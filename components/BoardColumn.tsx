import React, { useState, useRef, useEffect } from 'react';
import { Paper, Category } from '../types';
import PaperCard from './PaperCard';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Plus, Trash2, Archive, Maximize2 } from 'lucide-react'; // Added Maximize2
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Helper to convert hex to rgba for glass effects
const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface BoardColumnProps {
    category: Category;
    papers: Paper[];
    onAddPaper: (catId: string) => void;
    onDeletePaper: (id: string) => void;
    onArchiveNote: (id: string) => void;
    onDeleteCategory: (id: string) => void;
    onArchiveCategory: (id: string) => void;
    onUpdateCategory: (id: string, updates: Partial<Category>) => void;
    onPaperClick: (paper: Paper) => void;
    onTogglePin?: (id: string, pinned: boolean) => void;
    isExpanded?: boolean;
    onExpand?: () => void;
    isSingleColumn?: boolean;
    className?: string;
}

const BoardColumn: React.FC<BoardColumnProps> = ({
    category,
    papers,
    onAddPaper,
    onDeletePaper,
    onArchiveNote,
    onDeleteCategory,
    isSingleColumn,
    onArchiveCategory,
    onUpdateCategory,
    onPaperClick,
    onTogglePin,
    isExpanded = false,
    onExpand,
    className
}) => {
    // Refs for Drag and Drop
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: category.id,
        data: { type: 'column', categoryId: category.id },
        disabled: isExpanded // Disable drag when expanded
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    const [showOptions, setShowOptions] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editName, setEditName] = useState(category.title);
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const iconPickerTimerRef = useRef<NodeJS.Timeout | null>(null);
    const editTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-cancel edit name if inactive for 2 seconds
    useEffect(() => {
        if (isEditingName) {
            if (editTimeoutRef.current) clearTimeout(editTimeoutRef.current);
            editTimeoutRef.current = setTimeout(() => {
                setIsEditingName(false);
                setEditName(category.title);
            }, 2000);
        }
        return () => {
            if (editTimeoutRef.current) clearTimeout(editTimeoutRef.current);
        };
    }, [isEditingName, editName, category.title]);

    // Common Icons
    const availableIcons = [
        '🎨', '📚', '💼', '🚀', '💡', '📅', '📝', '🧘‍♀️', '🎮', '🎵',
        '✈️', '🏠', '🔧', '💻', '🛒', '🎓', '💊', '🎬', '🎤', '🏆',
        '⚽', '🍔', '🍕', '🚗', '🗺️', '📷', '🌻', '🐶', '🐱', '🦄',
        '🌈', '🔥', '💧', '⚡', '🎁', '🧸', '🔑', '🔒', '❤️', '⭐'
    ];

    const handleNameSubmit = () => {
        if (editTimeoutRef.current) clearTimeout(editTimeoutRef.current);
        if (editName.trim()) {
            onUpdateCategory(category.id, { title: editName });
        } else {
            setEditName(category.title);
        }
        setIsEditingName(false);
    };

    const displayPapers = [...papers.filter(p => p.pinned), ...papers.filter(p => !p.pinned)];

    // Grid class helper - Only used if isExpanded is true
    const getGridClass = (count: number) => {
        let desktopClass = 'md:grid-cols-4';
        if (count <= 1) desktopClass = 'md:grid-cols-1';
        else if (count === 2) desktopClass = 'md:grid-cols-2';
        else if (count === 3) desktopClass = 'md:grid-cols-3';
        else if (count === 4) desktopClass = 'md:grid-cols-2';
        else if (count <= 6) desktopClass = 'md:grid-cols-3';
        else if (count <= 8) desktopClass = 'md:grid-cols-4';
        else desktopClass = 'md:grid-cols-3';

        return `grid-cols-1 ${desktopClass}`;
    };

    // Determine content layout class
    const contentLayoutClass = isExpanded
        ? 'grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))] auto-rows-max p-8 h-full content-start'
        : 'flex flex-col gap-3'; // Single column stack for normal view

    const glassShadow = !isDragging ? `0 15px 30px -15px ${category.color}33, 0 6px 20px -10px rgba(0,0,0,0.15)` : 'none';

    return (
        <div
            ref={setNodeRef}
            style={{
                ...(!isExpanded ? style : {}),
                background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.2) 70%, ${category.color}1a 100%)`,
                boxShadow: glassShadow,
            }}
            className={`
                flex flex-col w-full rounded-[22px]
                backdrop-blur-xl border border-white/60 relative
                transition-all duration-300 ease-out
                ${isDragging ? 'opacity-20 !transition-none border-dashed' : (!isExpanded ? 'hover:scale-[1.01] hover:bg-white/10' : '')}
                ${isExpanded ? 'h-full shadow-none border-none bg-transparent' : 'h-full min-h-[150px]'}
                ${className || ''}
                ring-1 ring-white/20
            `}
            // 3. Click peripheral blank space to expand (Rule 4)
            // We apply onClick to the container. Children must stopPropagation if they don't want to trigger expand.
            onClick={(e) => {
                if (!isExpanded && onExpand && !isDragging) {
                    onExpand();
                }
            }}
        >
            {/* Header Area */}
            <div
                {...attributes}
                {...listeners}
                className={`flex items-center justify-between p-5 pb-2 pl-12 ${isExpanded ? 'pr-40' : ''} relative z-20 group/header outline-none ${!isExpanded ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Icon */}
                    <div
                        className="text-2xl cursor-copy relative"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsIconPickerOpen(!isIconPickerOpen);
                        }}
                        onMouseEnter={() => {
                            if (iconPickerTimerRef.current) {
                                clearTimeout(iconPickerTimerRef.current);
                                iconPickerTimerRef.current = null;
                            }
                        }}
                        onMouseLeave={() => {
                            if (isIconPickerOpen) {
                                iconPickerTimerRef.current = setTimeout(() => {
                                    setIsIconPickerOpen(false);
                                }, 1000);
                            }
                        }}
                    >
                        {category.icon || '📌'}
                        {isIconPickerOpen && (
                            <div className="absolute top-12 left-0 z-50 bg-white p-2 rounded-[14px] shadow-xl border border-gray-100 w-64 flex flex-wrap gap-1 cursor-default custom-scrollbar max-h-60 overflow-y-auto" onPointerDown={e => e.stopPropagation()}>
                                {availableIcons.map(icon => (
                                    <button
                                        key={icon}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onUpdateCategory(category.id, { icon });
                                            setIsIconPickerOpen(false);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-[10px] text-lg"
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Title Area - Click to edit, PointerDown allowed for Drag */}
                    <div className="flex-1 min-w-0 relative">
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    autoFocus
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleNameSubmit();
                                        if (e.key === 'Escape') {
                                            if (editTimeoutRef.current) clearTimeout(editTimeoutRef.current);
                                            setIsEditingName(false);
                                            setEditName(category.title);
                                        }
                                    }}
                                    onBlur={() => {
                                        // Delay blur slightly to allow "+" button click to register
                                        setTimeout(() => {
                                            if (editTimeoutRef.current) clearTimeout(editTimeoutRef.current);
                                            setIsEditingName(false);
                                            setEditName(category.title);
                                        }, 150);
                                    }}
                                    className="w-full bg-white/50 border border-blue-200 rounded-[10px] px-2 py-1 outline-none text-[var(--text-main)] font-semibold"
                                    onClick={e => e.stopPropagation()}
                                    onPointerDown={e => e.stopPropagation()}
                                />
                                <button onClick={(e) => { e.stopPropagation(); handleNameSubmit(); }} className="p-1 hover:bg-green-100 text-green-600 rounded-md">
                                    <Plus size={16} />
                                </button>
                            </div>
                        ) : (
                            <h3
                                className="font-bold text-black/80 truncate text-lg cursor-text px-2 py-1 rounded-[10px]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditingName(true);
                                }}
                            >
                                {category.title}
                            </h3>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className={`flex items-center gap-1 transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover/header:opacity-100'}`} onPointerDown={e => e.stopPropagation()}>
                    {!isExpanded && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onExpand?.(); }}
                            className="p-1.5 hover:bg-black/5 rounded-[10px] text-gray-400 hover:text-gray-600 transition-colors"
                            title="展開"
                        >
                            <Maximize2 size={16} />
                        </button>
                    )}
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowOptions(!showOptions); }}
                            className="p-1.5 hover:bg-black/5 rounded-[10px] text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <MoreHorizontal size={18} />
                        </button>
                        <AnimatePresence>
                            {showOptions && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-[14px] shadow-xl border border-gray-100 z-50 overflow-hidden"
                                >
                                    <button onClick={(e) => { e.stopPropagation(); onArchiveCategory(category.id); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-600">
                                        <Archive size={16} /> 收納欄位
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); onDeleteCategory(category.id); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600">
                                        <Trash2 size={16} /> 刪除欄位
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div
                className={`
                    flex-1 overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar p-3
                    ${contentLayoutClass}
                `}
            >
                <AnimatePresence>
                    {displayPapers.map(paper => (
                        <div key={paper.id} onClick={(e) => { e.stopPropagation(); onPaperClick(paper); }} className={isExpanded ? '' : 'w-full'}>
                            <PaperCard
                                paper={paper}
                                category={category}
                                onClick={() => onPaperClick(paper)}
                                onDelete={onDeletePaper}
                                onArchive={onArchiveNote}
                                onTogglePin={(id) => onTogglePin?.(id, !paper.pinned)}
                            />
                        </div>
                    ))}
                </AnimatePresence>

                {/* Add Button - Only show if NOT isExpanded */}
                {!isExpanded && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddPaper(category.id); }}
                        className={`
                            rounded-[18px] border-2 border-dashed
                            flex items-center justify-center
                            transition-all group cursor-pointer
                            w-full py-8 min-h-[100px]
                            bg-white/5
                        `}
                        style={{
                            borderColor: hexToRgba(category.color, 0.2),
                            color: hexToRgba(category.color, 0.4),
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = category.color;
                            e.currentTarget.style.color = category.color;
                            e.currentTarget.style.backgroundColor = hexToRgba(category.color, 0.05);
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = hexToRgba(category.color, 0.2);
                            e.currentTarget.style.color = hexToRgba(category.color, 0.4);
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <Plus size={32} className="group-hover:scale-110 transition-transform" />
                    </button>
                )}
            </div>


        </div>
    );
};

export default BoardColumn;