import React, { useState } from 'react';
import { Note, Category } from '../types';
import SortableNoteCard from './SortableNoteCard';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, X } from 'lucide-react';

interface BoardColumnProps {
    category: Category;
    notes: Note[];
    onOpenColumn: (catId: string) => void;
    onOpenNote: (note: Note) => void;
    onDeleteNote: (id: string) => void;
    onTogglePin: (id: string) => void;
    onArchiveNote: (id: string) => void;
    onUpdateNote: (note: Note) => void;
    onDeleteColumn: (id: string) => void;
}

const BoardColumn: React.FC<BoardColumnProps> = ({ category, notes, onOpenColumn, onOpenNote, onDeleteNote, onTogglePin, onArchiveNote, onUpdateNote, onDeleteColumn }) => {
    const [isDeletingColumn, setIsDeletingColumn] = useState(false);

    // Column Sorting Logic
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: category.id,
        data: {
            type: 'Column',
            category
        }
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        // Placeholder visual feedback
        opacity: isDragging ? 0.3 : 1,
        border: isDragging ? '2px dashed #00af80' : 'none',
        borderRadius: '16px',
        background: isDragging ? 'rgba(0, 175, 128, 0.05)' : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                flex flex-col h-full min-w-0
                group/column relative transition-all duration-300
                glass-card
                ${isDragging ? 'opacity-30 border-dashed border-[var(--primary)]' : ''}
            `}
        >
            {/* Show content only if not dragging (placeholder mode) */}
            <div className={`flex flex-col h-full ${isDragging ? 'opacity-0' : 'opacity-100'}`}>
                {/* Column Header */}
                <div
                    className="p-3 flex items-center justify-between mb-1 select-none"
                    {...attributes}
                >
                    {/* Title Area - Click to Open */}
                    <div className="flex items-center gap-2 flex-1 overflow-hidden cursor-pointer" onClick={() => onOpenColumn(category.id)}>
                        {/* Drag Handle */}
                        <div
                            className="p-1.5 -ml-1 text-[var(--text-muted)] opacity-30 hover:opacity-100 cursor-grab active:cursor-grabbing hover:bg-black/5 rounded-md touch-none transition-colors"
                            {...listeners}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GripVertical className="w-4 h-4" />
                        </div>

                        {category.icon && (
                            <span className="text-xl leading-none">{category.icon}</span>
                        )}
                        <h2
                            className="font-bold text-sm tracking-tight text-[var(--text-main)]"
                        >
                            {category.title}
                        </h2>
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono bg-white/50 border border-[var(--border-light)]"
                            style={{ color: category.color }}
                        >
                            {notes.length}
                        </span>
                    </div>

                    {/* Delete Column Button */}
                    <div className="relative">
                        {isDeletingColumn ? (
                            <div className="flex items-center gap-2 animate-modal-in">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteColumn(category.id); }}
                                    className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 whitespace-nowrap"
                                >
                                    刪除
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setIsDeletingColumn(false); }} className="text-[var(--text-muted)] hover:text-[var(--text-main)]" title="取消">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsDeletingColumn(true); }}
                                className="text-[var(--text-muted)] hover:text-red-500 transition-colors opacity-0 group-hover/column:opacity-100 p-1"
                                title="刪除欄位"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Notes List */}
                <div className="flex-grow overflow-y-auto px-3 pb-3 space-y-3 custom-scrollbar">
                    <SortableContext
                        items={notes.map(n => n.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {notes.map((note, idx) => (
                            <SortableNoteCard
                                key={note.id}
                                note={note}
                                category={category}
                                index={idx}
                                onClick={() => onOpenNote(note)}
                                onQuickAI={(e) => {
                                    e.stopPropagation();
                                    onOpenNote(note);
                                }}
                                onDelete={() => onDeleteNote(note.id)}
                                onTogglePin={(e) => {
                                    e.stopPropagation();
                                    onTogglePin(note.id);
                                }}
                                onArchive={(e) => {
                                    e.stopPropagation();
                                    onArchiveNote(note.id);
                                }}
                                onUpdateNote={onUpdateNote}
                            />
                        ))}
                    </SortableContext>
                    {/* Empty State */}
                    {notes.length === 0 && (
                        <div className="h-32 flex items-center justify-center opacity-30 border-2 border-dashed border-[var(--border-light)] rounded-2xl m-1">
                            <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">Empty_Slot</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BoardColumn;