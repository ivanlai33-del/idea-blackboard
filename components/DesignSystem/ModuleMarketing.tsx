import React from 'react';
import { TRANSLATIONS, Lang } from './constants';
import { ArrowRight, Briefcase, GraduationCap, Palette as PaletteIcon, Target, CheckCircle2 } from 'lucide-react';

const ModuleMarketing: React.FC<{ lang: Lang }> = ({ lang }) => {
    const t = TRANSLATIONS[lang];

    const pricingPlans = [
        { name: '免費版', price: 'NT$ 0', features: ['1 個 Lumos 看板', 'Aura 基礎摘要', '單人使用'] },
        { name: '職人版', price: 'NT$ 299', per: '/月', features: ['無限 Lumos 看板', 'Aura 職人工具箱 (全開)', 'Aura 繪圖 (50張/月)', '優先支援'], highlight: true },
        { name: '團隊版', price: 'NT$ 999', per: '/月', features: ['共享協作空間', 'Aura 繪圖 (無限)', 'Aura 團隊大腦', '專屬客服'] }
    ];

    return (
        <div className="space-y-32">
            {/* 15. Marketing & Landing Page Components */}
            <section id="marketing" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-indigo-600 pl-4">
                    <h2 className="text-2xl font-black text-slate-800">{t.sections.marketing}</h2>
                </div>

                <div className="space-y-16">
                    {/* Hero Section Spec (Synced with visual width) */}
                    <div className="p-16 bg-white rounded-[48px] border border-slate-100 shadow-xl space-y-8 text-center max-w-4xl mx-auto">
                        <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">Aura OS: The Next Gen</span>
                        <h4 className="text-5xl font-black text-slate-800 tracking-tight leading-tight">讓亂成一團的想法，<br /><span className="gradient-text">瞬間轉化為靈光</span></h4>
                        <div className="flex justify-center gap-4">
                            <button className="px-10 py-5 bg-slate-900 text-white rounded-full font-bold shadow-2xl hover:bg-black transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95">
                                啟動 Lumos <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Pricing Tiers (1:1 with Image 1 & LandingPage.tsx) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, idx) => (
                            <div key={idx} className={`p-10 rounded-[40px] border transition-all duration-300 relative group flex flex-col ${plan.highlight
                                ? 'bg-gradient-to-br from-cyan-400 to-teal-600 text-white scale-105 border-white/20 shadow-[0_32px_64px_-12px_rgba(45,212,191,0.5),inset_0_1px_0_0_rgba(255,255,255,0.3)] z-10 backdrop-blur-md'
                                : 'bg-white/60 backdrop-blur-xl border-white/50 text-slate-800 hover:shadow-2xl hover:bg-white/80 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.05),inset_0_1px_0_0_rgba(255,255,255,0.9)] hover:-translate-y-1'
                                }`}>
                                {plan.highlight && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-white/90 text-teal-600 text-[10px] font-black rounded-full shadow-lg backdrop-blur-sm border border-white/50 uppercase tracking-widest">
                                        Aura 首選
                                    </div>
                                )}
                                <h5 className={`text-xl font-black mb-4 ${plan.highlight ? 'opacity-100' : 'opacity-80'}`}>{plan.name}</h5>
                                <div className={`text-5xl font-black mb-8 tracking-tighter flex items-baseline gap-1 ${plan.highlight ? 'text-white' : 'gradient-text'}`}>
                                    {plan.price}
                                    <span className={`text-lg font-bold ${plan.highlight ? 'opacity-90' : 'opacity-100'}`}>{plan.per}</span>
                                </div>
                                <ul className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className={`flex items-center gap-3 text-sm font-bold ${plan.highlight ? 'opacity-100' : 'opacity-80'}`}>
                                            <div className={`p-1 rounded-full ${plan.highlight ? 'bg-white/20' : 'bg-teal-50'}`}>
                                                <CheckCircle2 className={`w-4 h-4 ${plan.highlight ? 'text-white' : 'text-teal-600'}`} />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg text-sm ${plan.highlight
                                    ? 'bg-white text-teal-700 hover:bg-teal-50 shadow-teal-900/10'
                                    : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-900 shadow-slate-200/50'
                                    }`}>
                                    立即訂閱
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Solutions Bento Cards (Secondary Specs) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { icon: <Briefcase size={24} />, title: '職場團隊', bg: 'bg-blue-50', text: 'text-blue-600' },
                            { icon: <GraduationCap size={24} />, title: '教育學習', bg: 'bg-indigo-50', text: 'text-indigo-600' },
                            { icon: <PaletteIcon size={24} />, title: '設計創意', bg: 'bg-pink-50', text: 'text-pink-600' },
                            { icon: <Target size={24} />, title: '企業營運', bg: 'bg-slate-50', text: 'text-slate-600' }
                        ].map((sol, i) => (
                            <div key={i} className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                <div className={`w-12 h-12 ${sol.bg} ${sol.text} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>{sol.icon}</div>
                                <h5 className="font-black text-slate-800 mb-2">{sol.title}</h5>
                                <div className="h-1 w-8 bg-slate-100 rounded-full group-hover:w-16 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ModuleMarketing;
