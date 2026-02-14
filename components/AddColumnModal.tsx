import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (title: string, color: string, icon: string) => void;
}

// Helper to convert hex to rgba for glass effects
const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const AddColumnModal: React.FC<AddColumnModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('#ef4444');
    const [icon, setIcon] = useState('💡');

    const colors = [
        '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
        '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
        '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b'
    ];

    const icons = [
        '💡', '🔎', '🚀', '📂', '📝', '✨', '🎯', '🔥', '📌', '🎨', '🛒', '📅', '❓', '✅',
        '⏰', '🛠️', '🏗️', '🧠', '💬', '📧', '🔗', '📁', '📈', '📉', '📊', '📋', '📓', '📕',
        '📘', '📙', '📔', '🔐', '🛡️', '⚙️', '📡', '🔋', '💻', '📱', '🕹️', '🌍'
    ];

    const handleSubmit = () => {
        if (!title.trim()) return;
        onAdd(title, color, icon);
        onClose();
        setTitle('');
        setColor('#ef4444');
        setIcon('💡');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white/50"
                >
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-xl shadow-inner border border-teal-100/50">
                                {icon}
                            </div>
                            <h3 className="text-xl font-bold text-black/80">
                                增加欄位
                            </h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">欄位名稱</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="例如：待辦事項"
                                className="w-full p-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                autoFocus
                            />
                        </div>

                        {/* Color Picker */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">標籤顏色</label>
                            <div className="grid grid-cols-6 gap-3">
                                {colors.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={`w-9 h-9 rounded-full transition-all flex items-center justify-center ${color === c ? 'shadow-[inset_0_3px_6px_rgba(0,0,0,0.3)] scale-95' : 'hover:scale-105 shadow-sm'}`}
                                        style={{ backgroundColor: c }}
                                    >
                                        {color === c && <div className="w-2 h-2 rounded-full bg-white/40" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Icon Picker */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">圖示</label>
                            <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {icons.map(i => (
                                    <button
                                        key={i}
                                        onClick={() => setIcon(i)}
                                        className={`w-10 h-10 flex items-center justify-center text-lg rounded-xl transition-all ${icon === i ? 'bg-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] scale-95' : 'hover:bg-gray-50'}`}
                                    >
                                        {i}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!title.trim()}
                            className="w-full py-4 rounded-2xl text-white text-lg font-black flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
                            style={{
                                background: `linear-gradient(135deg, ${color}, ${hexToRgba(color, 0.8)})`,
                                boxShadow: `0 8px 20px -4px ${hexToRgba(color, 0.4)}`,
                                border: `1px solid ${hexToRgba('#ffffff', 0.2)}`
                            }}
                        >
                            <Plus className="w-5 h-5" />
                            新增
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddColumnModal;
