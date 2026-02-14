
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, X, RotateCcw, Trash2, Search, Filter, Calendar } from 'lucide-react';
import { useBoard } from '../context/BoardContext';
import { Paper, Category } from '../types';

interface ArchiveModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ArchiveModal: React.FC<ArchiveModalProps> = ({ isOpen, onClose }) => {
    const { papers, categories, unarchivePaper, unarchiveCategory, deletePaper, deleteCategory } = useBoard();
    const [activeTab, setActiveTab] = useState<'papers' | 'categories'>('papers');
    const [searchQuery, setSearchQuery] = useState('');

    const archivedPapers = papers.filter(p => p.isStored);
    const archivedCategories = categories.filter(c => c.isStored);

    const filteredPapers = archivedPapers.filter(p =>
        p.text.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => (b.archivedAt || 0) - (a.archivedAt || 0));

    const filteredCategories = archivedCategories.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => (b.archivedAt || 0) - (a.archivedAt || 0));

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return '未知時間';
        return new Date(timestamp).toLocaleString('zh-TW', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                >
                    {/* Header */}
                    <div className="p-8 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                                <Archive size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">收納箱</h2>
                                <p className="text-gray-500 text-sm font-medium">檢視並管理所有已收納的靈感與欄位</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-gray-100 rounded-2xl transition-all active:scale-90 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Toolbar */}
                    <div className="px-8 py-4 bg-white flex flex-col md:flex-row gap-4 items-center border-b border-gray-50">
                        <div className="flex bg-gray-100 p-1 rounded-2xl w-full md:w-auto">
                            <button
                                onClick={() => setActiveTab('papers')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'papers'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                已收納卡片 ({archivedPapers.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('categories')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'categories'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                已收納欄位 ({archivedCategories.length})
                            </button>
                        </div>

                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder={`搜尋已收納的${activeTab === 'papers' ? '卡片' : '欄位'}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 text-sm font-medium placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/30">
                        {activeTab === 'papers' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredPapers.length > 0 ? (
                                    filteredPapers.map(paper => (
                                        <div
                                            key={paper.id}
                                            className="group bg-white border border-gray-100 rounded-3xl p-5 hover:shadow-xl hover:shadow-gray-200/50 transition-all flex flex-col gap-4"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
                                                    <Calendar size={12} className="text-gray-400" />
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        收納於 {formatDate(paper.archivedAt)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => unarchivePaper(paper.id)}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors tooltip"
                                                        title="恢復到白板"
                                                    >
                                                        <RotateCcw size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('確定要永久刪除這張卡片嗎？此動作無法復原。')) {
                                                                deletePaper(paper.id);
                                                            }
                                                        }}
                                                        className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                                                        title="永久刪除"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 font-medium">
                                                {paper.text}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState type="卡片" />
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map(category => (
                                        <div
                                            key={category.id}
                                            className="group bg-white border border-gray-100 rounded-3xl p-4 flex items-center justify-between hover:shadow-lg transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner"
                                                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                                                >
                                                    {category.icon || '📁'}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{category.title}</h3>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        收納於 {formatDate(category.archivedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => unarchiveCategory(category.id)}
                                                    className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-2"
                                                >
                                                    <RotateCcw size={14} /> 恢復欄位
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('確定要永久刪除這個欄位嗎？此動作無法復原。')) {
                                                            deleteCategory(category.id);
                                                        }
                                                    }}
                                                    className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState type="欄位" />
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const EmptyState = ({ type }: { type: string }) => (
    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-[30px] flex items-center justify-center text-gray-300 mb-4">
            <Archive size={40} />
        </div>
        <h3 className="text-gray-900 font-bold mb-1">這裡還沒有任何{type}</h3>
        <p className="text-gray-500 text-sm font-medium">
            在白板上將不需要的內容點選「收納」後，<br />它們就會出現在這裡。
        </p>
    </div>
);
