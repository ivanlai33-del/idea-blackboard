import React from 'react';
import { TRANSLATIONS, Lang } from './constants';

const SpecBrand: React.FC<{ lang: Lang }> = ({ lang }) => {
    const t = TRANSLATIONS[lang];

    const colorSpectrum = [
        { name: "Primary Lake", class: "bg-[#2DD4BF]", hex: "#2DD4BF", desc: "湖水綠 (Brand Primary)" },
        { name: "Lake Dark", class: "bg-[#0D9488]", hex: "#0D9488", desc: "深湖綠 (Primary Dark)" },
        { name: "Aura Violet", class: "bg-[#7C3AED]", hex: "#7C3AED", desc: "靈光紫 (Aura Core)" },
        { name: "Soft Rose", class: "bg-[#FB7185]", hex: "#FB7185", desc: "柔霧粉 (Secondary)" },
        { name: "Midnight Base", class: "bg-[#0f172a]", hex: "#0f172a", desc: "極夜黑 (Dark Theme)" },
        { name: "Aura Gradient", class: "bg-gradient-to-br from-[#7C3AED] via-[#2DD4BF] to-[#F43F5E]", hex: "Aura Multi", desc: "靈光漸層 (Core Multi)" }
    ];

    return (
        <div className="space-y-32">
            {/* 1. LOGO Section */}
            <section id="logo" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.sections.logo}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {['home', 'modal', 'col'].map((size, idx) => (
                        <div key={size} className="p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-6 group hover:shadow-xl transition-all">
                            <img src="/Lumos_logo.svg" alt="Logo" className={`${idx === 0 ? 'h-16' : idx === 1 ? 'h-10' : 'h-6'} object-contain`} />
                            <div className="text-center">
                                <p className="text-sm font-bold text-slate-600">{(t.logoDesc as any)[size]}</p>
                                <p className="text-[10px] text-slate-300 font-mono">H: {idx === 0 ? '64px' : idx === 1 ? '40px' : '24px'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. Typography */}
            <section id="typography" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.sections.typography}</h2>
                </div>
                <div className="space-y-8 p-12 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Heading 1 (Main Title)</span>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">{t.typo.h1}</h1>
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Heading 2 (Section Title)</span>
                        <h2 className="text-2xl font-black text-slate-700 tracking-tight">{t.typo.h2}</h2>
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Label / Caption</span>
                        <span className="block text-xs font-black text-slate-400 uppercase tracking-widest">{t.typo.label}</span>
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Body Text</span>
                        <p className="text-sm text-slate-600 leading-relaxed font-bold max-w-2xl">{t.typo.body}</p>
                    </div>
                </div>
            </section>

            {/* 3. Colors */}
            <section id="colors" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.sections.colors}</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    {colorSpectrum.map((color, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 hover:shadow-xl transition-all group">
                            <div className={`${color.class} aspect-video rounded-[24px] shadow-inner transform group-hover:scale-105 transition-all duration-500`} />
                            <div className="px-2">
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">{color.name}</h4>
                                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                                    <span>{color.hex}</span>
                                    <span className="font-sans font-bold text-slate-300">{color.desc}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 14. Aura Themes */}
            <section id="themes" className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-rose-500 pl-4">
                    <h2 className="text-2xl font-black text-slate-800">{t.sections.themes}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[48px] bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white space-y-4 shadow-xl border border-white/5 backdrop-blur-md">
                        <div className="h-8 w-24 bg-white/10 rounded-full" />
                        <h4 className="font-black text-xl">深邃極夜 (Midnight)</h4>
                        <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Base: #0f172a / Accent: Cyan-400</p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" />)}
                        </div>
                    </div>
                    <div className="p-8 rounded-[48px] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-slate-800 space-y-4 shadow-xl border border-slate-200">
                        <div className="h-8 w-24 bg-indigo-500/10 rounded-full" />
                        <h4 className="font-black text-xl">純白靈光 (Aura Light)</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Base: #f8fafc / Accent: Indigo-500</p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100" />)}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SpecBrand;
