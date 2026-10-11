import React, { useState } from 'react';
import { 
  Search, 
  Settings, 
  LayoutGrid, 
  Calendar, 
  BookOpen, 
  Wrench,
  Sparkles,
  SlidersHorizontal,
  Fish,
  Flower2,
  Waves
} from 'lucide-react';
import { ActiveView } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { AmbientSettings } from './KoiPondBackground';

interface HeaderProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  ambientSettings: AmbientSettings;
  onUpdateAmbientSettings: (settings: AmbientSettings) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  onOpenCommandPalette,
  onOpenSettings,
  ambientSettings,
  onUpdateAmbientSettings,
}) => {
  const [showAmbientMenu, setShowAmbientMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#2a5953]/50 bg-[#0a201e]/80 backdrop-blur-md px-4 lg:px-8 py-2.5 transition-colors duration-200 text-[#F5FAF8] shadow-[0_4px_20px_rgba(4,18,17,0.35)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark with oriental seal badge */}
        <div 
          onClick={() => onSelectView('media')}
          className="cursor-pointer text-base lg:text-lg font-bold tracking-tight text-[#F7FBF9] hover:text-[#F6D58C] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 group"
        >
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#FF6B4A] to-[#F5A623] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-orange-950/40 border border-[#FFE082]/30 group-hover:scale-105 transition-transform">
            鲤
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-semibold tracking-wide">KansoDesk</span>
              <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-[#184641]/80 text-[#9FE1D1] border border-[#2D736A]/50">
                澄潭水幕
              </span>
            </div>
            <span className="text-[10px] text-[#86ADA4] font-normal tracking-widest mt-0.5">
              ZEN CREATOR OS
            </span>
          </div>
        </div>

        {/* Zone 2: Concise Nav Links (Minimalist borderless water pill style) */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs lg:text-sm font-medium">
          <button
            onClick={() => onSelectView('media')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap shrink-0 ${
              activeView === 'media'
                ? 'bg-[#184843]/90 text-[#FCE19B] font-semibold border border-[#E5B85C]/40 shadow-xs'
                : 'text-[#B0D2CA] hover:text-[#FFFFFF] hover:bg-[#143B37]/50'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-[#FF8566]" />
            <span>自媒体矩阵</span>
          </button>

          <button
            onClick={() => onSelectView('schedule')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap shrink-0 ${
              activeView === 'schedule'
                ? 'bg-[#184843]/90 text-[#FCE19B] font-semibold border border-[#E5B85C]/40 shadow-xs'
                : 'text-[#B0D2CA] hover:text-[#FFFFFF] hover:bg-[#143B37]/50'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#D8B4FE]" />
            <span>今日日程待办</span>
          </button>

          <button
            onClick={() => onSelectView('english')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap shrink-0 ${
              activeView === 'english'
                ? 'bg-[#184843]/90 text-[#FCE19B] font-semibold border border-[#E5B85C]/40 shadow-xs'
                : 'text-[#B0D2CA] hover:text-[#FFFFFF] hover:bg-[#143B37]/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#F472B6]" />
            <span>英语口语训练</span>
          </button>

          <button
            onClick={() => onSelectView('tools')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap shrink-0 ${
              activeView === 'tools'
                ? 'bg-[#184843]/90 text-[#FCE19B] font-semibold border border-[#E5B85C]/40 shadow-xs'
                : 'text-[#B0D2CA] hover:text-[#FFFFFF] hover:bg-[#143B37]/50'
            }`}
          >
            <Wrench className="w-4 h-4 text-[#38BDF8]" />
            <span>开发者工具箱</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Zone + Ambient Pond Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Ambient Pond Mood Controller */}
          <div className="relative">
            <button
              onClick={() => setShowAmbientMenu((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#E3F2EE] bg-[#143C38]/80 hover:bg-[#1B4B46] border border-[#2B665E]/70 hover:border-[#F2C265]/50 rounded-lg transition-all shadow-xs"
              title="调节动态水池与锦鲤"
            >
              <Waves className="w-3.5 h-3.5 text-[#6EE7B7]" />
              <span className="hidden sm:inline text-[#D5EBE5]">水波景致</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            </button>

            {/* Ambient Control Dropdown */}
            {showAmbientMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-xl bg-[#091F1D]/95 border border-[#2E6860] backdrop-blur-xl p-3 shadow-2xl z-50 text-xs text-[#E1F1EC]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1E4D47] text-[11px] font-semibold text-[#F7D891]">
                  <span>动态景致调节</span>
                  <button 
                    onClick={() => setShowAmbientMenu(false)}
                    className="text-[#84ACA3] hover:text-[#FFFFFF]"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <Fish className="w-3.5 h-3.5 text-[#FF7043]" />
                      <span>锦鲤游弋 (5尾)</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={ambientSettings.showKoi}
                      onChange={(e) => onUpdateAmbientSettings({ ...ambientSettings, showKoi: e.target.checked })}
                      className="rounded accent-[#FF7043]"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <Flower2 className="w-3.5 h-3.5 text-[#F472B6]" />
                      <span>落樱随波</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={ambientSettings.showPetals}
                      onChange={(e) => onUpdateAmbientSettings({ ...ambientSettings, showPetals: e.target.checked })}
                      className="rounded accent-[#F472B6]"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
                      <span>浮光金粼</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={ambientSettings.showCaustics}
                      onChange={(e) => onUpdateAmbientSettings({ ...ambientSettings, showCaustics: e.target.checked })}
                      className="rounded accent-[#FACC15]"
                    />
                  </label>

                  <div className="pt-2 border-t border-[#1E4D47]/70">
                    <div className="flex items-center justify-between text-[11px] text-[#A2C7BF] mb-1">
                      <span>游速节奏</span>
                      <span className="font-mono text-[#F9DA8B]">{ambientSettings.koiSpeed.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={ambientSettings.koiSpeed}
                      onChange={(e) => onUpdateAmbientSettings({ ...ambientSettings, koiSpeed: parseFloat(e.target.value) })}
                      className="w-full accent-[#F59E0B] h-1.5 bg-[#173F3B] rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <PWAInstallButton />

          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#BCE0D7] bg-[#143C38]/80 hover:bg-[#1B4B46] border border-[#2B665E]/70 hover:border-[#6EE7B7]/50 rounded-lg transition-all shadow-xs"
            title="快捷搜索与指令 (Cmd+K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#6EE7B7]" />
            <span className="hidden sm:inline">指令中心</span>
            <kbd className="hidden sm:inline font-mono px-1.5 py-0.5 text-[10px] bg-[#0F2F2C] border border-[#275F57] rounded text-[#A6CDC4]">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 text-[#BCE0D7] hover:text-[#FFFFFF] bg-[#143C38]/80 hover:bg-[#1B4B46] rounded-lg transition-colors border border-[#2B665E]/70 shadow-xs"
            title="数据备份与配置"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 text-[#8CD1C2]" />
          </button>
        </div>
      </div>

      {/* Mobile subnavigation */}
      <div className="flex md:hidden items-center justify-around gap-1 pt-2 mt-2 border-t border-[#1C4742] text-xs">
        <button
          onClick={() => onSelectView('media')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'media' ? 'text-[#F9D686] font-bold bg-[#1A4742]' : 'text-[#8DB4AB]'}`}
        >
          自媒体矩阵
        </button>
        <button
          onClick={() => onSelectView('schedule')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'schedule' ? 'text-[#F9D686] font-bold bg-[#1A4742]' : 'text-[#8DB4AB]'}`}
        >
          日程待办
        </button>
        <button
          onClick={() => onSelectView('english')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'english' ? 'text-[#F9D686] font-bold bg-[#1A4742]' : 'text-[#8DB4AB]'}`}
        >
          口语训练
        </button>
        <button
          onClick={() => onSelectView('tools')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'tools' ? 'text-[#F9D686] font-bold bg-[#1A4742]' : 'text-[#8DB4AB]'}`}
        >
          工具箱
        </button>
      </div>
    </header>
  );
};

