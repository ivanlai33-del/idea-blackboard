import React, { useState } from 'react';
import { X, Layout, Languages, RefreshCw, ChevronRight } from 'lucide-react';
import { TRANSLATIONS, Lang } from './DesignSystem/constants';
import SpecBrand from './DesignSystem/SpecBrand';
import SpecInteraction from './DesignSystem/SpecInteraction';
import ModuleLegoParts from './DesignSystem/ModuleLegoParts';
import ModuleAppLogic from './DesignSystem/ModuleAppLogic';
import ModuleMarketing from './DesignSystem/ModuleMarketing';

interface DesignSystemProps {
    onClose: () => void;
}

const DesignSystem: React.FC<DesignSystemProps> = ({ onClose }) => {
    const [lang, setLang] = useState<Lang>('zh');
    const t = TRANSLATIONS[lang];

    const sidebarItems = [
        { id: 'logo', label: t.sections.logo },
        { id: 'typography', label: t.sections.typography },
        { id: 'colors', label: t.sections.colors },
        { id: 'buttons', label: t.sections.buttons },
        { id: 'interaction', label: t.sections.interaction },
        { id: 'responsive', label: t.sections.responsive },
        { id: 'ai', label: t.sections.ai },
        { id: 'layout', label: t.sections.layout },
        { id: 'portals', label: t.sections.portals },
        { id: 'sidebar', label: t.sections.sidebar },
        { id: 'cards', label: t.sections.cards },
        { id: 'modals', label: t.sections.modals },
        { id: 'themes', label: t.sections.themes },
        { id: 'marketing', label: t.sections.marketing },
        { id: 'auth', label: t.sections.auth },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-slate-50 flex overflow-hidden">
            {/* Left Sidebar TOC */}
            <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col shadow-xl">
                <div className="p-8 border-b border-slate-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-lg shadow-md flex items-center justify-center text-white">
                            <Layout size={18} />
                        </div>
                        <span className="font-black text-slate-800 tracking-tight">Navigation</span>
                    </div>
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-between group"
                            >
                                {item.label}
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-8">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Version</p>
                        <p className="text-sm font-black text-slate-800">LUMOS v2.0</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative scroll-smooth">
                {/* Sticky Header */}
                <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-teal-400 to-rose-400 rounded-xl shadow-lg flex items-center justify-center text-white lg:hidden">
                            <Layout size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800">{t.title}</h1>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t.subtitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-600 transition-all font-sans"
                        >
                            <Languages size={18} />
                            {t.lang}
                        </button>
                        <button
                            onClick={onClose}
                            title={t.close}
                            className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto py-16 px-8 space-y-32 pb-64">

                    {/* 0. AUTO-SYNC DISCLAIMER */}
                    <section className="p-8 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-[40px] animate-pulse">
                        <div className="flex items-center gap-3 mb-2">
                            <RefreshCw className="text-indigo-500" size={20} />
                            <h3 className="font-black text-indigo-700 uppercase tracking-widest text-sm">{t.autoSyncTitle}</h3>
                        </div>
                        <p className="text-xs text-indigo-600/70 font-bold leading-relaxed">{t.autoSyncDesc}</p>
                    </section>

                    {/* Modular Sections */}
                    <SpecBrand lang={lang} />
                    <SpecInteraction lang={lang} />
                    <ModuleLegoParts lang={lang} />
                    <ModuleAppLogic lang={lang} />
                    <ModuleMarketing lang={lang} />

                </main>
            </div>
        </div>
    );
};

export default DesignSystem;
