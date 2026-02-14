import React, { useState, useEffect, useRef } from 'react';
import { Plus, Archive, Sparkles, LogOut, Search, User, Box, LayoutDashboard, Check, X, FileText, Layout, ChevronUp, ChevronDown, Crown, Zap, Lock, Palette } from 'lucide-react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragStartEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
    DragOverEvent,
    closestCenter,
    closestCorners,
    CollisionDetection
} from '@dnd-kit/core';
import {
    SortableContext,
    rectSortingStrategy,
    arrayMove
} from '@dnd-kit/sortable';
import BoardColumn from './components/BoardColumn';
import AddNoteModal from './components/AddNoteModal';
import ExportModal from './components/ExportModal';
import LandingPage from './components/LandingPage';
import BoardSwitcher from './components/BoardSwitcher';
import BoardCreator from './components/BoardCreator';
import AuthModal from './components/AuthModal';
import PaperCard from './components/PaperCard';
import AddColumnModal from './components/AddColumnModal';
import PaperDetailModal from './components/PaperDetailModal';
import CategoryDetailModal from './components/CategoryDetailModal';
import { ArchiveModal } from './components/ArchiveModal';
import UpgradeModal from './components/UpgradeModal';
import InternalChatWidget from './components/InternalChatWidget';
import DesignSystem from './components/DesignSystem';
import { User as UserType, PaperType, Paper, Category, Board } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { useBoard } from './context/BoardContext';
import { usePermissions } from './hooks/usePermissions';

const App: React.FC = () => {
    // --- Authentication State ---
    const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
        const saved = localStorage.getItem('lumos_user_v1');
        return saved ? JSON.parse(saved) : null;
    });
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [showApp, setShowApp] = useState(!!currentUser);
    const [lang, setLang] = useState<'zh' | 'en'>('en'); // Default to English as requested

    // Simple translations
    const t = {
        zh: {
            add_column: "增加欄位",
            archive_box: "收納盒",
            archive_alert: "收納盒功能優化中，即將推出！",
            add_card: "新增卡片",
            close: "關閉"
        },
        en: {
            add_column: "Add Column",
            archive_box: "Archive Box",
            archive_alert: "Archive feature coming soon!",
            add_card: "Add Card",
            close: "Close"
        }
    }[lang];

    const toggleLang = () => setLang(l => l === 'zh' ? 'en' : 'zh');

    // --- Global Board State ---
    const {
        boards,
        activeBoardId,
        categories,
        papers,
        generatedReports,
        setActiveBoardId,
        addBoard,
        deleteBoard,
        addPaper,
        updatePaper,
        deletePaper,
        archivePaper,
        movePaper,
        addReport,
        deleteReport,
        deleteCategory,
        addCategory,
        archiveCategory,
        updateBoard,
        reorderBoards,
        updateCategory,
        reorderCategories,
        copyPaper,
        movePaperToBoard,
        moveColumnToBoard,
        copyColumnToBoard,
        resetData
    } = useBoard();

    // --- State for Advanced DnD (Alt/Option for Copy) ---
    const [isCopyModifierPressed, setIsCopyModifierPressed] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey) setIsCopyModifierPressed(true);
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (!e.altKey) setIsCopyModifierPressed(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Derived State (Moved up for scope access)
    const activeCategories = categories.filter(c => c.boardId === activeBoardId && !c.isStored);
    const activePapers = papers.filter(p => p.boardId === activeBoardId && !p.isStored);

    // --- DnD State & Handlers ---
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        })
    );
    const [activeDragPaper, setActiveDragPaper] = useState<Paper | null>(null);
    const [activeDragCategory, setActiveDragCategory] = useState<Category | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;

        // Check if dragging a category
        const category = categories.find(c => c.id === active.id);
        if (category) {
            setActiveDragCategory(category);
            return;
        }

        // Check if dragging a paper
        const paper = papers.find(p => p.id === active.id);
        if (paper) setActiveDragPaper(paper);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragPaper(null);
        setActiveDragCategory(null);

        if (!over) return;

        const overData = over.data.current;

        // --- Scenario 1: Dragging a Category (Column) ---
        const activeCategory = categories.find(c => c.id === active.id);
        if (activeCategory) {
            // Drop over a Board (Cross-board move/copy)
            if (overData?.type === 'board') {
                const targetBoardId = overData.boardId;
                if (targetBoardId !== activeBoardId) {
                    if (isCopyModifierPressed) {
                        copyColumnToBoard(activeCategory.id, targetBoardId);
                    } else {
                        moveColumnToBoard(activeCategory.id, targetBoardId);
                    }
                    setLastDropTargetId(targetBoardId);
                    setTimeout(() => setLastDropTargetId(null), 1000);
                }
                return;
            }

            // Drop over another Category (Reordering)
            const activeCategoryIndex = activeCategories.findIndex(c => c.id === active.id);
            const overCategoryIndex = activeCategories.findIndex(c => c.id === over.id);
            if (overCategoryIndex !== -1 && activeCategoryIndex !== overCategoryIndex) {
                const newOrder = arrayMove(activeCategories, activeCategoryIndex, overCategoryIndex);
                reorderCategories(newOrder);
            }
            return;
        }

        // --- Scenario 2: Dragging a Paper ---
        const activeId = active.id as string;
        const paper = papers.find(p => p.id === activeId);

        if (paper) {
            // Drop over a Board (Cross-board move/copy)
            if (overData?.type === 'board') {
                const targetBoardId = overData.boardId;
                const overId = over.id as string;
                if (targetBoardId !== activeBoardId) {
                    if (isCopyModifierPressed) {
                        copyPaper(activeId, overId, activeBoardId);
                    } else {
                        movePaper(activeId, overId);
                    }
                    setLastDropTargetId(targetBoardId);
                    setTimeout(() => setLastDropTargetId(null), 1000);
                }
                return;
            }

            // Drop over a Category (Same board move)
            const overId = over.id as string;
            const targetCategory = categories.find(c => c.id === overId);
            if (targetCategory && paper.columnId !== overId) {
                if (isCopyModifierPressed) {
                    copyPaper(activeId, overId, activeBoardId);
                } else {
                    movePaper(activeId, overId);
                }
            }
        }
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: { opacity: '0.5' },
            },
        }),
    };

    const {
        plan,
        canAddBoard,
        canAddColumn,
        canAddPaperToColumn,
        isPro
    } = usePermissions(currentUser);

    // --- UI/Modal States ---
    const [isBoardCreatorOpen, setIsBoardCreatorOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false); // Global Header Collapse State
    const [targetCategoryId, setTargetCategoryId] = useState<string>('');
    const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
    const [viewingPaperId, setViewingPaperId] = useState<string | null>(null);
    const activeViewingPaper = papers.find(p => p.id === viewingPaperId) || null;
    const [expandedCategory, setExpandedCategory] = useState<Category | null>(null);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);
    const [lastDropTargetId, setLastDropTargetId] = useState<string | null>(null);

    // --- Board Header Edit State ---
    const [isEditingBoardName, setIsEditingBoardName] = useState(false);
    const [boardEditName, setBoardEditName] = useState('');
    const [isBoardIconPickerOpen, setIsBoardIconPickerOpen] = useState(false);
    const iconPickerTimerRef = useRef<NodeJS.Timeout | null>(null); // Timer for auto-close

    // --- Background Themes ---
    const [bgTheme, setBgTheme] = useState(0);
    const bgThemes = [
        { id: 'dots', name: '極簡圓點', class: 'dot-grid-bg' },
        { id: 'mesh', name: '夢幻迷霧', class: 'mesh-gradient-bg' },
        { id: 'grid', name: '精細格線', class: 'grid-lines-bg' },
        { id: 'aura', name: '溫柔光暈', class: 'soft-aura-bg' },
        { id: 'diagonal', name: '極致斜紋', class: 'diagonal-stripes-bg' },
        { id: 'horizontal', name: '細緻橫紋', class: 'horizontal-stripes-bg' }
    ];

    // Common Icons for quick selection
    const availableIcons = [
        '🎨', '📚', '💼', '🚀', '💡', '📅', '📝', '🧘‍♀️', '🎮', '🎵',
        '✈️', '🏠', '🔧', '💻', '🛒', '🎓', '畢業', '🎬', '🎤', '🏆',
        '⚽', '🍔', '🍕', '🚗', '🗺️', '📷', '🌻', '🐶', '🐱', '🦄'
    ];

    // --- Persistence for User (Board persistence is handled in Context) ---
    useEffect(() => {
        localStorage.setItem('lumos_user_v1', JSON.stringify(currentUser));
    }, [currentUser]);

    // --- Handlers ---
    const handleLogin = (user: UserType) => {
        setCurrentUser(user);
        setIsAuthModalOpen(false);
        setShowApp(true);

        // If it's a Free User, we reset the workspace to 'Free Experience'
        if (user.tier === 'Free') {
            const freeBoard = {
                id: 'b-free',
                name: '免費體驗 / 升級Pro使用完整功能',
                icon: '🚀',
                color: '#0ea5e9',
                title: '免費體驗 / 升級Pro使用完整功能'
            };
            resetData([freeBoard], []);
        } else if (user.tier === 'Pro') {
            // Pro users start with a clean slate as requested
            resetData([], []);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setShowApp(false);
        localStorage.clear();
        window.location.reload();
    };

    const handleCreateBoard = (newBoard: Omit<any, 'id'>, cols: any[]) => {
        const boardId = `board-${Date.now()}`;
        const finalBoard = { ...newBoard, id: boardId };
        const finalCols = cols.map(c => ({ ...c, id: `cat-${Date.now()}-${Math.random()}`, boardId }));

        addBoard(finalBoard, finalCols);
        setIsBoardCreatorOpen(false);
    };

    const handleAddPaper = (text: string, categoryId: string, type: PaperType = 'text', url?: string) => {
        const columnPapers = papers.filter(p => p.columnId === categoryId && !p.isStored);

        if (!canAddPaperToColumn(categoryId, columnPapers.length)) {
            setIsUpgradeModalOpen(true);
            return;
        }

        const targetCategory = categories.find(c => c.id === categoryId);
        const newPaper: any = {
            id: `paper-${Date.now()}`,
            boardId: activeBoardId,
            columnId: categoryId,
            type: type,
            text,
            contentUrl: url,
            time: Date.now(),
            pinned: false,
            isStored: false,
            color: targetCategory?.color || '#3b82f6' // Inherit color from category
        };
        addPaper(newPaper);
        // Automatically open the detail modal for the new paper
        setViewingPaperId(newPaper.id);
    };

    const handleTogglePin = (id: string) => {
        const paper = papers.find(p => p.id === id);
        if (paper) {
            updatePaper(id, { pinned: !paper.pinned });
        }
    };

    const handleAddColumn = (title: string, color: string, icon: string) => {
        addCategory({
            id: `cat-${Date.now()}`,
            title,
            color,
            icon,
            boardId: activeBoardId
        });
    };

    // Calculate grid columns based on number of items (Categories or Papers)
    const getGridClass = (count: number) => {
        let desktopClass = 'lg:grid-cols-4 md:grid-cols-2';
        if (count <= 1) desktopClass = 'lg:grid-cols-1 md:grid-cols-1';
        else if (count === 2) desktopClass = 'lg:grid-cols-2 md:grid-cols-2';
        else if (count === 3) desktopClass = 'lg:grid-cols-3 md:grid-cols-2';
        else if (count === 4) desktopClass = 'lg:grid-cols-2 md:grid-cols-2'; // 2x2
        else if (count <= 6) desktopClass = 'lg:grid-cols-3 md:grid-cols-2';
        else if (count <= 8) desktopClass = 'lg:grid-cols-4 md:grid-cols-2';
        else desktopClass = 'lg:grid-cols-3 md:grid-cols-2';

        return `grid-cols-1 ${desktopClass}`;
    };

    // Overlay Render Helper - Using the new CategoryDetailModal
    const renderExpandedOverlay = () => {
        return (
            <CategoryDetailModal
                isOpen={!!expandedCategory}
                onClose={() => setExpandedCategory(null)}
                category={expandedCategory}
                papers={activePapers.filter(p => p.columnId === expandedCategory?.id)}
                onAddPaper={(catId) => {
                    setTargetCategoryId(catId);
                    setIsAddModalOpen(true);
                }}
                onPaperClick={(paper) => setViewingPaperId(paper.id)}
                onDeletePaper={deletePaper}
                onArchiveNote={archivePaper}
                onDeleteCategory={deleteCategory}
                onArchiveCategory={archiveCategory}
                onUpdateCategory={updateCategory}
                onUpgrade={() => setIsUpgradeModalOpen(true)}
            />
        );
    };

    // --- Render Logic ---
    if (!showApp) {
        return (
            <>
                <LandingPage onLogin={() => setIsAuthModalOpen(true)} />
                <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />
            </>
        );
    }

    const currentBoard = boards.find(b => b.id === activeBoardId);

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className={`w-screen h-screen flex flex-col ${bgThemes[bgTheme].class} relative overflow-hidden text-[var(--text-main)] antialiased font-sans ${activeDragPaper || activeDragCategory ? 'dragging-active' : ''}`}>
                {/* Header - Collapsible */}
                <header className={`
                z-40 relative transition-all duration-500 ease-in-out
                ${isHeaderCollapsed ? '-mt-[60px] opacity-0 pointer-events-none' : 'mt-0 opacity-100'}
            `}>
                    <div className="max-w-[1920px] mx-auto w-full px-4 md:px-6 flex items-center justify-between py-4">
                        <div className="flex items-center gap-2 ml-[111px]">
                            <img src="/Lumos_logo.svg" alt="Lumos System" className="h-[75px] object-contain" />
                            <span className="text-[var(--primary)] text-[10px] mt-1 font-black tracking-[0.2em] opacity-40 uppercase">System</span>
                        </div>

                        <div className="flex items-center gap-4 mr-[123px]">
                            {/* Background Switcher */}
                            <button
                                onClick={() => setBgTheme((prev) => (prev + 1) % bgThemes.length)}
                                className="flex flex-col items-center group relative p-1.5 hover:bg-white/40 rounded-[10px] transition-all"
                                title={`切換背景：${bgThemes[(bgTheme + 1) % bgThemes.length].name}`}
                            >
                                <div className="relative">
                                    <Palette className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                    {/* Small preview dot */}
                                    <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white shadow-sm ${bgThemes[(bgTheme + 1) % bgThemes.length].class}`} />
                                </div>
                                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none">
                                    下一步：{bgThemes[(bgTheme + 1) % bgThemes.length].name}
                                </span>
                            </button>

                            {currentUser && (
                                <div className="text-2xl cursor-pointer hover:scale-110 transition-transform flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-400" title={currentUser.name} />
                                </div>
                            )}

                            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-all" title="登出">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Fixed Zen Mode Toggle */}
                <button
                    onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
                    className="fixed top-6 right-8 z-[100] p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-[12px] text-gray-400 hover:bg-white hover:text-[var(--primary)] hover:shadow-xl hover:scale-110 transition-all active:scale-95 group"
                    title={isHeaderCollapsed ? "切換至一般模式" : "切換至專注模式 (隱藏選單)"}
                >
                    {isHeaderCollapsed ? (
                        <div className="flex flex-col items-center gap-1 group-hover:scale-110 transition-transform">
                            <ChevronDown className="w-5 h-5 animate-bounce" />
                        </div>
                    ) : (
                        <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                    )}
                </button>

                {/* Main Layout Container with Padding */}
                <div className="flex-1 flex flex-col overflow-hidden mt-[-12px] pb-[38px] px-[53px] md:px-[73px] relative max-w-[1800px] mx-auto w-full">
                    <div className="flex-1 flex rounded-[28px] border border-white/50 shadow-[0_15px_30px_-8px_rgba(0,0,0,0.25)] bg-white/80 backdrop-blur-2xl overflow-hidden relative">
                        {/* Sidebar */}
                        <BoardSwitcher
                            boards={boards}
                            activeBoardId={activeBoardId}
                            onSelectBoard={setActiveBoardId}
                            onAddBoard={() => setIsBoardCreatorOpen(true)}
                            onDeleteBoard={deleteBoard}
                            onUpdateBoard={updateBoard}
                            onReorderBoards={reorderBoards}
                            isCollapsed={isSidebarCollapsed}
                            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            user={currentUser}
                            onUpgrade={() => setIsUpgradeModalOpen(true)}
                            lastDropTargetId={lastDropTargetId}
                            isDraggingAny={!!activeDragPaper || !!activeDragCategory}
                        />

                        {/* Main Board Area */}
                        <main className="flex-1 relative flex flex-col overflow-hidden bg-gray-100/40 backdrop-blur-sm">
                            <div className="h-16 flex items-center justify-between px-6 border-b border-white/40 bg-white/50 backdrop-blur-md relative z-40 shadow-[0_10px_15px_-10px_rgba(0,0,0,0.15)]">
                                {activeBoardId && boards.length > 0 && (
                                    <div className="flex items-center gap-4 ml-6">
                                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                                            {/* Icon - Click to edit */}
                                            <div
                                                className="relative group/icon"
                                                onClick={() => setIsBoardIconPickerOpen(!isBoardIconPickerOpen)}
                                                onMouseEnter={() => {
                                                    if (iconPickerTimerRef.current) {
                                                        clearTimeout(iconPickerTimerRef.current);
                                                        iconPickerTimerRef.current = null;
                                                    }
                                                }}
                                                onMouseLeave={() => {
                                                    if (isBoardIconPickerOpen) {
                                                        iconPickerTimerRef.current = setTimeout(() => {
                                                            setIsBoardIconPickerOpen(false);
                                                        }, 1000);
                                                    }
                                                }}
                                            >
                                                <div className="text-3xl cursor-pointer hover:scale-110 transition-transform flex items-center justify-center">
                                                    {currentBoard?.icon}
                                                </div>

                                                {/* Icon Picker */}
                                                {isBoardIconPickerOpen && (
                                                    <div className="absolute top-12 left-0 z-50 bg-white p-2 rounded-xl shadow-xl border border-gray-100 w-64 flex flex-wrap gap-1 cursor-default custom-scrollbar max-h-60 overflow-y-auto" onPointerDown={e => e.stopPropagation()}>
                                                        {availableIcons.map(icon => (
                                                            <button
                                                                key={icon}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateBoard(activeBoardId, { icon });
                                                                    setIsBoardIconPickerOpen(false);
                                                                }}
                                                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-[10px] text-lg"
                                                            >
                                                                {icon}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Board Title */}
                                            {isEditingBoardName ? (
                                                <input
                                                    type="text"
                                                    value={boardEditName}
                                                    onChange={(e) => setBoardEditName(e.target.value)}
                                                    onBlur={() => {
                                                        if (boardEditName.trim() && boardEditName !== currentBoard?.name) {
                                                            updateBoard(activeBoardId, { name: boardEditName });
                                                        }
                                                        setIsEditingBoardName(false);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            if (boardEditName.trim() && boardEditName !== currentBoard?.name) {
                                                                updateBoard(activeBoardId, { name: boardEditName });
                                                            }
                                                            setIsEditingBoardName(false);
                                                        } else if (e.key === 'Escape') {
                                                            setIsEditingBoardName(false);
                                                        }
                                                    }}
                                                    className="text-lg font-bold text-gray-800 bg-white/80 border border-[var(--primary)] rounded-[10px] px-2 py-1 outline-none min-w-[150px] animate-in zoom-in-95"
                                                    autoFocus
                                                />
                                            ) : (
                                                <h2
                                                    className="text-lg font-bold gradient-text cursor-text hover:bg-teal-50/50 px-2 py-1 rounded-[10px] transition-colors"
                                                    onClick={() => {
                                                        setBoardEditName(currentBoard?.name || '');
                                                        setIsEditingBoardName(true);
                                                    }}
                                                >
                                                    {currentBoard?.name}
                                                </h2>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Right Side: Toolbar + Search + Action */}
                                <div className="flex items-center gap-2.5 mr-5">
                                    {/* Action Icons */}
                                    <div className="flex items-center gap-2.5">
                                        <button
                                            onClick={() => setIsArchiveModalOpen(true)}
                                            className="flex items-center justify-center text-gray-400 hover:text-teal-500 transition-all p-2"
                                            title="收納箱"
                                        >
                                            <Archive className="w-4 h-4" />
                                        </button>
                                        <button className="flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all p-2" title="文件">
                                            <FileText className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-px h-6 bg-gray-200"></div>

                                    {/* Search Input */}
                                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50/80 hover:bg-white rounded-[12px] border border-transparent hover:border-gray-200 hover:shadow-sm focus-within:bg-white focus-within:border-[var(--primary)] focus-within:shadow-md transition-all w-56">
                                        <Search className="w-3.5 h-3.5 text-gray-400" />
                                        <input type="text" placeholder="搜尋靈感..." className="bg-transparent border-none outline-none text-xs w-full font-medium placeholder:text-gray-400 text-gray-700" title="搜尋" />
                                    </div>

                                    {/* Smart Report Button */}
                                    <button
                                        onClick={() => isPro ? setIsExportModalOpen(true) : setIsUpgradeModalOpen(true)}
                                        className="h-10 px-5 rounded-[12px] bg-gradient-to-r from-cyan-400 to-teal-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 border border-white/20 hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 font-bold text-sm"
                                        title="AI 助手"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                        <span>智能報告</span>
                                    </button>

                                    {/* New Add Column Button - Pro Style */}
                                    {boards.length > 0 && (
                                        <motion.button
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => canAddColumn ? setIsAddColumnModalOpen(true) : setIsUpgradeModalOpen(true)}
                                            className="h-[52px] px-6 rounded-[16px] bg-gradient-to-r from-teal-400 to-emerald-600 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 border border-white/20 transition-all flex items-center gap-2 font-black text-base"
                                            title={canAddColumn ? "新增欄位" : "欄位數量已達上限"}
                                        >
                                            <Plus className="w-5 h-5" />
                                            <span>增加欄位</span>
                                        </motion.button>
                                    )}
                                </div>
                            </div>

                            {/* Board Content Area - Grid Layout */}
                            <div className={`flex-1 ${activeCategories.length <= 9 ? 'overflow-hidden' : 'overflow-y-auto'} overflow-x-hidden p-6 custom-scrollbar`}>
                                <AnimatePresence mode="popLayout">
                                    {activeBoardId && boards.length > 0 && (
                                        <motion.div
                                            key={activeBoardId}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className={`grid gap-6 pb-6 w-full h-full auto-rows-fr ${getGridClass(activeCategories.length)}`}
                                        >
                                            <SortableContext
                                                items={activeCategories.map(c => c.id)}
                                                strategy={rectSortingStrategy}
                                            >
                                                {activeCategories.map((category, index) => (
                                                    <motion.div
                                                        key={category.id}
                                                        variants={{
                                                            hidden: { opacity: 0, scale: 0.8, y: 30 },
                                                            visible: {
                                                                opacity: 1,
                                                                scale: 1,
                                                                y: 0,
                                                                transition: {
                                                                    delay: index * 0.08,
                                                                    duration: 0.5,
                                                                    ease: [0.2, 0.8, 0.2, 1]
                                                                }
                                                            },
                                                            exit: {
                                                                opacity: 0,
                                                                y: 100,
                                                                transition: {
                                                                    duration: 0.3,
                                                                    ease: "easeIn"
                                                                }
                                                            }
                                                        }}
                                                        layout
                                                    >
                                                        <BoardColumn
                                                            category={category}
                                                            papers={activePapers.filter(p => p.columnId === category.id)}
                                                            onAddPaper={(catId) => {
                                                                setTargetCategoryId(catId);
                                                                setIsAddModalOpen(true);
                                                            }}
                                                            onPaperClick={(paper) => setViewingPaperId(paper.id)}
                                                            onDeletePaper={deletePaper}
                                                            onArchiveNote={archivePaper}
                                                            onTogglePin={(id, pinned) => updatePaper(id, { pinned })}
                                                            onDeleteCategory={deleteCategory}
                                                            onArchiveCategory={archiveCategory}
                                                            onUpdateCategory={updateCategory}
                                                            onExpand={() => setExpandedCategory(category)}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </SortableContext>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Expanded Overlay */}
                            {renderExpandedOverlay()}
                        </main>
                    </div>
                </div>

                {isBoardCreatorOpen && (
                    <BoardCreator
                        onClose={() => setIsBoardCreatorOpen(false)}
                        onCreate={handleCreateBoard}
                    />
                )}

                <AddNoteModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    categories={activeCategories}
                    onAdd={handleAddPaper}
                    initialCategory={targetCategoryId}
                />

                <AddColumnModal
                    isOpen={isAddColumnModalOpen}
                    onClose={() => setIsAddColumnModalOpen(false)}
                    onAdd={handleAddColumn}
                />

                <PaperDetailModal
                    isOpen={!!viewingPaperId}
                    onClose={() => setViewingPaperId(null)}
                    paper={activeViewingPaper}
                    categories={activeCategories}
                    onSave={updatePaper}
                    onDelete={deletePaper}
                    onTogglePin={handleTogglePin}
                    onArchive={archivePaper}
                    isPro={isPro}
                    onUpgrade={() => setIsUpgradeModalOpen(true)}
                    activeBoard={currentBoard}
                />

                <ExportModal
                    isOpen={isExportModalOpen}
                    onClose={() => setIsExportModalOpen(false)}
                    categories={activeCategories}
                    notes={activePapers}
                    records={generatedReports}
                    onSaveRecord={addReport}
                    onDeleteRecord={deleteReport}
                    activeBoard={currentBoard}
                />

                <DragOverlay dropAnimation={dropAnimation} zIndex={1000}>
                    {activeDragPaper ? (
                        <div className="transform rotate-2 cursor-grabbing opacity-90 scale-105 pointer-events-none">
                            <PaperCard
                                paper={activeDragPaper}
                                category={categories.find(c => c.id === activeDragPaper.columnId)!}
                                onClick={() => { }}
                                onDelete={() => { }}
                                onTogglePin={() => { }}
                                onArchive={() => { }}
                                className="shadow-2xl ring-2 ring-[var(--primary)] !transition-none"
                            />
                        </div>
                    ) : activeDragCategory ? (
                        <div className="transform rotate-1 cursor-grabbing opacity-90 scale-[1.02] pointer-events-none">
                            <BoardColumn
                                category={activeDragCategory}
                                papers={activePapers.filter(p => p.columnId === activeDragCategory.id)}
                                onAddPaper={() => { }}
                                onDeletePaper={() => { }}
                                onArchiveNote={() => { }}
                                onDeleteCategory={() => { }}
                                onArchiveCategory={() => { }}
                                onUpdateCategory={() => { }}
                                onPaperClick={() => { }}
                                className="shadow-2xl ring-2 ring-[var(--primary)] !transition-none"
                            />
                        </div>
                    ) : null}
                </DragOverlay>
                <InternalChatWidget activeBoard={currentBoard} />
            </div>

            {/* Design System Preview (Dev Only) */}
            <AnimatePresence>
                {isDesignSystemOpen && (
                    <DesignSystem onClose={() => setIsDesignSystemOpen(false)} />
                )}
            </AnimatePresence>

            {/* Sidebar Toggle or Developer Portal */}
            <button
                onClick={() => setIsDesignSystemOpen(true)}
                className="fixed bottom-4 left-4 z-[150] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white/40 hover:text-white/80 transition-all shadow-lg"
                title="開啟設計系統規範"
            >
                <Palette size={20} />
            </button>
        </DndContext>
    );
};

export default App;
