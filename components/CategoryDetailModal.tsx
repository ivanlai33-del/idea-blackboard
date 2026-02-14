import React, { useState, useEffect, useRef } from 'react';
import { Category, Paper } from '../types';
import BoardColumn from './BoardColumn';
import { X, Plus, Maximize2, Move } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

interface CategoryDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    papers: Paper[];
    onAddPaper: (catId: string) => void;
    onPaperClick: (paper: Paper) => void;
    onDeletePaper: (id: string) => void;
    onArchiveNote: (id: string) => void;
    onDeleteCategory: (id: string) => void;
    onArchiveCategory: (id: string) => void;
    onUpdateCategory: (id: string, updates: Partial<Category>) => void;
    onUpgrade: () => void;
}

const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
    isOpen, onClose, category, papers, onAddPaper, onPaperClick, onDeletePaper,
    onArchiveNote, onDeleteCategory, onArchiveCategory, onUpdateCategory, onUpgrade
}) => {
    const [windowLayout, setWindowLayout] = useState({
        width: window.innerWidth * 0.85,
        height: window.innerHeight * 0.85,
        x: 0,
        y: 0
    });
    const dragControls = useDragControls();
    const [isResizing, setIsResizing] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const resizeAnchorRef = useRef<{
        left: number,
        top: number,
        initialWidth: number,
        initialHeight: number,
        initialX: number,
        initialY: number
    } | null>(null);

    // Resize Handler
    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !resizeAnchorRef.current) return;

            const {
                left: initialLeft,
                top: initialTop,
                initialWidth,
                initialHeight,
                initialX,
                initialY
            } = resizeAnchorRef.current;

            setWindowLayout(prev => {
                const layout = { ...prev };
                const mouseX = Math.max(0, Math.min(window.innerWidth, e.clientX));
                const mouseY = Math.max(0, Math.min(window.innerHeight, e.clientY));

                if (isResizing === 'r' || isResizing === 'br') {
                    const minWidth = 600;
                    const availableWidth = window.innerWidth - initialLeft - 20;
                    const finalWidth = Math.min(availableWidth, Math.max(minWidth, mouseX - initialLeft));

                    const deltaW = finalWidth - initialWidth;
                    layout.width = finalWidth;
                    layout.x = initialX + (deltaW / 2);
                }

                if (isResizing === 'br') {
                    const minHeight = 400;
                    const availableHeight = window.innerHeight - initialTop - 20;
                    const finalHeight = Math.min(availableHeight, Math.max(minHeight, mouseY - initialTop));

                    const deltaH = finalHeight - initialHeight;
                    layout.height = finalHeight;
                    layout.y = initialY + (deltaH / 2);
                }
                return layout;
            });
        };

        const handleMouseUp = () => setIsResizing(null);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    if (!isOpen || !category) return null;

    return (
        <AnimatePresence>
            <div
                ref={containerRef}
                className={`fixed inset-0 z-[150] bg-black/15 backdrop-blur-2xl flex items-center justify-center p-4 ${isResizing ? 'dragging-active' : ''}`}
            >
                <motion.div
                    drag
                    dragConstraints={containerRef}
                    dragElastic={0}
                    dragControls={dragControls}
                    dragListener={false}
                    dragMomentum={false}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        x: windowLayout.x,
                        y: windowLayout.y,
                        width: windowLayout.width,
                        height: windowLayout.height
                    }}
                    transition={isResizing || isDragging ? { duration: 0 } : { type: 'tween', duration: 0, opacity: { duration: 0.2 } }}
                    dragTransition={{ power: 0, timeConstant: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{ position: 'relative' }}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={(_, info) => {
                        setIsDragging(false);
                        setWindowLayout(prev => ({
                            ...prev,
                            x: prev.x + info.offset.x,
                            y: prev.y + info.offset.y
                        }));
                    }}
                    className={`bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative border border-white/60 ${isResizing || isDragging ? 'select-none pointer-events-none' : ''}`}
                >
                    {/* Resize Handle - Right Edge (Symmetric) */}
                    <div className="absolute top-16 bottom-16 right-0 w-2 cursor-ew-resize z-[260] hover:bg-indigo-500/10 transition-colors"
                        onMouseDown={() => {
                            const centerX = window.innerWidth / 2;
                            const centerY = window.innerHeight / 2;
                            resizeAnchorRef.current = {
                                left: centerX - windowLayout.width / 2 + windowLayout.x,
                                top: centerY - windowLayout.height / 2 + windowLayout.y,
                                initialWidth: windowLayout.width,
                                initialHeight: windowLayout.height,
                                initialX: windowLayout.x,
                                initialY: windowLayout.y
                            };
                            setIsResizing('r');
                        }}
                    />

                    {/* Resize Handle - Bottom Right Corner (4 Dots) */}
                    <div className="absolute bottom-0 right-0 w-12 h-12 cursor-se-resize z-[260] group/h flex items-center justify-center"
                        onMouseDown={() => {
                            const centerX = window.innerWidth / 2;
                            const centerY = window.innerHeight / 2;
                            resizeAnchorRef.current = {
                                left: centerX - windowLayout.width / 2 + windowLayout.x,
                                top: centerY - windowLayout.height / 2 + windowLayout.y,
                                initialWidth: windowLayout.width,
                                initialHeight: windowLayout.height,
                                initialX: windowLayout.x,
                                initialY: windowLayout.y
                            };
                            setIsResizing('br');
                        }}
                    >
                        <div className="grid grid-cols-2 gap-1.5 p-3 opacity-40 group-hover:opacity-100 transition-opacity">
                            {[...Array(4)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />)}
                        </div>
                    </div>

                    {/* Drag Handle Area - Top Area (No Hover UI) */}
                    <div
                        onPointerDown={(e) => !(isResizing || isDragging) && dragControls.start(e)}
                        className={`absolute top-0 left-0 right-0 h-16 z-[40] cursor-default active:cursor-grabbing pointer-events-auto`}
                    />

                    {/* Modal Content */}
                    <div className={`flex-1 overflow-hidden relative ${isResizing || isDragging ? 'pointer-events-none' : ''}`}>
                        <BoardColumn
                            category={category}
                            papers={papers}
                            onAddPaper={onAddPaper}
                            onPaperClick={onPaperClick}
                            onDeletePaper={onDeletePaper}
                            onArchiveNote={onArchiveNote}
                            onDeleteCategory={onDeleteCategory}
                            onArchiveCategory={onArchiveCategory}
                            onUpdateCategory={onUpdateCategory}
                            isExpanded={true}
                            onExpand={onClose}
                        />

                        {/* Top Right Actions */}
                        <div className="absolute top-6 right-8 flex items-center gap-3 z-[100]">
                            {(() => {
                                const categoryColor = category.color || '#6366f1';
                                const glassButtonStyle = {
                                    backgroundColor: categoryColor,
                                    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)',
                                    boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.4), 0 10px 20px -5px ${categoryColor}40`,
                                    border: '1px solid rgba(255,255,255,0.2)'
                                };
                                return (
                                    <button
                                        onClick={() => onAddPaper(category.id)}
                                        style={glassButtonStyle}
                                        className="flex items-center gap-2 px-5 py-2.5 text-white rounded-2xl font-black uppercase tracking-widest hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all group shadow-xl"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="text-xs">卡片</span>
                                    </button>
                                );
                            })()}

                            <button
                                onClick={onClose}
                                className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-400"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CategoryDetailModal;
