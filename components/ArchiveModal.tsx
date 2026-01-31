import React from 'react';
import { Note, Category } from '../types';
import { X, ArchiveRestore, Trash2, Archive } from 'lucide-react';
import NoteCard from './NoteCard';

interface ArchiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    notes: Note[];
    categories: Category[];
    onUnarchive: (id: string) => void;
    onDelete: (id: string) => void;
    onOpenNote: (note: Note) => void;
}

const ArchiveModal: React.FC<ArchiveModalProps> = ({ isOpen, onClose, notes, categories, onUnarchive, onDelete, onOpenNote }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-10 animate-modal-in">
             <div className="absolute inset-0 bg-[#F2F4F7]/95 backdrop-blur-xl" onClick={onClose} />

            <div className="relative z-10 flex flex-col w-full h-full max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl border border-[#D1D8E0] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-[#D1D8E0] flex justify-between items-center bg-[#FAFAFA]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#7c3aed]/10 text-[#7c3aed] rounded-xl flex items-center justify-center">
                            <Archive className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#2D3436]">收納版面</h2>
                            <p className="text-sm text-[#636E72]">已收納的點子與歸檔內容</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full text-[#636E72] hover:text-[#2D3436]">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto custom-scrollbar p-6 bg-[#F2F4F7]/50">
                    {notes.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-[#636E72] opacity-50 gap-4">
                            <Archive className="w-16 h-16" strokeWidth={1.5} />
                            <p className="text-lg font-medium">目前沒有收納的內容</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {notes.map(note => {
                                const cat = categories.find(c => c.id === note.category) || { title: 'Unknown', color: '#ccc', id: 'unknown' };
                                return (
                                    <div key={note.id} className="relative group">
                                        <div className="opacity-75 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                                            <NoteCard 
                                                note={note} 
                                                category={cat as Category} 
                                                onClick={() => onOpenNote(note)}
                                            />
                                        </div>
                                        
                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity rounded-xl pointer-events-none">
                                            <div className="pointer-events-auto flex gap-2">
                                                 <button 
                                                    onClick={(e) => { e.stopPropagation(); onUnarchive(note.id); }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#2D3436] rounded-lg shadow-lg hover:scale-105 transition-transform font-bold text-sm"
                                                >
                                                    <ArchiveRestore className="w-4 h-4" />
                                                    還原
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 hover:scale-105 transition-all font-bold text-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    刪除
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArchiveModal;