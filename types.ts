
export type SubscriptionTier = 'Free' | 'Pro' | 'Team';
export type Lang = 'zh' | 'en';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    tier: SubscriptionTier;
    provider: 'Google' | 'Line' | 'Email';
}

// Basic Board structure (formerly Persona)
export interface Board {
    id: string;
    name: string;
    icon: string; // Greyscale/Simple icons
    color: string;
    persona?: string; // Links to PERSONA_MAGIC_TOOLS
    isTemplate?: boolean;
}

// Global Paper (formerly Note)
export type PaperType = 'text' | 'image' | 'link' | 'file' | 'stock' | 'utility';

export interface Paper {
    id: string;
    boardId: string;
    columnId: string;
    type: PaperType;
    text: string;
    contentUrl?: string; // For images/files/link previews
    time: number;
    pinned: boolean;
    isStored: boolean; // Managed by Storage Box
    archivedAt?: number;
    fullBackground?: boolean; // New: Use image as card background
    modules?: PaperModule[]; // Optional modular components for 'utility' type
}

export interface PaperModule {
    id: string;
    type: 'checklist' | 'counter' | 'progress' | 'label-value';
    title: string;
    config?: any;
    data?: any;
}

export interface Category {
    id: string;
    boardId: string;
    title: string;
    color: string;
    icon?: string;
    avatar?: string; // Custom avatar for column
    isStored?: boolean;
    archivedAt?: number;
}

export interface AIReport {
    id: string;
    title: string;
    type: 'meeting' | 'slides' | 'todo' | 'reflection';
    content: string;
    createdAt: number;
    isStored: boolean;
}

export interface LinkData {
    url: string;
    title: string;
    description: string;
    siteName: string;
    image: string;
}

export interface GeneratedRecord {
    id: string;
    title: string;
    exportMode: string;
    contextType: string;
    scopeSummary: string;
    generatedAt: string;
    content: string;
    rawOutput: string;
}
