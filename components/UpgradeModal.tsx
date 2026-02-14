import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Zap } from 'lucide-react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8 pb-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-[30px] bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-6 shadow-inner">
                            <Crown className="w-10 h-10 text-amber-500 fill-amber-500/20" />
                        </div>

                        <h3 className="text-2xl font-black text-gray-800 mb-2">升級 Pro 專業版</h3>
                        <p className="text-gray-500 font-medium text-sm mb-8 leading-relaxed">
                            解鎖無限白板、無限欄位與無限 AI 建議，<br />開啟您的全方位靈感工作台。
                        </p>

                        <div className="w-full space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <span className="text-sm font-bold text-gray-700">無限白板與欄位 (目前已達上限)</span>
                            </div>
                            <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <span className="text-sm font-bold text-gray-700">啟動AI智能建議</span>
                            </div>
                            <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <span className="text-sm font-bold text-gray-700">進階智能數據分析報告</span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-lg shadow-[0_12px_24px_-8px_rgba(245,158,11,0.5)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Zap className="w-5 h-5 fill-white" />
                            立即升級 Pro
                        </button>

                        <button
                            onClick={onClose}
                            className="mt-4 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            我先考慮看看
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UpgradeModal;
