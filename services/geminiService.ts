
import { LinkData, Paper, Category, GeneratedRecord } from "../types";

type Note = Paper;
export type ExportMode = string;

export interface Persona {
    name: string;
    context: string;
    type?: string;
}

const getApiKey = (): string => {
    // Priority: Local Storage > Environment Variable
    const storedKey = localStorage.getItem("gemini_api_key");
    if (storedKey) return storedKey;

    try {
        // @ts-ignore - Vite environment variable access
        return import.meta.env?.VITE_GEMINI_API_KEY || "";
    } catch {
        return "";
    }
};

// Generic Fetch Helper for Gemini API
// Using REST API avoids SDK compatibility issues in browser and ensures simple HTTP requests
const callGeminiApi = async (
    prompt: string,
    systemInstruction?: string,
    tools?: any[],
    jsonMode: boolean = false
): Promise<string> => {
    console.log("[GeminiService] Starting API call...");
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("未偵測到 API Key。");

    // Default optimistic list
    const defaults = ["gemini-1.5-flash", "gemini-1.5-flash-latest"];
    let errors: string[] = [];

    // Helper to perform the actual fetch
    const fetchGeneration = async (modelName: string) => {
        // Strip 'models/' prefix if present for clean URL construction
        const cleanName = modelName.replace('models/', '');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanName}:generateContent?key=${apiKey}`;

        const body: any = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7 }
        };
        if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] };
        if (tools) body.tools = tools;
        if (jsonMode) body.generationConfig.responseMimeType = "application/json";

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`HTTP ${res.status}: ${txt}`);
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Empty response");
        return text;
    };

    // 1. Try defaults first
    for (const model of defaults) {
        try {
            console.log(`[GeminiService] Trying default: ${model}`);
            const result = await fetchGeneration(model);
            console.log(`[GeminiService] SUCCESS using default model: ${model}`);
            return result;
        } catch (e: any) {
            console.warn(`[GeminiService] ${model} failed: ${e.message}`);
            errors.push(`${model}: ${e.message}`);

            // If Key is invalid, stop immediately
            if (e.message.includes("400") && e.message.includes("API key")) throw e;
            if (e.message.includes("403")) throw e;
        }
    }

    // 2. If defaults failed with 404, perform Dynamic Discovery
    // Only try this if the previous errors were actually 404s (Not Found)
    if (errors.some(e => e.includes("404"))) {
        console.log("[GeminiService] Defaults failed (404). Fetching available models...");
        try {
            const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
            const listRes = await fetch(listUrl);

            if (!listRes.ok) {
                const listErr = await listRes.text();
                throw new Error(`ListModels failed: ${listErr}`);
            }

            const listData = await listRes.json();
            const availableModels = listData.models || [];

            // Find first model that supports 'generateContent'
            const validModel = availableModels.find((m: any) =>
                m.supportedGenerationMethods?.includes("generateContent")
            );

            if (validModel) {
                console.log(`[GeminiService] Discovered valid model: ${validModel.name}`);
                // validModel.name includes 'models/', fetchGeneration handles it
                const result = await fetchGeneration(validModel.name);
                console.log(`[GeminiService] SUCCESS using discovered model: ${validModel.name}`);
                return result;
            } else {
                throw new Error("No models with 'generateContent' capability found for this Key.");
            }

        } catch (discoveryError: any) {
            console.error("[GeminiService] Discovery failed:", discoveryError);
            errors.push(`Discovery: ${discoveryError.message}`);
        }
    }

    // Capture explicit failure
    const errorMsg = errors.join(" | ");
    console.error("All attempts failed:", errorMsg);

    // Throw simplified error for specific known cases, or full log for debugging
    if (errorMsg.includes("404")) throw new Error(`找不到可用模型 (404)。您的 API Key 可能未啟用 Generative AI API，或權限受限。\n細節: ${errorMsg}`);

    throw new Error(`AI 連線失敗: ${errorMsg}`);
};

const EXPORT_SYSTEM_INSTRUCTION = `You are the AI engine inside a web app called “Lumos AI”.
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

// Helper for UI components to call AI directly (e.g. PaperDetailModal)
export const generateAiResponse = async (prompt: string, systemInstruction?: string): Promise<string> => {
    return await callGeminiApi(prompt, systemInstruction);
};

// AI Image Generation
export const generateAiImage = async (prompt: string): Promise<string> => {
    console.log(`[GeminiService] Generating image for prompt: ${prompt}`);

    // Simulating delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return a variety of high-quality abstract images to simulate re-generation
    const randomSeed = Math.floor(Math.random() * 1000);
    const abstractPool = [
        '1620641788421-7a1c342ea42e',
        '1579546929518-9e396f3cc809',
        '1550684848-fac1c5b4e853',
        '1541701494587-cb58502866ab',
        '1494438639946-1ebd1d20bf85'
    ];
    const poolId = abstractPool[randomSeed % abstractPool.length];

    return `https://images.unsplash.com/photo-${poolId}?q=80&w=1000&auto=format&fit=crop&sig=${randomSeed}`;
};

export const expandIdeaWithAI = async (content: string, persona?: Persona): Promise<string> => {
    const personaContext = persona ? `\n當前身份背景：${persona.name} (${persona.context})。請站在這個身份的角度提供建議。` : "";
    const prompt = `你是一個創意教練。請針對以下點子，提供 3 個進一步擴展或落實的具體思路：\n"${content}"${personaContext}\n請用精簡且有啟發性的繁體中文回答。`;

    try {
        return await callGeminiApi(prompt);
    } catch (error) {
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
        // Use Google Search tool if possible, or just standard generation
        // Note: Google Search tool via REST API requires specific structure. 
        // For simplicity and robustness, we first try standard generation which often works for well-known URLs or relies on internal knowledge.
        // To use tools via REST: "tools": [{ "google_search": {} }]
        // Use standard generation without tools for stability
        const jsonText = await callGeminiApi(
            prompt,
            undefined,
            undefined,
            true // JSON mode
        );

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
    activePersona?: Persona
): Promise<string> => {
    const activeNotes = notes.filter(n => !n.isStored && selectedCategoryIds.includes(n.columnId));
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
            type: (activePersona as any).type || "Board",
            background: (activePersona as any).context || "Lumos Project Board"
        } : null,
        scope: {
            project_name: activePersona ? activePersona.name : "Lumos Workspace",
            boards: [
                {
                    board_id: "main_board",
                    board_name: "Main Board",
                    columns: activeCategories.map(cat => ({
                        column_id: cat.id,
                        column_name: cat.title,
                        cards: activeNotes
                            .filter(n => n.columnId === cat.id)
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
        return await callGeminiApi(JSON.stringify(inputPayload), EXPORT_SYSTEM_INSTRUCTION);
    } catch (error) {
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

export const generateInsightReport = async (logs: { user: string, ai: string, timestamp: string }[]): Promise<string> => {
    if (logs.length === 0) return "目前尚無對話紀錄可供分析。";

    // Convert logs to a readable string format
    const logsText = logs.map((log, index) =>
        `[${index + 1}] User: ${log.user}\nAI: ${log.ai}`
    ).join("\n\n");

    const systemPrompt = `
    你現在是 Lumos AI 的「客戶洞察專家」。
    你的任務是分析以下的使用者與客服機器人的對話紀錄，並產出一份「客戶洞察報告」。
    
    請包含以下部分：
    1. **熱門詢問主題**：使用者最常問什麼？（例如：價格、特定功能、教學...）
    2. **使用者痛點/需求**：他們遇到了什麼問題？或是想要什麼功能？
    3. **銷售機會分析**：哪些使用者展現了高度購買意願？
    4. **話術優化建議**：AI 的回答有哪些地方可以改進，以提高轉換率？

    請用專業、條理分明的繁體中文格式輸出 Markdown 報告。
    `;

    return await callGeminiApi(
        `以下是最近的對話紀錄：\n\n${logsText}\n\n請根據上述內容生成客戶洞察報告。`,
        systemPrompt
    );
};
