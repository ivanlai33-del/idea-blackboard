import React, { useState, useEffect } from 'react';
import { Note, Category } from '../types';
import { Pin, Sparkles, Trash2, X, ExternalLink, Globe, Archive } from 'lucide-react';
import { getLinkPreview } from '../services/geminiService';

interface NoteCardProps {
    note: Note;
    category: Category;
    onClick: () => void;
    onQuickAI?: (e: React.MouseEvent) => void;
    onDelete?: (e: React.MouseEvent) => void;
    onTogglePin?: (e: React.MouseEvent) => void;
    onArchive?: (e: React.MouseEvent) => void;
    onUpdateNote?: (note: Note) => void;
    index?: number;
    isLarge?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
    note, category, onClick, onQuickAI, onDelete, onTogglePin, onArchive, onUpdateNote, index = 0, isLarge = false
}) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

    // URL Detection and Auto-Preview
    useEffect(() => {
        if (!note.linkData && !isLoadingPreview && onUpdateNote) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const match = note.text.match(urlRegex);
            if (match) {
                const url = match[0];
                setIsLoadingPreview(true);
                getLinkPreview(url).then(data => {
                    onUpdateNote({ ...note, linkData: data });
                }).finally(() => {
                    setIsLoadingPreview(false);
                });
            }
        }
    }, [note.text, note.linkData]);

    const stopPropagation = (e: React.PointerEvent | React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            onClick={onClick}
            onMouseLeave={() => setIsConfirmingDelete(false)}
            className={`
                relative group cursor-pointer mb-3 p-4 rounded-2xl transition-all duration-300
                bg-white border border-[var(--border-light)] hover:border-[var(--primary)] hover:shadow-lg
                ${isLarge ? 'h-full' : ''}
            `}
            style={{ borderLeft: `4px solid ${category.color}` }}
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-[var(--text-muted)] tracking-wide uppercase">
                    {new Date(note.time).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })}
                    <span className="mx-1 opacity-50">|</span>
                    {category.title.substring(0, 8)}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {onTogglePin && !isConfirmingDelete && (
                        <button
                            onClick={onTogglePin}
                            onPointerDown={stopPropagation}
                            className={`p-1.5 rounded-lg hover:bg-black/5 tap-feedback ${note.pinned ? 'text-[#eab308] opacity-100' : 'text-slate-400'}`}
                            title="釘選"
                        >
                            <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-current' : ''}`} />
                        </button>
                    )}

                    {!isLarge && onQuickAI && !isConfirmingDelete && (
                        <button
                            onClick={onQuickAI}
                            onPointerDown={stopPropagation}
                            className="p-1.5 rounded-lg hover:bg-black/5 text-slate-400 hover:text-[var(--primary)] tap-feedback"
                            title="AI 擴展"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                        </button>
                    )}

                    {onArchive && !isConfirmingDelete && (
                        <button
                            onClick={onArchive}
                            onPointerDown={stopPropagation}
                            className="p-1 rounded hover:bg-black/5 text-slate-400 hover:text-[#7c3aed] tap-feedback"
                            title="收納"
                        >
                            <Archive className="w-3 h-3" />
                        </button>
                    )}

                    {onDelete && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    isConfirmingDelete ? onDelete(e) : setIsConfirmingDelete(true);
                                }}
                                onPointerDown={stopPropagation}
                                className={`p-1 rounded transition-colors tap-feedback ${isConfirmingDelete ? 'bg-red-50 text-red-600 font-bold px-2 text-[10px]' : 'hover:bg-black/5 text-[var(--text-muted)] hover:text-red-500'}`}
                                title={isConfirmingDelete ? "確認刪除" : "刪除"}
                            >
                                {isConfirmingDelete ? "確認" : <Trash2 className="w-3 h-3" />}
                            </button>
                            {isConfirmingDelete && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsConfirmingDelete(false); }}
                                    className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] tap-feedback"
                                    title="取消"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {note.pinned && !onTogglePin && (
                    <Pin className="w-3 h-3 text-[#eab308] fill-current absolute top-4 right-4" />
                )}
            </div>

            <p className={`
                font-normal text-[#2D3436] leading-relaxed mb-3 break-words whitespace-pre-wrap
                ${isLarge ? 'text-lg' : 'text-sm line-clamp-6'}
            `}>
                {note.text}
            </p>

            {/* Link Preview Card */}
            {note.linkData && (
                <div className="mt-auto pt-2">
                    <div className="bg-[#F8F9FA] rounded-lg overflow-hidden border border-black/5 hover:border-black/10 transition-colors">
                        <a href={note.linkData.url} target="_blank" rel="noopener noreferrer" onClick={stopPropagation} className="block group/link">
                            <div className="flex items-start gap-3 p-2">
                                {note.linkData.image && (
                                    <div className="w-10 h-10 min-w-[40px] rounded bg-white overflow-hidden flex items-center justify-center border border-black/5">
                                        <img src={note.linkData.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs text-[var(--text-main)] font-medium truncate group-hover/link:text-[var(--primary)] transition-colors">{note.linkData.title}</h4>
                                    <p className="text-[10px] text-[var(--text-muted)] line-clamp-1 mt-0.5">{note.linkData.description}</p>
                                    <div className="flex items-center gap-1 mt-1.5 text-[9px] text-[var(--text-muted)] opacity-60">
                                        <Globe className="w-2.5 h-2.5" />
                                        <span>{note.linkData.siteName}</span>
                                    </div>
                                </div>
                                <ExternalLink className="w-3 h-3 text-[#b2b2b2] group-hover/link:text-[#2D3436] transition-colors" />
                            </div>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoteCard;