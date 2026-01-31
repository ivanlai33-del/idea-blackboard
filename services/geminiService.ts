
import { GoogleGenAI } from "@google/genai";
import { LinkData, Note, Category, ExportMode, GeneratedRecord, Persona } from "../types";

// Initialize Gemini API client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const EXPORT_SYSTEM_INSTRUCTION = `You are the AI engine inside a web app called “Idea Blackboard AI”.
This app is a workflow-oriented whiteboard for individuals and small teams to turn messy ideas into clear actions, reports, and presentations.
You act as a behind-the-scenes assistant that整理、總結與結構化使用者的白板內容，並幫忙產生「可被收納與搜尋」的輸出資訊（例如標題、時間、分類）。

1. Input structure
The input will always be a JSON object with at least:
export_mode: string (e.g. "meeting_minutes", "proposal_slides", "task_list", "personal_summary")
scope: object describing what the user selected.
Optional hints: detail_level, tone, context_profile, current_datetime.

2. Output Format (CRITICAL)
The first lines of your output must ALWAYS be simple key-value pairs for archiving, in this exact format (one per line, no markdown formatting for keys):

Title: [A clear, concise title for this report]
Suggested_Filename: [filename_without_extension]
Context_Type: [The export mode used]
Scope_Summary: [Short description of what boards/columns are included]
Generated_At: [The current ISO datetime provided in input]

After these lines, leave ONE blank line, then start the human-readable content (the actual report/slides/list).

3. Content Generation
A. "meeting_minutes": Meeting title, Date/Participants, Purpose, Discussion Points, Decisions, Action Items.
B. "proposal_slides": Slide 1 (Title), Slide 2 (Problem), Slide 3 (Goals), Slide 4+ (Main Content), Final Slide (Next Steps).
C. "task_list": Summary, grouped Task List with Owners/Status/Deadlines.
D. "personal_summary": Daily summary, Main Insights, Next Steps.

4. Language
If input is mostly Traditional Chinese, output Traditional Chinese. Otherwise English.

5. Scope
Only use cards inside the provided scope. If scope is empty, generate the headers and a "No content" message.
`;

export const expandIdeaWithAI = async (content: string, persona?: Persona): Promise<string> => {
    const personaContext = persona ? `\n當前身份背景：${persona.name} (${persona.context})。請站在這個身份的角度提供建議。` : "";
    const prompt = `你是一個創意教練。請針對以下點子，提供 3 個進一步擴展或落實的具體思路：\n"${content}"${personaContext}\n請用精簡且有啟發性的繁體中文回答。`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "無法生成建議。";
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("AI 服務暫時無法使用，請稍後再試。");
    }
};

export const getLinkPreview = async (url: string): Promise<LinkData> => {
    const prompt = `分析這個連結: ${url}
    
    請回傳一個 JSON 物件 (不要 Markdown 格式)，包含以下欄位：
    1. title: 網頁標題 (繁體中文)
    2. description: 簡短摘要 (30字內，繁體中文)
    3. siteName: 網站名稱
    
    如果這是一個 YouTube 影片，請提供影片標題與描述。`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json"
            }
        });

        const jsonText = response.text || "{}";
        const data = JSON.parse(jsonText);

        const image = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(url)}&size=128`;

        return {
            url,
            title: data.title || url,
            description: data.description || "連結預覽",
            siteName: data.siteName || "Website",
            image
        };
    } catch (error) {
        console.error("Link Preview Error:", error);
        return {
            url,
            title: "連結",
            description: url,
            siteName: "Link",
            image: `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(url)}&size=128`
        };
    }
};

export const generateBoardReport = async (
    notes: Note[],
    categories: Category[],
    mode: ExportMode,
    selectedCategoryIds: string[],
    activePersona?: Persona // Added persona awareness
): Promise<string> => {
    const activeNotes = notes.filter(n => !n.archived && selectedCategoryIds.includes(n.categoryId)); // Fixed category -> categoryId
    const activeCategories = categories.filter(c => selectedCategoryIds.includes(c.id));

    let instructionMode = mode as string;
    if (mode === 'daily_summary') {
        instructionMode = 'personal_summary';
    }

    const inputPayload = {
        export_mode: instructionMode,
        current_datetime: new Date().toISOString(),
        persona: activePersona ? {
            name: activePersona.name,
            type: activePersona.type,
            background: activePersona.context
        } : null,
        scope: {
            project_name: activePersona ? `${activePersona.name} 的點子看板` : "IdeaFlow Workspace",
            boards: [
                {
                    board_id: "main_board",
                    board_name: "Main Board",
                    columns: activeCategories.map(cat => ({
                        column_id: cat.id,
                        column_name: cat.title,
                        cards: activeNotes
                            .filter(n => n.categoryId === cat.id) // Fixed: category -> categoryId
                            .map(n => ({
                                card_id: n.id,
                                title: n.text.split('\n')[0].substring(0, 50),
                                body: n.text,
                                tags: n.pinned ? ["pinned"] : [],
                                owner: "",
                                due_date: "",
                                status: ""
                            }))
                    }))
                }
            ]
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: JSON.stringify(inputPayload),
            config: {
                systemInstruction: EXPORT_SYSTEM_INSTRUCTION
            }
        });
        return response.text || "生成失敗，請稍後再試。";
    } catch (error) {
        console.error("Export Generation Error:", error);
        throw new Error("AI 服務暫時無法使用，請稍後再試。");
    }
};

/**
 * Parses the raw AI output to extract metadata and body content.
 */
export const parseGeneratedContent = (rawText: string, mode: ExportMode): Omit<GeneratedRecord, 'id'> => {
    const lines = rawText.split('\n');
    const meta: Record<string, string> = {};
    let contentStartIndex = 0;

    // Parse top lines until a blank line is found
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') {
            contentStartIndex = i + 1;
            break;
        }
        const match = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
        if (match) {
            meta[match[1]] = match[2];
        }
    }

    const bodyContent = lines.slice(contentStartIndex).join('\n').trim();

    return {
        title: meta['Title'] || '未命名報告',
        exportMode: mode,
        contextType: meta['Context_Type'] || mode,
        scopeSummary: meta['Scope_Summary'] || '自訂範圍',
        generatedAt: meta['Generated_At'] || new Date().toISOString(),
        content: bodyContent.length > 0 ? bodyContent : rawText, // Fallback if parse fails
        rawOutput: rawText
    };
};
