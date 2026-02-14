import React from 'react';
import { TRANSLATIONS, Lang } from './constants';
import { MousePointer2, Smartphone, Tablet, Monitor, Sparkles } from 'lucide-react';

const SpecInteraction: React.FC<{ lang: Lang }> = ({ lang }) => {
    const t = TRANSLATIONS[lang];

    return (
        <div className="space-y-32">
            {/* 4. Button System */}
            <section id="buttons" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.sections.buttons}</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Primary Lake ( Pill Shape 1:1) */}
                    <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-6 flex flex-col items-center">
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Primary Action (Lake)</h3>
                        <button className="px-10 py-4 btn-primary-lake text-sm flex items-center gap-2">
                            <Sparkles size={16} /> 立即訂閱
                        </button>
                        <p className="text-[10px] text-slate-400 font-bold">Class: .btn-primary-lake (Gradient + Blur)</p>
                    </div>

                    {/* Secondary Ghost */}
                    <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-6 flex flex-col items-center">
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Secondary (Ghost)</h3>
                        <button className="px-10 py-4 bg-slate-50 text-slate-400 font-bold rounded-full hover:bg-slate-100 transition-all border border-slate-200 text-sm">
                            取消方案
                        </button>
                        <p className="text-[10px] text-slate-400 font-bold">Base: .bg-slate-50 / Hover: .bg-slate-100</p>
                    </div>

                    {/* Aura Special */}
                    <div className="p-8 bg-slate-900 rounded-[40px] shadow-xl space-y-6 flex flex-col items-center">
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Dark Mode Primary</h3>
                        <button className="px-10 py-4 bg-white text-teal-700 font-black rounded-full hover:bg-teal-50 transition-all shadow-xl text-sm">
                            開始試用
                        </button>
                        <p className="text-[10px] text-slate-500 font-bold">Base: .bg-white / Shadow: Intense</p>
                    </div>
                </div>
            </section>

            {/* 5. Interaction Rules */}
            <section id="interaction" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.sections.interaction}</h2>
                </div>
                <div className="p-12 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-8">
                    <div className="flex gap-12 text-slate-400">
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-slate-50 rounded-2xl"><MousePointer2 size={32} className="text-slate-300" /></div>
                            <p className="text-[10px] font-black uppercase tracking-widest">預設游標 (Default)</p>
                        </div>
                        <div className="flex flex-col items-center gap-3 text-indigo-500">
                            <div className="p-4 bg-indigo-50 rounded-2xl"><MousePointer2 size={32} className="text-indigo-500" /></div>
                            <p className="text-[10px] font-black uppercase tracking-widest">指觸游標 (Pointer)</p>
                        </div>
                    </div>
                    <div className="space-y-4 text-center">
                        <p className="text-sm text-slate-500 font-bold max-w-lg leading-relaxed">全站交互遵循「輕快彈性」原則。懸停物體時需具備 1.02x 的縮放動畫與強化的陰影反饋（Box-Shadow Spread）。</p>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-100" />)}
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Responsive Rules */}
            <section id="responsive" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.sections.responsive}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-10 bg-slate-50 rounded-[32px] flex flex-col items-center gap-4 border border-slate-200 group hover:bg-white hover:shadow-xl transition-all">
                        <Smartphone size={32} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        <div className="text-center">
                            <span className="block text-xs font-black uppercase">Mobile</span>
                            <span className="text-[10px] text-slate-400 font-mono tracking-tighter">&lt; 640px</span>
                        </div>
                    </div>
                    <div className="p-10 bg-slate-50 rounded-[32px] flex flex-col items-center gap-4 border border-slate-200 group hover:bg-white hover:shadow-xl transition-all">
                        <Tablet size={32} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        <div className="text-center">
                            <span className="block text-xs font-black uppercase">Tablet</span>
                            <span className="text-[10px] text-slate-400 font-mono tracking-tighter">640px - 1024px</span>
                        </div>
                    </div>
                    <div className="p-10 bg-slate-50 rounded-[32px] flex flex-col items-center gap-4 border border-slate-200 group hover:bg-white hover:shadow-xl transition-all">
                        <Monitor size={32} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        <div className="text-center">
                            <span className="block text-xs font-black uppercase">Desktop</span>
                            <span className="text-[10px] text-slate-400 font-mono tracking-tighter">&gt; 1024px</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SpecInteraction;
