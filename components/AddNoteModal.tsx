import React, { useState, useEffect, useRef } from 'react';
import { Category } from '../types';
import { X, Plus, Edit3, ChevronDown } from 'lucide-react';

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    onAdd: (text: string, categoryId: string) => void;
    initialCategory?: string;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose, categories, onAdd, initialCategory }) => {
    const [text, setText] = useState('');
    const [selectedCat, setSelectedCat] = useState(categories[0]?.id || '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setText('');
            if (initialCategory) {
                setSelectedCat(initialCategory);
            } else if (categories.length > 0 && !categories.find(c => c.id === selectedCat)) {
                setSelectedCat(categories[0].id);
            }
        }
        setIsDropdownOpen(false);
    }, [isOpen, initialCategory, categories]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!text.trim()) return;
        onAdd(text, selectedCat);
        setText('');
        onClose();
    };

    const selectedCategoryObj = categories.find(c => c.id === selectedCat) || categories[0];

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#F2F4F7]/40 backdrop-blur-md" onClick={onClose} />

            <div className="w-full max-w-md p-8 relative animate-modal-in shadow-2xl glass-card !bg-white/95">
                <button onClick={onClose} className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors tap-feedback" title="關閉">
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-[var(--text-main)] mb-8 flex items-center gap-3">
                    <Edit3 className="w-6 h-6 text-[var(--primary)]" />
                    捕捉新點子
                </h3>

                <div className="space-y-6">
                    <div className="space-y-3 relative" ref={dropdownRef}>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold tracking-widest px-1">選擇類別</label>

                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex items-center justify-between bg-[var(--bg-main)] border border-[var(--border-light)] text-[var(--text-main)] text-sm py-4 px-5 rounded-2xl hover:border-[var(--primary)] transition-all shadow-sm tap-feedback"
                            title="展開類別選單"
                        >
                            <div className="flex items-center gap-3">
                                {selectedCategoryObj && (
                                    <>
                                        <div className="w-3 h-3 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: selectedCategoryObj.color }}></div>
                                        <span className="font-bold">{selectedCategoryObj.title}</span>
                                    </>
                                )}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#D1D8E0] rounded-xl shadow-xl z-50 max-h-[200px] overflow-y-auto custom-scrollbar animate-modal-in">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setSelectedCat(cat.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#F2F4F7] transition-colors border-b border-[#F2F4F7] last:border-0
                                            ${selectedCat === cat.id ? 'bg-[#F2F4F7] font-bold text-[#00af80]' : 'text-[#2D3436]'}
                                        `}
                                    >
                                        <div className="w-2.5 h-2.5 rounded-full ring-1 ring-black/5" style={{ backgroundColor: cat.color }}></div>
                                        {cat.title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold tracking-widest px-1">內容描述</label>
                        <textarea
                            rows={6}
                            placeholder="在這裡寫下您的想法..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-transparent rounded-2xl p-4 outline-none focus:bg-white focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(0,175,128,0.1)] transition-all resize-none placeholder-[var(--text-muted)] opacity-80 focus:opacity-100 text-sm leading-relaxed"
                            title="想法內容"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full py-4 bg-[var(--text-main)] text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl hover:-translate-y-1 tap-feedback"
                    >
                        <Plus className="w-5 h-5" /> 建立想法卡片
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNoteModal;