import React, { useState, useRef, useEffect } from 'react';
import { Category } from '../types';
import { X, Trash2, Plus, Sliders, ChevronDown } from 'lucide-react';

interface ConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    onUpdateCategory: (id: string, field: keyof Category, value: string) => void;
    onAddCategory: (title: string, icon: string) => void;
    onRemoveCategory: (id: string) => void;
}

// Curated list of Memoji-like or clear object icons including people
const ICONS = [
    '💡', '🔎', '🚀', '📂', '🎯', '🎨', '📝', '📅',
    '🔥', '✨', '🎉', '🤖', '👻', '🦄', '🧠', '👀',
    '👨‍💻', '👩‍🚀', '🏆', '🧩', '🎤', '🎧', '📷', '🛒',
    '😀', '😎', '🤓', '🤠', '🥳', '🥶', '🤯', '🤔',
    '👶', '👧', '🧒', '👦', '👩', '🧑', '👨',
    '👵', '🧓', '👴', '👲', '👳', '🧕',
    '👮', '👷', '💂', '🕵️', '👩‍⚕️', '👨‍⚕️',
    '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓',
    '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭',
    '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧',
    '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒',
    '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍⚖️', '👨‍⚖️',
    '👰', '🤵', '👸', '🤴', '🦸', '🦹', '🤶', '🎅',
    '🧙', '🧝', '🧛', '🧟', '🧞', '🧜', '🧚',
];

const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, categories, onUpdateCategory, onAddCategory, onRemoveCategory }) => {
    const [newCatTitle, setNewCatTitle] = useState('');
    const [newCatIcon, setNewCatIcon] = useState(ICONS[0]);

    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [activePickerIndex, setActivePickerIndex] = useState<number | 'new' | null>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsIconPickerOpen(false);
                setActivePickerIndex(null);
            }
        };

        if (isIconPickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isIconPickerOpen]);

    if (!isOpen) return null;

    const handleIconSelect = (icon: string) => {
        if (activePickerIndex === 'new') {
            setNewCatIcon(icon);
        } else if (typeof activePickerIndex === 'number') {
            const catId = categories[activePickerIndex]?.id;
            if (catId) onUpdateCategory(catId, 'icon', icon);
        }
        setIsIconPickerOpen(false);
        setActivePickerIndex(null);
    };

    const openPicker = (index: number | 'new') => {
        setActivePickerIndex(index);
        setIsIconPickerOpen(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#F2F4F7]/40 backdrop-blur-md" onClick={onClose} />

            <div className="w-full max-w-lg flex flex-col max-h-[80vh] animate-modal-in overflow-hidden glass-card !bg-white/90 shadow-2xl !p-0 relative">
                <div className="p-6 border-b border-[var(--border-light)] flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-[var(--primary)]" />
                        欄位配置
                    </h3>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors tap-feedback" title="關閉">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-3 custom-scrollbar flex-grow bg-[var(--bg-main)]/30 relative min-h-[300px]">
                    {categories.map((cat, idx) => (
                        <div key={cat.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[var(--border-light)] shadow-sm hover:border-[var(--primary)]/50 transition-all group/item">

                            <button
                                onClick={() => openPicker(idx)}
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl hover:bg-black/5 transition-colors border border-transparent tap-feedback"
                                title="更換圖示"
                            >
                                {cat.icon || '📌'}
                            </button>

                            <div className="h-8 w-px bg-[var(--border-light)] mx-1"></div>

                            <input
                                type="color"
                                value={cat.color}
                                onChange={(e) => onUpdateCategory(cat.id, 'color', e.target.value)}
                                className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer p-0"
                                title="選擇顏色"
                            />
                            <input
                                type="text"
                                value={cat.title}
                                onChange={(e) => onUpdateCategory(cat.id, 'title', e.target.value)}
                                className="flex-grow bg-transparent outline-none text-[var(--text-main)] text-sm font-bold border-b border-transparent focus:border-[var(--primary)]"
                                title="欄位名稱"
                            />
                            <button
                                onClick={() => onRemoveCategory(cat.id)}
                                className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors tap-feedback"
                                title="刪除欄位"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-[var(--border-light)] bg-white flex gap-3 relative z-10">
                    <button
                        onClick={() => openPicker('new')}
                        className="w-10 h-10 rounded-xl bg-[var(--bg-main)] flex items-center justify-center text-xl hover:bg-[var(--border-light)] transition-colors border border-transparent tap-feedback shrink-0"
                        title="選擇圖示"
                    >
                        {newCatIcon}
                    </button>

                    <input
                        type="text"
                        placeholder="新欄位名稱..."
                        value={newCatTitle}
                        onChange={(e) => setNewCatTitle(e.target.value)}
                        className="flex-grow bg-[var(--bg-main)] border-none text-[var(--text-main)] rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all font-medium text-sm"
                    />
                    <button
                        onClick={() => {
                            if (newCatTitle.trim()) {
                                onAddCategory(newCatTitle.trim(), newCatIcon);
                                setNewCatTitle('');
                                setNewCatIcon(ICONS[Math.floor(Math.random() * ICONS.length)]);
                            }
                        }}
                        className="px-6 py-2 bg-[var(--text-main)] text-white rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shrink-0 tap-feedback"
                    >
                        <Plus className="w-4 h-4" /> 新增
                    </button>
                </div>

                {/* Icon Picker Popover */}
                {isIconPickerOpen && (
                    <div
                        ref={pickerRef}
                        className="absolute bottom-24 left-6 z-50 p-4 bg-white rounded-[32px] shadow-2xl border border-[var(--border-light)] w-[340px] animate-modal-in"
                    >
                        <div className="grid grid-cols-6 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                            {ICONS.map((icon, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleIconSelect(icon)}
                                    className="w-11 h-11 flex items-center justify-center text-xl hover:bg-[var(--bg-main)] rounded-xl transition-all tap-feedback hover:scale-110 active:scale-90"
                                    title={`選擇 ${icon}`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfigModal;