import React, { useState, useRef, useEffect } from 'react';
import { Category, Note } from '../types';
import { X, Plus, GripVertical } from 'lucide-react';
import NoteCard from './NoteCard';
import SortableNoteCard from './SortableNoteCard';
import {
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    MouseSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    defaultDropAnimationSideEffects,
    DropAnimation
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy
} from '@dnd-kit/sortable';

interface ColumnExpandModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    notes: Note[];
    onOpenNote: (note: Note) => void;
    onAddNote: (categoryId: string) => void;
    onReorderNotes: (newNotes: Note[]) => void;
    onDeleteNote: (id: string) => void;
    onTogglePin: (id: string) => void;
    onArchiveNote: (id: string) => void;
    onUpdateNote: (note: Note) => void;
    onUpdateCategory: (id: string, field: keyof Category, value: string) => void;
}

// Reusing same icons from ConfigModal
const ICONS = [
    '💡', '🔎', '🚀', '📂', '🎯', '🎨', '📝', '📅', 
    '🔥', '✨', '🎉', '🤖', '👻', '🦄', '🧠', '👀',
    '👨‍💻', '👩‍🚀', '🏆', '🧩', '🎤', '🎧', '📷', '🛒',
    '😀', '😎', '🤓', '🤠', '🥳', '🥶', '🤯', '🤔',
    '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', 
    '👵', '🧓', '👴', '👲', '👳', '🧕', 
    '👮', '👷', '💂', '🕵️', '👩‍⚕️', '👨‍⚕️', 
    '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓', 
    '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭',
    '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧',
    '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒',
    '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍⚖️', '👨‍⚖️',
    '👰', '🤵', '👸', '🤴', '🦸', '🦹', '🤶', '🎅',
    '🧙', '🧝', '🧛', '🧟', '🧞', '🧜', '🧚',
];

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

const ColumnExpandModal: React.FC<ColumnExpandModalProps> = ({ 
    isOpen, onClose, category, notes, onOpenNote, onAddNote, onReorderNotes, onDeleteNote, onTogglePin, onArchiveNote, onUpdateNote, onUpdateCategory
}) => {
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Optimized Sensors for Mobile/Touch
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, { 
            coordinateGetter: sortableKeyboardCoordinates 
        })
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsIconPickerOpen(false);
            }
        };

        if (isIconPickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isIconPickerOpen]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const note = notes.find(n => n.id === active.id);
        if (note) setActiveNote(note);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveNote(null);
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = notes.findIndex((n) => n.id === active.id);
            const newIndex = notes.findIndex((n) => n.id === over.id);
            onReorderNotes(arrayMove(notes, oldIndex, newIndex));
        }
    };

    if (!isOpen || !category) return null;

    return (
        <div className="fixed inset-0 z-[55] flex flex-col p-6 sm:p-10 animate-modal-in">
             <div className="absolute inset-0 bg-[#F2F4F7]/95 backdrop-blur-xl" onClick={onClose} />

            {/* Increased z-index to z-20 so it sits above the content area */}
            <div className="relative z-20 flex justify-between items-center mb-8 max-w-7xl mx-auto w-full border-b border-[#D1D8E0] pb-6">
                <div className="flex items-center gap-4 relative">
                    <div 
                        className="w-2 h-8 rounded-full shadow-sm"
                        style={{ backgroundColor: category.color }}
                    ></div>
                    
                    <button 
                        onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
                        className="w-12 h-12 rounded-xl hover:bg-black/5 flex items-center justify-center transition-colors border border-transparent hover:border-black/10"
                        title="更換圖示"
                    >
                         {category.icon && (
                            <span className="text-4xl leading-none select-none">{category.icon}</span>
                        )}
                    </button>

                    <h2 
                        className="text-3xl font-bold tracking-tight text-[#2D3436]"
                    >
                        {category.title} <span className="text-[#636E72] text-sm font-mono align-middle ml-2 font-normal">/ FOCUS VIEW</span>
                    </h2>

                    {/* Icon Picker Popover */}
                    {isIconPickerOpen && (
                        <div 
                            ref={pickerRef}
                            className="absolute top-16 left-0 z-50 p-3 bg-white rounded-xl shadow-2xl border border-[#D1D8E0] w-[320px] animate-modal-in"
                        >
                            <div className="grid grid-cols-6 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {ICONS.map((icon, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            onUpdateCategory(category.id, 'icon', icon);
                                            setIsIconPickerOpen(false);
                                        }}
                                        className="w-10 h-10 flex items-center justify-center text-xl hover:bg-[#F2F4F7] rounded-lg transition-colors hover:scale-110 active:scale-95"
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex gap-6">
                     <button 
                        onClick={() => onAddNote(category.id)}
                        className="p-2.5 rounded-xl bg-[#22d3ee] text-white hover:bg-[#06b6d4] hover:shadow-lg transition-all"
                        title="新增卡片"
                    >
                        <Plus strokeWidth={3} className="w-6 h-6" /> 
                    </button>
                    <button 
                        onClick={onClose}
                        className="p-2.5 bg-white border border-[#D1D8E0] text-[#636E72] hover:text-[#2D3436] rounded-xl hover:shadow-md transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>
            
            <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                dropAnimation={dropAnimation}
            >
                {/* Content area kept at z-10 (default or lower) */}
                <div className="relative z-10 flex-grow overflow-y-auto custom-scrollbar max-w-7xl mx-auto w-full pb-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <SortableContext items={notes.map(n => n.id)} strategy={rectSortingStrategy}>
                            {notes.map((note) => (
                                <SortableNoteCard 
                                    key={note.id}
                                    note={note}
                                    category={category}
                                    onClick={() => onOpenNote(note)}
                                    onDelete={() => onDeleteNote(note.id)}
                                    onTogglePin={() => onTogglePin(note.id)}
                                    onArchive={() => onArchiveNote(note.id)}
                                    onUpdateNote={onUpdateNote}
                                    isLarge={true}
                                />
                            ))}
                        </SortableContext>
                        
                        <button 
                            onClick={() => onAddNote(category.id)}
                            className="w-full min-h-[200px] rounded-xl border-2 border-dashed border-[#D1D8E0] hover:border-[#00af80] flex flex-col items-center justify-center gap-3 group transition-all bg-white/30 hover:bg-[#00af80]/5"
                        >
                            <Plus className="w-8 h-8 text-[#D1D8E0] group-hover:text-[#00af80] transition-colors" />
                            <span className="text-xs font-mono text-[#636E72] group-hover:text-[#00af80] font-bold">ADD NEW ITEM</span>
                        </button>
                    </div>
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeNote ? (
                        <div className="scale-105 rotate-3 cursor-grabbing shadow-2xl">
                            <NoteCard 
                                note={activeNote} 
                                category={category} 
                                onClick={() => {}} 
                                isLarge={true}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default ColumnExpandModal;