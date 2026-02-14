
import { Board, Category } from '../types';

export interface BoardTemplate {
    name: string;
    icon: string;
    color: string;
    columns: Omit<Category, 'id' | 'boardId'>[];
}

export const BOARD_TEMPLATES: BoardTemplate[] = [
    {
        name: '學生範本',
        icon: '🎓',
        color: '#7c3aed',
        columns: [
            { title: '課業進度', color: '#6366f1', icon: '📚' },
            { title: '作業筆記', color: '#10b981', icon: '✍️' },
            { title: '社團活動', color: '#f59e0b', icon: '🎭' },
            { title: '實習計畫', color: '#f43f5e', icon: '💼' },
            { title: '生活雜事', color: '#0ea5e9', icon: '🔋' }
        ]
    },
    {
        name: '上班族範本',
        icon: '💼',
        color: '#0284c7',
        columns: [
            { title: '今日待辦', color: '#06b6d4', icon: '✅' },
            { title: '專案進度', color: '#8b5cf6', icon: '🚀' },
            { title: '會議記錄', color: '#f97316', icon: '📝' },
            { title: '長期目標', color: '#10b981', icon: '🎯' },
            { title: '下班生活', color: '#ec4899', icon: '🏠' }
        ]
    },
    {
        name: '經營者範本',
        icon: '👑',
        color: '#059669',
        columns: [
            { title: '戰略願景', color: '#6366f1', icon: '🧭' },
            { title: '核心業務', color: '#0ea5e9', icon: '🏗️' },
            { title: '團隊管理', color: '#f59e0b', icon: '👥' },
            { title: '市場動態', color: '#14b8a6', icon: '🌏' },
            { title: '財務指標', color: '#10b981', icon: '📊' }
        ]
    },
    {
        name: '科研員範本',
        icon: '🧪',
        color: '#e11d48',
        columns: [
            { title: '研究主題', color: '#f43f5e', icon: '🧬' },
            { title: '實驗數據', color: '#8b5cf6', icon: '🔬' },
            { title: '文獻探討', color: '#06b6d4', icon: '📖' },
            { title: '論文編寫', color: '#10b981', icon: '📄' },
            { title: '經費管理', color: '#f59e0b', icon: '💰' }
        ]
    },
    {
        name: '電商運營',
        icon: '🛒',
        color: '#f59e0b',
        columns: [
            { title: '產品選品', color: '#f97316', icon: '📦' },
            { title: '行銷廣告', color: '#8b5cf6', icon: '📣' },
            { title: '訂單處理', color: '#0ea5e9', icon: '💳' },
            { title: '庫存管理', color: '#14b8a6', icon: '🏭' },
            { title: '售後服務', color: '#f43f5e', icon: '💬' }
        ]
    },
    {
        name: '劇本創作',
        icon: '🎬',
        color: '#db2777',
        columns: [
            { title: '角色設定', color: '#06b6d4', icon: '👤' },
            { title: '大綱靈感', color: '#f59e0b', icon: '💡' },
            { title: '分場大綱', color: '#6366f1', icon: '🎞️' },
            { title: '第一稿', color: '#10b981', icon: '✍️' },
            { title: '修稿紀錄', color: '#f43f5e', icon: '♻️' }
        ]
    },
    {
        name: '旅行規劃師',
        icon: '✈️',
        color: '#2563eb',
        columns: [
            { title: '景點搜集', color: '#f43f5e', icon: '📍' },
            { title: '交通預訂', color: '#0ea5e9', icon: '🎫' },
            { title: '住宿安排', color: '#8b5cf6', icon: '🏨' },
            { title: '美食清單', color: '#10b981', icon: '🍜' },
            { title: '預算預估', color: '#f59e0b', icon: '💵' }
        ]
    },
    {
        name: '軟體架構師',
        icon: '🏗️',
        color: '#475569',
        columns: [
            { title: '需求分析', color: '#6366f1', icon: '📋' },
            { title: '系統佈局', color: '#06b6d4', icon: '🗺️' },
            { title: '技術選型', color: '#f97316', icon: '⚙️' },
            { title: '安全管理', color: '#10b981', icon: '🛡️' },
            { title: '性能指標', color: '#f43f5e', icon: '🏎️' }
        ]
    },
    {
        name: '食譜博主',
        icon: '🍜',
        color: '#ea580c',
        columns: [
            { title: '新菜點子', color: '#f43f5e', icon: '🍎' },
            { title: '食材採購', color: '#10b981', icon: '🥬' },
            { title: '實作紀錄', color: '#f59e0b', icon: '👩‍🍳' },
            { title: '拍攝進度', color: '#0ea5e9', icon: '📸' },
            { title: '文案編輯', color: '#8b5cf6', icon: '🖋️' }
        ]
    },
    {
        name: '健身教練',
        icon: '💪',
        color: '#16a34a',
        columns: [
            { title: '學員管理', color: '#0ea5e9', icon: '👥' },
            { title: '課表編排', color: '#6366f1', icon: '🗓️' },
            { title: '飲食追蹤', color: '#f97316', icon: '🥗' },
            { title: '體測數據', color: '#f43f5e', icon: '📉' },
            { title: '運動補充', color: '#10b981', icon: '🍶' }
        ]
    },
    {
        name: '活動企劃',
        icon: '🎉',
        color: '#7c3aed',
        columns: [
            { title: '活動草案', color: '#8b5cf6', icon: '📜' },
            { title: '場地流程', color: '#06b6d4', icon: '📍' },
            { title: '聯繫名單', color: '#10b981', icon: '📞' },
            { title: '物資採購', color: '#f59e0b', icon: '🛍️' },
            { title: '風險管控', color: '#f43f5e', icon: '⚠️' }
        ]
    },
    {
        name: 'UI 介面設計',
        icon: '🎨',
        color: '#ff4400',
        columns: [
            { title: '靈感牆', color: '#8b5cf6', icon: '🖼️' },
            { title: '組件規範', color: '#0ea5e9', icon: '📏' },
            { title: '草圖流程', color: '#10b981', icon: '📐' },
            { title: '正式介面', color: '#f97316', icon: '💎' },
            { title: '交付文件', color: '#f43f5e', icon: '📂' }
        ]
    },
    {
        name: '股市交易',
        icon: '📈',
        color: '#00cc66',
        columns: [
            { title: '關注清單', color: '#0ea5e9', icon: '👀' },
            { title: '財報分析', color: '#f97316', icon: '📖' },
            { title: '交易計畫', color: '#6366f1', icon: '📝' },
            { title: '覆盤紀錄', color: '#10b981', icon: '✒️' },
            { title: '心情筆記', color: '#ec4899', icon: '💭' }
        ]
    },
    {
        name: 'Podcast 主播',
        icon: '🎙️',
        color: '#9933ff',
        columns: [
            { title: '訪談嘉賓', color: '#0ea5e9', icon: '👤' },
            { title: '腳本提綱', color: '#f59e0b', icon: '📜' },
            { title: '剪輯排程', color: '#8b5cf6', icon: '✂️' },
            { title: '推廣發佈', color: '#10b981', icon: '📢' },
            { title: '聽眾反饋', color: '#f43f5e', icon: '💬' }
        ]
    },
    {
        name: '外語學習',
        icon: '🌐',
        color: '#3399ff',
        columns: [
            { title: '生字庫', color: '#f43f5e', icon: '📖' },
            { title: '語法要點', color: '#10b981', icon: '🔗' },
            { title: '聽力練習', color: '#f97316', icon: '🎧' },
            { title: '口說筆記', color: '#8b5cf6', icon: '🗣️' },
            { title: '備考進度', color: '#0ea5e9', icon: '✏️' }
        ]
    },
    {
        name: '手帳愛好者',
        icon: '📓',
        color: '#ff99cc',
        columns: [
            { title: '每日紀錄', color: '#ec4899', icon: '📅' },
            { title: '周回顧', color: '#8b5cf6', icon: '🔄' },
            { title: '月計畫', color: '#f59e0b', icon: '🌙' },
            { title: '習慣追蹤', color: '#10b981', icon: '✅' },
            { title: '靈感拼貼', color: '#0ea5e9', icon: '✂️' }
        ]
    },
    {
        name: '法務案例',
        icon: '⚖️',
        color: '#666666',
        columns: [
            { title: '案件概覽', color: '#6366f1', icon: '📁' },
            { title: '法條蒐集', color: '#f97316', icon: '📖' },
            { title: '證據文件', color: '#10b981', icon: '⚖️' },
            { title: '出庭紀錄', color: '#f43f5e', icon: '🏛️' },
            { title: '客戶諮詢', color: '#06b6d4', icon: '💬' }
        ]
    },
    {
        name: '產品經理',
        icon: '🏗️',
        color: '#334455',
        columns: [
            { title: '產品規劃', color: '#8b5cf6', icon: '🗺️' },
            { title: '功能池', color: '#0ea5e9', icon: '🌊' },
            { title: '開發進度', color: '#10b981', icon: '🔨' },
            { title: '用戶需求', color: '#f59e0b', icon: '🙋' },
            { title: '數據指標', color: '#f97316', icon: '📈' }
        ]
    },
    {
        name: '社群小編',
        icon: '📱',
        color: '#ff3366',
        columns: [
            { title: '選題靈感', color: '#8b5cf6', icon: '💡' },
            { title: '貼文排練', color: '#f97316', icon: '✍️' },
            { title: '素材庫', color: '#10b981', icon: '🖼️' },
            { title: '數據反饋', color: '#0ea5e9', icon: '📊' },
            { title: '聯絡事宜', color: '#f43f5e', icon: '📩' }
        ]
    },
    {
        name: '園藝大師',
        icon: '🌿',
        color: '#228b22',
        columns: [
            { title: '植栽目錄', color: '#10b981', icon: '🌻' },
            { title: '澆水排程', color: '#0ea5e9', icon: '💧' },
            { title: '施肥紀錄', color: '#f59e0b', icon: '💩' },
            { title: '病蟲監控', color: '#f43f5e', icon: '🐛' },
            { title: '園藝點子', color: '#8b5cf6', icon: '🏡' }
        ]
    },
    {
        name: '家庭管家',
        icon: '🏠',
        color: '#f472b6',
        columns: [
            { title: '今日菜單', color: '#f97316', icon: '🍳' },
            { title: '家務清單', color: '#0ea5e9', icon: '🧹' },
            { title: '採購計畫', color: '#10b981', icon: '🛒' },
            { title: '帳單繳費', color: '#6366f1', icon: '🧾' },
            { title: '孩子行程', color: '#ec4899', icon: '👶' }
        ]
    },
    {
        name: 'AI 詠唱師',
        icon: '🪄',
        color: '#8b5cf6',
        columns: [
            { title: '咒語庫', color: '#6366f1', icon: '🪄' },
            { title: '工具清單', color: '#0ea5e9', icon: '🛠️' },
            { title: '實測紀錄', color: '#10b981', icon: '📋' },
            { title: '參數調整', color: '#f59e0b', icon: '⚙️' },
            { title: '待探索領域', color: '#f43f5e', icon: '🔍' }
        ]
    },
    {
        name: '短影音創作者',
        icon: '🤳',
        color: '#ec4899',
        columns: [
            { title: '爆款靈感', color: '#f97316', icon: '💡' },
            { title: '腳本分鏡', color: '#8b5cf6', icon: '📝' },
            { title: '拍攝素材', color: '#0ea5e9', icon: '📸' },
            { title: '剪輯特效', color: '#10b981', icon: '🎞️' },
            { title: '數據分析', color: '#f43f5e', icon: '📊' }
        ]
    },
    {
        name: '一人公司',
        icon: '🛠️',
        color: '#475569',
        columns: [
            { title: '產品進度', color: '#6366f1', icon: '🏗️' },
            { title: '市場反饋', color: '#14b8a6', icon: '💬' },
            { title: '獲利模式', color: '#10b981', icon: '💰' },
            { title: '品牌推廣', color: '#f59e0b', icon: '📣' },
            { title: '週營運回顧', color: '#f43f5e', icon: '🔄' }
        ]
    },
    {
        name: '數位遊牧',
        icon: '🏝️',
        color: '#06b6d4',
        columns: [
            { title: '旅居清單', color: '#f43f5e', icon: '📍' },
            { title: '工作空間', color: '#0ea5e9', icon: '💻' },
            { title: '簽證保險', color: '#8b5cf6', icon: '🛡️' },
            { title: '異地開銷', color: '#10b981', icon: '💵' },
            { title: '資產備份', color: '#f59e0b', icon: '☁️' }
        ]
    },
    {
        name: '正念練習',
        icon: '🧘',
        color: '#10b981',
        columns: [
            { title: '感恩筆記', color: '#f59e0b', icon: '☀️' },
            { title: '情緒觀察', color: '#0ea5e9', icon: '🌊' },
            { title: '練習心得', color: '#8b5cf6', icon: '✍️' },
            { title: '能量狀態', color: '#6366f1', icon: '⚡' },
            { title: '智慧金句', color: '#f43f5e', icon: '💎' }
        ]
    },
    {
        name: '毛孩管家',
        icon: '🐾',
        color: '#f97316',
        columns: [
            { title: '飲食補給', color: '#10b981', icon: '🥣' },
            { title: '醫療紀錄', color: '#f43f5e', icon: '🏥' },
            { title: '訓練計畫', color: '#8b5cf6', icon: '🎾' },
            { title: '探險地圖', color: '#0ea5e9', icon: '🗺️' },
            { title: '美好瞬間', color: '#ec4899', icon: '📷' }
        ]
    },
    {
        name: '命理算命師',
        icon: '🔮',
        color: '#7c3aed',
        columns: [
            { title: '預約排程', color: '#8b5cf6', icon: '📅' },
            { title: '命盤分析', color: '#a855f7', icon: '📜' },
            { title: '開運建議', color: '#f59e0b', icon: '✨' },
            { title: '案例隨筆', color: '#10b981', icon: '📓' },
            { title: '客戶回訪', color: '#0ea5e9', icon: '💬' }
        ]
    },
    {
        name: '塔羅占卜師',
        icon: '🃏',
        color: '#db2777',
        columns: [
            { title: '今日牌面', color: '#f43f5e', icon: '🎴' },
            { title: '牌陣聯想', color: '#ec4899', icon: '🔍' },
            { title: '靈感直覺', color: '#8b5cf6', icon: '💡' },
            { title: '工作儀式', color: '#d946ef', icon: '🕯️' },
            { title: '深度個案', color: '#6366f1', icon: '📖' }
        ]
    },
    {
        name: '人類圖分析',
        icon: '🧬',
        color: '#0369a1',
        columns: [
            { title: '地圖解析', color: '#0ea5e9', icon: '🗺️' },
            { title: '策略權威', color: '#06b6d4', icon: '🧭' },
            { title: '通道定義', color: '#14b8a6', icon: '⚡' },
            { title: '週期追蹤', color: '#8b5cf6', icon: '🔄' },
            { title: '解說筆記', color: '#10b981', icon: '✒️' }
        ]
    },
    {
        name: '占星諮詢師',
        icon: '🪐',
        color: '#4338ca',
        columns: [
            { title: '星盤配置', color: '#6366f1', icon: '🌌' },
            { title: '天象觀察', color: '#3b82f6', icon: '🔭' },
            { title: '行星逆行', color: '#f43f5e', icon: '⏪' },
            { title: '合盤研究', color: '#ec4899', icon: '💞' },
            { title: '諮詢金句', color: '#f59e0b', icon: '💎' }
        ]
    }
];

export const GREY_ICONS = [
    '🎓', '💼', '👑', '🧪', '🛒', '🎬', '✈️', '🏗️', '🍜', '💪',
    '🎉', '🎨', '📈', '🎙️', '🌐', '📓', '⚖️', '📱', '🌿', '🏠',
    '🪄', '🤳', '🛠️', '🏝️', '🧘', '🐾', '👨‍💻', '👩‍🎨', '👨‍🏫', '👩‍⚕️',
    '🍳', '🍼', '🎮', '🎵', '📷', '🚲', '🚗', '💰', '💡', '⏰'
];
