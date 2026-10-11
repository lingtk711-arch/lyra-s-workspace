import React, { useState } from 'react';
import { Download, Monitor, Smartphone, Check, X, ShieldCheck, HardDriveDownload } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running in standalone PWA mode, don't show the aggressive banner,
  // but allow a subtle status icon or guide
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
        <Check className="w-3.5 h-3.5" />
        <span>桌面独立应用模式</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {isInstallable ? (
          <button
            onClick={install}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-medium shadow-md shadow-indigo-950/40 border border-indigo-400/20 transition-all active:scale-95"
            title="一键安装为独立桌面/手机小程序"
          >
            <Download className="w-3.5 h-3.5 animate-pulse" />
            <span>安装为独立小程序</span>
          </button>
        ) : (
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium border border-neutral-700/60 transition"
            title="查看桌面小程序与手机使用指南"
          >
            <Monitor className="w-3.5 h-3.5 text-indigo-400" />
            <span>安装到桌面/手机</span>
          </button>
        )}
      </div>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-5 text-neutral-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-indigo-400" />
                  工作台桌面与手机小程序使用指南
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  无需下载庞大安装包，无需应用商店审核，秒级变身专属独立 App
                </p>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Desktop Section */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-indigo-300 text-sm">
                  <Monitor className="w-4 h-4" />
                  1. 电脑端 (Chrome / Edge / 360 / 任何现代浏览器)
                </div>
                <ul className="space-y-1.5 text-neutral-300 pl-4 list-disc">
                  <li>
                    <strong>Chrome 浏览器</strong>：点击浏览器地址栏右侧的 <span className="text-white bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">“安装应用”</span> 图标，或右上角三个点 → <strong>“保存并分享” → “将网页安装为应用”</strong>。
                  </li>
                  <li>
                    <strong>Edge 浏览器</strong>：点击右上角三个点 → <strong>“应用” → “将此站点作为应用安装”</strong>。
                  </li>
                  <li>
                    <strong>效果</strong>：桌面上将自动生成专属应用图标，打开后<strong>独立无边框运行，完全脱离浏览器干扰</strong>！
                  </li>
                </ul>
              </div>

              {/* Mobile iPhone/iPad Section */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-emerald-300 text-sm">
                  <Smartphone className="w-4 h-4" />
                  2. 苹果手机 / iPad (iOS Safari)
                </div>
                <ul className="space-y-1.5 text-neutral-300 pl-4 list-disc">
                  <li>
                    在自带的 <strong>Safari 浏览器</strong> 中打开工作台网址。
                  </li>
                  <li>
                    点击底部中间的 <strong>分享按钮 (带有向上箭头的正方形)</strong>。
                  </li>
                  <li>
                    向上滑动选项，点击 <strong>“添加到主屏幕” (Add to Home Screen)</strong>，确认右上角“添加”。
                  </li>
                  <li>
                    <strong>效果</strong>：手机屏幕上出现高清 App 图标，点击全屏无缝启动，媲美原生 iOS 应用！
                  </li>
                </ul>
              </div>

              {/* Mobile Android Section */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-cyan-300 text-sm">
                  <Smartphone className="w-4 h-4" />
                  3. 安卓手机 (微信 / 手机浏览器)
                </div>
                <ul className="space-y-1.5 text-neutral-300 pl-4 list-disc">
                  <li>
                    若在微信中打开，先点击右上角三点 → <strong>“在浏览器中打开”</strong>。
                  </li>
                  <li>
                    在浏览器中点击菜单栏 → <strong>“添加到主屏幕”</strong> 或 <strong>“安装为应用”</strong>。
                  </li>
                </ul>
              </div>

              {/* Data Persistence Safety Section */}
              <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-indigo-400 text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  4. 数据长期保存与永不丢失保障
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  本工作台自动开启离线缓存与双轨存储。您在生词库、流水线等所有记录均实时安全加密保存在本地设备。您也可以随时在右上角设置中进行<strong>“一键备份导出 JSON”</strong>，换电脑、换手机随时一秒恢复！
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-lg shadow-indigo-950/40"
              >
                我知道了，开始使用
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
