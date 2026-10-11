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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-100/90 hover:bg-pink-100 text-pink-900 text-xs font-semibold border border-pink-300/80 transition-all active:scale-95 shadow-xs"
            title="一键安装为独立桌面/手机小程序"
          >
            <Download className="w-3.5 h-3.5 text-pink-600 animate-pulse" />
            <span>安装为独立小程序</span>
          </button>
        ) : (
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/80 hover:bg-white text-[#684852] hover:text-pink-700 text-xs font-medium border border-pink-200/70 transition shadow-xs"
            title="查看桌面小程序与手机使用指南"
          >
            <Monitor className="w-3.5 h-3.5 text-emerald-600" />
            <span>安装到桌面/手机</span>
          </button>
        )}
      </div>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pink-950/20 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white/95 border border-pink-200 p-6 shadow-2xl space-y-5 text-[#684852] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-start justify-between pb-2 border-b border-pink-100">
              <div>
                <h3 className="text-base font-bold text-[#684852] flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-emerald-600" />
                  工作台桌面与手机小程序使用指南
                </h3>
                <p className="text-xs text-[#8F727C] mt-1">
                  无需下载庞大安装包，秒级变身专属独立桌面/手机 App
                </p>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-[#8F727C] hover:text-[#684852] p-1 rounded-lg hover:bg-pink-50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Desktop Section */}
              <div className="p-3.5 rounded-xl bg-pink-50/50 border border-pink-200/70 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-pink-900 text-sm">
                  <Monitor className="w-4 h-4 text-pink-600" />
                  1. 电脑端 (Chrome / Edge / 360 / 现代浏览器)
                </div>
                <ul className="space-y-1.5 text-[#684852] pl-4 list-disc">
                  <li>
                    <strong>Chrome 浏览器</strong>：点击浏览器地址栏右侧的 <span className="bg-white px-1.5 py-0.5 rounded border border-pink-200 font-bold">“安装应用”</span> 图标，或右上角三个点 → <strong>“保存并分享” → “将网页安装为应用”</strong>。
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
              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-emerald-900 text-sm">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  2. 苹果手机 / iPad (iOS Safari)
                </div>
                <ul className="space-y-1.5 text-[#684852] pl-4 list-disc">
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
              <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200/70 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-teal-900 text-sm">
                  <Smartphone className="w-4 h-4 text-teal-600" />
                  3. 安卓手机 (微信 / 手机浏览器)
                </div>
                <ul className="space-y-1.5 text-[#684852] pl-4 list-disc">
                  <li>
                    若在微信中打开，先点击右上角三点 → <strong>“在浏览器中打开”</strong>。
                  </li>
                  <li>
                    在浏览器中点击菜单栏 → <strong>“添加到主屏幕”</strong> 或 <strong>“安装为应用”</strong>。
                  </li>
                </ul>
              </div>

              {/* Data Persistence Safety Section */}
              <div className="p-3.5 rounded-xl bg-pink-50/30 border border-pink-200/50 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-pink-800 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  4. 数据长期保存与永不丢失保障
                </div>
                <p className="text-[#8F727C] leading-relaxed">
                  本工作台自动开启离线缓存与双轨存储。您在生词库、流水线等所有记录均实时安全加密保存在本地设备。您也可以随时在右上角设置中进行<strong>“一键备份导出 JSON”</strong>，换电脑、换手机随时一秒恢复！
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs transition shadow-xs"
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
