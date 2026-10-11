import React, { useRef, useState } from 'react';
import { X, Download, Upload, RotateCcw, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ContentItem, DailyTask, EnglishPhrase } from '../types';
import { INITIAL_CONTENT_ITEMS, INITIAL_DAILY_TASKS, INITIAL_ENGLISH_PHRASES } from '../utils/mediaPresets';
import { playChime } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentItems: ContentItem[];
  tasks: DailyTask[];
  phrases: EnglishPhrase[];
  onRestoreAll: (data: {
    contentItems: ContentItem[];
    tasks: DailyTask[];
    phrases: EnglishPhrase[];
  }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  contentItems,
  tasks,
  phrases,
  onRestoreAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const backupData = {
      version: '2.0',
      timestamp: Date.now(),
      contentItems,
      tasks,
      phrases,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kansodesk-creator-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    playChime('click');
    setSuccessMsg('自媒体矩阵与工作台数据已成功备份导出！');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.contentItems && Array.isArray(parsed.contentItems)) {
          onRestoreAll({
            contentItems: parsed.contentItems,
            tasks: parsed.tasks || [],
            phrases: parsed.phrases || [],
          });
          playChime('complete');
          setSuccessMsg('已成功从备份文件还原全部数据！');
          setTimeout(() => setSuccessMsg(null), 3000);
        } else {
          setErrorMsg('备份文件结构不匹配');
        }
      } catch {
        setErrorMsg('解析备份文件出错');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetDefaults = () => {
    if (window.confirm('确认重置为预设示范内容吗？当前已编辑的自媒体草稿与待办将被覆盖。')) {
      onRestoreAll({
        contentItems: INITIAL_CONTENT_ITEMS,
        tasks: INITIAL_DAILY_TASKS,
        phrases: INITIAL_ENGLISH_PHRASES,
      });
      playChime('click');
      setSuccessMsg('已重置为初始示范状态');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-2xl border border-[#235850] bg-[#0b2421]/95 text-[#E1F1EC] p-6 shadow-2xl space-y-6 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#1d4c44]/70">
          <div>
            <h3 className="text-base font-bold text-[#F4FAF8] flex items-center gap-2">
              <span className="text-[#F7CE74]">🐟</span>
              <span>数据备份与工作台设置</span>
            </h3>
            <p className="text-xs text-[#8DB5AB] mt-0.5">所有数据均保存在本地浏览器中，离线私密安全</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#8DB5AB] hover:text-[#FFFFFF] rounded-lg hover:bg-[#133e38] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {successMsg && (
          <div className="p-3 text-xs text-[#A7F3D0] bg-[#0a352c] border border-[#1f7262] rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#34D399] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 text-xs text-[#FCA5A5] bg-[#3a1515] border border-[#7f2d2d] rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F87171] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-3">
          {/* Export JSON */}
          <div className="p-4 rounded-xl border border-[#1d4c44]/70 bg-[#0e302c]/60 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#F4FAF8]">导出完整数据备份 (JSON)</div>
              <div className="text-[11px] text-[#8DB5AB] mt-0.5">
                包含 4 个账号选题文案、今日待办与外贸口语库
              </div>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-[#164e45] text-[#F7CE74] hover:bg-[#1d6358] border border-[#E5B85C]/40 rounded-lg transition-colors whitespace-nowrap shadow-xs font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出备份</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-xl border border-[#1d4c44]/70 bg-[#0e302c]/60 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#F4FAF8]">导入并恢复备份</div>
              <div className="text-[11px] text-[#8DB5AB] mt-0.5">
                选择之前的 JSON 备份快速还原
              </div>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-[#103732] text-[#E1F1EC] border border-[#235850] hover:bg-[#184843] rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                <Upload className="w-3.5 h-3.5 text-[#34D399]" />
                <span>导入文件</span>
              </button>
            </div>
          </div>

          {/* Reset Defaults */}
          <div className="p-4 rounded-xl border border-[#1d4c44]/70 bg-[#0e302c]/60 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#F4FAF8]">恢复出厂初始预设</div>
              <div className="text-[11px] text-[#8DB5AB] mt-0.5">
                重置为圣多纳释放法与 4 账号初始范例
              </div>
            </div>
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#2e1514] text-[#FFA28D] border border-[#FF6B4A]/40 hover:bg-[#431d1b] rounded-lg transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>恢复预设</span>
            </button>
          </div>
        </div>

        <div className="text-right pt-2 border-t border-[#1d4c44]/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#0b2421] bg-[#F7CE74] hover:bg-[#FBE29D] font-bold rounded-lg transition-colors shadow-xs"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
