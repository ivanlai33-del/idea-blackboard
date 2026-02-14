export type Lang = 'zh' | 'en';

export const TRANSLATIONS = {
    zh: {
        title: "LUMOS 設計系統",
        subtitle: "全站零件庫 v2.0 (模組化架構)",
        close: "關閉組件庫",
        lang: "English",
        autoSyncTitle: "🛠️ LUMOS 完備性定律 (Law of Completeness)",
        autoSyncDesc: "「網站可以選擇不使用設計系統裡的零件，但設計系統裡不能沒有網站已存在的零件。」本頁面必須作為全站 UI 的超集 (Superset)，確保所有實體零件 1:1 收錄入庫。",
        sections: {
            logo: "1. LOGO 品牌規範",
            typography: "2. 文字樣式與層級",
            colors: "3. 色彩能量規律",
            buttons: "4. 按鈕交互系統",
            interaction: "5. 滑鼠與觸控交互規則",
            responsive: "6. 響應式裝置適應",
            ai: "8. AI 助理系統 (Aura Core)",
            layout: "9. 佈局實體零件 (Layout Blocks)",
            portals: "10. 行動入口與彈窗 (Action Portals)",
            sidebar: "11. 導航與側邊欄 (Navigator)",
            cards: "12. 紙片卡片圖鑑 (Paper Taxonomy)",
            modals: "13. 視窗元件標準 (Modal Logic)",
            themes: "14. 靈光主題光譜 (Aura Themes)",
            marketing: "15. 首頁行銷組件 (Marketing Library)",
            auth: "16. 身份驗證與登入 (Auth System)"
        },
        logoDesc: {
            home: "首頁 / 導航 (Nav)",
            modal: "視窗 (Modal)",
            col: "欄位 (Column)"
        },
        typo: {
            h1: "LUMOS 智慧心智系統",
            h2: "Aura 職人工具箱",
            label: "欄位名稱",
            body: "Aura 是您的隨身靈光，她會根據您當前的專業身份，提供精準的 AI 建議。"
        },
        ai: {
            fab: "浮動助理按鈕 (FAB)",
            chat: "支援對話視窗 (Support Chat)",
            tip: "隨身貼士 (Smart Tip)",
            desc: "Aura 是系統的靈魂，負責提供建議、引導與問答。"
        }
    },
    en: {
        title: "LUMOS Design System",
        subtitle: "Components Library v2.0 (Modular)",
        close: "Close",
        lang: "中文版本",
        autoSyncTitle: "🛠️ Component Auto-Sync Policy",
        autoSyncDesc: "This page serves as the single source of truth. All newly implemented UI objects must be defined here.",
        sections: {
            logo: "1. LOGO & Brand",
            typography: "2. Typography",
            colors: "3. Color Spectrum",
            buttons: "4. Button System",
            interaction: "5. Interaction Rules",
            responsive: "6. Responsive Rules",
            ai: "8. AI Assistant System (Aura Core)",
            layout: "9. Layout Components (Lego Blocks)",
            portals: "10. Action Portals & Modals",
            sidebar: "11. Navigation & Sidebar",
            cards: "12. Paper Card Taxonomy",
            modals: "13. Modal Standards",
            themes: "14. Aura Themes",
            marketing: "15. Landing Page Components",
            auth: "16. Identity & Auth System"
        },
        logoDesc: {
            home: "Landing / Nav",
            modal: "Modal (Header)",
            col: "Column (Title)"
        },
        typo: {
            h1: "LUMOS Cognitive System",
            h2: "Aura Persona Toolbox",
            label: "COLUMN TITLE",
            body: "Aura is your personal spark, providing precise AI suggestions based on your persona."
        },
        ai: {
            fab: "Floating Action Button",
            chat: "Support Chat Box",
            tip: "Aura Smart Tip",
            desc: "Aura is the soul of Lumos, managing suggestions and support."
        }
    }
};
