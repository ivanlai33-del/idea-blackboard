import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import NoteCard from './NoteCard';
import { Note, Category } from '../types';

interface SortableNoteCardProps {
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

const SortableNoteCard: React.FC<SortableNoteCardProps> = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: props.note.id,
        data: {
            type: 'Note',
            note: props.note
        }
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        // Visual feedback for the placeholder in the list when dragging
        opacity: isDragging ? 0.4 : 1,
        // Dashed border placeholder effect
        border: isDragging ? '2px dashed #00af80' : 'none',
        borderRadius: '12px',
        backgroundColor: isDragging ? 'rgba(0, 175, 128, 0.05)' : undefined,
        // Mobile touch optimization
        touchAction: 'manipulation', 
        zIndex: isDragging ? 0 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {/* If dragging, we might want to hide the content to show just the placeholder slot, 
                but reducing opacity is usually smoother */}
            <div style={{ opacity: isDragging ? 0 : 1 }}>
                <NoteCard {...props} />
            </div>
        </div>
    );
};

export default SortableNoteCard;