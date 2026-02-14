import React, { useState } from 'react';
import { Paper, Category } from '../types';
import { Pin, Sparkles, Trash2, X, Globe, Archive, FileIcon, ImageIcon, LinkIcon, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Helper to convert hex to rgba for glass effects
const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface PaperCardProps {
    paper: Paper;
    category: Category;
    onClick: () => void;
    onDelete?: (id: string) => void;
    onTogglePin?: (id: string) => void;
    onArchive?: (id: string) => void;
    className?: string;
}

const PaperCard: React.FC<PaperCardProps> = ({
    paper, category, onClick, onDelete, onTogglePin, onArchive, className = ""
}) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: paper.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 999 : undefined,
    };
    // ...
    const [isHovered, setIsHovered] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const renderContent = () => {
        switch (paper.type) {
            case 'image':
                if (paper.fullBackground && paper.contentUrl) {
                    return (
                        <div className="flex flex-col h-full justify-end pb-4">
                            <p className="text-sm text-white font-bold leading-relaxed line-clamp-4 drop-shadow-md">
                                {paper.text}
                            </p>
                        </div>
                    );
                }
                return (
                    <div className="relative rounded-xl overflow-hidden mb-2 aspect-video bg-gray-100">
                        {paper.contentUrl ? (
                            <img src={paper.contentUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-8 h-8 opacity-20" />
                            </div>
                        )}
                    </div>
                );
            case 'stock':
                // Only take the first line as the symbol
                const fullText = paper.text || '';
                const firstLine = fullText.split('\n')[0].trim();
                const rawSymbol = firstLine.toUpperCase() || 'TSLA';

                // Enhanced formatter for TradingView symbols
                const formatStockSymbol = (s: string) => {
                    const trimmed = s.trim().replace(/\s+/g, '');
                    if (!trimmed) return 'TSLA';
                    // Taiwan Market Mapping
                    if (trimmed.endsWith('.TW')) return `TWSE:${trimmed.replace('.TW', '')}`;
                    if (trimmed.endsWith('.TWO')) return `TPEX:${trimmed.replace('.TWO', '')}`;
                    // Special case for common crypto without prefix
                    if (['BTC', 'ETH', 'SOL', 'DOGE'].includes(trimmed)) return `BINANCE:${trimmed}USDT`;
                    // If it's 4-6 digits, it's likely a Taiwan/HK stock
                    if (/^\d{4,6}$/.test(trimmed)) {
                        return `TWSE:${trimmed}`;
                    }
                    return trimmed;
                };
                const tvSymbol = formatStockSymbol(rawSymbol);

                return (
                    <div className="flex flex-col gap-2 h-full">
                        <div className="flex items-center gap-2 px-1">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-bold gradient-text">{rawSymbol}</span>
                            <span className="text-[10px] text-gray-400 ml-auto font-medium">Real-time</span>
                        </div>
                        <div className="flex-1 min-h-[140px] rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative">
                            <iframe
                                title={`Stock Chart for ${tvSymbol}`}
                                src={`https://s.tradingview.com/widgetembed/?symbol=${tvSymbol}&interval=D&theme=light&style=1&timezone=Etc%2FUTC&studies=%5B%5D&hide_top_toolbar=true&hide_legend=true&save_image=false&locale=en`}
                                className="absolute inset-0 w-full h-full border-0"
                                key={tvSymbol} // Force reload when symbol changes
                            />
                        </div>
                    </div>
                );
            case 'link':
                return (
                    <div className="flex items-start gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 mb-2">
                        <LinkIcon className="w-4 h-4 text-[var(--primary)] mt-1 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold truncate block">{paper.text}</span>
                            <span className="text-[10px] text-gray-400 truncate block">{paper.contentUrl}</span>
                        </div>
                    </div>
                );
            case 'file':
                return (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100 mb-2">
                        <div className="p-2 bg-blue-500 text-white rounded-lg">
                            <FileIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-xs font-bold truncate block">{paper.text}</span>
                            <span className="text-[10px] text-blue-400 font-mono">PDF / 2.4MB</span>
                        </div>
                    </div>
                );
            default:
                if (paper.fullBackground && paper.contentUrl) return null;
                return (
                    <p className={`text-sm text-[var(--text-main)] leading-relaxed mb-2 line-clamp-6 opacity-90`}>
                        {paper.text}
                    </p>
                );
        }
    };

    return (
        <motion.div
            ref={setNodeRef}

            {...listeners}
            {...attributes}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -50 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
            className={`
                group p-4 rounded-3xl bg-white border-2 
                shadow-md hover:shadow-[0_24px_48px_rgba(0,0,0,0.15)]
                transition-all duration-500 cursor-pointer relative w-full
                h-full flex flex-col overflow-hidden
                ${className}
            `}
            style={{
                ...style,
                borderColor: paper.fullBackground ? 'transparent' : `${category.color}59`,
                backgroundImage: paper.fullBackground && paper.contentUrl ? `url(${paper.contentUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: style.transform ? style.transform : (paper.pinned ? 'rotate(-1deg)' : 'none')
            }}
        >
            {/* Dark Overlay for Background Mode */}
            {paper.fullBackground && paper.contentUrl && (
                <div className="absolute inset-0 bg-black/40 z-0" />
            )}
            {/* Hover Scattering Background Effect (Subtle) */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.03 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[var(--primary)] pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex justify-between items-start mb-2 relative z-10 shrink-0">
                <span className={`text-[9px] font-bold tracking-widest uppercase opacity-60 ${paper.fullBackground ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                    {new Date(paper.time).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                    {paper.pinned && (
                        <Pin className="w-3 h-3 text-[#eab308] fill-current" />
                    )}
                    <div className={`flex items-center gap-1 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onTogglePin?.(paper.id); }}
                            className={`p-1.5 rounded-xl transition-colors ${paper.fullBackground ? 'hover:bg-white/10' : 'hover:bg-gray-100'} ${paper.pinned ? 'text-[#eab308]' : (paper.fullBackground ? 'text-white/70' : 'text-gray-400')}`}
                            title={paper.pinned ? "取消釘選" : "釘選"}
                            aria-label={paper.pinned ? "取消釘選" : "釘選"}
                        >
                            <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onArchive?.(paper.id); }}
                            className={`p-1.5 rounded-xl transition-colors ${paper.fullBackground ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-purple-50 text-gray-400 hover:text-purple-500'}`}
                            title="收納"
                            aria-label="收納"
                        >
                            <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                            className={`p-1.5 rounded-xl transition-colors ${paper.fullBackground ? 'hover:bg-white/10 text-white/70 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'}`}
                            title="刪除"
                            aria-label="刪除"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative z-10 flex-1 min-h-0 overflow-hidden">
                {renderContent()}
            </div>

            {/* Footer / Meta */}
            <div className={`flex items-center justify-between mt-2 pt-2 border-t transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} ${paper.fullBackground ? 'border-white/10' : 'border-gray-50'}`}>
                <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold uppercase ${paper.fullBackground ? 'bg-white/10 text-white/50' : 'bg-gray-100 text-gray-400'}`}>
                        {paper.type === 'stock' ? <TrendingUp className="w-3 h-3" /> : paper.type[0]}
                    </div>
                    <span className={`text-[10px] italic ${paper.fullBackground ? 'text-white/40' : 'text-gray-400'}`}>#{paper.type}</span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                    className={`
                        flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-full transition-all shadow-md active:scale-95
                        ${paper.fullBackground ? 'brightness-110' : ''}
                    `}
                    style={{
                        background: `linear-gradient(135deg, ${category.color}, ${hexToRgba(category.color, 0.8)})`,
                        border: `1px solid ${hexToRgba('#ffffff', 0.2)}`,
                        color: 'white'
                    }}
                >
                    <Sparkles className="w-3 h-3 text-white" />
                    AI 建議
                </button>
            </div>

            {/* Suction/Delete Animation Confirmation */}
            <AnimatePresence>
                {confirmDelete && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <p className="text-xs font-bold text-gray-600 mb-3">確認移除這張小紙片？</p>
                            <div className="flex gap-2 justify-center">
                                <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 text-[10px] font-bold text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">取消</button>
                                <button onClick={() => { onDelete?.(paper.id); setConfirmDelete(false); }} className="px-3 py-1.5 text-[10px] font-bold bg-red-500 text-white rounded-lg shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors">刪除</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PaperCard;
