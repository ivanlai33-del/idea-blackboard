import React, { useState, useEffect, useRef } from 'react';
import { Paper, Category } from '../types';
import { Sparkles, X, Trash2, Pin, Archive, Save, Loader2, Maximize2, Download, Image as ImageIconComponent, Type, TrendingUp, ListChecks, Calculator, Activity, Hash, PlusCircle, CheckCircle2, ChevronRight, Minus, Plus as PlusIcon } from 'lucide-react';
import { motion, AnimatePresence, useDragControls, useMotionValue } from 'framer-motion';
import { generateAiResponse, generateAiImage } from '../services/geminiService';
import { Board } from '../types';
import { PERSONA_MAGIC_TOOLS, METAPHYSICAL_CHEATSHEETS, GET_TOOLS_FOR_PERSONA, GET_WIDGETS_FOR_PERSONA, LumosWidget } from '../constants/personaTools';
import { Wand2, HelpCircle, BookOpen as BookOpenIcon, Lightbulb as LightbulbIcon, ImageIcon } from 'lucide-react';

interface PaperDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    paper: Paper | null;
    categories: Category[];
    onSave: (id: string, updates: Partial<Paper>) => void;
    onDelete: (id: string) => void;
    onTogglePin: (id: string) => void;
    onArchive: (id: string) => void;
    isPro?: boolean;
    onUpgrade?: () => void;
    activeBoard: Board | null;
}

const PaperDetailModal: React.FC<PaperDetailModalProps> = ({
    isOpen, onClose, paper, categories, onSave, onDelete, onTogglePin, onArchive, isPro = false, onUpgrade, activeBoard
}) => {
    const [text, setText] = useState('');
    const [columnId, setColumnId] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState('');
    const [showAiResponse, setShowAiResponse] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [debouncedTvSymbol, setDebouncedTvSymbol] = useState('');
    const [modules, setModules] = useState<any[]>([]);
    const [magicToolResult, setMagicToolResult] = useState<string | null>(null);
    const [showMagicToolPanel, setShowMagicToolPanel] = useState(true);

    const motionX = useMotionValue(0);
    const motionY = useMotionValue(0);

    const [windowLayout, setWindowLayout] = useState({
        width: window.innerWidth * 0.75,
        height: window.innerHeight * 0.75
    });

    const dragControls = useDragControls();
    const [isResizing, setIsResizing] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const resizeAnchorRef = useRef<{
        left: number,
        top: number,
        initialWidth: number,
        initialHeight: number,
        initialX: number,
        initialY: number
    } | null>(null);

    // Resize Handler
    useEffect(() => {
        if (!isResizing) return;

        const originalCursor = document.body.style.cursor;
        const originalUserSelect = document.body.style.userSelect;

        const cursorMap: Record<string, string> = {
            'r': 'ew-resize',
            'br': 'se-resize'
        };

        document.body.style.cursor = cursorMap[isResizing] || 'default';
        document.body.style.userSelect = 'none';

        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !resizeAnchorRef.current) return;

            const {
                left: initialLeft,
                top: initialTop,
                initialWidth,
                initialHeight,
                initialX,
                initialY
            } = resizeAnchorRef.current;

            const mouseX = Math.max(0, Math.min(window.innerWidth, e.clientX));
            const mouseY = Math.max(0, Math.min(window.innerHeight, e.clientY));

            let newWidth = initialWidth;
            let newHeight = initialHeight;

            if (isResizing === 'r' || isResizing === 'br') {
                const minWidth = 400;
                const availableWidth = window.innerWidth - initialLeft - 20;
                const finalWidth = Math.min(availableWidth, Math.max(minWidth, mouseX - initialLeft));

                const deltaW = finalWidth - initialWidth;
                motionX.set(initialX + (deltaW / 2));
                newWidth = finalWidth;
            }

            if (isResizing === 'br') {
                const minHeight = 300;
                const availableHeight = window.innerHeight - initialTop - 20;
                const finalHeight = Math.min(availableHeight, Math.max(minHeight, mouseY - initialTop));

                const deltaH = finalHeight - initialHeight;
                motionY.set(initialY + (deltaH / 2));
                newHeight = finalHeight;
            }

            setWindowLayout({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            setIsResizing(null);
            document.body.style.cursor = originalCursor;
            document.body.style.userSelect = originalUserSelect;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = originalCursor;
            document.body.style.userSelect = originalUserSelect;
        };
    }, [isResizing]);

    const personaKey = activeBoard?.persona || activeBoard?.name || '';
    const activePersonaTools = GET_TOOLS_FOR_PERSONA(personaKey || 'default');
    const activePersonaWidgets = GET_WIDGETS_FOR_PERSONA(personaKey || 'default');
    const activePersonaTips = personaKey ? METAPHYSICAL_CHEATSHEETS[personaKey] : null;

    const handleMagicTool = async (prompt: string, label: string) => {
        setAiLoading(true);
        setMagicToolResult(null);
        try {
            const finalPrompt = `${prompt}\n以下是相關筆記內容：\n"${text}"`;
            const response = await generateAiResponse(finalPrompt);
            setMagicToolResult(response);
            setShowAiResponse(true); // Share AI panel for result
            setAiResponse(response);
        } catch (error) {
            setAiResponse("魔法暫時失靈，請稍後再試。");
        } finally {
            setAiLoading(false);
        }
    };

    useEffect(() => {
        if (paper) {
            setText(paper.text);
            setColumnId(paper.columnId);
            setAiResponse('');
            setPreviewImage('');
            setShowAiResponse(false);
            setAiLoading(false);
            setImageLoading(false);
            setModules(paper.modules || []);
            motionX.set(0);
            motionY.set(0);

            // Initialize debounced symbol
            const firstLine = paper.text.split('\n')[0].trim() || 'TSLA';
            setDebouncedTvSymbol(firstLine);
        }
    }, [paper, motionX, motionY]);

    // Debounce Stock Symbol Update
    useEffect(() => {
        if (paper?.type !== 'stock') return;

        const firstLine = text.split('\n')[0].trim();
        const timer = setTimeout(() => {
            if (firstLine) {
                setDebouncedTvSymbol(firstLine);
            }
        }, 800); // 800ms debounce to prevent multiple reloads while typing

        return () => clearTimeout(timer);
    }, [text, paper?.type]);

    if (!isOpen || !paper) return null;

    const currentCategory = categories.find(c => c.id === paper.columnId);
    const categoryColor = currentCategory?.color || '#6366f1'; // Default indigo

    const glassButtonStyle = {
        backgroundColor: categoryColor,
        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)',
        boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.4), 0 10px 20px -5px ${categoryColor}40`,
        border: '1px solid rgba(255,255,255,0.2)'
    };

    const handleSave = () => {
        onSave(paper.id, {
            text: text + (aiResponse ? `\n\n> **AI 建議**\n> ${aiResponse}` : ''),
            columnId,
            modules // Save modular data
        });
        onClose();
    };

    const handleGenerateImage = async () => {
        if (!isPro && onUpgrade) {
            onUpgrade();
            return;
        }
        if (!text.trim()) return;

        setImageLoading(true);
        setAiResponse(''); // Clear text response
        setPreviewImage(''); // Clear previous image
        setShowAiResponse(true);
        try {
            const imageUrl = await generateAiImage(text);
            setPreviewImage(imageUrl);
        } catch (error) {
            console.error("Image Gen Error:", error);
            setAiResponse("無法為您生成圖片，請檢查 API 設定。");
        } finally {
            setImageLoading(false);
        }
    };

    const handleAiSuggest = async () => {
        if (!isPro && onUpgrade) {
            onUpgrade();
            return;
        }
        setAiLoading(true);
        setAiResponse(''); // Clear previous text
        setPreviewImage(''); // Clear previous image
        setShowAiResponse(true);
        try {
            const prompt = `針對這張便利貼的內容：「${text}」，請給出3個具體的延伸想法或行動建議。請用條列式。`;
            const response = await generateAiResponse(prompt);
            setAiResponse(response || "無回應");
        } catch (error) {
            console.error("AI Error:", error);
            const msg = "無法連接 AI 服務。";
            setAiResponse(msg);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div ref={containerRef} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                <motion.div
                    drag
                    dragConstraints={containerRef}
                    dragElastic={0}
                    dragControls={dragControls}
                    dragListener={false}
                    dragMomentum={false}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    style={{
                        position: 'relative',
                        x: motionX,
                        y: motionY,
                        width: windowLayout.width,
                        height: windowLayout.height
                    }}
                    transition={{
                        type: 'tween',
                        duration: 0.2,
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 }
                    }}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                    className={`max-w-[95vw] max-h-[95vh] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative ${isResizing || isDragging ? 'select-none' : ''}`}
                >
                    {/* Resize Handle - Right Edge (Symmetric) */}
                    <div className="absolute top-12 bottom-12 -right-1 w-3 cursor-ew-resize z-[260] hover:bg-blue-500/10 transition-colors"
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            const centerX = window.innerWidth / 2;
                            resizeAnchorRef.current = {
                                left: centerX - windowLayout.width / 2 + motionX.get(),
                                top: (window.innerHeight / 2) - windowLayout.height / 2 + motionY.get(),
                                initialWidth: windowLayout.width,
                                initialHeight: windowLayout.height,
                                initialX: motionX.get(),
                                initialY: motionY.get()
                            };
                            setIsResizing('r');
                        }}
                    />

                    {/* Resize Handle - Bottom Right Corner (4 Dots) */}
                    <div className="absolute bottom-0 right-0 w-12 h-12 cursor-se-resize z-[260] group/h flex items-center justify-center bg-transparent active:scale-110 transition-transform"
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            const centerX = window.innerWidth / 2;
                            const centerY = window.innerHeight / 2;
                            resizeAnchorRef.current = {
                                left: centerX - windowLayout.width / 2 + motionX.get(),
                                top: centerY - windowLayout.height / 2 + motionY.get(),
                                initialWidth: windowLayout.width,
                                initialHeight: windowLayout.height,
                                initialX: motionX.get(),
                                initialY: motionY.get()
                            };
                            setIsResizing('br');
                        }}
                    >
                        <div className="grid grid-cols-2 gap-1 p-2 bg-gray-100/50 rounded-full group-hover/h:bg-blue-100/50 transition-colors">
                            {[...Array(4)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover/h:bg-blue-500" />)}
                        </div>
                    </div>

                    {/* Header - Drag Trigger */}
                    <div
                        onPointerDown={(e) => !(isResizing || isDragging) && dragControls.start(e)}
                        className={`p-4 px-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 cursor-default active:cursor-grabbing select-none pointer-events-auto`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                #{paper.id.slice(-4)}
                            </span>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm cursor-pointer group hover:border-gray-400 transition-colors">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categories.find(c => c.id === columnId)?.color }} title="分類顏色" />
                                <select
                                    value={columnId}
                                    onChange={(e) => setColumnId(e.target.value)}
                                    className="text-xs font-bold text-gray-600 bg-transparent outline-none cursor-pointer appearance-none pr-4"
                                    style={{ backgroundImage: 'none' }}
                                    title="選擇分類"
                                >
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button onPointerDown={e => e.stopPropagation()} onClick={() => onTogglePin(paper.id)} className={`p-2 rounded-xl transition-all ${paper.pinned ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`} title="釘選">
                                <Pin className="w-5 h-5" fill={paper.pinned ? "currentColor" : "none"} />
                            </button>
                            <button onPointerDown={e => e.stopPropagation()} onClick={() => { onArchive(paper.id); onClose(); }} className="p-2 rounded-xl text-gray-400 hover:bg-purple-50 hover:text-purple-500 transition-all" title="收納">
                                <Archive className="w-5 h-5" />
                            </button>
                            <button onPointerDown={e => e.stopPropagation()} onClick={() => { onDelete(paper.id); onClose(); }} className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all" title="刪除">
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <div className="w-px h-6 bg-gray-200 mx-2"></div>
                            <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => onSave(paper.id, { type: paper.type === 'utility' ? 'text' : 'utility' })}
                                className={`p-2 rounded-xl transition-all ${paper.type === 'utility' ? 'text-indigo-600 bg-indigo-50 border border-indigo-100' : 'text-gray-400 hover:bg-indigo-50 hover:text-indigo-500'}`}
                                title="轉換為多功能工具"
                            >
                                <Sparkles className="w-5 h-5" />
                            </button>
                            <div className="w-px h-6 bg-gray-200 mx-2"></div>
                            <button onPointerDown={e => e.stopPropagation()} onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all" title="關閉">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className={`flex-1 overflow-hidden flex relative bg-white`}>
                        {/* Main Editor Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                            {/* Current Image Display (If it's an image card) */}
                            {paper.type === 'stock' && (
                                <div className="px-8 pt-6">
                                    <div className="bg-gray-50/80 rounded-[28px] p-6 border border-gray-100 shadow-sm flex flex-col gap-5">
                                        {/* Symbol Control Header */}
                                        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-inner">
                                            <div className="flex items-center gap-2 px-3 border-r border-gray-100">
                                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">代碼</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={text.split('\n')[0]}
                                                onChange={(e) => {
                                                    const lines = text.split('\n');
                                                    lines[0] = e.target.value.toUpperCase();
                                                    setText(lines.join('\n'));
                                                }}
                                                placeholder="例如: 2330.TW 或 TSLA"
                                                className="flex-1 bg-transparent border-none outline-none font-black text-gray-800 placeholder:text-gray-300"
                                            />
                                            {(() => {
                                                const formatStockSymbol = (s: string) => {
                                                    const trimmed = s.trim().replace(/\s+/g, '').toUpperCase();
                                                    if (!trimmed) return 'TSLA';
                                                    if (trimmed.includes(':')) return trimmed;
                                                    if (trimmed.endsWith('.TW')) return `TWSE:${trimmed.replace('.TW', '')}`;
                                                    if (trimmed.endsWith('.TWO')) return `TPEX:${trimmed.replace('.TWO', '')}`;
                                                    if (['BTC', 'ETH', 'SOL', 'DOGE', 'BNB'].includes(trimmed)) return `BINANCE:${trimmed}USDT`;
                                                    if (/^\d{4,6}$/.test(trimmed)) return `TWSE:${trimmed}`;
                                                    if (/^[A-Z]{1,5}$/.test(trimmed)) return `NASDAQ:${trimmed}`;
                                                    return trimmed;
                                                };
                                                const activeSymbol = formatStockSymbol(text.split('\n')[0]);
                                                return (
                                                    <div className="flex flex-col items-end gap-0.5">
                                                        <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                            {activeSymbol}
                                                        </div>
                                                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Active Link</span>
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        {/* Chart Container */}
                                        <div className="rounded-[22px] overflow-hidden border-2 border-white shadow-xl bg-white aspect-video relative">
                                            {(() => {
                                                const formatStockSymbol = (s: string) => {
                                                    const trimmed = s.trim().replace(/\s+/g, '').toUpperCase();
                                                    if (!trimmed) return 'TSLA';
                                                    if (trimmed.includes(':')) return trimmed; // User knows best

                                                    // For Taiwan, .TW is often more stable in widgets than TWSE:
                                                    if (trimmed.endsWith('.TW')) return trimmed;
                                                    if (trimmed.endsWith('.TWO')) return trimmed;

                                                    if (['BTC', 'ETH', 'SOL', 'DOGE', 'BNB'].includes(trimmed)) return `BINANCE:${trimmed}USDT`;

                                                    // If numbers, add .TW for Taiwan if no suffix
                                                    if (/^\d{4,6}$/.test(trimmed)) return `${trimmed}.TW`;

                                                    return trimmed;
                                                };
                                                const tvSymbol = formatStockSymbol(debouncedTvSymbol);
                                                return (
                                                    <iframe
                                                        title={`Stock Chart for ${tvSymbol}`}
                                                        src={`https://s.tradingview.com/widgetembed/?symbol=${tvSymbol}&interval=D&theme=light&style=1&timezone=Etc%2FUTC&studies=%5B%5D&hide_top_toolbar=true&hide_legend=true&save_image=false&locale=zh_TW`}
                                                        className="absolute inset-0 w-full h-full border-0"
                                                        key={tvSymbol}
                                                    />
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paper.type === 'utility' && (
                                <div className="px-8 pt-6 flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-lg font-black gradient-text tracking-tight">FlexTool 工作站</h4>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {modules.map((mod, idx) => (
                                            <div key={mod.id} className="bg-gray-50 border border-gray-100 rounded-[24px] p-6 relative group/mod">
                                                <button
                                                    onClick={() => setModules(modules.filter(m => m.id !== mod.id))}
                                                    className="absolute top-4 right-4 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover/mod:opacity-100 transition-all"
                                                >
                                                    <X size={14} />
                                                </button>

                                                <div className="flex items-center gap-3 mb-4">
                                                    {mod.type === 'checklist' && <ListChecks className="w-4 h-4 text-orange-500" />}
                                                    {mod.type === 'counter' && <Calculator className="w-4 h-4 text-emerald-500" />}
                                                    {mod.type === 'progress' && <Activity className="w-4 h-4 text-blue-500" />}
                                                    {mod.type === 'label-value' && <Hash className="w-4 h-4 text-purple-500" />}
                                                    <input
                                                        className="bg-transparent font-black text-xs uppercase tracking-widest text-gray-400 outline-none"
                                                        value={mod.title}
                                                        onChange={(e) => {
                                                            const newMods = [...modules];
                                                            newMods[idx].title = e.target.value;
                                                            setModules(newMods);
                                                        }}
                                                    />
                                                </div>

                                                {mod.type === 'checklist' && (
                                                    <div className="flex flex-col gap-2">
                                                        {(mod.data || []).map((item: any, i: number) => (
                                                            <div key={i} className="flex items-center gap-3">
                                                                <button
                                                                    onClick={() => {
                                                                        const newMods = [...modules];
                                                                        newMods[idx].data[i].done = !newMods[idx].data[i].done;
                                                                        setModules(newMods);
                                                                    }}
                                                                    className={`p-1 rounded-md transition-colors ${item.done ? 'text-emerald-500 bg-emerald-50' : 'text-gray-300 hover:bg-gray-100'}`}
                                                                >
                                                                    <CheckCircle2 size={16} />
                                                                </button>
                                                                <input
                                                                    className={`flex-1 bg-transparent text-sm outline-none ${item.done ? 'text-gray-300 line-through' : 'text-gray-700 font-bold'}`}
                                                                    value={item.text}
                                                                    onChange={(e) => {
                                                                        const newMods = [...modules];
                                                                        newMods[idx].data[i].text = e.target.value;
                                                                        setModules(newMods);
                                                                    }}
                                                                />
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => {
                                                                const newMods = [...modules];
                                                                if (!newMods[idx].data) newMods[idx].data = [];
                                                                newMods[idx].data.push({ text: '', done: false });
                                                                setModules(newMods);
                                                            }}
                                                            style={{ color: categoryColor }}
                                                            className="text-[10px] font-black hover:brightness-90 px-1 mt-2 flex items-center gap-1"
                                                        >
                                                            <PlusIcon size={12} /> 新增項目
                                                        </button>
                                                    </div>
                                                )}

                                                {mod.type === 'counter' && (
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-3xl font-black text-gray-800 tabular-nums">{(mod.data || 0).toLocaleString()}</div>
                                                        <div className="flex items-center bg-white rounded-xl border border-gray-100 p-1">
                                                            <button
                                                                onClick={() => {
                                                                    const newMods = [...modules];
                                                                    newMods[idx].data = (newMods[idx].data || 0) - 1;
                                                                    setModules(newMods);
                                                                }}
                                                                className="p-2 hover:bg-gray-50 text-gray-400 rounded-lg"
                                                            >
                                                                <Minus size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    const newMods = [...modules];
                                                                    newMods[idx].data = (newMods[idx].data || 0) + 1;
                                                                    setModules(newMods);
                                                                }}
                                                                style={{ color: categoryColor }}
                                                                className="p-2 hover:bg-gray-50 rounded-lg"
                                                            >
                                                                <PlusIcon size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {mod.type === 'progress' && (
                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex justify-between items-end">
                                                            <div className="text-2xl font-black text-gray-800 tabular-nums">{mod.data || 0}%</div>
                                                            <input
                                                                type="range"
                                                                className="flex-1 max-w-[150px] accent-blue-500"
                                                                value={mod.data || 0}
                                                                onChange={(e) => {
                                                                    const newMods = [...modules];
                                                                    newMods[idx].data = parseInt(e.target.value);
                                                                    setModules(newMods);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${mod.data || 0}%` }}
                                                                className="h-full bg-blue-500"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {mod.type === 'label-value' && (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 flex-1 outline-none"
                                                            placeholder="輸入內容..."
                                                            value={mod.data || ''}
                                                            onChange={(e) => {
                                                                const newMods = [...modules];
                                                                newMods[idx].data = e.target.value;
                                                                setModules(newMods);
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                {mod.type === 'timer' && (
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">目標時間 / 倒數</span>
                                                            <input
                                                                type="text"
                                                                className="bg-transparent text-2xl font-black text-gray-800 outline-none placeholder:text-gray-200"
                                                                placeholder="25:00"
                                                                value={mod.data || ''}
                                                                onChange={(e) => {
                                                                    const newMods = [...modules];
                                                                    newMods[idx].data = e.target.value;
                                                                    setModules(newMods);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ml-auto flex items-center gap-2">
                                                            <button
                                                                style={glassButtonStyle}
                                                                className="px-4 py-2 text-white text-[10px] font-black rounded-lg hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest shadow-lg"
                                                            >
                                                                開始計時
                                                            </button>
                                                            <button className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-gray-200"><X size={14} /></button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        <div className="p-6 border-2 border-dashed border-gray-100 rounded-[24px] flex flex-wrap gap-3">
                                            {[
                                                { type: 'checklist', label: '清單', icon: ListChecks, color: 'text-orange-500 bg-orange-50' },
                                                { type: 'counter', label: '計算器', icon: Calculator, color: 'text-emerald-500 bg-emerald-50' },
                                                { type: 'progress', label: '進度條', icon: Activity, color: 'text-blue-500 bg-blue-50' },
                                                { type: 'label-value', label: '數值', icon: Hash, color: 'text-purple-500 bg-purple-50' },
                                                { type: 'timer', label: '計時器', icon: Wand2, color: 'text-indigo-500 bg-indigo-50' },
                                            ].map(opt => (
                                                <button
                                                    key={opt.type}
                                                    onClick={() => {
                                                        const exists = modules.find(m => m.type === opt.type);
                                                        if (exists) {
                                                            alert(`此紙片已包含「${opt.label}」組件。`);
                                                            return;
                                                        }
                                                        const newMod = {
                                                            id: Math.random().toString(36).substr(2, 9),
                                                            type: opt.type,
                                                            title: opt.label,
                                                            data: opt.type === 'checklist' ? [{ text: '', done: false }] : (opt.type === 'progress' ? 0 : '')
                                                        };
                                                        setModules([...modules, newMod]);
                                                    }}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all transform hover:scale-105 shadow-sm border border-transparent hover:border-white ${opt.color}`}
                                                >
                                                    <opt.icon size={14} />
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="p-8 flex-1 flex flex-col gap-2">
                                {paper.type === 'stock' && (
                                    <h5 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] px-1">分析筆記</h5>
                                )}
                                <textarea
                                    value={paper.type === 'stock' ? text.split('\n').slice(1).join('\n') : text}
                                    onChange={(e) => {
                                        if (paper.type === 'stock') {
                                            const lines = text.split('\n');
                                            const symbol = lines[0];
                                            setText(symbol + '\n' + e.target.value);
                                        } else {
                                            setText(e.target.value);
                                        }
                                    }}
                                    className="w-full h-full min-h-[200px] text-lg leading-relaxed text-gray-800 outline-none resize-none placeholder:text-gray-300 bg-transparent"
                                    placeholder={paper.type === 'stock' ? "輸入關於這支股票的分析或筆記..." : "輸入想法描述..."}
                                />
                                <button
                                    onClick={handleAiSuggest}
                                    disabled={aiLoading || !text.trim()}
                                    className="w-full py-4 btn-primary-lake flex items-center justify-center gap-3 group pointer-events-auto disabled:opacity-50"
                                    title="使用 AI 擴展想法"
                                >
                                    {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                                    智能擴展想法
                                </button>
                            </div>
                        </div>

                        {/* Right Sidebar: Persona Tools & Tips */}
                        <div className={`w-72 border-l border-gray-100 bg-gray-50/30 flex flex-col overflow-hidden transition-all ${showMagicToolPanel ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute right-0'}`}>
                            <div className="p-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-1">
                                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-[8px] font-black text-white px-2 py-0.5 rounded-bl-lg shadow-sm">PRO</div>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Wand2 className="w-4 h-4 text-teal-500" />
                                    <h4 className="text-sm font-black gradient-text uppercase tracking-wider">職人工具箱</h4>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium">針對「{activeBoard?.name}」的專屬建議</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar flex flex-col gap-6">
                                {/* Action Buttons (Aura AI Tools) */}
                                <div className="flex flex-col gap-3">
                                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">AI 魔法捷徑</h5>
                                    {activePersonaTools.map(tool => (
                                        <button
                                            key={tool.id}
                                            onClick={() => handleMagicTool(tool.prompt, tool.label)}
                                            disabled={aiLoading}
                                            className="group flex flex-col gap-1 p-4 rounded-2xl bg-white border border-gray-100 hover:border-teal-200 hover:shadow-md active:scale-[0.98] transition-all text-left"
                                            title={tool.description}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{tool.icon}</span>
                                                <span className="text-xs font-black gradient-text">{tool.label}</span>
                                            </div>
                                            <p className="text-[9px] text-gray-400 leading-relaxed">{tool.description}</p>
                                        </button>
                                    ))}
                                </div>

                                {/* Aura Quick Tips (Lumos Lab Tips) */}
                                {activePersonaTips && activePersonaTips.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <h5 className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                            <span className="flex items-center gap-1.5"><BookOpenIcon className="w-3 h-3 text-violet-500" /> Aura 知識卡</span>
                                        </h5>
                                        <div className="flex flex-col gap-2">
                                            {activePersonaTips.slice(0, 3).map((tip, idx) => (
                                                <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100/50 text-[11px] text-violet-800 leading-relaxed font-bold shadow-sm hover:shadow-md transition-all cursor-help border-l-4 border-l-violet-400">
                                                    {tip}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Lumos Lab (Widget Tools) - Integrated Here */}
                                {activePersonaWidgets && activePersonaWidgets.length > 0 && (
                                    <div className="flex flex-col gap-3 pt-2 border-t border-gray-100/50">
                                        <h5 className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                            <span className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-emerald-500" /> Lumos Lab 實驗室</span>
                                            <span className="bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded text-[8px]">PRO</span>
                                        </h5>
                                        <div className="grid grid-cols-2 gap-2">
                                            {activePersonaWidgets.map(widget => (
                                                <button
                                                    key={widget.id}
                                                    onClick={() => {
                                                        if (!isPro && onUpgrade) {
                                                            onUpgrade();
                                                            return;
                                                        }

                                                        if (widget.type === 'action' && widget.actionPayload) {
                                                            if (widget.actionPayload === 'set_type_stock') {
                                                                if (paper.type === 'stock') {
                                                                    alert('⚠️ 這個筆記已經是股票分析模式囉！');
                                                                } else {
                                                                    const confirmSwitch = window.confirm('即將切換為「股票分析模式」，這將開啟即時走勢圖。確定切換嗎？');
                                                                    if (confirmSwitch) {
                                                                        onSave(paper.id, { type: 'stock' });
                                                                    }
                                                                }
                                                            }
                                                        } else if (widget.type === 'randomizer') {
                                                            // Aura Fate Result logic
                                                            const results: Record<string, string[]> = {
                                                                'daily_tarot': ['☀️ 太陽：今日充滿能量，宜行動。', '🌙 月亮：情緒波動起伏，宜靜思。', '⭐️ 星星：靈感如泉湧，宜創作。', '🎡 命運之輪：變動即將到來，宜順應。'],
                                                                'decision_coin': ['🪙 正面 (HEADS)：前進！', '🪙 反面 (TAILS)：等待。'],
                                                                'color_palette': ['🎨 莫蘭迪綠 & 奶油白', '🎨 深邃藍 & 香檳金', '🎨 櫻花粉 & 灰藕紫'],
                                                                'default': ['✨ 靈光閃現：這是一個好預兆。', '🧘 保持呼吸：當下即是最好。']
                                                            };
                                                            const pool = results[widget.id] || results['default'];
                                                            const res = pool[Math.floor(Math.random() * pool.length)];
                                                            setAiResponse(`【${widget.label}】\n\n${res}`);
                                                            setShowAiResponse(true);
                                                        } else if (widget.type === 'checklist') {
                                                            const exists = modules.find(m => m.title === widget.label);
                                                            if (exists) {
                                                                alert(`此紙片已包含「${widget.label}」組件。`);
                                                                return;
                                                            }
                                                            const newMod = {
                                                                id: Math.random().toString(36).substr(2, 9),
                                                                type: 'checklist',
                                                                title: widget.label,
                                                                data: [{ text: '新項目...', done: false }]
                                                            };
                                                            setModules([...modules, newMod]);
                                                            if (paper.type !== 'utility') {
                                                                onSave(paper.id, { type: 'utility' });
                                                            }
                                                        } else if (widget.type === 'counter') {
                                                            const exists = modules.find(m => m.title === widget.label);
                                                            if (exists) {
                                                                alert(`此紙片已包含「${widget.label}」組件。`);
                                                                return;
                                                            }
                                                            const newMod = {
                                                                id: Math.random().toString(36).substr(2, 9),
                                                                type: 'counter',
                                                                title: widget.label,
                                                                data: 0
                                                            };
                                                            setModules([...modules, newMod]);
                                                            if (paper.type !== 'utility') {
                                                                onSave(paper.id, { type: 'utility' });
                                                            }
                                                        } else if (widget.type === 'timer') {
                                                            const exists = modules.find(m => m.title === widget.label || m.type === 'timer');
                                                            if (exists) {
                                                                alert(`此紙片已包含「${widget.label}」組件。`);
                                                                return;
                                                            }
                                                            const newMod = {
                                                                id: Math.random().toString(36).substr(2, 9),
                                                                type: 'timer',
                                                                title: widget.label,
                                                                data: '25:00'
                                                            };
                                                            setModules([...modules, newMod]);
                                                            if (paper.type !== 'utility') {
                                                                onSave(paper.id, { type: 'utility' });
                                                            }
                                                        } else if (widget.type === 'sound') {
                                                            alert(`🎵 ${widget.label} 正播放白噪音... (模擬中)`);
                                                        } else if (widget.type === 'link') {
                                                            alert(`🔗 已開啟相關工具：${widget.label}`);
                                                            if (widget.id === 'simple_calc') {
                                                                window.open('https://www.google.com/search?q=calculator', '_blank');
                                                            }
                                                        } else {
                                                            alert(`🔧 ${widget.label} 正在初始化...`);
                                                        }
                                                    }}
                                                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-gray-100 hover:bg-indigo-50 hover:border-indigo-100 hover:shadow-sm hover:scale-[1.02] transition-all group"
                                                >
                                                    <span className="text-xl group-hover:scale-110 transition-transform">{widget.icon}</span>
                                                    <span className="text-[10px] font-bold text-gray-600">{widget.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quick Links */}
                                <div className="mt-auto p-4 rounded-2xl bg-indigo-600 text-white flex flex-col gap-2 shadow-lg shadow-indigo-100">
                                    <div className="flex items-center gap-2">
                                        <HelpCircle className="w-3 h-3 opacity-80" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">學習資源</span>
                                    </div>
                                    <p className="text-[9px] leading-relaxed opacity-90">點擊探索更多有關這項專業的排盤輔助工具與教學。</p>
                                    <button className="mt-1 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-[9px] font-bold transition-colors" title="查看推薦工具">
                                        查看推薦工具清單
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* AI Suggestion Panel - Sliding up, ensuring it doesn't block the sidebar strictly */}
                        <AnimatePresence>
                            {showAiResponse && (
                                <motion.div
                                    initial={{ opacity: 0, y: '100%' }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: '100%' }}
                                    className="absolute bottom-0 left-0 right-0 z-[210] bg-white border-t border-emerald-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col max-h-[70%] pointer-events-auto"
                                >
                                    {/* AI Header - Reorganized Buttons */}
                                    <div className="px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-700 border-b border-white/10 shadow-lg relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                                                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">Aura AI 靈感回應</h3>
                                                    <p className="text-white/60 text-[8px] font-bold tracking-widest uppercase">Premium Insight</p>
                                                </div>
                                            </div>
                                            {aiLoading || imageLoading ? (
                                                <div className="flex items-center gap-2 text-white/80">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{imageLoading ? 'Visualizing...' : 'Thinking...'}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    {(aiResponse || previewImage) && (
                                                        <div className="flex items-center gap-2">
                                                            {previewImage ? (
                                                                <button
                                                                    onClick={() => {
                                                                        onSave(paper.id, {
                                                                            type: 'image',
                                                                            contentUrl: previewImage,
                                                                            text: text
                                                                        });
                                                                        onClose();
                                                                    }}
                                                                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs rounded-xl font-black shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest"
                                                                >
                                                                    <ImageIconComponent size={14} /> 套用為卡片封面
                                                                </button>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        onClick={() => {
                                                                            setText(aiResponse);
                                                                            setAiResponse('');
                                                                            setShowAiResponse(false);
                                                                        }}
                                                                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-[10px] rounded-lg font-black transition-all flex items-center gap-2 uppercase tracking-widest border border-white/10"
                                                                    >
                                                                        <Type size={14} /> 取代現有內容
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setText(prev => prev + '\n\n' + aiResponse);
                                                                            setAiResponse('');
                                                                            setShowAiResponse(false);
                                                                        }}
                                                                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] rounded-lg font-black shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest"
                                                                    >
                                                                        <PlusIcon size={14} /> 附加到結尾
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(aiResponse);
                                                                            alert('✅ 已複製到剪貼簿');
                                                                        }}
                                                                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                                                                        title="複製內容"
                                                                    >
                                                                        <Download size={14} />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setAiResponse('');
                                                            setPreviewImage('');
                                                            setShowAiResponse(false);
                                                        }}
                                                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                                        title="關閉"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* AI Content - Scrollable */}
                                    <div className="p-8 overflow-y-auto custom-scrollbar bg-white/50 backdrop-blur-sm">
                                        {aiLoading || imageLoading ? (
                                            <div className="flex flex-col items-center justify-center py-16 gap-4">
                                                <div className="flex gap-2">
                                                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }} className={`w-3 h-3 rounded-full ${imageLoading ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                                                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className={`w-3 h-3 rounded-full ${imageLoading ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                                                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className={`w-3 h-3 rounded-full ${imageLoading ? 'bg-indigo-600' : 'bg-emerald-600'}`} />
                                                </div>
                                                <p className={`text-sm font-bold tracking-widest italic animate-pulse ${imageLoading ? 'text-indigo-700' : 'text-emerald-700'}`}>
                                                    {imageLoading ? '正在描繪靈感畫面...' : '正在為您捕捉靈感閃光...'}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="prose prose-emerald max-w-none">
                                                {previewImage ? (
                                                    <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-video bg-gray-100 flex items-center justify-center">
                                                        <img src={previewImage} alt="Generated" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="text-[16px] leading-relaxed text-gray-700 whitespace-pre-wrap font-medium">
                                                        {aiResponse}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 px-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0 relative z-30">
                        <div className="flex gap-3">
                            <button
                                onClick={handleAiSuggest}
                                disabled={aiLoading || imageLoading}
                                style={glassButtonStyle}
                                className={`
                                    flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all active:scale-95 disabled:opacity-50
                                    text-white shadow-lg uppercase tracking-widest hover:brightness-110
                                `}
                            >
                                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                AI 智慧建議
                            </button>

                            <button
                                onClick={handleGenerateImage}
                                disabled={aiLoading || imageLoading}
                                style={{ ...glassButtonStyle, filter: 'hue-rotate(-30deg) saturate(1.2)' }}
                                className={`
                                    flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all active:scale-95 disabled:opacity-50
                                    text-white shadow-lg uppercase tracking-widest hover:brightness-110
                                `}
                            >
                                {imageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                                AI 生成圖片
                            </button>
                        </div>

                        <button
                            onClick={handleSave}
                            className="mr-[18px] flex items-center gap-2 px-8 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-sm shadow-sm hover:border-[var(--primary)] hover:text-[var(--primary)] active:scale-95 transition-all"
                        >
                            <Save className="w-4 h-4 text-[var(--primary)]" />
                            保存變更
                        </button>
                    </div>
                </motion.div>
            </div >
        </AnimatePresence >
    );
};

export default PaperDetailModal;
