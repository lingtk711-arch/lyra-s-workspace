import React, { useState, useEffect } from 'react';
import { 
  Braces, 
  Binary, 
  Hash, 
  GitCompare, 
  Code2, 
  Palette, 
  KeyRound, 
  Copy, 
  Check, 
  RefreshCw, 
  ArrowLeftRight, 
  AlertCircle, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { ActiveTool } from '../types';
import { md5, sha, generateUUID } from '../utils/crypto';
import { playChime } from '../utils/audio';

export const DeveloperTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>('json');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    playChime('click');
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // --- 1. JSON STUDIO ---
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify({
      workspace: "KansoDesk",
      theme: "Dreamy Rose & Morandi",
      accounts: [
        { id: "sedona", name: "圣多纳释放法疗愈 IP", status: "核心运营" },
        { id: "bot1", name: "小红书 BOT 1号", status: "预备转型期" },
        { id: "ai_matrix", name: "AI 前沿科技全网矩阵", status: "双端同步" }
      ],
      features: ["bi-directional-leap", "isolated-workspaces", "local-privacy"]
    }, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleFormatJson = (indent: number) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, indent));
      setJsonError(null);
      playChime('click');
    } catch (err: unknown) {
      if (err instanceof Error) setJsonError(err.message);
      else setJsonError('无效的 JSON 格式');
    }
  };

  const handleMinifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
      setJsonError(null);
      playChime('click');
    } catch (err: unknown) {
      if (err instanceof Error) setJsonError(err.message);
      else setJsonError('无效的 JSON 格式');
    }
  };

  // --- 2. BASE64 & URL TRANSFORMER ---
  const [transInput, setTransInput] = useState('圣多纳释放法：允许一切如其所是。Release & Let go.');
  const [transMode, setTransMode] = useState<'base64' | 'url' | 'hex'>('base64');
  const [transDirection, setTransDirection] = useState<'encode' | 'decode'>('encode');
  const [transOutput, setTransOutput] = useState('');
  const [transError, setTransError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setTransError(null);
      if (!transInput) {
        setTransOutput('');
        return;
      }
      if (transMode === 'base64') {
        if (transDirection === 'encode') {
          const encoded = btoa(unescape(encodeURIComponent(transInput)));
          setTransOutput(encoded);
        } else {
          const decoded = decodeURIComponent(escape(atob(transInput)));
          setTransOutput(decoded);
        }
      } else if (transMode === 'url') {
        if (transDirection === 'encode') {
          setTransOutput(encodeURIComponent(transInput));
        } else {
          setTransOutput(decodeURIComponent(transInput));
        }
      } else if (transMode === 'hex') {
        if (transDirection === 'encode') {
          let hex = '';
          for (let i = 0; i < transInput.length; i++) {
            hex += transInput.charCodeAt(i).toString(16).padStart(2, '0');
          }
          setTransOutput(hex);
        } else {
          let str = '';
          const clean = transInput.replace(/\s+/g, '');
          for (let i = 0; i < clean.length; i += 2) {
            str += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
          }
          setTransOutput(str);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) setTransError(err.message);
      else setTransError('解码失败，请确认输入数据是否合法');
      setTransOutput('');
    }
  }, [transInput, transMode, transDirection]);

  // --- 3. HASH, UUID & TIMESTAMP ---
  const [hashInput, setHashInput] = useState('sedona-release-healing-2026');
  const [md5Val, setMd5Val] = useState('');
  const [sha256Val, setSha256Val] = useState('');
  const [sha1Val, setSha1Val] = useState('');
  const [uuids, setUuids] = useState<string[]>([]);
  
  // Timestamp
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [epochInput, setEpochInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [epochParsedDate, setEpochParsedDate] = useState<string>('');

  useEffect(() => {
    const t = setInterval(() => setCurrentEpoch(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setMd5Val(md5(hashInput));
    sha(hashInput, 'SHA-256').then(setSha256Val);
    sha(hashInput, 'SHA-1').then(setSha1Val);
  }, [hashInput]);

  useEffect(() => {
    handleGenerateUUIDs(5);
  }, []);

  const handleGenerateUUIDs = (count: number) => {
    const list = Array.from({ length: count }, () => generateUUID());
    setUuids(list);
  };

  useEffect(() => {
    try {
      const num = Number(epochInput);
      if (!isNaN(num) && num > 0) {
        const d = num > 1e11 ? new Date(num) : new Date(num * 1000);
        setEpochParsedDate(d.toLocaleString('zh-CN', { hour12: false }) + ` (${d.toISOString()})`);
      } else {
        setEpochParsedDate('无效的时间戳数值');
      }
    } catch {
      setEpochParsedDate('时间戳转换出错');
    }
  }, [epochInput]);

  // --- 4. TEXT DIFF ---
  const [diffOriginal, setDiffOriginal] = useState(
    `小红书文案第1版：\n为什么你总是感到焦虑？\n因为你总是在试图控制一切。\n试着放开手吧。`
  );
  const [diffModified, setDiffModified] = useState(
    `小红书文案第2版（优化钩子）：\n为什么你越用力摆脱焦虑，它越死死抓着你？\n因为“想要改变情绪”本身就是一种抓取。\n试试圣多纳经典的3步释放法。`
  );

  const getDiffLines = () => {
    const linesA = diffOriginal.split('\n');
    const linesB = diffModified.split('\n');
    const max = Math.max(linesA.length, linesB.length);
    const result = [];
    for (let i = 0; i < max; i++) {
      const a = linesA[i] !== undefined ? linesA[i] : null;
      const b = linesB[i] !== undefined ? linesB[i] : null;
      const isSame = a === b;
      result.push({ index: i + 1, a, b, isSame });
    }
    return result;
  };

  // --- 5. REGEX LAB ---
  const [regexPattern, setRegexPattern] = useState(String.raw`#[\u4e00-\u9fa5a-zA-Z0-9_]+`);
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexTestText, setRegexTestText] = useState(
    `小红书发布文案示例：今天聊聊 #圣多纳释放法 与 #情绪疗愈 ，学会 #接纳与臣服 ，告别 #精神内耗 ！`
  );
  const [regexMatches, setRegexMatches] = useState<string[]>([]);
  const [regexError, setRegexError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setRegexError(null);
      if (!regexPattern) {
        setRegexMatches([]);
        return;
      }
      const reg = new RegExp(regexPattern, regexFlags);
      const matches = regexTestText.match(reg) || [];
      setRegexMatches(matches);
    } catch (err: unknown) {
      if (err instanceof Error) setRegexError(err.message);
      else setRegexError('正则表达式语法错误');
      setRegexMatches([]);
    }
  }, [regexPattern, regexFlags, regexTestText]);

  // --- 6. COLOR & CONTRAST STUDIO ---
  const [fgColor, setFgColor] = useState('#2D2326');
  const [bgColor, setBgColor] = useState('#FDF4F5');

  const getLuminance = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = (fg: string, bg: string) => {
    try {
      const l1 = getLuminance(fg);
      const l2 = getLuminance(bg);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      return Number(ratio.toFixed(2));
    } catch {
      return 1;
    }
  };

  const contrastRatio = getContrastRatio(fgColor, bgColor);

  // --- 7. JWT INSPECTOR ---
  const [jwtToken, setJwtToken] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNlZG9uYSBIZWFsaW5nIiwicm9sZSI6ImNyZWF0b3IiLCJpYXQiOjE3NzI0NTYwMDAsImV4cCI6MTc3NTA1NjAwMH0.J1g76_q7p8X8n_example'
  );
  const [jwtHeader, setJwtHeader] = useState('');
  const [jwtPayload, setJwtPayload] = useState('');
  const [jwtError, setJwtError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setJwtError(null);
      const parts = jwtToken.trim().split('.');
      if (parts.length < 2) {
        setJwtError('JWT 应包含至少用点号分隔的 3 个部分');
        setJwtHeader('');
        setJwtPayload('');
        return;
      }
      const decodeB64 = (str: string) => {
        let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        return decodeURIComponent(escape(atob(b64)));
      };
      const headerObj = JSON.parse(decodeB64(parts[0]));
      const payloadObj = JSON.parse(decodeB64(parts[1]));
      setJwtHeader(JSON.stringify(headerObj, null, 2));
      setJwtPayload(JSON.stringify(payloadObj, null, 2));
    } catch {
      setJwtError('JWT 解码失败');
    }
  }, [jwtToken]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Tool Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#F2DFE4] rounded-2xl overflow-x-auto scrollbar-none shadow-xs">
        {[
          { id: 'json', label: 'JSON 工作室', icon: Braces },
          { id: 'base64', label: 'Base64 & URL 转换', icon: Binary },
          { id: 'hash-uuid', label: '哈希 · UUID · 时间戳', icon: Hash },
          { id: 'diff', label: '文案代码对比 Diff', icon: GitCompare },
          { id: 'regex', label: '小红书标签与正则', icon: Code2 },
          { id: 'contrast', label: '封面色彩对比度', icon: Palette },
          { id: 'jwt', label: 'JWT 令牌解密', icon: KeyRound },
        ].map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id as ActiveTool);
                playChime('click');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs rounded-xl whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#2D2326] text-white font-medium shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#FAF0F3]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: JSON STUDIO */}
      {activeTool === 'json' && (
        <div className="p-6 rounded-2xl border border-[#F2DFE4] bg-white shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#2D2326]">JSON 校验 · 格式化 · 压缩</h2>
              <div className="text-xs text-neutral-400 mt-0.5">纯本地计算，保护自媒体配置与隐私数据安全</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFormatJson(2)}
                className="px-3 py-1.5 text-xs bg-[#FDF4F5] hover:bg-[#FAF0F3] text-[#2D2326] rounded-lg transition-colors border border-[#F2DFE4]"
              >
                美化 (2 空格)
              </button>
              <button
                onClick={handleMinifyJson}
                className="px-3 py-1.5 text-xs bg-[#FDF4F5] hover:bg-[#FAF0F3] text-[#2D2326] rounded-lg transition-colors border border-[#F2DFE4]"
              >
                压缩单行
              </button>
              <button
                onClick={() => handleCopy('json', jsonInput)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-[#2D2326] text-white font-medium rounded-lg transition-colors shadow-xs"
              >
                {copiedKey === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'json' ? '已复制' : '复制 JSON'}</span>
              </button>
            </div>
          </div>

          {jsonError && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>语法错误: {jsonError}</span>
            </div>
          )}

          <textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setJsonError(null);
            }}
            rows={12}
            className="w-full p-4 font-mono text-xs bg-[#FDF4F5]/40 border border-[#F2DFE4] rounded-xl text-[#2D2326] focus:outline-none focus:border-[#D9AAB6] focus:bg-white leading-relaxed resize-y"
          />
        </div>
      )}

      {/* TOOL 2: BASE64 & URL */}
      {activeTool === 'base64' && (
        <div className="p-6 rounded-2xl border border-[#F2DFE4] bg-white shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#2D2326]">多进制与编码转换</h2>
              <div className="text-xs text-neutral-400 mt-0.5">支持 Base64、URL 编码、Hex 十六进制转换</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-[#FDF4F5] border border-[#F2DFE4] rounded-lg text-xs">
                {(['base64', 'url', 'hex'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setTransMode(m)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      transMode === m ? 'bg-white text-[#2D2326] font-bold shadow-xs' : 'text-neutral-500'
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setTransDirection(transDirection === 'encode' ? 'decode' : 'encode');
                  setTransInput(transOutput || transInput);
                  playChime('click');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#FDF4F5] border border-[#F2DFE4] text-[#2D2326] rounded-lg transition-colors"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>{transDirection === 'encode' ? '转为解码' : '转为编码'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-600">
                输入 ({transDirection === 'encode' ? '原文' : '已编码'})
              </span>
              <textarea
                value={transInput}
                onChange={(e) => setTransInput(e.target.value)}
                rows={8}
                className="w-full p-3 font-mono text-xs bg-[#FDF4F5]/40 border border-[#F2DFE4] rounded-xl text-[#2D2326] focus:outline-none focus:border-[#D9AAB6] focus:bg-white resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
                <span>转换结果 ({transDirection === 'encode' ? '已编码' : '明文'})</span>
                <button
                  onClick={() => handleCopy('transOut', transOutput)}
                  className="text-xs text-[#8C5D68] hover:text-[#5A3841] flex items-center gap-1"
                >
                  {copiedKey === 'transOut' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'transOut' ? '已复制' : '复制'}</span>
                </button>
              </div>
              <textarea
                value={transOutput}
                readOnly
                rows={8}
                className="w-full p-3 font-mono text-xs bg-[#FDF4F5]/70 border border-[#F2DFE4] rounded-xl text-[#2D2326] focus:outline-none resize-y"
              />
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: HASH, UUID & TIMESTAMP */}
      {activeTool === 'hash-uuid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-[#F2DFE4] bg-white shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#2D2326]">哈希摘要计算</h2>
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-[#FDF4F5]/40 border border-[#F2DFE4] rounded-lg text-[#2D2326] focus:outline-none"
            />
            <div className="space-y-3">
              {[
                { label: 'MD5 (32位)', val: md5Val, key: 'md5' },
                { label: 'SHA-256 (64位)', val: sha256Val, key: 'sha256' },
                { label: 'SHA-1 (40位)', val: sha1Val, key: 'sha1' },
              ].map((item) => (
                <div key={item.key} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>{item.label}</span>
                    <button
                      onClick={() => handleCopy(item.key, item.val)}
                      className="text-[#8C5D68] hover:underline"
                    >
                      {copiedKey === item.key ? '已复制' : '复制'}
                    </button>
                  </div>
                  <div className="p-2 font-mono text-xs bg-[#FDF4F5]/80 border border-[#F5E2E7] rounded-lg text-[#2D2326] break-all select-all">
                    {item.val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-[#F2DFE4] bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2D2326]">批量 UUID v4 生成</h3>
                <button
                  onClick={() => handleGenerateUUIDs(5)}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-[#FDF4F5] border border-[#F2DFE4] rounded-lg text-[#2D2326]"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>刷新生成</span>
                </button>
              </div>

              <div className="space-y-1 max-h-36 overflow-y-auto">
                {uuids.map((u, i) => (
                  <div
                    key={i}
                    onClick={() => handleCopy(`uuid_${i}`, u)}
                    className="p-1.5 px-2.5 text-xs font-mono bg-[#FDF4F5]/50 border border-[#F5E2E7] rounded-md text-[#2D2326] cursor-pointer hover:bg-white flex justify-between"
                  >
                    <span>{u}</span>
                    <span className="text-[10px] text-neutral-400">点击复制</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-[#F2DFE4] bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2D2326]">Unix 时间戳转换</h3>
                <span className="text-xs font-mono font-bold text-purple-700">{currentEpoch}</span>
              </div>
              <input
                type="text"
                value={epochInput}
                onChange={(e) => setEpochInput(e.target.value)}
                placeholder="输入时间戳..."
                className="w-full px-3 py-2 text-xs font-mono bg-[#FDF4F5]/40 border border-[#F2DFE4] rounded-lg text-[#2D2326]"
              />
              <div className="p-2.5 bg-[#FAF0F3] rounded-lg text-xs font-mono text-[#2D2326]">
                {epochParsedDate}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: TEXT DIFF */}
      {activeTool === 'diff' && (
        <div className="p-6 rounded-2xl border border-[#F2DFE4] bg-white shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#2D2326]">文案迭代与代码对比 Diff</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-neutral-600 block mb-1">初版原稿</span>
              <textarea
                value={diffOriginal}
                onChange={(e) => setDiffOriginal(e.target.value)}
                rows={5}
                className="w-full p-3 font-mono text-xs bg-[#FDF4F5]/40 border border-[#F2DFE4] rounded-xl text-[#2D2326]"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 block mb-1">修订优化版</span>
              <textarea
                value={diffModified}
                onChange={(e) => setDiffModified(e.target.value)}
                rows={5}
                className="w-full p-3 font-mono text-xs bg-[#FDF4F5]/40 border border-[#F2DFE4] rounded-xl text-[#2D2326]"
              />
            </div>
          </div>

          <div className="border border-[#F2DFE4] rounded-xl overflow-hidden bg-white text-xs font-mono">
            {getDiffLines().map((row) => (
              <div
                key={row.index}
                className={`grid grid-cols-12 px-3 py-1.5 border-b border-[#FAF0F3] ${
                  row.isSame ? 'text-neutral-600' : 'bg-amber-50/60'
                }`}
              >
                <div className="col-span-1 text-neutral-400 select-none">{row.index}</div>
                <div className={`col-span-5 truncate pr-2 ${!row.isSame ? 'text-rose-700 font-semibold' : ''}`}>
                  {row.a || <span className="text-neutral-300">[空]</span>}
                </div>
                <div className={`col-span-6 truncate pl-2 ${!row.isSame ? 'text-emerald-700 font-semibold' : ''}`}>
                  {row.b || <span className="text-neutral-300">[空]</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 5: REGEX */}
      {activeTool === 'regex' && (
        <div className="p-6 rounded-2xl border border-[#F2DFE4] bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#2D2326]">小红书标签与正则表达式实验室</h2>
            <span className="text-xs text-neutral-500 font-mono">命中: {regexMatches.length} 个</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              className="flex-1 px-3 py-2 font-mono text-xs bg-[#FDF4F5]/40 border border-[#F2DFE4] rounded-lg text-[#2D2326]"
            />
            <input
              type="text"
              value={regexFlags}
              onChange={(e) => setRegexFlags(e.target.value)}
              className="w-16 px-3 py-2 font-mono text-xs bg-[#FDF4F5]/40 border border-[#F2DFE4] rounded-lg text-[#2D2326] text-center"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-neutral-600 block mb-1">测试文案</span>
              <textarea
                value={regexTestText}
                onChange={(e) => setRegexTestText(e.target.value)}
                rows={6}
                className="w-full p-3 font-mono text-xs bg-[#FDF4F5]/40 border border-[#F2DFE4] rounded-xl text-[#2D2326]"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 block mb-1">抓取捕获列表</span>
              <div className="p-3 bg-[#FAF0F3] border border-[#F5E2E7] rounded-xl h-40 overflow-y-auto space-y-1 font-mono text-xs">
                {regexMatches.map((m, i) => (
                  <div key={i} className="p-1 bg-white rounded border border-[#F2DFE4] text-[#2D2326]">
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 6: CONTRAST */}
      {activeTool === 'contrast' && (
        <div className="p-6 rounded-2xl border border-[#F2DFE4] bg-white shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#2D2326]">小红书封面色彩与对比度评估</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#F2DFE4] bg-[#FDF4F5]/50 flex justify-between items-center">
              <div>
                <span className="text-xs text-neutral-500 block">文字前景色</span>
                <span className="font-mono text-sm font-bold text-[#2D2326]">{fgColor}</span>
              </div>
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-9 h-9" />
            </div>
            <div className="p-4 rounded-xl border border-[#F2DFE4] bg-[#FDF4F5]/50 flex justify-between items-center">
              <div>
                <span className="text-xs text-neutral-500 block">背景底色</span>
                <span className="font-mono text-sm font-bold text-[#2D2326]">{bgColor}</span>
              </div>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-9 h-9" />
            </div>
          </div>

          <div className="p-6 rounded-xl border border-[#F2DFE4] bg-[#FAF0F3] flex justify-between items-center">
            <div>
              <span className="text-xs text-neutral-500">对比度比值</span>
              <div className="text-3xl font-bold font-mono text-[#2D2326] mt-1">{contrastRatio} : 1</div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold ${contrastRatio >= 4.5 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {contrastRatio >= 4.5 ? '✓ 视觉清晰易读' : '✕ 对比度偏弱'}
              </span>
            </div>
          </div>

          <div
            className="p-8 rounded-2xl border border-[#F2DFE4] text-center space-y-1"
            style={{ backgroundColor: bgColor, color: fgColor }}
          >
            <h3 className="text-lg font-bold">小红书封面大字视觉效果预览</h3>
            <p className="text-xs opacity-90">《为什么越想摆脱焦虑，焦虑反而越紧？》</p>
          </div>
        </div>
      )}

      {/* TOOL 7: JWT */}
      {activeTool === 'jwt' && (
        <div className="p-6 rounded-2xl border border-[#F2DFE4] bg-white shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#2D2326]">JWT 令牌解码查看</h2>
          <textarea
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
            rows={2}
            className="w-full p-3 font-mono text-xs bg-[#FDF4F5]/40 border border-[#F2DFE4] rounded-xl text-[#2D2326]"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <span className="text-neutral-500 block mb-1">Header</span>
              <pre className="p-3 bg-[#FAF0F3] border border-[#F2DFE4] rounded-xl overflow-x-auto min-h-24">
                {jwtHeader || '// 空'}
              </pre>
            </div>
            <div>
              <span className="text-neutral-500 block mb-1">Payload</span>
              <pre className="p-3 bg-[#FAF0F3] border border-[#F2DFE4] rounded-xl overflow-x-auto min-h-24">
                {jwtPayload || '// 空'}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
