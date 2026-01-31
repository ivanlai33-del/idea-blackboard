import React from 'react';
import { ArrowRight, CheckCircle2, Users, Home, Briefcase, Zap } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    return (
        <div className="bg-[var(--bg-main)] min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-[var(--border-light)]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white font-bold">I</div>
                    <span className="text-xl font-bold text-[var(--text-main)]">IdeaFlow AI</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-muted)]">
                    <a href="#solutions" className="hover:text-[var(--primary)] transition-colors">解決方案</a>
                    <a href="#features" className="hover:text-[var(--primary)] transition-colors">產品功能</a>
                    <a href="#pricing" className="hover:text-[var(--primary)] transition-colors">訂閱方案</a>
                </div>
                <button
                    onClick={onStart}
                    className="px-6 py-2 bg-[var(--text-main)] text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg tap-feedback"
                >
                    立即登入
                </button>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-xs animate-pulse-primary">
                            <Zap className="w-4 h-4" /> 新一代智能工作白板
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-[var(--text-main)] leading-[1.1]">
                            讓亂成一團的想法，<br />
                            <span className="text-[var(--primary)]">一鍵變成專業報告</span>
                        </h1>
                        <p className="text-xl text-[var(--text-muted)] max-w-lg">
                            IdeaFlow AI 協助您捕捉靈感、自動歸納，並運用 AI 轉化為專業報告。支持 Google、LINE 與 Email 快速登入，隨時隨地同步您的創意。
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={onStart}
                                className="px-8 py-4 bg-[var(--primary)] text-white rounded-2xl font-bold text-lg hover:bg-[var(--primary-hover)] transition-all shadow-xl flex items-center gap-2 group tap-feedback"
                            >
                                立即開始 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-white text-[var(--text-main)] border border-[var(--border-light)] rounded-2xl font-bold text-lg hover:bg-[var(--bg-main)] transition-all tap-feedback">
                                訂閱方案
                            </button>
                        </div>
                    </div>
                    {/* Hero Visual Block */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] opacity-10 blur-3xl rounded-[40px] group-hover:opacity-20 transition-opacity"></div>
                        <div className="glass-card aspect-[4/3] w-full flex flex-col p-6 overflow-hidden border border-white/50 shadow-2xl skew-y-1 group-hover:skew-y-0 transition-transform duration-500">
                            {/* Mock Workspace Interior */}
                            <div className="flex gap-4 mb-4">
                                <div className="w-24 h-4 bg-[var(--border-light)] rounded-full"></div>
                                <div className="w-16 h-4 bg-[var(--border-light)] opacity-50 rounded-full"></div>
                                <div className="ml-auto w-8 h-8 bg-[var(--secondary)] rounded-full opacity-20"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 flex-grow">
                                <div className="p-4 bg-white/40 rounded-2xl space-y-3">
                                    <div className="w-full h-12 bg-[var(--primary)]/10 rounded-xl shimmer-bg"></div>
                                    <div className="w-2/3 h-4 bg-[var(--border-light)] rounded-full"></div>
                                    <div className="w-full h-4 bg-[var(--border-light)] rounded-full"></div>
                                </div>
                                <div className="p-4 bg-white/40 rounded-2xl space-y-3">
                                    <div className="w-full h-12 bg-[var(--secondary)]/10 rounded-xl shimmer-bg"></div>
                                    <div className="w-full h-4 bg-[var(--border-light)] rounded-full"></div>
                                    <div className="w-1/2 h-4 bg-[var(--border-light)] rounded-full"></div>
                                </div>
                            </div>
                            <div className="mt-4 p-4 bg-[var(--text-main)] rounded-2xl text-white/90 text-sm font-mono shimmer-bg relative overflow-hidden">
                                <div className="relative z-10">AI 正在生成您的專案報告...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solutions Grid */}
            <section id="solutions" className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-bold text-[var(--text-main)]">無論是誰，都能找到專屬用法</h2>
                        <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
                            我們設計了針對不同生活與工作情境的 AI 專才，讓您的白板不僅僅是記錄，更是執行的起點。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Home className="text-pink-500" />, title: '家庭生活', desc: '旅行計畫、家務排程、預算分配預算分配。', color: 'bg-pink-50' },
                            { icon: <Briefcase className="text-blue-500" />, title: '職場團隊', desc: '會議記錄、專案衝刺、年度週報。', color: 'bg-blue-50' },
                            { icon: <Users className="text-purple-500" />, title: '社團活動', desc: '物資清單、企劃案、交接紀錄。', color: 'bg-purple-50' },
                            { icon: <Zap className="text-yellow-500" />, title: '個人創意', desc: '腦力激盪、學習筆記、日報總結。', color: 'bg-yellow-50' }
                        ].map((item, idx) => (
                            <div key={idx} className="p-8 rounded-[32px] bg-white border border-[var(--border-light)] hover:border-[var(--primary)] hover:shadow-xl transition-all group tap-feedback">
                                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-main)] mb-3">{item.title}</h3>
                                <p className="text-[var(--text-muted)] text-sm mb-6">{item.desc}</p>
                                <div className="flex items-center gap-2 text-[var(--primary)] font-bold text-sm">
                                    立即開始 <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section (SAAS Integration) */}
            <section id="pricing" className="py-24 px-6 bg-[var(--bg-main)]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-bold text-[var(--text-main)]">選擇適合您的方案</h2>
                        <p className="text-[var(--text-muted)] text-lg">解鎖強大的 AI 能力，讓效率翻倍。</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: '免費版', price: '$0', features: ['3 個看板', '基本 AI 總結', '單人使用'] },
                            { name: '專業版', price: '$299', per: '/月', features: ['無限看板', '深度報告產出', 'AI 創意練習', '優先技術支援'], highlight: true },
                            { name: '團隊版', price: '$999', per: '/月', features: ['共享空間', '多人協力編輯', '管理員後台', '專屬客服'] }
                        ].map((plan, idx) => (
                            <div key={idx} className={`p-10 rounded-[40px] border transition-all ${plan.highlight ? 'bg-[var(--text-main)] text-white shadow-2xl scale-105 border-[var(--primary)]' : 'bg-white text-[var(--text-main)] border-[var(--border-light)] hover:shadow-xl'}`}>
                                <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                                <div className="text-4xl font-bold mb-6">{plan.price}<span className="text-lg opacity-60 font-normal">{plan.per}</span></div>
                                <ul className="space-y-4 mb-10">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm opacity-80">
                                            <CheckCircle2 className={`w-5 h-5 ${plan.highlight ? 'text-[var(--primary)]' : 'text-[var(--primary)]'}`} /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={onStart}
                                    className={`w-full py-4 rounded-2xl font-bold transition-all tap-feedback ${plan.highlight ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]' : 'bg-[var(--bg-main)] text-[var(--text-main)] hover:bg-[var(--border-light)]'}`}
                                >
                                    立即訂閱
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto glass-card p-12 text-center bg-[var(--text-main)] !bg-opacity-100 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] opacity-20 blur-[100px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--secondary)] opacity-10 blur-[100px] -ml-32 -mb-32"></div>

                    <h2 className="text-4xl font-bold mb-6 relative z-10">準備好體驗下一代的工作流程了嗎？</h2>
                    <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto relative z-10">
                        加入 10,000+ 位使用者，使用 Google 或 LINE 一鍵登入，開始將雜亂的想法轉化為實質成果。
                    </p>
                    <button
                        onClick={onStart}
                        className="px-10 py-4 bg-[var(--primary)] text-white rounded-2xl font-bold text-xl hover:bg-[var(--primary-hover)] transition-all shadow-2xl relative z-10"
                    >
                        開始免費試用
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-[var(--border-light)] text-center text-[var(--text-muted)] text-sm">
                <p>© 2026 IdeaFlow AI. All rights reserved. 讓創意流動，讓成果發生。</p>
            </footer>
        </div>
    );
};

export default LandingPage;
