
export interface LinkData {
    url: string;
    title: string;
    description: string;
    image?: string;
    siteName?: string;
}

export type PersonaType = 'Student' | 'Teacher' | 'Housewife' | 'Employee' | 'Boss' | 'Accountant' | 'Doctor' | 'Designer' | 'Custom';

export type SubscriptionTier = 'Free' | 'Pro' | 'Team';

export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    tier: SubscriptionTier;
    provider: 'Google' | 'Line' | 'Email';
}

export interface Persona {
    id: string;
    userId?: string; // Link to the owner
    type: PersonaType;
    name: string;
    icon: string;
    context: string; // The system prompt or background info for AI
    color: string;
}

export interface UserProfile {
    id: string;
    email: string;
    personas: Persona[];
    activePersonaId: string;
}

export interface Note {
    id: string;
    categoryId: string;
    text: string;
    time: number;
    pinned: boolean;
    archived?: boolean;
    linkData?: LinkData;
    personaId?: string; // Link note to a specific persona
}

export interface Category {
    id: string;
    title: string;
    color: string;
    icon?: string;
    personaId: string; // Linking category/column to a specific persona
}

export interface GeneratedRecord {
    id: string;
    title: string;
    exportMode: ExportMode;
    contextType: string;
    scopeSummary: string;
    generatedAt: string; // ISO string
    content: string; // The full raw content or body
    rawOutput: string; // The complete original response including headers
}

export type ViewMode = 'board' | 'grid';

export type ExportMode = 'meeting_minutes' | 'proposal_slides' | 'task_list' | 'daily_summary';
