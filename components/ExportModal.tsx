
import React, { useState } from 'react';
import { Note, Category, ExportMode, GeneratedRecord, Persona } from '../types';
import { generateBoardReport, parseGeneratedContent } from '../services/geminiService';
import { X, FileText, Check, Copy, Presentation, ListTodo, ClipboardList, Coffee, History, ArrowLeft, Trash2, Calendar, Sparkles, ChevronRight, User } from 'lucide-react';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    notes: Note[];
    records: GeneratedRecord[];
    onSaveRecord: (record: GeneratedRecord) => void;
    onDeleteRecord: (id: string) => void;
    activePersona?: Persona; // Added activePersona
}

type ModalView = 'menu' | 'config' | 'loading' | 'result';

const MODES: { id: ExportMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
        id: 'meeting_minutes',
        label: '會議報告',
        icon: <ClipboardList className="w-5 h-5" />,
        desc: '結構化會議紀要與行動清單'
    },
    {
        id: 'proposal_slides',
        label: '簡報大綱',
        icon: <Presentation className="w-5 h-5" />,
        desc: '產出 PPT / Keynote 簡報架構'
    },
    {
        id: 'task_list',
        label: '待辦清單',
        icon: <ListTodo className="w-5 h-5" />,
        desc: '提取待辦事項與執行計畫'
    },
    {
        id: 'daily_summary',
        label: '個人反思',
        icon: <Coffee className="w-5 h-5" />,
        desc: '彙整今日洞察與明日建議'
    },
];

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, categories, notes, records, onSaveRecord, onDeleteRecord, activePersona }) => {
    const [currentView, setCurrentView] = useState<ModalView>('menu');
    const [selectedMode, setSelectedMode] = useState<ExportMode>('meeting_minutes');
    const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set(categories.map(c => c.id)));
    const [viewRecord, setViewRecord] = useState<GeneratedRecord | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    if (!isOpen) return null;

    const reset = () => {
        setCurrentView('menu');
        setViewRecord(null);
        setError(null);
        setSelectedCats(new Set(categories.map(c => c.id)));
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const toggleCategory = (id: string) => {
        const next = new Set(selectedCats);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedCats(next);
    };

    const handleGenerate = async () => {
        if (selectedCats.size === 0) {
            setError("請至少選擇一個範圍");
            return;
        }
        setCurrentView('loading');
        setError(null);

        try {
            const rawText = await generateBoardReport(notes, categories, selectedMode, Array.from(selectedCats), activePersona);

            // Parse and save automatically
            const parsed = parseGeneratedContent(rawText, selectedMode);
            const newRecord: GeneratedRecord = {
                id: Date.now().toString(),
                ...parsed
            };

            onSaveRecord(newRecord);
            setViewRecord(newRecord);
            setCurrentView('result');
        } catch (err) {
            setError("生成失敗，請稍後再試。");
            setCurrentView('config');
        }
    };

    const handleCopy = () => {
        if (viewRecord) {
            navigator.clipboard.writeText(viewRecord.content);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const handleDeleteCurrent = () => {
        if (viewRecord) {
            if (confirm("確定要刪除此份報告嗎？")) {
                onDeleteRecord(viewRecord.id);
                setCurrentView('menu');
            }
        }
    }

    const formatDate = (iso: string) => {
        return new Date(iso).toLocaleString('zh-TW', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#F2F4F7]/90 backdrop-blur-md" onClick={handleClose} />

            <div className="card-item w-full max-w-2xl max-h-[85vh] flex flex-col !bg-white shadow-2xl relative animate-modal-in overflow-hidden !p-0 border border-[#D1D8E0]">

                {/* Header */}
                <div className="px-5 py-4 border-b border-[#D1D8E0] flex justify-between items-center bg-white/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                        {currentView !== 'menu' && (
                            <button onClick={() => setCurrentView('menu')} title="返回" className="text-[#636E72] hover:text-[#2D3436] mr-1 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div className="flex items-center gap-2">
                            {currentView === 'loading' ? (
                                <Sparkles className="w-5 h-5 text-[#00af80] animate-pulse" />
                            ) : (
                                <div className="w-8 h-8 rounded-lg bg-[#00af80]/10 flex items-center justify-center text-[#00af80]">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                            )}
                            <h2 className="text-base font-bold text-[#2D3436]">智能助手</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Primary Action Button placed in Header */}
                        {currentView === 'config' && (
                            <button
                                onClick={handleGenerate}
                                className="flex items-center gap-2 px-4 py-2 bg-[#00af80] text-white rounded-lg font-bold text-xs hover:bg-[#009f75] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                開始生成
                            </button>
                        )}

                        <div className="w-px h-5 bg-[#D1D8E0] mx-1"></div>

                        <button onClick={handleClose} title="關閉" className="text-[#636E72] hover:text-[#2D3436] p-1 rounded-lg hover:bg-gray-100 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#FAFAFA] relative">

                    {/* VIEW: MENU */}
                    {currentView === 'menu' && (
                        <div className="p-6 sm:p-8 flex flex-col gap-6 h-full">
                            {/* Main CTA */}
                            <button
                                onClick={() => setCurrentView('config')}
                                className="w-full bg-white p-6 rounded-2xl border border-[#D1D8E0] hover:border-[#00af80] shadow-sm hover:shadow-md transition-all group text-left relative overflow-hidden"
                            >
                                <div className="absolute right-0 top-0 w-32 h-32 bg-[#00af80]/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#00af80]/10 transition-colors"></div>

                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-[#00af80] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[#2D3436] mb-1 group-hover:text-[#00af80] transition-colors">建立新報告</h3>
                                        <p className="text-sm text-[#636E72]">透過 AI 整理白板上的點子，快速生成會議紀要或簡報架構。</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#D1D8E0] group-hover:text-[#00af80] transition-colors self-center" />
                                </div>
                            </button>

                            {/* History Section */}
                            <div className="flex flex-col flex-1 min-h-0 bg-white rounded-2xl border border-[#D1D8E0] shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-[#D1D8E0] bg-[#FAFAFA]/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <History className="w-4 h-4 text-[#636E72]" />
                                        <span className="text-xs font-bold text-[#636E72] uppercase tracking-wider">歷史紀錄</span>
                                    </div>
                                    <span className="text-[10px] bg-[#F2F4F7] px-2 py-0.5 rounded-full text-[#636E72] font-mono">{records.length}</span>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                                    {records.length === 0 ? (
                                        <div className="h-40 flex flex-col items-center justify-center text-[#636E72]/40 gap-3">
                                            <div className="w-12 h-12 rounded-full bg-[#F2F4F7] flex items-center justify-center">
                                                <History className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-medium">尚無生成紀錄</span>
                                        </div>
                                    ) : (
                                        records.map(r => (
                                            <button
                                                key={r.id}
                                                onClick={() => {
                                                    setViewRecord(r);
                                                    setCurrentView('result');
                                                }}
                                                className="w-full text-left p-3 rounded-xl hover:bg-[#F2F4F7] border border-transparent hover:border-[#D1D8E0] transition-all group"
                                            >
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <span className="text-sm font-bold text-[#2D3436] line-clamp-1 group-hover:text-[#00af80] transition-colors">{r.title}</span>
                                                    <span className="text-[10px] text-[#b2b2b2] whitespace-nowrap font-mono pt-0.5">{formatDate(r.generatedAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#D1D8E0] text-[#636E72] group-hover:border-[#00af80]/30 transition-colors">
                                                        {MODES.find(m => m.id === r.exportMode)?.label || r.contextType}
                                                    </span>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: CONFIG */}
                    {currentView === 'config' && (
                        <div className="p-6 sm:p-8 space-y-8 max-w-2xl mx-auto">
                            {/* Section 1 */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-[#636E72] uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[#2D3436] text-white flex items-center justify-center text-[10px]">1</span>
                                    選擇格式
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {MODES.map(mode => (
                                        <button
                                            key={mode.id}
                                            onClick={() => setSelectedMode(mode.id)}
                                            className={`
                                                relative p-4 rounded-xl border text-left transition-all duration-200 group
                                                ${selectedMode === mode.id
                                                    ? 'bg-white border-[#00af80] shadow-[0_0_0_2px_rgba(0,175,128,0.1)]'
                                                    : 'bg-white border-[#D1D8E0] hover:border-[#636E72] hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`
                                                    w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                                                    ${selectedMode === mode.id ? 'bg-[#00af80]/10 text-[#00af80]' : 'bg-[#F2F4F7] text-[#636E72] group-hover:bg-[#2D3436]/5'}
                                                `}>
                                                    {mode.icon}
                                                </div>
                                                <div>
                                                    <div className={`font-bold text-sm mb-0.5 ${selectedMode === mode.id ? 'text-[#00af80]' : 'text-[#2D3436]'}`}>
                                                        {mode.label}
                                                    </div>
                                                    <div className="text-[11px] text-[#636E72] leading-tight">
                                                        {mode.desc}
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedMode === mode.id && (
                                                <div className="absolute top-3 right-3 text-[#00af80]">
                                                    <Check className="w-4 h-4" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-[#636E72] uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[#2D3436] text-white flex items-center justify-center text-[10px]">2</span>
                                    匯出範圍
                                </h3>

                                {activePersona && (
                                    <div className="flex items-center gap-2 p-3 bg-[var(--primary)]/5 rounded-xl border border-[var(--primary)]/20 mb-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-lg">{activePersona.icon}</div>
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold">當前身份裝備</p>
                                            <p className="text-xs font-bold text-[var(--text-main)] italic">「{activePersona.name}」模式 - AI 將對應此角色生成專業內容</p>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white border border-[#D1D8E0] rounded-xl overflow-hidden shadow-sm">
                                    <div className="grid grid-cols-2 divide-x divide-[#F2F4F7]">
                                        {categories.map((cat, idx) => (
                                            <label
                                                key={cat.id}
                                                className={`
                                                    flex items-center gap-3 p-3 cursor-pointer hover:bg-[#F8F9FA] transition-colors
                                                    ${idx >= 2 ? 'border-t border-[#F2F4F7]' : ''} 
                                                    ${selectedCats.has(cat.id) ? 'bg-[#00af80]/5' : ''}
                                                `}
                                            >
                                                <div className="relative flex items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCats.has(cat.id)}
                                                        onChange={() => toggleCategory(cat.id)}
                                                        className="peer appearance-none w-5 h-5 border-2 border-[#D1D8E0] rounded checked:bg-[#00af80] checked:border-[#00af80] transition-all cursor-pointer"
                                                    />
                                                    <Check className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                                                </div>

                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-lg">{cat.icon}</span>
                                                    <span className={`text-sm font-medium truncate ${selectedCats.has(cat.id) ? 'text-[#2D3436]' : 'text-[#636E72]'}`}>
                                                        {cat.title}
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                {error && (
                                    <div className="flex items-center gap-2 text-xs text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100 animate-modal-in">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* VIEW: LOADING */}
                    {currentView === 'loading' && (
                        <div className="flex flex-col items-center justify-center h-full p-10 text-center gap-8">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-[#F2F4F7] border-t-[#00af80] rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-[#00af80]" />
                                </div>
                            </div>
                            <div className="max-w-xs space-y-2">
                                <h3 className="text-lg font-bold text-[#2D3436]">正在分析白板內容...</h3>
                                <p className="text-sm text-[#636E72] leading-relaxed">
                                    AI 正在閱讀您的點子並進行結構化整理，報告將自動儲存。
                                </p>
                            </div>
                        </div>
                    )}

                    {/* VIEW: RESULT */}
                    {currentView === 'result' && viewRecord && (
                        <div className="flex flex-col h-full bg-white">
                            {/* Meta Info Bar */}
                            <div className="bg-[#FAFAFA] px-6 py-3 border-b border-[#D1D8E0] flex flex-wrap gap-4 items-center text-xs text-[#636E72]">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="font-mono">{formatDate(viewRecord.generatedAt)}</span>
                                </div>
                                <div className="h-4 w-px bg-[#D1D8E0]"></div>
                                <span className="font-bold text-[#2D3436]">{viewRecord.title}</span>
                                <div className="ml-auto flex items-center gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all border shadow-sm
                                            ${copySuccess
                                                ? 'bg-green-50 text-green-600 border-green-200'
                                                : 'bg-white border-[#D1D8E0] text-[#636E72] hover:text-[#2D3436] hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        {copySuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copySuccess ? '已複製' : '複製內容'}
                                    </button>
                                    <button
                                        onClick={handleDeleteCurrent}
                                        className="p-1.5 text-[#636E72] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="刪除"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white">
                                <div className="max-w-3xl mx-auto">
                                    <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-[#2D3436] prose-p:text-[#4a5568] prose-li:text-[#4a5568] prose-strong:text-[#2D3436]">
                                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{viewRecord.content}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
