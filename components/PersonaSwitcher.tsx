import React from 'react';
import { Persona } from '../types';
import { User, Plus, GraduationCap, Briefcase, HeartPulse, Palette, Home, UserCheck } from 'lucide-react';

interface PersonaSwitcherProps {
    personas: Persona[];
    activePersonaId: string;
    onSelect: (id: string) => void;
    onAdd: () => void;
}

const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ personas, activePersonaId, onSelect, onAdd }) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'Student': return <GraduationCap className="w-5 h-5" />;
            case 'Teacher': return <UserCheck className="w-5 h-5" />;
            case 'Employee': return <Briefcase className="w-5 h-5" />;
            case 'Doctor': return <HeartPulse className="w-5 h-5" />;
            case 'Designer': return <Palette className="w-5 h-5" />;
            case 'Housewife': return <Home className="w-5 h-5" />;
            default: return <User className="w-5 h-5" />;
        }
    };

    return (
        <div className="flex flex-col gap-3 p-4 glass-card h-full w-20 sm:w-64">
            <div className="mb-4">
                <h3 className="hidden sm:block text-xs font-mono text-[var(--text-muted)] uppercase font-bold tracking-widest px-2">切換身份</h3>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1">
                {personas.map(p => (
                    <button
                        key={p.id}
                        onClick={() => onSelect(p.id)}
                        className={`
                            group flex items-center gap-3 p-3 rounded-2xl transition-all tap-feedback
                            ${activePersonaId === p.id
                                ? 'bg-[var(--primary)] text-white shadow-lg scale-105'
                                : 'bg-white/50 text-[var(--text-main)] hover:bg-white border border-[var(--border-light)]'
                            }
                        `}
                        title={p.name}
                    >
                        <div className={`p-2 rounded-xl ${activePersonaId === p.id ? 'bg-white/20' : 'bg-[var(--bg-main)]'}`}>
                            {getIcon(p.type)}
                        </div>
                        <div className="hidden sm:flex flex-col items-start overflow-hidden">
                            <span className="text-sm font-bold truncate w-full">{p.name}</span>
                            <span className={`text-[10px] opacity-70 ${activePersonaId === p.id ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                                {p.type === 'Custom' ? '自定義模式' : `${p.type} 檔案`}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            <button
                onClick={onAdd}
                className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-2xl border-2 border-dashed border-[var(--border-light)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all tap-feedback"
            >
                <div className="p-2 bg-[var(--bg-main)] rounded-xl group-hover:bg-[var(--primary)]/10">
                    <Plus className="w-5 h-5" />
                </div>
                <span className="hidden sm:block text-sm font-bold">新增身份</span>
            </button>
        </div>
    );
};

export default PersonaSwitcher;
