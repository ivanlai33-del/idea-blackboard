import React, { useState, useEffect, useRef } from 'react';
import { Note, Category } from '../types';
import { X, Pin, Sparkles, Trash2, ArrowLeft, Terminal, Cpu, Save, Archive, ArchiveRestore, ChevronDown, Check } from 'lucide-react';
import { expandIdeaWithAI } from '../services/geminiService';

interface NoteDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    note: Note | null;
    categories?: Category[];
    onSave: (id: string, text: string, categoryId?: string) => void;
    onTogglePin: (id: string) => void;
    onDelete: (id: string) => void;
    onArchive?: (id: string) => void;
    onRestore?: (id: string) => void;
    onBack?: () => void;
    initialAutoAI?: boolean;
}

const NoteDetailModal: React.FC<NoteDetailModalProps> = ({ 
    isOpen, onClose, note, categories = [], onSave, onTogglePin, onDelete, onArchive, onRestore, onBack, initialAutoAI 
}) => {
    const [text, setText] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
    const [targetCategoryId, setTargetCategoryId] = useState<string>('');
    const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (note) {
            setText(note.text);
            setTargetCategoryId(note.category);
            setAiSuggestion(null);
            setAiLoading(false);
            if (initialAutoAI) handleAIExpand(note.text);
        }
    }, [note, initialAutoAI]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCatDropdownOpen(false);
            }
        };

        if (isCatDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCatDropdownOpen]);

    const handleSave = () => {
        if (note) {
            // Pass the targetCategoryId. If it matches original note.category, App.tsx logic handles it.
            onSave(note.id, text, targetCategoryId !== note.category ? targetCategoryId : undefined);
            onClose();
        }
    };

    const handleAIExpand = async (currentText: string = text) => {
        if (!currentText.trim()) return;
        setAiLoading(true);
        try {
            const result = await expandIdeaWithAI(currentText);
            setAiSuggestion(result);
        } catch (error) {
            setAiSuggestion("連線錯誤: 無法使用 AI 服務");
        } finally {
            setAiLoading(false);
        }
    };

    if (!isOpen || !note) return null;

    const isArchived = note.archived;
    const currentCategory = categories.find(c => c.id === targetCategoryId) || categories[0];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             {/* Backdrop */}
            <div className="absolute inset-0 bg-[#F2F4F7]/80 backdrop-blur-md" onClick={onClose} />

            {/* Modal Card */}
            <div className="relative card-item w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden animate-modal-in shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] !bg-white border-[#D1D8E0] !p-0">
                
                {/* Header */}
                <div className="p-5 border-b border-[#D1D8E0] flex justify-between items-center bg-[#FAFAFA]">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button onClick={onBack} className="text-[#636E72] hover:text-[#2D3436]">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <span className="text-[10px] font-mono text-[#00af80] border border-[#00af80]/30 px-2 py-0.5 rounded-full bg-[#00af80]/5 tracking-wider font-bold">
                            #{note.id.slice(-4)}
                        </span>
                        {isArchived && (
                            <span className="text-[10px] font-mono text-[#7c3aed] border border-[#7c3aed]/30 px-2 py-0.5 rounded-full bg-[#7c3aed]/5 tracking-wider font-bold flex items-center gap-1">
                                <Archive className="w-3 h-3" /> ARCHIVED
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {isArchived ? (
                            <>
                                {onRestore && (
                                    <button 
                                        onClick={() => onRestore(note.id)}
                                        className="flex items-center gap-2 text-xs font-bold text-[#2D3436] hover:text-[#7c3aed] bg-white border border-[#D1D8E0] px-3 py-1.5 rounded-lg hover:border-[#7c3aed] transition-colors"
                                    >
                                        <ArchiveRestore className="w-4 h-4" />
                                        還原
                                    </button>
                                )}
                                <button onClick={() => onDelete(note.id)} className="text-[#636E72] hover:text-red-500 p-2" title="刪除">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={() => handleAIExpand()}
                                    disabled={aiLoading}
                                    className={`flex items-center gap-2 text-xs font-bold text-[#00af80] hover:text-[#008f68] transition-colors ${aiLoading ? 'animate-pulse' : ''} bg-[#00af80]/5 px-3 py-1.5 rounded-lg border border-[#00af80]/20 hover:bg-[#00af80]/10`}
                                >
                                    <Cpu className="w-4 h-4" />
                                    {aiLoading ? 'Thinking...' : 'AI 分析'}
                                </button>
                                <div className="w-px h-4 bg-[#D1D8E0]"></div>
                                <button onClick={() => onTogglePin(note.id)} className={`${note.pinned ? 'text-[#eab308]' : 'text-[#636E72] hover:text-[#2D3436]'}`} title="釘選">
                                    <Pin className="w-4 h-4" />
                                </button>
                                {onArchive && (
                                    <button onClick={() => onArchive(note.id)} className="text-[#636E72] hover:text-[#7c3aed]" title="收納">
                                        <Archive className="w-4 h-4" />
                                    </button>
                                )}
                                <button onClick={() => onDelete(note.id)} className="text-[#636E72] hover:text-red-500" title="刪除">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                        
                        <div className="w-px h-4 bg-[#D1D8E0]"></div>
                        <button onClick={onClose} className="text-[#636E72] hover:text-[#2D3436]">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-white relative">
                     {/* Editor */}
                    <textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full bg-transparent text-[#2D3436] outline-none resize-none leading-relaxed text-lg placeholder-[#636E72]/30 font-medium min-h-[200px]"
                        placeholder="在此輸入..."
                        readOnly={!!isArchived} // Optional: make read-only if archived
                    />

                    {/* AI Output */}
                    {aiSuggestion && (
                        <div className="mt-8 relative border-t border-[#D1D8E0] pt-6 animate-modal-in">
                            <div className="absolute -top-3 left-0 bg-white pr-3 text-[10px] text-[#00af80] font-mono flex items-center gap-2 font-bold">
                                <Terminal className="w-3 h-3" />
                                AI_RESPONSE
                            </div>
                            <div className="font-mono text-sm text-[#2D3436] leading-relaxed whitespace-pre-wrap bg-[#F2F4F7] p-4 rounded-xl border border-[#D1D8E0]">
                                {aiSuggestion}
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button 
                                    onClick={() => {
                                        setText(prev => prev + "\n\n" + aiSuggestion);
                                        setAiSuggestion(null);
                                    }}
                                    className="px-4 py-2 bg-[#00af80] text-white text-xs font-bold rounded-lg hover:bg-[#008f68] transition-colors shadow-md"
                                >
                                    加入筆記
                                </button>
                                <button 
                                    onClick={() => setAiSuggestion(null)}
                                    className="px-4 py-2 border border-[#D1D8E0] text-[#636E72] text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    清除
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Status */}
                <div className="p-4 border-t border-[#D1D8E0] bg-[#FAFAFA] flex justify-between items-center">
                    <span className="text-[10px] font-mono text-[#636E72] hidden sm:inline-block">CHARS: {text.length}</span>
                    
                    {!isArchived && (
                        <div className="flex items-center gap-3 ml-auto">
                            {/* Category Selector Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                                    className="flex items-center gap-2 text-xs font-bold text-[#636E72] hover:text-[#2D3436] bg-white border border-[#D1D8E0] px-3 py-1.5 rounded-lg hover:border-[#636E72] transition-all"
                                    title="移動至其他欄位"
                                >
                                    {currentCategory && (
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentCategory.color }}></div>
                                    )}
                                    <span>{currentCategory?.title || '選擇欄位'}</span>
                                    <ChevronDown className={`w-3 h-3 transition-transform ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isCatDropdownOpen && (
                                    <div className="absolute bottom-full mb-2 right-0 bg-white border border-[#D1D8E0] rounded-xl shadow-xl z-50 min-w-[180px] overflow-hidden animate-modal-in">
                                        <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => {
                                                        setTargetCategoryId(cat.id);
                                                        setIsCatDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-[#F2F4F7] transition-colors border-b border-[#F2F4F7] last:border-0 text-xs font-medium ${targetCategoryId === cat.id ? 'bg-[#F2F4F7] text-[#00af80]' : 'text-[#2D3436]'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                                        {cat.title}
                                                    </div>
                                                    {targetCategoryId === cat.id && <Check className="w-3 h-3" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleSave}
                                className="text-white bg-[#2D3436] hover:bg-black flex items-center gap-2 text-xs font-bold transition-all px-4 py-1.5 rounded-lg shadow-lg hover:-translate-y-0.5"
                            >
                                <Save className="w-3 h-3" />
                                儲存變更
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteDetailModal;