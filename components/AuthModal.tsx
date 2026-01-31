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

    const handleMockLogin = (provider: 'Google' | 'Line' | 'Email') => {
        // Simulating the Clerk login process
        const mockUser: User = {
            id: `usr_${Date.now()}`,
            email: email || `${provider.toLowerCase()}@example.com`,
            name: provider === 'Email' ? 'User' : `${provider} User`,
            avatar: provider === 'Google' ? 'https://lh3.googleusercontent.com/a/default-user' : undefined,
            tier: 'Free',
            provider
        };
        onLogin(mockUser);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-md glass-card bg-white/95 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-8 text-center bg-gradient-to-b from-[var(--primary)]/5 to-transparent">
                    <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-xl">I</div>
                    <h2 className="text-2xl font-bold text-[var(--text-main)]">
                        {view === 'login' ? '歡迎回來' : '加入 IdeaFlow'}
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
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-[var(--border-light)] rounded-xl font-bold text-[var(--text-main)] hover:bg-[var(--bg-main)] transition-all tap-feedback"
                        >
                            <Chrome className="w-5 h-5 text-blue-500" />
                            使用 Google 帳號登入
                        </button>
                        <button
                            onClick={() => handleMockLogin('Line')}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#06C755] text-white rounded-xl font-bold hover:bg-[#05b34c] transition-all shadow-md tap-feedback"
                        >
                            <MessageCircle className="w-5 h-5" />
                            使用 LINE 帳號登入
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-light)]"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-[var(--text-muted)]">或使用電子郵件</span></div>
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
                                className="w-full pl-11 pr-4 py-3 bg-[var(--bg-main)] border-none rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="password"
                                placeholder="密碼"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-[var(--bg-main)] border-none rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-sm"
                            />
                        </div>
                        <button
                            onClick={() => handleMockLogin('Email')}
                            className="w-full py-3 bg-[var(--text-main)] text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg tap-feedback"
                        >
                            {view === 'login' ? '立即登入' : '註冊帳號'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
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
