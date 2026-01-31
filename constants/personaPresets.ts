import { PersonaType } from '../types';

export interface PersonaPreset {
    type: PersonaType;
    name: string;
    icon: string;
    context: string;
    columns: { title: string; icon: string; color: string }[];
}

export const PERSONA_PRESETS: PersonaPreset[] = [
    {
        type: 'Student',
        name: '學生模式',
        icon: '📚',
        context: '專注於學習進度、打工事項與生涯規劃的學生。',
        columns: [
            { title: '學生領地', icon: '📝', color: '#e11d48' },
            { title: '家庭生活', icon: '🏠', color: '#0284c7' },
            { title: '打工記錄', icon: '💰', color: '#059669' },
            { title: '生涯規劃', icon: '🎯', color: '#7c3aed' }
        ]
    },
    {
        type: 'Employee',
        name: '上班族模式',
        icon: '💼',
        context: '平衡工作、投資與個人生活的職場人士。',
        columns: [
            { title: '工作推進', icon: '📈', color: '#0284c7' },
            { title: '生活雜事', icon: '🍵', color: '#f59e0b' },
            { title: '旅遊計畫', icon: '✈️', color: '#10b981' },
            { title: '投資理財', icon: '💹', color: '#059669' },
            { title: '帳單開銷', icon: '🧾', color: '#ef4444' }
        ]
    },
    {
        type: 'Boss',
        name: '老闆模式',
        icon: '👑',
        context: '管理公司業務、金流與投資關係的決策者。',
        columns: [
            { title: '客戶關係', icon: '🤝', color: '#0284c7' },
            { title: '業務開發', icon: '🚀', color: '#0ea5e9' },
            { title: '公司金流', icon: '🏦', color: '#059669' },
            { title: '創業點子', icon: '💡', color: '#f59e0b' },
            { title: '預算管理', icon: '📊', color: '#ef4444' }
        ]
    },
    {
        type: 'Doctor',
        name: '研究/醫學模式',
        icon: '🧬',
        context: '專注於學術研究、臨床案例與論文發表的專業人員。',
        columns: [
            { title: '醫學研究', icon: '🧪', color: '#0284c7' },
            { title: '實驗資料', icon: '📁', color: '#0ea5e9' },
            { title: '進度報告', icon: '📄', color: '#059669' },
            { title: '論文發表', icon: '🎓', color: '#7c3aed' },
            { title: '薪資開銷', icon: '💰', color: '#f59e0b' }
        ]
    },
    {
        type: 'Custom',
        name: '法律人模式',
        icon: '⚖️',
        context: '管理案例、客戶時間與法庭文件的法律專家。',
        columns: [
            { title: '判決案例', icon: '🔨', color: '#0284c7' },
            { title: '客戶諮詢', icon: '🗣️', color: '#0ea5e9' },
            { title: '時間管理', icon: '⌛', color: '#059669' },
            { title: '記帳開銷', icon: '💸', color: '#ef4444' }
        ]
    }
];
