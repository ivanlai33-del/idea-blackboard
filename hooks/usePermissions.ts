import { useBoard } from '../context/BoardContext';
import { User } from '../types';

export const usePermissions = (user: User | null) => {
    const { boards, categories, activeBoardId } = useBoard();

    const plan = user?.tier || 'Free';

    // Limits
    const limits = {
        boards: plan === 'Free' ? 1 : 1000,
        columnsPerBoard: plan === 'Free' ? 3 : 9,
        papersPerColumn: plan === 'Free' ? 3 : 1000,
        aiReports: plan === 'Free' ? 3 : 1000,
        imageGenerations: plan === 'Free' ? 0 : 50, // Monthly limit for Pro
    };

    // Checks
    const canAddBoard = boards.length < limits.boards;

    const activeBoardCategories = categories.filter(c => c.boardId === activeBoardId);
    const canAddColumn = activeBoardCategories.length < limits.columnsPerBoard;

    const canAddPaperToColumn = (columnId: string, currentPaperCount: number) => {
        return currentPaperCount < limits.papersPerColumn;
    };

    const isPro = plan === 'Pro' || plan === 'Team';
    const isTeam = plan === 'Team';

    return {
        plan,
        limits,
        canAddBoard,
        canAddColumn,
        canAddPaperToColumn,
        isPro,
        isTeam,
        // AI specifically
        canUseAdvancedAI: isPro,
        canGenerateImage: isPro, // New: Gate image generation to paid tiers
    };
};
