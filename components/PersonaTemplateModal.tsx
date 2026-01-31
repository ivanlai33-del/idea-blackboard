import React from 'react';
import { PERSONA_PRESETS, PersonaPreset } from '../constants/personaPresets';
import { X, Check } from 'lucide-react';

interface PersonaTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (template: PersonaPreset) => void;
}

const PersonaTemplateModal: React.FC<PersonaTemplateModalProps> = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-4xl max-h-[90vh] glass-card overflow-hidden bg-white/90 flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 border-b border-[var(--border-light)] flex items-center justify-between bg-gradient-to-r from-[var(--primary)]/10 to-transparent">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-main)]">選擇您的身份裝備</h2>
                        <p className="text-sm text-[var(--text-muted)] mt-1">選擇一個預設模組來自動規劃您的初始白板，或是稍後自行定義。</p>
                    </div>
                    <button onClick={onClose} title="關閉" className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X className="w-6 h-6 text-[var(--text-muted)]" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PERSONA_PRESETS.map((preset) => (
                            <div
                                key={preset.name}
                                onClick={() => onSelect(preset)}
                                className="group relative flex flex-col p-5 rounded-3xl border-2 border-[var(--border-light)] hover:border-[var(--primary)] hover:shadow-xl transition-all cursor-pointer bg-white/50 tap-feedback"
                            >
                                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{preset.icon}</div>
                                <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">{preset.name}</h3>
                                <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-4">{preset.context}</p>

                                <div className="mt-auto flex flex-wrap gap-1">
                                    {preset.columns.map((col, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 rounded-full text-[10px] bg-white border border-[var(--border-light)] text-[var(--text-muted)]"
                                        >
                                            {col.icon} {col.title}
                                        </span>
                                    ))}
                                </div>

                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white">
                                        <Check className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Custom / Empty Template */}
                        <div
                            onClick={() => onSelect({
                                type: 'Custom',
                                name: '自定義身份',
                                icon: '🎭',
                                context: '從零開始構建您的專屬白板。',
                                columns: [{ title: '主看板', icon: '📌', color: '#00af80' }]
                            })}
                            className="flex flex-col p-5 rounded-3xl border-2 border-dashed border-[var(--border-light)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all cursor-pointer items-center justify-center text-center tap-feedback"
                        >
                            <div className="text-4xl mb-2 opacity-50">＋</div>
                            <h3 className="text-lg font-bold">自定義起始</h3>
                            <p className="text-xs opacity-70">手動打造每個細節</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-[var(--bg-main)] text-center">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">IdeaFlow® 專業身份模組庫</p>
                </div>
            </div>
        </div>
    );
};

export default PersonaTemplateModal;
