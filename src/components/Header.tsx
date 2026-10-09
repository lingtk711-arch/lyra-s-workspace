import React from 'react';
import { 
  Search, 
  Settings, 
  LayoutGrid, 
  Calendar, 
  BookOpen, 
  Wrench,
  Sparkles
} from 'lucide-react';
import { ActiveView } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  onOpenCommandPalette,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#F2DFE4]/80 bg-[#FDF4F5]/90 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => onSelectView('media')}
          className="cursor-pointer text-lg font-bold tracking-tight text-[#2D2326] hover:text-[#5E3843] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <div className="w-6 h-6 rounded-md bg-[#2D2326] text-[#FDF4F5] flex items-center justify-center font-mono font-bold text-xs shadow-xs">
            K
          </div>
          <span>KansoDesk</span>
        </div>

        {/* Zone 2: 4 Concise Single-line Nav Links (De-cardified text links with subtle active indicator) */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => onSelectView('media')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'media'
                ? 'bg-white text-[#2D2326] font-bold shadow-2xs border border-[#F2DFE4]'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-[#8C5D68]" />
            <span>自媒体矩阵</span>
          </button>

          <button
            onClick={() => onSelectView('schedule')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'schedule'
                ? 'bg-white text-[#2D2326] font-bold shadow-2xs border border-[#F2DFE4]'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
            }`}
          >
            <Calendar className="w-4 h-4 text-purple-600" />
            <span>今日日程待办</span>
          </button>

          <button
            onClick={() => onSelectView('english')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'english'
                ? 'bg-white text-[#2D2326] font-bold shadow-2xs border border-[#F2DFE4]'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-rose-600" />
            <span>英语口语训练</span>
          </button>

          <button
            onClick={() => onSelectView('tools')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'tools'
                ? 'bg-white text-[#2D2326] font-bold shadow-2xs border border-[#F2DFE4]'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
            }`}
          >
            <Wrench className="w-4 h-4 text-sky-600" />
            <span>开发者工具箱</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton />

          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-600 bg-white/80 hover:bg-white border border-[#F2DFE4] hover:border-[#D9AAB6] rounded-lg transition-all shadow-2xs"
            title="快捷搜索与指令 (Cmd+K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">指令中心</span>
            <kbd className="hidden sm:inline font-mono px-1.5 py-0.5 text-[10px] bg-[#FAF0F3] border border-[#F2DFE4] rounded text-neutral-500">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 text-neutral-600 hover:text-[#2D2326] bg-white/80 hover:bg-white rounded-lg transition-colors border border-[#F2DFE4] shadow-2xs"
            title="数据备份与配置"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile subnavigation */}
      <div className="flex md:hidden items-center justify-around gap-1 pt-2.5 mt-2 border-t border-[#F2DFE4] text-xs">
        <button
          onClick={() => onSelectView('media')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'media' ? 'text-[#2D2326] font-bold bg-white' : 'text-neutral-500'}`}
        >
          自媒体矩阵
        </button>
        <button
          onClick={() => onSelectView('schedule')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'schedule' ? 'text-[#2D2326] font-bold bg-white' : 'text-neutral-500'}`}
        >
          日程待办
        </button>
        <button
          onClick={() => onSelectView('english')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'english' ? 'text-[#2D2326] font-bold bg-white' : 'text-neutral-500'}`}
        >
          口语训练
        </button>
        <button
          onClick={() => onSelectView('tools')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'tools' ? 'text-[#2D2326] font-bold bg-white' : 'text-neutral-500'}`}
        >
          工具箱
        </button>
      </div>
    </header>
  );
};
