import React, { useState } from 'react';
import { TRANSLATIONS, Lang } from './constants';
import { Sparkles, X, Layout, User, Bell, LogOut, Plus, ChevronRight, Lock, ShieldCheck, Mail, MessageCircle } from 'lucide-react';

const ModuleAppLogic: React.FC<{ lang: Lang }> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [mockSavedTips, setMockSavedTips] = useState(['多喝水，靈感才會來。', '深呼吸三次試試看。', '剛才的點子很有趣！']);
    const [isExpand, setIsExpand] = useState(false);

    return (
        <div className="space-y-32">
            {/* 8. AI Assistant System */}
            <section id="ai" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-cyan-500 pl-4">
                    <h2 className="text-2xl font-black text-slate-800">{t.sections.ai}</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* FAB Interaction */}
                    <div className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm flex flex-col gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-full flex items-center justify-center shadow-xl">
                                <img src="/ai_logo_up.svg" className="w-12 h-12 object-contain" alt="AI" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 text-lg">Aura Core FAB</h4>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">互動行為：呼吸、搖擺、拖行</p>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 italic text-xs text-slate-500 font-bold leading-relaxed">
                            「Aura 的靈魂認知的動態。她不僅是按鈕，更是具有個性的生命體。」
                        </div>
                    </div>

                    {/* NEW: Aura Pearl Sphere Spec v4.0 */}
                    <div className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm space-y-8 relative overflow-hidden">
                        <h4 className="font-black text-slate-800 text-lg">珍珠靈光：3D 球體收納規範</h4>

                        <div className="flex items-center gap-6">
                            {/* Interactive Demo (Aura Pearl Sphere Style) */}
                            <div className="relative isolate pt-4">
                                {isExpand && (
                                    <div className="absolute bottom-[calc(100%+16px)] left-0 w-64 bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/60 p-5 space-y-3 mb-2 animate-in fade-in zoom-in-95">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-100/50">
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">已存檔貼士</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setMockSavedTips([]); setIsExpand(false); }}
                                                className="text-[10px] font-black text-rose-500 hover:text-rose-600 px-2 py-0.5 bg-rose-50/50 rounded-full transition-colors"
                                            >
                                                全部清除
                                            </button>
                                        </div>
                                        {mockSavedTips.map((tip, i) => (
                                            <div key={i} className="p-3 bg-white/40 rounded-2xl text-[11px] font-bold text-slate-600 leading-relaxed border border-white/50">
                                                {tip}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="relative isolate">
                                    {/* Decorative small sphere */}
                                    <div
                                        className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full z-[-1] shadow-[0_4px_12px_rgba(45,212,191,0.3)]"
                                        style={{
                                            background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #f1f5f9 50%, #cbd5e1 100%)',
                                            border: '0.5px solid rgba(255,255,255,0.8)'
                                        }}
                                    />
                                    {/* Main pearl sphere */}
                                    <div
                                        onClick={() => setIsExpand(!isExpand)}
                                        className="w-12 h-12 rounded-full cursor-pointer flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(45,212,191,0.4),0_8px_16px_-4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-4px_8px_rgba(0,0,0,0.05)] active:scale-95 transition-all"
                                        style={{
                                            background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #f8fafc 45%, #e2e8f0 100%)',
                                            border: '1px solid rgba(255,255,255,0.6)'
                                        }}
                                    >
                                        <span className="text-sm font-black text-slate-700 select-none">{mockSavedTips.length}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-[10px] text-slate-400 font-bold space-y-1">
                                <p>• 渲染：多層放射狀漸層 (Radial Gradient)</p>
                                <p>• 光影：核心亮點 (30% 30%) + 底部環境影</p>
                                <p>• 擴散：Lake Green 環境擴散渲染 (#2DD4BF 40%)</p>
                                <p>• 結構：12px 主球 + 4px 裝飾副球</p>
                            </div>
                        </div>

                        <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 text-[10px] text-teal-800 font-bold leading-relaxed">
                            <ShieldCheck className="w-3 h-3 mb-1 inline mr-1" /> 完備性定律修正：正式引入 3D 擬物化視覺（Skeuomorphism），復刻圖片渲染質感。
                        </div>
                    </div>
                </div>
            </section>

            {/* 11. Sidebar & Navigation */}
            <section id="sidebar" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-slate-800 pl-4">
                    <h2 className="text-2xl font-black text-slate-800">{t.sections.sidebar}</h2>
                </div>
                <div className="bg-white rounded-[48px] border border-slate-200 shadow-2xl overflow-hidden flex h-[400px]">
                    <div className="w-20 bg-slate-50 border-r border-slate-100 flex flex-col items-center py-6 gap-6">
                        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Layout size={24} /></div>
                    </div>
                    <div className="flex-1 p-6 space-y-6 flex flex-col">
                        <h3 className="font-black text-slate-800 text-lg">My Boards</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-gradient-to-r from-slate-100 to-white border border-slate-200 rounded-2xl flex items-center gap-3">
                                <span className="text-xl">🚀</span>
                                <span className="font-bold text-slate-800 flex-1">產品代號：Aura</span>
                                <ChevronRight className="text-slate-300" size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 16. Identity & Auth System */}
            <section id="auth" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-rose-600 pl-4">
                    <h2 className="text-2xl font-black text-slate-800">{t.sections.auth}</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative p-8 bg-slate-900 rounded-[56px] shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-center border border-slate-800">
                        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-500/20 to-transparent" />
                        <div className="relative z-10 space-y-8 max-w-sm mx-auto w-full">
                            <div className="text-center space-y-2">
                                <img src="/Lumos_logo.svg" className="h-[40px] mx-auto opacity-100" alt="Logo" />
                                <h4 className="text-4xl font-black text-white tracking-tighter">歡迎回來</h4>
                                <p className="text-xs text-white/40 font-bold uppercase tracking-widest">登入以持續您的靈感流動</p>
                            </div>
                            <div className="space-y-3">
                                <button className="w-full py-4 bg-white rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all">
                                    <div className="p-1.5 bg-slate-100 rounded-lg"><img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" /></div>
                                    <span className="text-sm font-black text-slate-800">使用 Google 帳號快速登入</span>
                                </button>
                                <button className="w-full py-4 bg-[#06C755] text-white rounded-2xl flex items-center justify-center gap-3 font-black shadow-lg hover:brightness-110 transition-all">
                                    <MessageCircle size={20} />
                                    <span className="text-sm">使用 LINE 帳號一鍵登入</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full w-fit text-[10px] font-black uppercase tracking-widest mb-4">
                            <ShieldCheck size={14} /> Security First
                        </div>
                        <h3 className="font-black text-slate-800 text-xl">Identity Specs</h3>
                        <p className="text-sm text-slate-600 font-bold leading-relaxed">
                            OAuth 登入統一使用 brand 圓角卡片 (32px)，登入頁面背景統一使用 Midnight Base 色系搭配 20% 高斯模糊背景。按鈕高度固定為 56px。
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ModuleAppLogic;
