
import React, { useState, useEffect, useRef } from 'react';
import { Category, PaperType } from '../types';
import { X, Plus, Edit3, ChevronDown, ImageIcon, LinkIcon, FileIcon, Type, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    onAdd: (text: string, categoryId: string, type: PaperType, url?: string) => void;
    initialCategory?: string;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose, categories, onAdd, initialCategory }) => {
    const [text, setText] = useState('');
    const [url, setUrl] = useState('');
    const [type, setType] = useState<PaperType>('text');
    const [selectedCat, setSelectedCat] = useState(categories[0]?.id || '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setText('');
            setUrl('');
            setType('text');
            if (initialCategory) {
                setSelectedCat(initialCategory);
            } else if (categories.length > 0 && !categories.find(c => c.id === selectedCat)) {
                setSelectedCat(categories[0].id);
            }
        }
        setIsDropdownOpen(false);
    }, [isOpen, initialCategory, categories]);

    const handleSubmit = () => {
        const content = type === 'text' ? text : (url || text);
        if (!content.trim()) return;
        onAdd(text, selectedCat, type, url);
        onClose();
    };

    if (!isOpen) return null;
    const selectedCategoryObj = categories.find(c => c.id === selectedCat) || categories[0];
    const categoryColor = selectedCategoryObj?.color || '#6366f1';

    const glassButtonStyle = {
        backgroundColor: categoryColor,
        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)',
        boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.4), 0 10px 20px -5px ${categoryColor}40`,
        border: '1px solid rgba(255,255,255,0.2)'
    };

    const types: { id: PaperType, icon: any, label: string }[] = [
        { id: 'text', icon: Type, label: '文字' },
        { id: 'image', icon: ImageIcon, label: '圖片' },
        { id: 'link', icon: LinkIcon, label: '連結' },
        { id: 'stock', icon: TrendingUp, label: '股市' },
        { id: 'file', icon: FileIcon, label: '檔案' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white/50 flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-[var(--border-light)] flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-3">
                        <div className="p-2 bg-[var(--primary)]/10 rounded-xl text-[var(--primary)]">
                            <Plus className="w-5 h-5" />
                        </div>
                        捕捉新點子
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Type Selector */}
                    <div className="flex p-1 bg-gray-100 rounded-2xl">
                        {types.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setType(t.id)}
                                className={`
                                    flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
                                    ${type === t.id ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-400 hover:text-gray-600'}
                                `}
                            >
                                <t.icon className="w-4 h-4" />
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-2 relative" ref={dropdownRef}>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">存放至欄位</label>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 border border-[var(--border-light)] rounded-2xl hover:border-[var(--primary)] transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedCategoryObj?.color }}></div>
                                <span className="font-bold text-sm">{selectedCategoryObj?.title}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-[var(--border-light)] rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto"
                                >
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => { setSelectedCat(cat.id); setIsDropdownOpen(false); }}
                                            className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm font-medium"
                                        >
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                            {cat.title}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Inputs based on type */}
                    <div className="space-y-4">
                        {(type === 'image' || type === 'link' || type === 'file') && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                    {type === 'image' ? '圖片網址' : type === 'link' ? '點擊跳轉網址' : type === 'stock' ? '股票代碼 (例如: 2330.TW, TSLA, BTCUSD)' : '檔案連結'}
                                </label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[var(--primary)] outline-none transition-all text-sm"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">內容描述</label>
                            <textarea
                                rows={type === 'text' ? 6 : 3}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={type === 'text' ? "在這裡寫下您的想法..." : type === 'stock' ? "輸入股票代碼..." : "為這張紙片添加一點備註..."}
                                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[var(--primary)] outline-none transition-all text-sm resize-none"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={!text.trim() && !url.trim()}
                        style={!text.trim() && !url.trim() ? {} : glassButtonStyle}
                        className={`
                            w-full py-4 rounded-2xl font-black transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest
                            ${!text.trim() && !url.trim() ? 'bg-gray-100 text-gray-400' : 'text-white hover:brightness-110 active:scale-95'}
                        `}
                    >
                        建立紙片
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AddNoteModal;