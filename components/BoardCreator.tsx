
import React, { useState, useEffect } from 'react';
import { X, RefreshCw, ChevronRight, Hash, Type } from 'lucide-react';
import { BOARD_TEMPLATES, GREY_ICONS, BoardTemplate } from '../constants/boardTemplates';
import { Board } from '../types';

interface BoardCreatorProps {
    onClose: () => void;
    onCreate: (board: Omit<Board, 'id'>, columns: any[]) => void;
}

const INTRO_VARIANTS = [
    "從推薦範本快速開始，或建立自定義空間",
    "釋放你的創意潛能，從一個空白畫布或精選範本開始",
    "將混亂的想法轉化為清晰的行動，選擇最適合你的工作流",
    "不管是專案管理還是靈感收集，這裡是你最佳的起點",
    "打造專屬於你的思考空間，讓每個點子都能發光發熱"
];

const BoardCreator: React.FC<BoardCreatorProps> = ({ onClose, onCreate }) => {
    const [step, setStep] = useState<'select' | 'custom'>('select');
    const [randomTemplates, setRandomTemplates] = useState<BoardTemplate[]>([]);
    const [customName, setCustomName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('📋');
    const [introText, setIntroText] = useState(INTRO_VARIANTS[0]);

    // Shuffle and pick 5 templates on mount
    useEffect(() => {
        refreshTemplates();
        setIntroText(INTRO_VARIANTS[Math.floor(Math.random() * INTRO_VARIANTS.length)]);
    }, []);

    const refreshTemplates = () => {
        const shuffled = [...BOARD_TEMPLATES].sort(() => 0.5 - Math.random());
        setRandomTemplates(shuffled.slice(0, 6)); // Show 6 templates
    };

    const handleSelectTemplate = (template: BoardTemplate) => {
        onCreate(
            { name: template.name, icon: template.icon, color: template.color, persona: template.name },
            template.columns.map((c, idx) => ({ ...c, id: `cat-${Date.now()}-${idx}` }))
        );
    };

    const handleCreateCustom = () => {
        if (!customName.trim()) return;
        onCreate(
            { name: customName, icon: selectedIcon, color: '#64748b' },
            [
                { title: '待辦事項', color: '#64748b', icon: '📝' },
                { title: '進行中', color: '#94a3b8', icon: '⏳' },
                { title: '已完成', color: '#cbd5e1', icon: '✅' }
            ]
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl overflow-hidden border border-white/50 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-[var(--border-light)]">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-main)]">創立你的白板</h2>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            {step === 'select' ? introText : '設定您的專屬工作區'}
                        </p>
                    </div>
                    <button onClick={onClose} type="button" className="p-2 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {step === 'select' ? (
                        <div className="flex flex-col gap-6">
                            {/* Template Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {randomTemplates.map((t, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelectTemplate(t)}
                                        className="
                                            flex items-center gap-4 p-4 rounded-3xl bg-white border border-[var(--border-light)] 
                                            hover:border-[var(--primary)] hover:shadow-xl hover:shadow-[var(--primary)]/10 
                                            active:scale-95
                                            transition-all group text-left animate-in slide-in-from-bottom-4
                                        "
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <div className="text-4xl p-3 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">
                                            {t.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[var(--text-main)]">{t.name}</h4>
                                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                                                {t.columns.length} 個預設欄位
                                            </p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[var(--primary)]" />
                                    </button>
                                ))}
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={refreshTemplates}
                                className="flex items-center justify-center gap-2 self-center px-4 py-2 rounded-full text-sm font-bold text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                換一組看看
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8 animate-in slide-in-from-right-8 duration-500">
                            {/* Name Input */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <Type className="w-4 h-4" /> 白板名稱
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    placeholder="例如：下半年發展計畫..."
                                    className="w-full text-xl p-4 rounded-2xl border border-[var(--border-light)] focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none"
                                />
                            </div>

                            {/* Icon Picker */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <Hash className="w-4 h-4" /> 選擇圖標
                                </label>
                                <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                                    {GREY_ICONS.map(icon => (
                                        <button
                                            key={icon}
                                            onClick={() => setSelectedIcon(icon)}
                                            className={`
                                                aspect-square flex items-center justify-center text-3xl rounded-2xl transition-all relative overflow-hidden
                                                ${selectedIcon === icon
                                                    ? 'bg-gradient-to-br from-cyan-400 to-teal-600 text-white scale-110 shadow-[0_8px_20px_-4px_rgba(45,212,191,0.5)]'
                                                    : 'bg-white border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/50'}
                                            `}
                                        >
                                            {selectedIcon === icon && (
                                                <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
                                            )}
                                            <span className="relative z-10">{icon}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Footer */}
                <div className="p-6 border-t border-[var(--border-light)] bg-gray-50/50 flex gap-3">
                    {step === 'custom' && (
                        <button
                            onClick={() => setStep('select')}
                            className="px-6 py-3 rounded-2xl font-bold text-[var(--text-muted)] hover:bg-white transition-colors"
                        >
                            返回
                        </button>
                    )}
                    <button
                        disabled={step === 'custom' && !customName.trim()}
                        onClick={() => step === 'select' ? setStep('custom') : handleCreateCustom()}
                        className={`
                            flex-1 py-4 rounded-2xl font-bold transition-all relative overflow-hidden group/btn
                            ${step === 'custom' && !customName.trim()
                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none border border-gray-200'
                                : 'bg-gradient-to-r from-cyan-400 to-teal-600 text-white shadow-[0_12px_24px_-6px_rgba(45,212,191,0.5)] hover:shadow-[0_16px_32px_-8px_rgba(45,212,191,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'
                            }
                        `}
                    >
                        {/* Shimmer Effect */}
                        {!(step === 'custom' && !customName.trim()) && (
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                        )}
                        <span className="relative z-10">
                            {step === 'select' ? '進入自定義模式' : '建立專案白板'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BoardCreator;
