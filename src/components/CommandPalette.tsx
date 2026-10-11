import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  LayoutGrid, 
  Calendar, 
  BookOpen, 
  Wrench, 
  X,
  FileText,
  Sparkles
} from 'lucide-react';
import { ActiveView, ContentItem } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  contentItems: ContentItem[];
  onSelectView: (view: ActiveView) => void;
  onSelectContentItem?: (accountId: string, itemId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  contentItems,
  onSelectView,
  onSelectContentItem,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigationCommands = [
    { label: '自媒体矩阵工作台 (Media)', view: 'media' as ActiveView, icon: LayoutGrid },
    { label: '今日日程待办与排期 (Schedule)', view: 'schedule' as ActiveView, icon: Calendar },
    { label: '英语口语训练场 (English Oral)', view: 'english' as ActiveView, icon: BookOpen },
    { label: '开发者实用工具箱 (DevTools)', view: 'tools' as ActiveView, icon: Wrench },
  ].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  const safeContentItems = Array.isArray(contentItems) ? contentItems : [];

  const matchedContents = safeContentItems.filter((i) =>
    (i.title || '').toLowerCase().includes(query.toLowerCase()) ||
    (i.hook && i.hook.toLowerCase().includes(query.toLowerCase())) ||
    (i.tags || []).some((t) => typeof t === 'string' && t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-xl rounded-2xl border border-[#235850] bg-[#0b2421]/95 text-[#E1F1EC] p-2 shadow-2xl overflow-hidden backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-[#1d4c44]/70">
          <Search className="w-4 h-4 text-[#76A196] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索选题、文案草稿、日程或工具..."
            className="w-full bg-transparent text-sm text-[#F4FAF8] placeholder-[#6A9489] focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1 text-[#76A196] hover:text-[#FFFFFF] rounded hover:bg-[#133e38] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {/* Section 1: Navigation */}
          {navigationCommands.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 text-[10px] uppercase font-bold tracking-wider text-[#F7CE74]">
                主视图导航
              </div>
              {navigationCommands.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      onSelectView(item.view);
                      onClose();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#CBE3DC] hover:text-white hover:bg-[#153f3a] text-left transition-colors"
                  >
                    <Icon className="w-4 h-4 text-[#76A196]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Section 2: Contents */}
          {matchedContents.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 text-[10px] uppercase font-bold tracking-wider text-[#F7CE74]">
                自媒体内容选题与草稿
              </div>
              {matchedContents.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    if (onSelectContentItem) onSelectContentItem(c.accountId, c.id);
                    onSelectView('media');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#CBE3DC] hover:text-white hover:bg-[#153f3a] transition-colors text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-[#76A196] shrink-0" />
                    <span className="font-semibold truncate">{c.title}</span>
                  </div>
                  <span className="text-[10px] text-[#8DB5AB] font-mono shrink-0 ml-2">
                    {c.targetDate || '选题中'}
                  </span>
                </button>
              ))}
            </div>
          )}

          {navigationCommands.length === 0 && matchedContents.length === 0 && (
            <div className="py-8 text-center text-xs text-[#76A196]">
              未匹配到任何结果，按 Esc 退出
            </div>
          )}
        </div>

        <div className="px-3 py-2 border-t border-[#1d4c44]/70 flex items-center justify-between text-[11px] text-[#76A196]">
          <span>Esc 退出 · ↑↓ 选择 · ↵ 跳转</span>
          <span className="text-[#F7CE74]/90 font-serif">🐟 澄潭 · 快捷检索</span>
        </div>
      </div>
    </div>
  );
};
