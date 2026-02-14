import React from 'react';
import { TRANSLATIONS, Lang } from './constants';
import { Layout, Plus, X, Sparkles, CheckCircle2 } from 'lucide-react';

const ModuleLegoParts: React.FC<{ lang: Lang }> = ({ lang }) => {
    const t = TRANSLATIONS[lang];

    return (
        <div className="space-y-32">
            {/* 9. Layout Blocks */}
            <section id="layout" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-slate-400 pl-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.sections.layout}</h2>
                </div>
                {/* 1:1 Dot Grid Background Implementation */}
                <div className="relative aspect-video bg-[#F8F9FB] rounded-[48px] border border-slate-200 shadow-inner overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#2DD4BF 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
                    <div className="relative z-10 w-3/4 h-2/3 border-2 border-dashed border-teal-100 rounded-[32px] flex items-center justify-center bg-white/40 backdrop-blur-sm">
                        <img src="/Lumos_logo.svg" className="h-24 opacity-10" alt="Logo" />
                    </div>
                </div>
            </section>

            {/* 10. Action Portals */}
            <section id="portals" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-indigo-400 pl-4">
                    <h2 className="text-2xl font-black text-slate-800">{t.sections.portals}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Add Column Entry (1:1 with AddColumn button) */}
                    <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(13,148,136,0.08)] flex items-center gap-6 group hover:scale-[1.02] transition-all">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-90 transition-transform duration-500">
                            <Plus size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-800 uppercase tracking-widest">新增元件入口</p>
                            <p className="text-xs text-slate-400 font-bold">Base: .rounded-2xl + Lake Gradient</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 12. Paper Card Taxonomy */}
            <section id="cards" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-teal-500 pl-4">
                    <h2 className="text-2xl font-black text-slate-800">{t.sections.cards}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Standard Card (1:1 with PaperCard.tsx) */}
                    <div className="bg-white/80 backdrop-blur-md rounded-[32px] border border-white shadow-[0_20px_50px_-12px_rgba(13,148,136,0.08)] p-6 space-y-4 hover:shadow-2xl transition-all">
                        <div className="flex justify-between items-start">
                            <h4 className="text-sm font-black text-slate-800">標準任務卡片</h4>
                            <div className="w-2 h-2 rounded-full bg-teal-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed">這是全站通用的紙片卡片規範。採用 32px 圓角與湖水綠環境陰影。</p>
                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex gap-1">
                                {[1, 2].map(i => <div key={i} className="w-5 h-1.5 rounded-full bg-slate-100" />)}
                            </div>
                            <CheckCircle2 size={14} className="text-teal-400" />
                        </div>
                    </div>

                    {/* Image Card (1:1 with Gallery Card) */}
                    <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white group">
                        <img src="/3A3E117BD965EC95.png" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="BG" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={14} className="text-teal-400" />
                                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">AI Generated</span>
                            </div>
                            <p className="text-xs font-black text-white leading-tight">全背景圖片沉浸式零件</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 13. Modal Standards */}
            <section id="modals" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-indigo-400 pl-4">
                    <h2 className="text-2xl font-black text-slate-800">{t.sections.modals}</h2>
                </div>
                <div className="p-16 bg-slate-100/50 rounded-[64px] flex items-center justify-center border-2 border-dashed border-slate-200">
                    <div className="w-full max-w-sm bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-white">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-base font-black text-slate-800 tracking-tight">標準視窗標頭</h3>
                            <div className="p-1.5 bg-slate-100 rounded-full text-slate-400"><X size={16} /></div>
                        </div>
                        <div className="p-10 space-y-4">
                            <div className="h-2 w-3/4 bg-slate-50 rounded-full" />
                            <div className="h-2 w-full bg-slate-50 rounded-full" />
                            <div className="pt-4 h-12 bg-indigo-50 rounded-2xl border border-indigo-100/50" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ModuleLegoParts;
