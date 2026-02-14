import React, { useState } from 'react';
import { X, Mail, Chrome, MessageCircle, Lock, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [view, setView] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleMockLogin = (provider: 'Google' | 'Line' | 'Email', tier: 'Free' | 'Pro' = 'Pro') => {
        // Simulating the Clerk login process
        const mockUser: User = {
            id: `usr_${Date.now()}`,
            email: email || `${provider.toLowerCase()}@example.com`,
            name: provider === 'Email' ? (tier === 'Pro' ? 'Pro User' : 'Free User') : `${provider} User`,
            avatar: provider === 'Google' ? 'https://lh3.googleusercontent.com/a/default-user' : undefined,
            tier: tier,
            provider
        };
        onLogin(mockUser);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-white/45 backdrop-blur-2xl border border-white/50 shadow-[0_50px_100px_-12px_rgba(0,0,0,0.5)] rounded-[32px] overflow-hidden animate-in fade-in zoom-in duration-300 ring-1 ring-white/60">
                {/* Header */}
                <div className="p-8 text-center bg-gradient-to-b from-[var(--primary)]/5 to-transparent">
                    <img src="/Lumos_logo.svg" className="h-16 mx-auto mb-4 object-contain" alt="Lumos Logo" />
                    <h2 className="text-2xl font-bold gradient-text">
                        {view === 'login' ? '歡迎回來' : '加入 Lumos'}
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-2">
                        {view === 'login' ? '登入以持續您的靈感流動' : '開始捕捉您的下一個偉大點子'}
                    </p>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:bg-black/5 rounded-full" title="關閉">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Social Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleMockLogin('Google')}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 btn-primary-lake group relative"
                        >
                            <div className="w-5 h-5 bg-white rounded flex items-center justify-center shadow-sm">
                                <img src="https://www.google.com/favicon.ico" className="w-3.5 h-3.5" alt="Google" />
                            </div>
                            <span>使用 Google 帳號登入</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => handleMockLogin('Line')}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#E2F9E2] text-[#00B900] rounded-xl font-bold border border-[#00B900]/20 hover:bg-[#D1F2D1] transition-all tap-feedback"
                        >
                            <MessageCircle className="w-5 h-5" />
                            使用 LINE 帳號登入
                        </button>
                    </div>

                    <div className="relative flex items-center gap-4 py-2">
                        <div className="h-px bg-gray-300/40 w-full" />
                        <span className="text-xs text-gray-600/80 font-medium whitespace-nowrap">或使用電子郵件</span>
                        <div className="h-px bg-gray-300/40 w-full" />
                    </div>

                    {/* Email Form */}
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="email"
                                placeholder="電子郵件"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white/50 border border-white/50 rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm font-medium text-gray-700 placeholder:text-gray-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleMockLogin('Email', 'Free')}
                                className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all border border-gray-200"
                            >
                                免費版登入
                            </button>
                            <button
                                onClick={() => handleMockLogin('Email', 'Pro')}
                                className="py-3 px-4 btn-primary-lake text-sm"
                            >
                                專業版登入
                            </button>
                        </div>
                    </div>

                    {/* Footer Toggle */}
                    <p className="text-center text-sm text-[var(--text-muted)]">
                        {view === 'login' ? '還沒有帳號？' : '已經有帳號？'}
                        <button
                            onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                            className="ml-1 text-[var(--primary)] font-bold hover:underline"
                        >
                            {view === 'login' ? '立即註冊' : '登入帳號'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
