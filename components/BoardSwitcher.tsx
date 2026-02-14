import React, { useState, useRef } from 'react';
import { Board } from '../types';
import { Plus, Trash2, AlertTriangle, ChevronLeft, ChevronRight, Check, Layout, Lock, X } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DropAnimation,
    useDndContext
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { usePermissions } from '../hooks/usePermissions';

const restrictToVerticalAxis = ({ transform }: any) => {
    return {
        ...transform,
        x: 0,
    };
};

interface BoardSwitcherProps {
    boards: Board[];
    activeBoardId: string;
    onSelectBoard: (id: string) => void;
    onAddBoard: () => void;
    onDeleteBoard: (id: string) => void;
    onUpdateBoard: (id: string, updates: Partial<Board>) => void;
    onReorderBoards: (boards: Board[]) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    user: any;
    onUpgrade: () => void;
}

// --- Sortable Item Component ---
interface SortableBoardItemProps {
    board: Board;
    activeBoardId: string;
    onSelectBoard: (id: string) => void;
    onDeleteBoard: (id: string) => void;
    onUpdateBoard: (id: string, updates: Partial<Board>) => void;
    isCollapsed: boolean;
    confirmDeleteId: string | null;
    setConfirmDeleteId: (id: string | null) => void;
    isSingular: boolean;
    isLastDropTarget?: boolean;
}

// --- Pure UI Component (No DnD logic inside) ---
interface BoardItemUIProps extends Omit<SortableBoardItemProps, 'isLastDropTarget'> {
    isDragging?: boolean;
    isOver?: boolean;
    style?: React.CSSProperties;
    attributes?: any;
    listeners?: any;
    isLastDropTarget?: boolean;
    isInOverlay?: boolean;
    isPlaceholder?: boolean;
    isActivelyHeld?: boolean;
}

const BoardItemUI: React.FC<BoardItemUIProps> = ({
    board: b,
    activeBoardId,
    onSelectBoard,
    onDeleteBoard,
    onUpdateBoard,
    isCollapsed,
    confirmDeleteId,
    setConfirmDeleteId,
    isSingular,
    isDragging,
    isOver,
    style,
    attributes,
    listeners,
    isLastDropTarget,
    isInOverlay,
    isPlaceholder,
    isActivelyHeld
}) => {
    const isActive = activeBoardId === b.id;
    const [deleteStep, setDeleteStep] = useState(0);

    if (isPlaceholder) {
        return (
            <div
                className={`
                    relative pointer-events-none flex items-center justify-center
                    ${isCollapsed ? 'w-full h-[52px]' : 'w-full h-[72px]'}
                    transition-none
                `}
            >
                <div className={`
                    border-2 border-dashed border-gray-300 bg-gray-50/20 rounded-[16px]
                    ${isCollapsed ? 'w-[52px] h-[52px]' : 'w-full h-full'}
                `} />
            </div>
        );
    }

    return (
        <div
            style={isInOverlay ? undefined : style}
            className={`
                relative group perspective-1000 touch-none origin-center
                scale-100
                ${isDragging ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                z-10
            `}
            {...attributes}
            {...listeners}
        >
            <div
                onClick={() => {
                    if (!isActive) onSelectBoard(b.id);
                }}
                style={isInOverlay ? undefined : {
                    ...style,
                    background: (isActive || isInOverlay)
                        ? 'linear-gradient(135deg, rgba(220, 220, 220, 0.8) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(200, 200, 200, 0.7) 100%)'
                        : undefined
                }}
                className={`
                    flex items-center ${isInOverlay ? '' : 'transition-all duration-300'}
                    relative z-10 select-none cursor-grab active:cursor-grabbing
                    ${isCollapsed ? 'w-[52px] h-[52px] justify-center rounded-[16px]' : 'w-full h-[72px] p-3 rounded-[16px] gap-3'}
                    ${(isActive || isInOverlay)
                        ? 'shadow-[0_10px_20px_-5px_rgba(0,0,0,0.12),0_4px_6px_-2px_rgba(0,0,0,0.05)] border-white/60'
                        : 'bg-white/40 border-transparent hover:bg-white hover:shadow-md hover:border-[var(--border-light)]'
                    }
                    ${isInOverlay ? 'scale-110 rotate-1 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)]' : 'scale-100'}
                    border
                `}
            >
                {/* Icon */}
                <motion.div
                    animate={isLastDropTarget ? {
                        scale: [1, 1.4, 0.9, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                        opacity: [1, 0.8, 1]
                    } : {}}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`
                        flex-shrink-0 relative
                        flex items-center justify-center ${isInOverlay ? '' : 'transition-all duration-300'}
                        text-xl
                        ${isLastDropTarget ? 'ring-4 ring-cyan-400 ring-opacity-50' : ''}
                    `}
                >
                    {b.icon}
                </motion.div>

                {/* Name */}
                {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between group/name">
                            <span className="text-sm font-bold text-gray-700 truncate flex-1 text-left">
                                {b.name}
                            </span>
                            {!isSingular && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmDeleteId(b.id);
                                        setDeleteStep(1);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-[10px] transition-all"
                                    title="刪除白板"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Confirm Delete Overlay */}
                {confirmDeleteId === b.id && (
                    <div className="absolute inset-0 bg-red-50 z-[100] rounded-[16px] flex items-center justify-center animate-in fade-in zoom-in duration-200 shadow-xl border-2 border-red-200 overflow-hidden">
                        {deleteStep === 1 ? (
                            <div className="flex items-center gap-2 px-4 w-full h-full">
                                <span className="text-xs font-black text-red-600 flex-1">確認刪除？</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDeleteStep(2); }}
                                    className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-[12px] hover:bg-red-600 shadow-sm active:scale-95 transition-all"
                                >
                                    確認
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); setDeleteStep(0); }}
                                    className="p-1.5 bg-white text-gray-400 rounded-[12px] hover:bg-gray-100 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-1 w-full h-full bg-red-600 text-white p-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                                    <span className="text-[10px] font-black leading-tight">將一併刪除此白板內<br />所有欄位與卡片！</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteBoard(b.id); }}
                                        className="px-4 py-1.5 bg-white text-red-600 text-xs font-black rounded-[10px] hover:shadow-lg active:scale-95 transition-all"
                                    >
                                        確定移除
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); setDeleteStep(0); }}
                                        className="px-3 py-1.5 bg-transparent text-white/80 text-[10px] font-bold hover:text-white"
                                    >
                                        取消
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Background Placeholder when held but not yet dragging */}
            {
                isActivelyHeld && !isDragging && !isInOverlay && (
                    <div
                        className={`
                        absolute inset-0 -z-10 border-2 border-dashed border-gray-300 bg-gray-50/20 rounded-[16px]
                        ${isCollapsed ? 'w-[52px] h-[52px]' : 'w-full h-[72px]'}
                    `}
                    />
                )
            }
        </div >
    );
};

const SortableBoardItem: React.FC<SortableBoardItemProps> = (props) => {
    const { board: b } = props;
    const { active } = useDndContext();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver
    } = useSortable({
        id: b.id,
        data: { type: 'board', boardId: b.id }
    });

    const isActivelyHeld = active?.id === b.id;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'none' : transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="mb-2 last:mb-0"
        >
            <BoardItemUI
                {...props}
                isDragging={isDragging}
                isPlaceholder={isDragging}
                isActivelyHeld={isActivelyHeld}
                attributes={attributes}
                listeners={listeners}
                isOver={isOver}
            />
        </div>
    );
};

const BoardSwitcher: React.FC<BoardSwitcherProps> = ({
    boards,
    activeBoardId,
    onSelectBoard,
    onAddBoard,
    onDeleteBoard,
    onUpdateBoard,
    onReorderBoards,
    isCollapsed,
    onToggleCollapse,
    user,
    onUpgrade,
    lastDropTargetId,
    isDraggingAny
}) => {
    const { canAddBoard, plan } = usePermissions(user);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [isInternalDragging, setIsInternalDragging] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 250, // "長按" activation
                tolerance: 5,
            }
        }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: any) => {
        setIsInternalDragging(true);
        setActiveDragId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setIsInternalDragging(false);
        setActiveDragId(null);

        if (active.id !== over?.id) {
            const oldIndex = boards.findIndex((b) => b.id === active.id);
            const newIndex = boards.findIndex((b) => b.id === over?.id);
            onReorderBoards(arrayMove(boards, oldIndex, newIndex));
        }
    };

    return (
        <div
            className={`
                relative flex flex-col gap-4 h-full transition-all duration-500 ease-in-out z-20 border-r border-gray-200/50
                ${isCollapsed ? 'w-20 p-2 py-4' : 'w-72 px-6 py-4'}
            `}
        >
            {/* Collapse Toggle */}
            <button
                onClick={onToggleCollapse}
                className="absolute -right-[43px] top-[13px] p-2 flex items-center justify-center z-50 hover:text-gray-900 transition-colors cursor-pointer text-gray-400 group-hover:opacity-100"
            >
                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Header/Add Board */}
            <div className="flex flex-col gap-3">
                <motion.button
                    initial={false}
                    animate={{
                        scale: [1, 1.015, 1],
                        transition: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                    whileHover={canAddBoard ? {
                        y: -2,
                        scale: 1.02,
                        boxShadow: '0 12px 24px -6px rgba(45,212,191,0.4)',
                    } : {}}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => canAddBoard ? onAddBoard() : onUpgrade()}
                    className={`
                        flex items-center justify-center gap-2 rounded-[16px]
                        ${isCollapsed ? 'w-full h-[52px] p-0' : 'w-full h-[52px] p-3'}
                        ${canAddBoard
                            ? 'bg-gradient-to-r from-cyan-400 to-teal-600 text-white shadow-[0_8px_20px_-4px_rgba(45,212,191,0.5)]'
                            : 'bg-white text-gray-400 border border-amber-200 shadow-[0_4px_12px_rgba(245,158,11,0.15)] opacity-90'
                        }
                        transition-all tap-feedback group relative -mt-[8px]
                    `}
                >
                    {canAddBoard ? <Plus className="w-5 h-5" /> : <Lock className="w-4 h-4 text-amber-500" />}
                    {!isCollapsed && (
                        <span className={`text-base font-bold whitespace-nowrap ${!canAddBoard ? 'text-amber-600' : ''}`}>
                            {canAddBoard ? '白板' : '升級 PRO 體驗無限'}
                        </span>
                    )}
                </motion.button>
            </div>

            {/* Boards List with DnD */}
            <div className={`
                flex flex-col flex-1 overflow-y-auto overflow-x-visible custom-scrollbar py-2 mt-3
                ${isCollapsed ? 'px-0 items-center' : 'px-0'}
            `}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <SortableContext
                        items={boards.map(b => b.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {boards.map(b => (
                            <SortableBoardItem
                                key={b.id}
                                board={b}
                                activeBoardId={activeBoardId}
                                onSelectBoard={onSelectBoard}
                                onDeleteBoard={onDeleteBoard}
                                onUpdateBoard={onUpdateBoard}
                                isCollapsed={isCollapsed}
                                confirmDeleteId={confirmDeleteId}
                                setConfirmDeleteId={setConfirmDeleteId}
                                isSingular={boards.length <= 1}
                                isLastDropTarget={lastDropTargetId === b.id}
                            />
                        ))}
                    </SortableContext>
                    <DragOverlay
                        zIndex={200}
                        modifiers={[restrictToVerticalAxis]}
                        adjustScale={false}
                        dropAnimation={{
                            duration: 300,
                            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                            sideEffects: defaultDropAnimationSideEffects({
                                styles: {
                                    active: {
                                        opacity: '1',
                                    },
                                },
                            }),
                        }}
                    >
                        {activeDragId ? (
                            <div className="cursor-grabbing pointer-events-none origin-center">
                                <BoardItemUI
                                    board={boards.find(b => b.id === activeDragId)!}
                                    activeBoardId={activeBoardId}
                                    onSelectBoard={() => { }}
                                    onDeleteBoard={() => { }}
                                    onUpdateBoard={() => { }}
                                    isCollapsed={isCollapsed}
                                    confirmDeleteId={null}
                                    setConfirmDeleteId={() => { }}
                                    isSingular={false}
                                    isDragging={false}
                                    isInOverlay={true}
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {/* Team Section - Coming Soon */}
            {!isCollapsed && (
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-widest">團隊工作區</h3>
                        <span className="text-[8px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-bold">SOON</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-[16px] border border-dashed border-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-400 font-medium italic">功能開發中...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardSwitcher;
