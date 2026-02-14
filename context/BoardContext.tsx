
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Board, Category, Paper, GeneratedRecord, PaperType } from '../types';

interface BoardContextType {
    boards: Board[];
    activeBoardId: string;
    categories: Category[];
    papers: Paper[];
    generatedReports: GeneratedRecord[];

    // Actions
    setActiveBoardId: (id: string) => void;

    // Board Actions
    addBoard: (board: Board, defaultCategories: Category[]) => void;
    deleteBoard: (id: string) => void;

    // Paper Actions
    addPaper: (paper: Paper) => void;
    updatePaper: (id: string, updates: Partial<Paper>) => void;
    deletePaper: (id: string) => void;
    archivePaper: (id: string) => void;
    unarchivePaper: (id: string) => void;
    movePaper: (paperId: string, newColumnId: string, newIndex?: number) => void;
    copyPaper: (paperId: string, targetColumnId: string, targetBoardId: string) => void;
    movePaperToBoard: (paperId: string, targetBoardId: string) => void;

    // Category Actions
    addCategory: (category: Category) => void;
    deleteCategory: (id: string) => void;
    moveColumnToBoard: (columnId: string, targetBoardId: string) => void;
    copyColumnToBoard: (columnId: string, targetBoardId: string) => void;
    archiveCategory: (categoryId: string) => void;
    unarchiveCategory: (categoryId: string) => void;

    // Report Actions
    addReport: (report: GeneratedRecord) => void;
    deleteReport: (id: string) => void;
    resetData: (boards?: Board[], categories?: Category[]) => void;

    // History Actions
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

const DEFAULT_BOARDS: Board[] = [
    { id: 'b1', name: '設計師日常', icon: '🎨', color: '#7c3aed' },
    { id: 'b2', name: '學霸筆記', icon: '📚', color: '#0284c7' }
];

const DEFAULT_CATEGORIES: Category[] = [
    { id: 'cat1', title: '發現', color: '#e11d48', icon: '💡', boardId: 'b1' },
    { id: 'cat2', title: '分析', color: '#0284c7', icon: '🔎', boardId: 'b1' },
    { id: 'cat3', title: '執行', color: '#059669', icon: '🚀', boardId: 'b1' },
    { id: 'cat4', title: '歸檔', color: '#7c3aed', icon: '📂', boardId: 'b1' }
];

interface HistoryState {
    boards: Board[];
    categories: Category[];
    papers: Paper[];
    generatedReports: GeneratedRecord[];
    activeBoardId: string;
}

export const BoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // --- State Initialization ---
    const [boards, setBoards] = useState<Board[]>(() => {
        const saved = localStorage.getItem('lumos_boards_v1');
        return saved ? JSON.parse(saved) : DEFAULT_BOARDS;
    });

    const [activeBoardId, setActiveBoardId] = useState<string>(() => {
        return localStorage.getItem('lumos_activeBoardId') || boards[0]?.id || '';
    });

    const [categories, setCategories] = useState<Category[]>(() => {
        const saved = localStorage.getItem('lumos_cats_v1');
        return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    });

    const [papers, setPapers] = useState<Paper[]>(() => {
        const saved = localStorage.getItem('lumos_papers_v1');
        return saved ? JSON.parse(saved) : [];
    });

    const [generatedReports, setGeneratedReports] = useState<GeneratedRecord[]>(() => {
        const saved = localStorage.getItem('lumos_reports_v1');
        return saved ? JSON.parse(saved) : [];
    });

    // --- History Management ---
    const [undoStack, setUndoStack] = useState<HistoryState[]>([]);
    const [redoStack, setRedoStack] = useState<HistoryState[]>([]);
    const MAX_HISTORY = 50;

    const saveHistory = () => {
        const currentState: HistoryState = {
            boards: [...boards],
            categories: [...categories],
            papers: [...papers],
            generatedReports: [...generatedReports],
            activeBoardId
        };
        setUndoStack(prev => {
            const newStack = [...prev, currentState];
            if (newStack.length > MAX_HISTORY) return newStack.slice(1);
            return newStack;
        });
        setRedoStack([]); // Clear redo stack on new action
    };

    const undo = () => {
        if (undoStack.length === 0) return;

        const previousState = undoStack[undoStack.length - 1];
        const currentState: HistoryState = { boards, categories, papers, generatedReports, activeBoardId };

        setRedoStack(prev => [...prev, currentState]);
        setUndoStack(prev => prev.slice(0, -1));

        // Apply previous state
        setBoards(previousState.boards);
        setCategories(previousState.categories);
        setPapers(previousState.papers);
        setGeneratedReports(previousState.generatedReports);
        setActiveBoardId(previousState.activeBoardId);
    };

    const redo = () => {
        if (redoStack.length === 0) return;

        const nextState = redoStack[redoStack.length - 1];
        const currentState: HistoryState = { boards, categories, papers, generatedReports, activeBoardId };

        setUndoStack(prev => [...prev, currentState]);
        setRedoStack(prev => prev.slice(0, -1));

        // Apply next state
        setBoards(nextState.boards);
        setCategories(nextState.categories);
        setPapers(nextState.papers);
        setGeneratedReports(nextState.generatedReports);
        setActiveBoardId(nextState.activeBoardId);
    };

    // --- Persistence ---
    useEffect(() => {
        localStorage.setItem('lumos_boards_v1', JSON.stringify(boards));
        localStorage.setItem('lumos_activeBoardId', activeBoardId);
        localStorage.setItem('lumos_cats_v1', JSON.stringify(categories));
        localStorage.setItem('lumos_papers_v1', JSON.stringify(papers));
        localStorage.setItem('lumos_reports_v1', JSON.stringify(generatedReports));
    }, [boards, activeBoardId, categories, papers, generatedReports]);

    // --- Actions ---

    const addBoard = (board: Board, initialCategories: Category[]) => {
        saveHistory();
        setBoards(prev => [...prev, board]);
        setCategories(prev => [...prev, ...initialCategories]);
        setActiveBoardId(board.id);
    };

    const updateBoard = (id: string, updates: Partial<Board>) => {
        saveHistory();
        setBoards(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const deleteBoard = (id: string) => {
        if (boards.length <= 1) {
            alert("至少需要保留一個白板！");
            return;
        }
        if (confirm("確定要刪除此白板嗎？所有的欄位和紙片都會消失。")) {
            saveHistory();
            setBoards(prev => prev.filter(b => b.id !== id));
            // Cleanup related data
            setCategories(prev => prev.filter(c => c.boardId !== id));
            setPapers(prev => prev.filter(p => p.boardId !== id));

            if (activeBoardId === id) {
                const remaining = boards.filter(b => b.id !== id);
                if (remaining.length > 0) setActiveBoardId(remaining[0].id);
            }
        }
    };

    const reorderBoards = (newBoards: Board[]) => {
        saveHistory();
        setBoards(newBoards);
    };

    const addPaper = (paper: Paper) => {
        saveHistory();
        setPapers(prev => [paper, ...prev]);
    };

    const updatePaper = (id: string, updates: Partial<Paper>) => {
        saveHistory();
        setPapers(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deletePaper = (id: string) => {
        saveHistory();
        setPapers(prev => prev.filter(p => p.id !== id));
    };

    const archivePaper = (id: string) => {
        saveHistory();
        updatePaper(id, { isStored: true, archivedAt: Date.now() });
    };

    const unarchivePaper = (id: string) => {
        saveHistory();
        updatePaper(id, { isStored: false, archivedAt: undefined });
    };

    const movePaper = (paperId: string, newColumnId: string) => {
        saveHistory();
        setPapers(prev => prev.map(p => p.id === paperId ? { ...p, columnId: newColumnId } : p));
    };

    const copyPaper = (paperId: string, targetColumnId: string, targetBoardId: string) => {
        const paper = papers.find(p => p.id === paperId);
        if (!paper) return;
        const newPaper = {
            ...paper,
            id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            columnId: targetColumnId,
            boardId: targetBoardId,
            time: Date.now()
        };
        setPapers(prev => [newPaper, ...prev]);
        saveHistory();
    };

    const movePaperToBoard = (paperId: string, targetBoardId: string) => {
        const paper = papers.find(p => p.id === paperId);
        if (!paper) return;

        // Find a destination column in the target board
        const targetColumn = categories.find(c => c.boardId === targetBoardId);
        if (targetColumn) {
            setPapers(prev => prev.map(p => p.id === paperId ? { ...p, boardId: targetBoardId, columnId: targetColumn.id } : p));
        } else {
            // Create a default 'Inbox' column if none exists
            const newCol: Category = {
                id: `cat-inbox-${Date.now()}`,
                boardId: targetBoardId,
                title: '收件匣',
                color: '#64748b',
                icon: '📥'
            };
            setCategories(prev => [...prev, newCol]);
            setPapers(prev => prev.map(p => p.id === paperId ? { ...p, boardId: targetBoardId, columnId: newCol.id } : p));
        }
    };

    const addCategory = (category: Category) => {
        saveHistory();
        setCategories(prev => [...prev, category]);
    };

    const deleteCategory = (id: string) => {
        saveHistory();
        setCategories(prev => prev.filter(c => c.id !== id));
        setPapers(prev => prev.filter(p => p.columnId !== id)); // Cascading delete
    };

    const moveColumnToBoard = (columnId: string, targetBoardId: string) => {
        setCategories(prev => prev.map(c => c.id === columnId ? { ...c, boardId: targetBoardId } : c));
        setPapers(prev => prev.map(p => p.columnId === columnId ? { ...p, boardId: targetBoardId } : p));
    };

    const copyColumnToBoard = (columnId: string, targetBoardId: string) => {
        const column = categories.find(c => c.id === columnId);
        if (!column) return;

        const newColumnId = `cat-copy-${Date.now()}`;
        const newColumn = { ...column, id: newColumnId, boardId: targetBoardId };

        const columnPapers = papers.filter(p => p.columnId === columnId);
        const newPapers = columnPapers.map(p => ({
            ...p,
            id: `p-copy-${Date.now()}-${Math.random()}`,
            columnId: newColumnId,
            boardId: targetBoardId,
            time: Date.now()
        }));

        setCategories(prev => [...prev, newColumn]);
        setPapers(prev => [...newPapers, ...prev]);
    };

    const addReport = (report: GeneratedRecord) => {
        saveHistory();
        setGeneratedReports(prev => [report, ...prev]);
    };

    const deleteReport = (id: string) => {
        setGeneratedReports(prev => prev.filter(r => r.id !== id));
    };

    const archiveCategory = (categoryId: string) => {
        saveHistory();
        setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, isStored: true, archivedAt: Date.now() } : c));
        // Also archive its papers? User didn't explicitly say, but usually archiving a column implies its content is archived.
        // However, if we just hide the column, the papers remain associated with it.
    };

    const unarchiveCategory = (categoryId: string) => {
        saveHistory();
        setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, isStored: false, archivedAt: undefined } : c));
    };

    const updateCategory = (id: string, updates: Partial<Category>) => {
        saveHistory();
        setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const reorderCategories = (newBoardCategories: Category[]) => {
        saveHistory();
        setCategories(prev => {
            // Preserve categories that are for other boards OR are archived
            const otherCategories = prev.filter(c => c.boardId !== activeBoardId || !!c.isStored);
            // newBoardCategories is the new order of active, un-archived categories for current board
            return [...otherCategories, ...newBoardCategories];
        });
    };

    const resetData = (newBoards: Board[] = [], newCategories: Category[] = []) => {
        setBoards(newBoards);
        setCategories(newCategories);
        setPapers([]);
        setGeneratedReports([]);
        if (newBoards.length > 0) {
            setActiveBoardId(newBoards[0].id);
        } else {
            setActiveBoardId('');
        }
    };

    return (
        <BoardContext.Provider value={{
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
            unarchivePaper,
            movePaper,
            copyPaper,
            movePaperToBoard,
            addCategory,
            deleteCategory,
            moveColumnToBoard,
            copyColumnToBoard,
            archiveCategory,
            unarchiveCategory,
            addReport,
            deleteReport,
            updateBoard,
            reorderBoards,
            reorderCategories,
            updateCategory,
            resetData,
            undo,
            redo,
            canUndo: undoStack.length > 0,
            canRedo: redoStack.length > 0
        }}>
            {children}
        </BoardContext.Provider>
    );
};

export const useBoard = () => {
    const context = useContext(BoardContext);
    if (context === undefined) {
        throw new Error('useBoard must be used within a BoardProvider');
    }
    return context;
};
