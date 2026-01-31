import React, { useState, useEffect } from 'react';
import { Plus, Layout, Archive, FileText, Sparkles, LogOut } from 'lucide-react';
import BoardColumn from './components/BoardColumn';
import AddNoteModal from './components/AddNoteModal';
import ConfigModal from './components/ConfigModal';
import ColumnExpandModal from './components/ColumnExpandModal';
import NoteDetailModal from './components/NoteDetailModal';
import NoteCard from './components/NoteCard';
import ArchiveModal from './components/ArchiveModal';
import ExportModal from './components/ExportModal';
import LandingPage from './components/LandingPage';
import PersonaSwitcher from './components/PersonaSwitcher';
import PersonaTemplateModal from './components/PersonaTemplateModal';
import AuthModal from './components/AuthModal';
import { Persona, UserProfile, User, Category, Note, GeneratedRecord } from './types';
import { expandIdeaWithAI, generateBoardReport } from './services/geminiService';

// DnD Kit imports
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
    DragStartEvent,
    DragOverEvent,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DropAnimation
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy
} from '@dnd-kit/sortable';

// Updated Default Colors for Light Theme
const DEFAULT_CATEGORIES: Category[] = [
    { id: 'cat1', title: '發現', color: '#e11d48', icon: '💡', personaId: 'p1' },
    { id: 'cat2', title: '分析', color: '#0284c7', icon: '🔎', personaId: 'p1' },
    { id: 'cat3', title: '執行', color: '#059669', icon: '🚀', personaId: 'p1' },
    { id: 'cat4', title: '歸檔', color: '#7c3aed', icon: '📂', personaId: 'p1' }
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

const App: React.FC = () => {
    // State
    const [categories, setCategories] = useState<Category[]>(() => {
        const saved = localStorage.getItem('aiBoard_cats_v12');
        if (saved) return JSON.parse(saved);

        // Initial setup for default persona
        return DEFAULT_CATEGORIES;
    });

    const [notes, setNotes] = useState<Note[]>(() => {
        const saved = localStorage.getItem('aiBoard_notes_v11');
        return saved ? JSON.parse(saved) : [];
    });

    const [generatedRecords, setGeneratedRecords] = useState<GeneratedRecord[]>(() => {
        const saved = localStorage.getItem('aiBoard_records_v1');
        return saved ? JSON.parse(saved) : [];
    });

    // Drag State
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeDragType, setActiveDragType] = useState<'Column' | 'Note' | null>(null);

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addModalInitialCategory, setAddModalInitialCategory] = useState<string | undefined>(undefined);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [expandedColumnId, setExpandedColumnId] = useState<string | null>(null);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [autoAI, setAutoAI] = useState(false);
    const [showApp, setShowApp] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('aiBoard_user_v1');
        return saved ? JSON.parse(saved) : null;
    });
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Persona State
    const [personas, setPersonas] = useState<Persona[]>(() => {
        const saved = localStorage.getItem('aiBoard_personas_v1');
        return saved ? JSON.parse(saved) : [
            { id: 'p1', type: 'Designer', name: '設計師日常', icon: '🎨', context: 'UI/UX Design Specialist', color: '#00af80' },
            { id: 'p2', type: 'Student', name: '學霸筆記', icon: '📚', context: 'University student focused on CS', color: '#22d3ee' }
        ];
    });
    const [activePersonaId, setActivePersonaId] = useState<string>(() => {
        return localStorage.getItem('aiBoard_activePersonaId') || personas[0]?.id || '';
    });

    // DnD Sensors - Optimized for Touch and Mouse
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200, // 200ms delay to prevent scrolling conflict
                tolerance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Persistence
    useEffect(() => {
        localStorage.setItem('aiBoard_cats_v12', JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem('aiBoard_notes_v11', JSON.stringify(notes));
    }, [notes]);

    useEffect(() => {
        localStorage.setItem('aiBoard_records_v1', JSON.stringify(generatedRecords));
    }, [generatedRecords]);

    useEffect(() => {
        localStorage.setItem('aiBoard_personas_v1', JSON.stringify(personas));
        localStorage.setItem('aiBoard_activePersonaId', activePersonaId);
    }, [personas, activePersonaId]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('aiBoard_user_v1', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('aiBoard_user_v1');
        }
    }, [currentUser]);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        setIsAuthModalOpen(false);
        setShowApp(true);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setShowApp(false);
    };

    // Handlers
    const handleAddNote = (text: string, categoryId: string) => {
        const newNote: Note = {
            id: Date.now().toString(),
            categoryId, // Fixed: was category
            text,
            time: Date.now(),
            pinned: false,
            personaId: activePersonaId // Contextualizing note to persona
        };
        setNotes([newNote, ...notes]);
    };

    const handleUpdateNote = (updatedNote: Note) => {
        setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
    };

    // --- Persona Equipment Logic ---
    const handleAddPersonaWithTemplate = (template: any) => {
        const personaId = Date.now().toString();
        const newPersona: Persona = {
            id: personaId,
            type: template.type,
            name: template.name,
            icon: template.icon,
            context: template.context,
            color: template.columns[0]?.color || '#00af80'
        };

        const newCategories: Category[] = template.columns.map((col: any, idx: number) => ({
            id: `cat_${personaId}_${idx}`,
            title: col.title,
            icon: col.icon,
            color: col.color,
            personaId: personaId
        }));

        setPersonas([...personas, newPersona]);
        setCategories([...categories, ...newCategories]);
        setActivePersonaId(personaId);
        setIsTemplateModalOpen(false);
    };

    // --- DnD Logic ---
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
        if (active.data.current?.type === 'Column') {
            setActiveDragType('Column');
        } else if (active.data.current?.type === 'Note') {
            setActiveDragType('Note');
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;
        const isActiveNote = active.data.current?.type === 'Note';
        const isOverNote = over.data.current?.type === 'Note';
        const isOverColumn = over.data.current?.type === 'Column';

        if (!isActiveNote) return;

        if (isActiveNote && (isOverNote || isOverColumn)) {
            setNotes((notes) => {
                const activeIndex = notes.findIndex((n) => n.id === activeId);
                const overIndex = notes.findIndex((n) => n.id === overId);

                if (notes[activeIndex].category !== notes[overIndex]?.category && isOverNote) {
                    notes[activeIndex].category = notes[overIndex].category;
                    return arrayMove(notes, activeIndex, overIndex - 1);
                }

                if (isOverColumn) {
                    const overColumnId = overId;
                    if (notes[activeIndex].category !== overColumnId) {
                        notes[activeIndex].category = overColumnId as string;
                        return [...notes];
                    }
                }
                return notes;
            });
        }
    };

    const handleAIExpand = async (content: string) => {
        const currentPersona = personas.find(p => p.id === activePersonaId);
        const result = await expandIdeaWithAI(content, currentPersona);
        // ... handled in modal
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveDragType(null);

        if (!over) return;

        if (active.data.current?.type === 'Column') {
            if (active.id !== over.id) {
                setCategories((items) => {
                    const oldIndex = items.findIndex((item) => item.id === active.id);
                    const newIndex = items.findIndex((item) => item.id === over.id);
                    return arrayMove(items, oldIndex, newIndex);
                });
            }
        } else if (active.data.current?.type === 'Note') {
            const activeIndex = notes.findIndex((n) => n.id === active.id);
            const overIndex = notes.findIndex((n) => n.id === over.id);

            if (over.data.current?.type === 'Column') {
                const updatedNotes = [...notes];
                updatedNotes[activeIndex].category = over.id as string;
                setNotes(updatedNotes);
            }
            else if (activeIndex !== overIndex) {
                setNotes((items) => arrayMove(items, activeIndex, overIndex));
            }
        }
    };
    // --- End DnD Logic ---

    const handleUpdateCategory = (index: number, field: keyof Category, value: string) => {
        const newCats = [...categories];
        newCats[index] = { ...newCats[index], [field]: value };
        setCategories(newCats);
    };

    const handleUpdateCategoryById = (id: string, field: keyof Category, value: string) => {
        const index = categories.findIndex(c => c.id === id);
        if (index !== -1) {
            handleUpdateCategory(index, field, value);
        }
    }

    const handleAddCategory = (title: string, icon: string = '📌') => {
        setCategories([...categories, {
            id: 'custom_' + Date.now(),
            title,
            color: '#00af80',
            icon
        }]);
    };

    const handleRemoveCategory = (id: string) => {
        const catToRemove = categories.find(c => c.id === id);
        if (!catToRemove) return;
        setNotes(prev => prev.filter(n => n.category !== catToRemove.id));
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    const handleNoteSave = (id: string, text: string, newCategoryId?: string) => {
        setNotes(notes.map(n => n.id === id ? {
            ...n,
            text,
            category: newCategoryId || n.category
        } : n));
    };

    const handleTogglePin = (id: string) => {
        setNotes(prev => {
            const target = prev.find(n => n.id === id);
            if (!target) return prev;
            const updated = { ...target, pinned: !target.pinned };
            const catNotes = prev.filter(n => n.category === target.category && n.id !== id);
            const others = prev.filter(n => n.category !== target.category);
            let newCatOrder = [];
            if (updated.pinned) {
                newCatOrder = [updated, ...catNotes];
            } else {
                let lastPinnedIndex = -1;
                for (let i = catNotes.length - 1; i >= 0; i--) {
                    if (catNotes[i].pinned) {
                        lastPinnedIndex = i;
                        break;
                    }
                }
                newCatOrder = [
                    ...catNotes.slice(0, lastPinnedIndex + 1),
                    updated,
                    ...catNotes.slice(lastPinnedIndex + 1)
                ];
            }
            return [...others, ...newCatOrder];
        });
        if (selectedNote && selectedNote.id === id) {
            setSelectedNote(prev => prev ? ({ ...prev, pinned: !prev.pinned }) : null);
        }
    };

    const handleArchiveNote = (id: string) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, archived: true, pinned: false } : n));
        if (selectedNote && selectedNote.id === id) setSelectedNote(null);
    };

    const handleUnarchiveNote = (id: string) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, archived: false, time: Date.now() } : n));
    };

    const handleDeleteNote = (id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id));
        if (selectedNote && selectedNote.id === id) setSelectedNote(null);
    };

    const openAddModal = (initialCatId?: string) => {
        setAddModalInitialCategory(initialCatId);
        setIsAddModalOpen(true);
    };

    const handleReorderNotesInExpanded = (newNotes: Note[]) => {
        if (!expandedColumnId) return;
        setNotes(prev => {
            const otherNotes = prev.filter(n => n.category !== expandedColumnId);
            return [...otherNotes, ...newNotes];
        });
    };

    // History Handlers
    const handleSaveRecord = (record: GeneratedRecord) => {
        setGeneratedRecords(prev => [record, ...prev]);
    };

    const handleDeleteRecord = (id: string) => {
        setGeneratedRecords(prev => prev.filter(r => r.id !== id));
    };

    // Filter Logic: Only show unarchived notes on the board
    const activeNotes = notes.filter(n => !n.archived);
    const archivedNotes = notes.filter(n => n.archived);

    const getNotesForCategory = (catId: string) => activeNotes.filter(n => n.category === catId);

    const currentExpandedCategory = expandedColumnId
        ? categories.find(c => c.id === expandedColumnId) || null
        : null;

    const activeNoteDetail = selectedNote ? notes.find(n => n.id === selectedNote.id) || null : null;
    const activeDragNote = activeId && activeDragType === 'Note' ? notes.find(n => n.id === activeId) : null;
    const activeDragCategory = activeId && activeDragType === 'Column' ? categories.find(c => c.id === activeId) : null;

    if (!showApp && !currentUser) {
        return (
            <>
                <LandingPage onStart={() => setIsAuthModalOpen(true)} />
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    onLogin={handleLogin}
                />
            </>
        );
    }

    const currentPersona = personas.find(p => p.id === activePersonaId);

    return (
        <>
            <div className="noise-overlay"></div>

            {/* Main Grid Layout */}
            <div className="w-full h-full p-2 sm:p-5 flex items-center justify-center">
                <main className="w-full h-full max-w-[1920px] rounded-[40px] grid grid-cols-1 grid-rows-[80px_1fr] gap-5 relative bg-[var(--bg-main)]">

                    {/* HEADER: Modern Glass Header */}
                    <header className="row-start-1 glass-card flex items-center justify-between px-3 sm:px-8 z-20 m-2 mt-4 ml-4 mr-4">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                                    <span className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-lg flex items-center justify-center text-white text-xs">IF</span>
                                    IdeaFlow <span className="text-[var(--primary)] text-sm font-mono opacity-50">PRO</span>
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Member Profile */}
                            {currentUser ? (
                                <div
                                    onClick={handleLogout}
                                    className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-[var(--bg-main)] border border-[var(--border-light)] hover:border-red-500 transition-all cursor-pointer group tap-feedback"
                                    title="登出"
                                >
                                    {currentUser.avatar ? (
                                        <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-[10px] font-bold">
                                            {currentUser.name?.[0] || 'U'}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-tighter leading-none">{currentUser.tier} 方案</span>
                                        <span className="text-[10px] font-medium text-[var(--text-main)] truncate max-w-[80px]">{currentUser.name || currentUser.email}</span>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all cursor-pointer tap-feedback"
                                >
                                    <span className="text-xs font-bold">登入帳號</span>
                                </div>
                            )}

                            <button
                                onClick={() => setAutoAI(!autoAI)}
                                className={`p-2 rounded-xl transition-all tap-feedback ${autoAI ? 'bg-[var(--primary)] text-white shadow-lg animate-pulse-primary' : 'bg-white text-[var(--text-muted)] border border-[var(--border-light)]'}`}
                                title="自動 AI 建議"
                            >
                                <Sparkles className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setShowApp(false)}
                                className="p-2 rounded-xl bg-white text-[var(--text-muted)] border border-[var(--border-light)] hover:text-red-500 hover:border-red-200 transition-all tap-feedback"
                                title="登出系統"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </header>
                    {/* CANVAS: Main Depth */}
                    <section className="row-start-2 flex gap-4 overflow-hidden z-10 m-2 ml-4 mr-4 mb-4 rounded-[32px]">
                        {/* PERSOAN SIDEBAR */}
                        <PersonaSwitcher
                            personas={personas}
                            activePersonaId={activePersonaId}
                            onSelect={setActivePersonaId}
                            onAdd={() => setIsTemplateModalOpen(true)} // Open Template Modal for new persona
                        />

                        {/* WHITEBOARD CANVAS */}
                        <div className="flex-1 whiteboard-canvas relative overflow-hidden rounded-[24px]">
                            <div className="w-full h-full p-3 sm:p-6 overflow-y-auto custom-scrollbar">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext items={categories.map(c => c.id)} strategy={rectSortingStrategy}>
                                        <div className="flex gap-4 sm:gap-6 h-full min-h-[500px] items-start">
                                            {categories.map((category) => (
                                                <BoardColumn
                                                    key={category.id}
                                                    category={category}
                                                    notes={notes.filter(n => n.categoryId === category.id && n.personaId === activePersonaId)}
                                                    onOpenColumn={setExpandedColumnId}
                                                    onOpenNote={setSelectedNote}
                                                    onDeleteNote={(id) => setNotes(notes.filter(n => n.id !== id))}
                                                    onTogglePin={(id) => setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))}
                                                    onArchiveNote={(id) => setNotes(notes.map(n => n.id === id ? { ...n, archived: true } : n))}
                                                    onUpdateNote={handleUpdateNote}
                                                    onDeleteColumn={(id) => setCategories(categories.filter(c => c.id !== id))}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>

                                    {/* DRAG OVERLAY: Advanced levitation effect */}
                                    <DragOverlay dropAnimation={null}>
                                        {activeId ? (
                                            <div style={{ transform: 'rotate(3deg)', transition: 'transform 0.2s' }}>
                                                {activeDragType === 'Note' && activeDragNote && (
                                                    <NoteCard
                                                        note={activeDragNote}
                                                        category={categories.find(c => c.id === activeDragNote.categoryId)!}
                                                        onClick={() => { }}
                                                        isLarge={false}
                                                        className="scale-105 shadow-2xl !border-[var(--primary)] cursor-grabbing"
                                                    />
                                                )}
                                                {activeDragType === 'Column' && activeDragCategory && (
                                                    <div className="glass-card p-4 min-w-[250px] scale-105 shadow-2xl border-2 border-[var(--primary)] rotate-1">
                                                        <h3 className="font-bold">{activeDragCategory.title}</h3>
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </DragOverlay>
                                </DndContext>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Modals */}
            <AddNoteModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                categories={categories.filter(c => c.personaId === activePersonaId)}
                onAdd={handleAddNote}
                initialCategory={addModalInitialCategory}
            />

            <ConfigModal
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                categories={categories.filter(c => c.personaId === activePersonaId)}
                onAddCategory={(title, icon) => {
                    const newCat: Category = {
                        id: Date.now().toString(),
                        title,
                        icon,
                        color: '#00af80',
                        personaId: activePersonaId // Fixed: Link to active persona
                    };
                    setCategories([...categories, newCat]);
                }}
                onUpdateCategory={(id, field, value) => {
                    setCategories(categories.map(c => c.id === id ? { ...c, [field]: value } : c));
                }}
                onRemoveCategory={(id) => setCategories(categories.filter(c => c.id !== id))}
            />

            <ArchiveModal
                isOpen={isArchiveModalOpen}
                onClose={() => setIsArchiveModalOpen(false)}
                notes={notes.filter(n => n.archived && n.personaId === activePersonaId)}
                categories={categories.filter(c => c.personaId === activePersonaId)}
                onUnarchive={(id) => setNotes(notes.map(n => n.id === id ? { ...n, archived: false } : n))}
                onDelete={(id) => setNotes(notes.filter(n => n.id !== id))}
                onOpenNote={setSelectedNote}
            />

            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                categories={categories.filter(c => c.personaId === activePersonaId)}
                notes={notes.filter(n => n.personaId === activePersonaId)}
                records={generatedRecords}
                onSaveRecord={(record) => setGeneratedRecords([record, ...generatedRecords])}
                onDeleteRecord={(id) => setGeneratedRecords(generatedRecords.filter(r => r.id !== id))}
                activePersona={currentPersona}
            />

            <ColumnExpandModal
                isOpen={!!expandedColumnId}
                onClose={() => setExpandedColumnId(null)}
                category={categories.find(c => c.id === expandedColumnId)}
                notes={notes.filter(n => n.categoryId === expandedColumnId && n.personaId === activePersonaId)}
                onOpenNote={setSelectedNote}
                onAddNote={(catId) => {
                    setAddModalInitialCategory(catId);
                    setIsAddModalOpen(true);
                }}
                onReorderNotes={(reordered) => {
                    setNotes(notes.filter(n => n.categoryId !== expandedColumnId).concat(reordered));
                }}
                onDeleteNote={(id) => setNotes(notes.filter(n => n.id !== id))}
                onTogglePin={(id) => setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))}
                onArchiveNote={(id) => setNotes(notes.map(n => n.id === id ? { ...n, archived: true } : n))}
                onUpdateNote={handleUpdateNote}
                onUpdateCategory={(cat) => setCategories(categories.map(c => c.id === cat.id ? cat : c))}
            />

            <NoteDetailModal
                isOpen={!!selectedNote}
                onClose={() => setSelectedNote(null)}
                note={selectedNote}
                categories={categories}
                onSave={handleUpdateNote}
                onTogglePin={(id) => setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))}
                onDelete={(id) => {
                    setNotes(notes.filter(n => n.id !== id));
                    setSelectedNote(null);
                }}
                onArchive={(id) => setNotes(notes.map(n => n.id === id ? { ...n, archived: true } : n))}
                onRestore={(id) => setNotes(notes.map(n => n.id === id ? { ...n, archived: false } : n))}
                initialAutoAI={autoAI}
            />

            <PersonaTemplateModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSelect={handleAddPersonaWithTemplate}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLogin={handleLogin}
            />
        </>
    );
};

export default App;
