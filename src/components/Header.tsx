import React, { useState } from 'react';
import { 
  Search, 
  Settings, 
  LayoutGrid, 
  Calendar, 
  BookOpen, 
  Wrench,
  Sparkles,
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
    <header className="sticky top-0 z-40 border-b border-pink-200/60 bg-white/75 backdrop-blur-md px-4 lg:px-8 py-2.5 transition-colors duration-200 text-[#684852] shadow-[0_2px_14px_rgba(244,166,185,0.08)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Wordmark with pastel oriental seal badge */}
        <div 
          onClick={() => onSelectView('media')}
          className="cursor-pointer text-base lg:text-lg font-bold tracking-tight text-[#684852] hover:text-pink-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 group"
        >
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-pink-400 to-rose-400 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-pink-200 group-hover:scale-105 transition-transform">
            🌸
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-semibold tracking-wide font-serif text-[#684852]">KansoDesk</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                碧波微澜
              </span>
            </div>
            <span className="text-[10px] text-[#9A7D87] font-normal tracking-widest mt-0.5">
              CREATOR OS
            </span>
          </div>
        </div>

        {/* Zone 2: Minimalist borderless water pill navigation */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs lg:text-sm font-medium">
          <button
            onClick={() => onSelectView('media')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeView === 'media'
                ? 'bg-linear-to-r from-pink-100/90 to-emerald-100/80 text-[#684852] font-bold border border-pink-200/80 shadow-xs'
                : 'text-[#856771] hover:text-[#684852] hover:bg-white/80'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-pink-500" />
            <span>自媒体矩阵</span>
          </button>

          <button
            onClick={() => onSelectView('schedule')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeView === 'schedule'
                ? 'bg-linear-to-r from-pink-100/90 to-emerald-100/80 text-[#684852] font-bold border border-pink-200/80 shadow-xs'
                : 'text-[#856771] hover:text-[#684852] hover:bg-white/80'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>今日日程待办</span>
          </button>

          <button
            onClick={() => onSelectView('english')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeView === 'english'
                ? 'bg-linear-to-r from-pink-100/90 to-emerald-100/80 text-[#684852] font-bold border border-pink-200/80 shadow-xs'
                : 'text-[#856771] hover:text-[#684852] hover:bg-white/80'
            }`}
          >
            <BookOpen className="w-4 h-4 text-rose-500" />
            <span>英语口语训练</span>
          </button>

          <button
            onClick={() => onSelectView('tools')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeView === 'tools'
                ? 'bg-linear-to-r from-pink-100/90 to-emerald-100/80 text-[#684852] font-bold border border-pink-200/80 shadow-xs'
                : 'text-[#856771] hover:text-[#684852] hover:bg-white/80'
            }`}
          >
            <Wrench className="w-4 h-4 text-teal-600" />
            <span>开发者工具箱</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Zone + Ambient Pond Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Ambient Pond Mood Controller */}
          <div className="relative">
            <button
              onClick={() => setShowAmbientMenu((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#684852] bg-white/80 hover:bg-white border border-pink-200/70 hover:border-emerald-300 rounded-lg transition-all shadow-xs"
              title="调节动态水池与锦鲤"
            >
              <Waves className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">水波景致</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* Ambient Control Dropdown */}
            {showAmbientMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-xl bg-white/95 border border-pink-200/80 backdrop-blur-xl p-3 shadow-xl z-50 text-xs text-[#684852]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-pink-100 text-[11px] font-semibold text-pink-700">
                  <span>动态景致调节</span>
                  <button 
                    onClick={() => setShowAmbientMenu(false)}
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <Fish className="w-3.5 h-3.5 text-pink-500" />
                      <span>锦鲤游弋 (4尾)</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={ambientSettings.showKoi}
                      onChange={(e) => onUpdateAmbientSettings({ ...ambientSettings, showKoi: e.target.checked })}
                      className="rounded accent-pink-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <Flower2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>落樱浮波</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={ambientSettings.showPetals}
                      onChange={(e) => onUpdateAmbientSettings({ ...ambientSettings, showPetals: e.target.checked })}
                      className="rounded accent-rose-400"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>水面金光</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={ambientSettings.showCaustics}
                      onChange={(e) => onUpdateAmbientSettings({ ...ambientSettings, showCaustics: e.target.checked })}
                      className="rounded accent-amber-500"
                    />
                  </label>

                  <div className="pt-2 border-t border-pink-100">
                    <div className="flex items-center justify-between text-[11px] text-[#8F727C] mb-1">
                      <span>游速节奏</span>
                      <span className="font-mono text-pink-700 font-bold">{ambientSettings.koiSpeed.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={ambientSettings.koiSpeed}
                      onChange={(e) => onUpdateAmbientSettings({ ...ambientSettings, koiSpeed: parseFloat(e.target.value) })}
                      className="w-full accent-pink-500 h-1.5 bg-pink-100 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <PWAInstallButton />

          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#684852] bg-white/80 hover:bg-white border border-pink-200/70 hover:border-emerald-300 rounded-lg transition-all shadow-xs"
            title="快捷搜索与指令 (Cmd+K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">指令中心</span>
            <kbd className="hidden sm:inline font-mono px-1.5 py-0.5 text-[10px] bg-pink-50 border border-pink-200 rounded text-pink-700">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 text-[#684852] hover:text-pink-700 bg-white/80 hover:bg-white rounded-lg transition-colors border border-pink-200/70 shadow-xs"
            title="数据备份与配置"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </div>

      {/* Mobile subnavigation */}
      <div className="flex md:hidden items-center justify-around gap-1 pt-2 mt-2 border-t border-pink-100 text-xs">
        <button
          onClick={() => onSelectView('media')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'media' ? 'text-pink-700 font-bold bg-pink-50' : 'text-[#7A666D]'}`}
        >
          自媒体矩阵
        </button>
        <button
          onClick={() => onSelectView('schedule')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'schedule' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-[#7A666D]'}`}
        >
          日程待办
        </button>
        <button
          onClick={() => onSelectView('english')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'english' ? 'text-rose-700 font-bold bg-rose-50' : 'text-[#7A666D]'}`}
        >
          口语训练
        </button>
        <button
          onClick={() => onSelectView('tools')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'tools' ? 'text-teal-700 font-bold bg-teal-50' : 'text-[#7A666D]'}`}
        >
          工具箱
        </button>
      </div>
    </header>
  );
};
