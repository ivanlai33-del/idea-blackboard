
import React, { useState } from 'react';
import { Paper, Category, Board, GeneratedRecord, PaperType } from '../types';
import { generateBoardReport, parseGeneratedContent } from '../services/geminiService';
import { X, FileText, Check, Copy, Presentation, ListTodo, ClipboardList, Coffee, History, ArrowLeft, Trash2, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    notes: Paper[];
    records: GeneratedRecord[];
    onSaveRecord: (record: GeneratedRecord) => void;
    onDeleteRecord: (id: string) => void;
    activeBoard?: Board;
}

type ExportMode = 'meeting' | 'slides' | 'todo' | 'reflection';
type ModalView = 'menu' | 'config' | 'loading' | 'result';

const MODES: { id: ExportMode; label: string; icon: any; desc: string }[] = [
    { id: 'meeting', label: '會議報告', icon: ClipboardList, desc: '結構化會議紀要與行動清單' },
    { id: 'slides', label: '簡報大綱', icon: Presentation, desc: '產出 PPT / Keynote 簡報架構' },
    { id: 'todo', label: '待辦清單', icon: ListTodo, desc: '提取待辦事項與執行計畫' },
    { id: 'reflection', label: '個人反思', icon: Coffee, desc: '彙整今日洞察與明日建議' },
];

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, categories, notes, records, onSaveRecord, onDeleteRecord, activeBoard }) => {
    const [currentView, setCurrentView] = useState<ModalView>('menu');
    const [selectedMode, setSelectedMode] = useState<ExportMode>('meeting');
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
        if (next.has(id)) next.delete(id);
        else next.add(id);
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
            // Refine the prompt context based on active board
            const contextType = activeBoard?.name || '專案';
            const rawText = await generateBoardReport(notes as any, categories, selectedMode as any, Array.from(selectedCats), activeBoard as any);

            const parsed = parseGeneratedContent(rawText, selectedMode as any);
            const newRecord: GeneratedRecord = {
                id: `report-${Date.now()}`,
                ...parsed
            };

            onSaveRecord(newRecord);
            setViewRecord(newRecord);
            setCurrentView('result');
        } catch (err) {
            console.error(err);
            setError("生成失敗，請檢查網路或 API KEY。");
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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white/50 flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-[var(--border-light)] flex items-center justify-between bg-white relative z-10">
                    <div className="flex items-center gap-3">
                        {currentView !== 'menu' && (
                            <button onClick={() => setCurrentView('menu')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-500" />
                            </button>
                        )}
                        <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-3">
                            <img src="/Lumos_logo.svg" className="w-6 h-6 object-contain" alt="" />
                            智能助手
                        </h3>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30">
                    <AnimatePresence mode="wait">
                        {currentView === 'menu' && (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-6 space-y-6"
                            >
                                <button
                                    onClick={() => setCurrentView('config')}
                                    className="w-full bg-white p-6 rounded-3xl border border-[var(--border-light)] hover:border-[var(--primary)] shadow-sm hover:shadow-xl transition-all group text-left flex items-center gap-6"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <img src="/logo.svg" className="w-10 h-10 object-contain" alt="" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-[var(--text-main)] mb-1">建立新報告</h4>
                                        <p className="text-sm text-gray-400">分析當前白板內容，自動生成專業文件</p>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-gray-300" />
                                </button>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">報告歷史</label>
                                    {records.length === 0 ? (
                                        <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-300">
                                            <History className="w-8 h-8 mb-2 opacity-20" />
                                            <span className="text-xs font-bold">尚無歷史紀錄</span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-2">
                                            {records.map(r => (
                                                <button
                                                    key={r.id}
                                                    onClick={() => { setViewRecord(r); setCurrentView('result'); }}
                                                    className="p-4 bg-white border border-[var(--border-light)] rounded-2xl flex items-center justify-between hover:bg-gray-50 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-[var(--primary)]" />
                                                        <span className="text-sm font-bold text-gray-600 line-clamp-1">{r.title}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-mono">{new Date(r.generatedAt).toLocaleDateString()}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {currentView === 'config' && (
                            <motion.div
                                key="config"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-6 space-y-8"
                            >
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">1. 選擇報告類型</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {MODES.map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => setSelectedMode(m.id)}
                                                className={`
                                                    p-4 rounded-2xl border text-left transition-all
                                                    ${selectedMode === m.id ? 'bg-white border-[var(--primary)] shadow-lg' : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200'}
                                                `}
                                            >
                                                <m.icon className={`w-5 h-5 mb-2 ${selectedMode === m.id ? 'text-[var(--primary)]' : 'text-gray-400'}`} />
                                                <h5 className={`text-sm font-bold ${selectedMode === m.id ? 'text-[var(--text-main)]' : 'text-gray-500'}`}>{m.label}</h5>
                                                <p className="text-[10px] text-gray-400 leading-tight mt-1">{m.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">2. 選擇分析範圍</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => toggleCategory(cat.id)}
                                                className={`
                                                    flex items-center gap-3 p-3 rounded-xl border transition-all text-sm font-bold
                                                    ${selectedCats.has(cat.id) ? 'bg-white border-[var(--primary)] shadow-sm' : 'bg-gray-50 border-transparent text-gray-400'}
                                                `}
                                            >
                                                <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center ${selectedCats.has(cat.id) ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-gray-300'}`}>
                                                    {selectedCats.has(cat.id) && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                {cat.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    className="w-full py-4 bg-gradient-to-r from-cyan-400 to-teal-600 text-white rounded-[24px] font-bold shadow-xl hover:brightness-110 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg active:scale-95"
                                >
                                    <img src="/logo.svg" className="w-6 h-6 object-contain brightness-0 invert" alt="" />
                                    產生智能報告
                                </button>
                            </motion.div>
                        )}

                        {currentView === 'loading' && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-96 flex flex-col items-center justify-center text-center p-10 gap-6"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 border-4 border-gray-100 border-t-[var(--primary)] rounded-full animate-spin"></div>
                                    <img src="/logo.svg" className="absolute inset-x-0 inset-y-0 m-auto w-10 h-10 object-contain animate-pulse" alt="" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold text-[var(--text-main)]">正在彙整您的思緒...</h4>
                                    <p className="text-sm text-gray-400 max-w-xs">AI 正在讀取這 {notes.length} 張紙片中的數據並進行結構化分析。</p>
                                </div>
                            </motion.div>
                        )}

                        {currentView === 'result' && viewRecord && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col h-full overflow-hidden"
                            >
                                <div className="p-4 bg-gray-50 border-b border-[var(--border-light)] flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(viewRecord.generatedAt).toLocaleString()}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={handleCopy} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${copySuccess ? 'bg-green-500 text-white' : 'bg-white text-[var(--primary)] border border-[var(--primary)] hover:bg-[var(--primary)]/5'}`}>
                                            {copySuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                            {copySuccess ? '已複製' : '複製內容'}
                                        </button>
                                        <button onClick={() => { onDeleteRecord(viewRecord.id); setCurrentView('menu'); }} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
                                    <div className="prose prose-sm max-w-none">
                                        <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-gray-700 bg-transparent border-none p-0">{viewRecord.content}</pre>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ExportModal;
