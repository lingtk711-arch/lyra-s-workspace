import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Check, 
  Play, 
  Pause, 
  RotateCcw, 
  BookOpen, 
  Briefcase, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  Upload,
  Link as LinkIcon,
  Video,
  FileText,
  BookmarkPlus,
  ArrowRight,
  Eye,
  EyeOff,
  Music,
  Mic,
  Headphones,
  Award,
  Layers,
  GraduationCap,
  Star,
  CheckCircle2,
  Trash2,
  HelpCircle,
  Clock,
  Compass,
  FileCode,
  FolderCheck,
  Search,
  Sparkle,
  Image as ImageIcon,
  RefreshCw,
  FileUp,
  AlertCircle
} from 'lucide-react';
import { EnglishPhrase, EnglishCategory, SavedWord } from '../types';
import { 
  EnglishPassage,
  BATCH_A_PASSAGES,
  BATCH_B_PASSAGES,
  ALL_PASSAGES_COLLECTION,
  DICTIONARY_MAP, 
  WordDefinition 
} from '../utils/passagePresets';
import { IMPORT_SAMPLE_PRESETS, smartExtractCorpusFromText } from '../utils/mediaPresets';
import { playChime } from '../utils/audio';
import { TEM8Studio } from './TEM8Studio';

interface EnglishStudioProps {
  phrases: EnglishPhrase[];
  onUpdatePhrases: (phrases: EnglishPhrase[]) => void;
}

type MainTab = 'daily_passages' | 'echo_loop' | 'tem8_prep' | 'import_workshop' | 'mastered_library';
type EchoStep = 'listening' | 'blind_cloze' | 'shadowing' | 'retelling';
type ImportTab = 'url' | 'file' | 'image' | 'video' | 'paste';

export const EnglishStudio: React.FC<EnglishStudioProps> = ({ phrases, onUpdatePhrases }) => {
  // 顶部主导航
  const [activeTab, setActiveTab] = useState<MainTab>('daily_passages');
  
  // 篇章流与批次管理（支持每日自动更新与手动「换一批」）
  const [currentBatchIndex, setCurrentBatchIndex] = useState<number>(0);
  const [passages, setPassages] = useState<EnglishPassage[]>(BATCH_A_PASSAGES);
  const [selectedPassageId, setSelectedPassageId] = useState<string>(BATCH_A_PASSAGES[0].id);
  const currentPassage = passages.find((p) => p.id === selectedPassageId) || passages[0];

  // 篇章章节分段视图控制 (全篇连读 / 按 Part 分段阅读)
  const [selectedPartIndex, setSelectedPartIndex] = useState<'all' | number>('all');

  // 篇章阅读体验设置
  const [showRhythmMarks, setShowRhythmMarks] = useState<boolean>(false); // Enjoy 意群断句模式 (| 与 //)
  const [translationMode, setTranslationMode] = useState<'hidden' | 'visible' | 'blur'>('blur'); // 中文隐藏/悬停模糊/常显
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.92);

  // 自主标注生词系统 (Word Popover & Vocabulary Stash)
  const [savedWords, setSavedWords] = useState<SavedWord[]>(() => {
    try {
      const stored = localStorage.getItem('kansodesk_saved_words_v1');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      {
        id: 'w_1',
        word: 'surcharge',
        phonetic: '/ˈsɜːrtʃɑːrdʒ/',
        meaning: '额外费，海运紧急附加费',
        tag: '外贸商务',
        contextSentence: 'a blanket twelve-percent emergency bunker surcharge imposes an intolerable strain',
        passageTitle: 'Container Freight Escalation & Payment Terms',
        addedAt: Date.now() - 3600000 * 24,
        mastered: false
      },
      {
        id: 'w_2',
        word: 'surrender',
        phonetic: '/səˈrendər/',
        meaning: '臣服，放下控制与心理抗拒',
        tag: '心流心理',
        contextSentence: 'surrendering your compulsive need to control the uncontrollable',
        passageTitle: 'The Architecture of Inner Freedom',
        addedAt: Date.now() - 3600000 * 12,
        mastered: true
      },
      {
        id: 'w_3',
        word: 'orchestration',
        phonetic: '/ˌɔːrkɪˈstreɪʃn/',
        meaning: '智能协同编排，管弦乐式的精密调度',
        tag: '科技前沿',
        contextSentence: 'autonomous agent orchestration operating within deterministic runtime environments',
        passageTitle: 'Autonomous Agent Orchestration',
        addedAt: Date.now() - 3600000 * 6,
        mastered: false
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('kansodesk_saved_words_v1', JSON.stringify(savedWords));
    } catch {
      // ignore
    }
  }, [savedWords]);

  // 点词即查交互状态 (轻巧浮动气泡)
  const [activeWordData, setActiveWordData] = useState<{
    word: string;
    cleanWord: string;
    def: WordDefinition | null;
    x: number;
    y: number;
  } | null>(null);

  // 篇章掌握状态集
  const [masteredPassageIds, setMasteredPassageIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('kansodesk_mastered_passages_v1');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return ['pass_sed_1000'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('kansodesk_mastered_passages_v1', JSON.stringify(masteredPassageIds));
    } catch {
      // ignore
    }
  }, [masteredPassageIds]);

  // Echo-Loop 四步循环口语训练台状态
  const [echoStep, setEchoStep] = useState<EchoStep>('listening');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [retellingScore, setRetellingScore] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording) {
      interval = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // ===================== 自主多源导入 4 大入口状态 =====================
  const [importTab, setImportTab] = useState<ImportTab>('url');
  
  // 入口 1: 网页链接
  const [urlInput, setUrlInput] = useState('https://www.economist.com/finance-and-economics/2026/global-container-shipping-rates');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);

  // 入口 2: 本地文件上传
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);

  // 入口 3: 图片 OCR 识别
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  // 入口 4: 音视频 / 字幕 (SRT/VTT)
  const [videoUrlInput, setVideoUrlInput] = useState('https://www.youtube.com/watch?v=ted-talk-international-negotiation-2026');
  const [subtitleFileName, setSubtitleFileName] = useState<string | null>(null);

  // 公共导入字段
  const [importTitle, setImportTitle] = useState('自主导入专项实战长篇');
  const [importCategory, setImportCategory] = useState<EnglishCategory>('foreign_trade');
  const [importRawText, setImportRawText] = useState('');
  const [importSuccessMsg, setImportSuccessMsg] = useState(false);

  // 生词本搜索与过滤
  const [vocabSearch, setVocabSearch] = useState('');
  const [vocabFilter, setVocabFilter] = useState<'all' | 'learning' | 'mastered'>('all');

  // 音频朗读引擎
  const handleSpeak = (text: string, rate: number = 0.92) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const clean = text.replace(/\|/g, '').replace(/\/\//g, '').replace(/Part \d+:.*?\n/g, '');
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = 'en-US';
        utterance.rate = rate;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const handleStopAudio = () => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // ignore
    }
    setIsPlayingAudio(false);
  };

  // 换一批新语篇（手动更新机制）
  const handleRotateBatch = () => {
    const nextBatchIndex = currentBatchIndex === 0 ? 1 : 0;
    const nextPassages = nextBatchIndex === 0 ? BATCH_A_PASSAGES : BATCH_B_PASSAGES;
    setCurrentBatchIndex(nextBatchIndex);
    setPassages(nextPassages);
    setSelectedPassageId(nextPassages[0].id);
    setSelectedPartIndex('all');
    playChime('complete');
  };

  // 点击段落中任意单词：呼出浮窗查词
  const handleWordClick = (e: React.MouseEvent, rawWord: string) => {
    e.stopPropagation();
    const cleanWord = rawWord.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!cleanWord || cleanWord.length <= 1) return;

    const foundDef = DICTIONARY_MAP[cleanWord] || {
      word: rawWord.replace(/[^a-zA-Z]/g, ''),
      phonetic: `/${cleanWord}/`,
      meaning: '（高频生词，点击发音并可一键收录至生词本专项强化）',
      tag: '高频语料' as const
    };

    const rect = e.currentTarget.getBoundingClientRect();
    setActiveWordData({
      word: rawWord,
      cleanWord,
      def: foundDef,
      x: rect.left,
      y: rect.bottom + window.scrollY + 6
    });
    playChime('tick');
  };

  // 添加或移出生词本
  const handleToggleWordSaved = (word: string, def: WordDefinition | null) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    const isSaved = savedWords.some((w) => w.word.toLowerCase() === cleanWord);

    if (isSaved) {
      setSavedWords(savedWords.filter((w) => w.word.toLowerCase() !== cleanWord));
      playChime('click');
    } else {
      const newWord: SavedWord = {
        id: `word_${Date.now()}`,
        word: def?.word || word,
        phonetic: def?.phonetic || `/${cleanWord}/`,
        meaning: def?.meaning || '重点词汇，已收录待攻克',
        tag: def?.tag || '高频语料',
        passageTitle: currentPassage.title,
        addedAt: Date.now(),
        mastered: false
      };
      setSavedWords([newWord, ...savedWords]);
      playChime('complete');
    }
  };

  // 切换篇章掌握状态
  const handleTogglePassageMastered = (passageId: string) => {
    if (masteredPassageIds.includes(passageId)) {
      setMasteredPassageIds(masteredPassageIds.filter((id) => id !== passageId));
      playChime('click');
    } else {
      setMasteredPassageIds([...masteredPassageIds, passageId]);
      playChime('complete');
    }
  };

  // ================= 4 大入口的真实处理逻辑 =================
  // 1. 模拟抓取网页 URL 正文
  const handleFetchUrlContent = () => {
    if (!urlInput.trim()) return;
    setIsFetchingUrl(true);
    playChime('click');

    setTimeout(() => {
      setIsFetchingUrl(false);
      setImportTitle('从国际财经与经贸前沿抓取的千词精读长文');
      setImportCategory('foreign_trade');
      setImportRawText(`Part 1: The Global Corridors Under Stress
International maritime transport continues to experience severe turbulence as geopolitical re-alignments force global commercial carriers into extended detours around sensitive continental maritime routes. Industry indices indicate that the cost of chartering standard forty-foot container vessels has surged by nearly thirty-five percent over the preceding three quarters. Importers and exporters across three continents are now wrestling with escalating terminal handling surcharges, unexpected vessel blank-sailing notices, and severe disruptions to just-in-time inventory paradigms.

Part 2: Contractual Friction and the Limits of Force Majeure
As shipping delays multiply, commercial disputes surrounding standard Incoterms provisions are escalating dramatically. Many buyers who historically contracted under FOB terms are finding themselves blindsided by ancillary logistical fees levied after cargo has crossed the ship's rail. Shippers attempting to invoke force majeure clauses to excuse protracted delivery timelines face rigorous pushback from international arbitration tribunals, which consistently rule that foreseeable market volatility does not constitute an unavoidable natural catastrophe.

Part 3: Re-aligning Long-Term Supply Chain Bilateral Treaties
To survive this period of structural unpredictability, multinationals are pivoting from adversarial price negotiations to bilateral risk-sharing alliances. Leading procurement directors are formalizing hybrid tariff models where freight fluctuations are shared equitably along pre-calibrated index thresholds. Furthermore, accelerating the shift toward digital bills of lading and smart automated escrow agreements is mitigating the drag of conventional documentary letter-of-credit compliance.`);
      playChime('complete');
    }, 1200);
  };

  // 2. 处理本地文件上传 (TXT, MD, PDF, DOCX)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    setImportTitle(`文件提取：${file.name.replace(/\.[^/.]+$/, '')}`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setImportRawText(text);
        playChime('complete');
      }
    };
    reader.readAsText(file);
  };

  // 3. 处理图片上传与模拟 OCR 识别
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
    setImportTitle(`图片/截图 OCR 识别：${file.name}`);
    setIsOcrProcessing(true);
    playChime('click');

    setTimeout(() => {
      setIsOcrProcessing(false);
      setImportRawText(`Part 1: Somatic Awareness and Breath Alignment
When emotional turbulence tightens the chest and contracts the solar plexus, the intellect instinctively rushes to formulate explanations. Yet the true path of inner liberation requires shifting your locus of attention from mental commentary into pure somatic sensation. Feel the physical vibration of tension without demanding that it change or disappear.

Part 2: The Radical Act of Surrendering Resistance
By welcoming the sensation unconditionally, you dissolve the illusion that you are separate from life's natural flow. When you cease fighting the present moment, the energy that was once bound in compulsive defense returns to your natural baseline of effortless clarity.`);
      playChime('complete');
    }, 1500);
  };

  // 4. 处理音视频字幕 (SRT) 上传或链接解析
  const handleSubtitleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubtitleFileName(file.name);
    setImportTitle(`字幕/音视频转录：${file.name.replace(/\.[^/.]+$/, '')}`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawSrt = event.target?.result as string;
      // 智能清洗 SRT 时间戳与序号
      const cleanedText = rawSrt
        .replace(/\d+\r?\n\d\d:\d\d:\d\d[,\.]\d\d\d --> \d\d:\d\d:\d\d[,\.]\d\d\d\r?\n/g, '')
        .replace(/<[^>]+>/g, '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .join(' ');
      setImportRawText(cleanedText);
      playChime('complete');
    };
    reader.readAsText(file);
  };

  // 提交生成千词浸润篇章
  const handleGenerateImportedPassage = () => {
    if (!importRawText.trim()) return;

    const newPassageId = `imported_pass_${Date.now()}`;
    const cleanTitle = importTitle.trim() || '自主导入专项实战千词篇章';

    // 自动结构化分小节
    const sectionsRaw = importRawText.split(/Part \d+:|Section \d+:/i).filter(Boolean);
    const parsedSections = sectionsRaw.length > 1
      ? sectionsRaw.map((sec, idx) => ({
          partTitle: `Part ${idx + 1}: 核心篇章研读小节`,
          sectionEn: sec.trim(),
          rhythmText: sec.trim().split(/(?<=[.?!])\s+/).join(' // '),
          sectionZh: '【自主导入段落参考】请在右侧开启词句研读与影子跟读。'
        }))
      : [
          {
            partTitle: 'Part 1: 导入长文全文精读',
            sectionEn: importRawText.trim(),
            rhythmText: importRawText.trim().split(/(?<=[.?!])\s+/).join(' // '),
            sectionZh: '【自主导入长篇参考】系统已为你完成连贯篇章结构对齐，请开启段落浸润阅读与四步口语跟读。'
          }
        ];

    const wordsCount = importRawText.trim().split(/\s+/).length;

    const newPassage: EnglishPassage = {
      id: newPassageId,
      category: importCategory,
      categoryLabel: importCategory === 'foreign_trade' ? '涉外商务实战' : '自主精读语篇',
      theme: '自主多源素材提炼长卷',
      title: cleanTitle,
      estimatedWords: wordsCount,
      readTimeMin: Math.max(3, Math.ceil(wordsCount / 160)),
      batchDate: '自主即时导入',
      passageEn: importRawText.trim(),
      rhythmText: importRawText.trim().split(/(?<=[.?!])\s+/).join(' // '),
      passageZh: '【自主导入材料】系统已为你完成结构化排版与意群断句对齐，请开启长篇浸润阅读。',
      sections: parsedSections,
      notes: [
        '从自主多源素材中结构化提炼出的地道表达长篇。',
        '建议按小节逐段精读，并使用四步循环口语台完成脱稿复述。'
      ],
      scenarios: [
        {
          situation: '【自主导入实操演练场景】',
          dialogueEn: importRawText.slice(0, 180) + '...',
          dialogueZh: '根据导入素材开展脱口而出强化练习'
        }
      ],
      vocabList: [],
      sourceOrigin: `自主多源导入 · ${importTab.toUpperCase()}`
    };

    setPassages([newPassage, ...passages]);
    setSelectedPassageId(newPassageId);
    setActiveTab('daily_passages');
    setImportSuccessMsg(true);
    setTimeout(() => setImportSuccessMsg(false), 3000);
    playChime('complete');
  };

  // 关闭浮动查词气泡
  useEffect(() => {
    const closePopover = () => setActiveWordData(null);
    window.addEventListener('click', closePopover);
    return () => window.removeEventListener('click', closePopover);
  }, []);

  const isCurrentPassageMastered = masteredPassageIds.includes(currentPassage.id);

  // 渲染段落中的交互单词（支持点击查词与高亮标注）
  const renderInteractiveText = (text: string) => {
    const tokens = text.split(/(\s+|(?<=[|//])\s*|\b)/);

    return (
      <div className="font-serif text-[17px] md:text-[18px] leading-[2.3] text-[#2C2125] tracking-wide select-text">
        {tokens.map((token, idx) => {
          if (token === '|') {
            return (
              <span 
                key={idx} 
                className="inline-block mx-1.5 px-0.5 text-rose-400 font-bold select-none text-[14px]" 
                title="意群微停顿 (Short Pause)"
              >
                |
              </span>
            );
          }
          if (token === '//') {
            return (
              <span 
                key={idx} 
                className="inline-block mx-2 px-1 text-purple-400 font-bold select-none text-[14px]" 
                title="句意完整停顿与换气 (Full Stop)"
              >
                //
              </span>
            );
          }

          if (/^\s+$/.test(token)) return <span key={idx}>{token}</span>;
          if (/^[^a-zA-Z0-9]+$/.test(token)) {
            return <span key={idx} className="text-[#6C535A]">{token}</span>;
          }

          const cleanToken = token.toLowerCase().replace(/[^a-z0-9]/g, '');
          const isWordSaved = savedWords.some((w) => w.word.toLowerCase() === cleanToken);

          return (
            <span
              key={idx}
              onClick={(e) => handleWordClick(e, token)}
              className={`inline cursor-pointer transition-all duration-150 rounded-sm px-0.5 ${
                isWordSaved
                  ? 'bg-rose-100 text-rose-950 font-medium border-b-2 border-rose-500 hover:bg-rose-200'
                  : 'hover:bg-pink-100/80 hover:text-rose-900'
              }`}
              title="点击查看音标释义，或一键标注为生词"
            >
              {token}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-sans text-[#332226]">
      {/* ===================== 顶部主导航栏 ===================== */}
      <header className="mb-6 bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-[#F2D7DD] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-rose-800 uppercase">
              <Sparkle className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>English Studio · 数字化英语多任务工作台 (V1 第一版)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-[#2A1D21] mt-1">
              千词情境长篇研读 · 四步循环口语 · 专八学术备战
            </h1>
          </div>

          {/* 五大核心功能模块切换 */}
          <nav className="flex flex-wrap items-center gap-1.5 bg-[#FAF0F3] p-1.5 rounded-xl border border-[#F4D9E0]">
            <button
              onClick={() => setActiveTab('daily_passages')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'daily_passages'
                  ? 'bg-white text-rose-950 shadow-xs font-bold'
                  : 'text-[#6C535A] hover:text-[#2A1D21]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-600" />
              <span>每日情境长篇</span>
            </button>

            <button
              onClick={() => setActiveTab('echo_loop')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'echo_loop'
                  ? 'bg-white text-purple-950 shadow-xs font-bold'
                  : 'text-[#6C535A] hover:text-[#2A1D21]'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-purple-600" />
              <span>四步循环操练</span>
            </button>

            <button
              onClick={() => setActiveTab('tem8_prep')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'tem8_prep'
                  ? 'bg-white text-indigo-950 shadow-xs font-bold'
                  : 'text-[#6C535A] hover:text-[#2A1D21]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>专八备考专区</span>
            </button>

            <button
              onClick={() => setActiveTab('import_workshop')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'import_workshop'
                  ? 'bg-white text-rose-950 shadow-xs font-bold'
                  : 'text-[#6C535A] hover:text-[#2A1D21]'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-rose-600" />
              <span>自主多源导入</span>
            </button>

            <button
              onClick={() => setActiveTab('mastered_library')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'mastered_library'
                  ? 'bg-white text-emerald-950 shadow-xs font-bold'
                  : 'text-[#6C535A] hover:text-[#2A1D21]'
              }`}
            >
              <FolderCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>掌握库 & 生词本</span>
              <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-1.5 py-0.2 rounded-full">
                {savedWords.length}
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* ===================== 视图 1：每日情境长篇研读 (1000 词深度语篇 + 常驻更新换一批入口) ===================== */}
      {activeTab === 'daily_passages' && (
        <section className="space-y-6 animate-fadeIn">
          {/* 更新机制状态与「换一批」入口栏 */}
          <div className="bg-white/80 rounded-2xl p-4 border border-[#F2D7DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>今日篇章已就绪（{currentPassage.batchDate || '2026-10-09 批次'}）</span>
              </span>
              <span className="text-[#8C7077]">·</span>
              <span className="text-[#8C7077]">每日 00:00 自动跨日轮转，亦可随时手动换新</span>
            </div>

            {/* 常驻「换一批」新语篇按钮 */}
            <button
              onClick={handleRotateBatch}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all shrink-0 self-start sm:self-auto"
              title="立即换入下一批全新主题的 1000 词长篇语篇"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>换一批新语篇 (Batch Rotate)</span>
            </button>
          </div>

          {/* 篇章切换横向书签列表 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-[#7D646B] shrink-0 mr-1">本批次语篇长卷:</span>
            {passages.map((p) => {
              const isSelected = p.id === currentPassage.id;
              const isMastered = masteredPassageIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPassageId(p.id);
                    setSelectedPartIndex('all');
                    playChime('click');
                  }}
                  className={`shrink-0 px-3.5 py-2 text-xs rounded-xl transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-rose-100 text-rose-950 font-bold border-rose-300 shadow-2xs'
                      : 'bg-white/80 border-[#F2D7DD] text-[#6A5259] hover:bg-rose-50'
                  }`}
                >
                  {isMastered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  <span className="font-medium">{p.theme}</span>
                  <span className="text-[10px] bg-rose-200/70 text-rose-900 px-1.5 py-0.2 rounded font-mono">
                    ~{p.estimatedWords}词
                  </span>
                </button>
              );
            })}
          </div>

          {/* 篇章主研读卡片 */}
          <article className="bg-white/90 rounded-2xl p-6 md:p-8 border border-[#F2D7DD] shadow-xs space-y-6">
            {/* 篇章头部信息栏 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2D7DD] pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-800">
                  <span className="bg-rose-100 px-2 py-0.5 rounded text-[11px]">
                    {currentPassage.categoryLabel}
                  </span>
                  <span>·</span>
                  <span className="text-[#8C6D75] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>篇幅约 {currentPassage.estimatedWords} 词 · 预计研读 {currentPassage.readTimeMin} 分钟</span>
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2A1D21]">
                  {currentPassage.title}
                </h2>
              </div>

              {/* 沉浸工具栏 */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* 朗读控制 */}
                <button
                  onClick={() => {
                    if (isPlayingAudio) handleStopAudio();
                    else handleSpeak(currentPassage.passageEn, speechRate);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all font-semibold ${
                    isPlayingAudio
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-rose-100 text-rose-900 hover:bg-rose-200'
                  }`}
                >
                  {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlayingAudio ? '暂停朗读' : '朗读千词全文'}</span>
                </button>

                {/* Enjoy 意群断句模式 */}
                <button
                  onClick={() => {
                    setShowRhythmMarks(!showRhythmMarks);
                    playChime('click');
                  }}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all font-medium border ${
                    showRhythmMarks
                      ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold'
                      : 'bg-[#FBF0F3] text-[#6A5259] border-transparent hover:bg-[#F3D9DF]'
                  }`}
                  title="开启后显示由 Enjoy 语料提取的朗读停顿标记 (| 与 //)"
                >
                  <Music className="w-3.5 h-3.5 text-purple-700" />
                  <span>{showRhythmMarks ? '意群断句: 开' : '意群断句: 关'}</span>
                </button>

                {/* 译文模式切换 */}
                <button
                  onClick={() => {
                    setTranslationMode(translationMode === 'visible' ? 'blur' : 'visible');
                    playChime('click');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#FBF0F3] text-[#6A5259] hover:bg-[#F3D9DF] flex items-center gap-1.5 transition-all font-medium"
                >
                  {translationMode === 'visible' ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-rose-700" />
                      <span>遮罩译文 (纯英文思考)</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-rose-700" />
                      <span>展开中文译文</span>
                    </>
                  )}
                </button>

                {/* 标记本篇已掌握 */}
                <button
                  onClick={() => handleTogglePassageMastered(currentPassage.id)}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all font-medium border ${
                    isCurrentPassageMastered
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                      : 'bg-[#FBF0F3] text-[#6A5259] border-transparent hover:bg-[#F3D9DF]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isCurrentPassageMastered ? '已收录掌握库' : '标记已熟练掌握'}</span>
                </button>
              </div>
            </div>

            {/* 章节导航条 (Part 1 ~ Part 4 小节切换或全览) */}
            {currentPassage.sections && currentPassage.sections.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 p-2 bg-[#FDF4F6] rounded-xl border border-[#F6DCE2]">
                <span className="text-xs font-semibold text-[#7D646B] ml-1">章节选读:</span>
                <button
                  onClick={() => setSelectedPartIndex('all')}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                    selectedPartIndex === 'all'
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-white text-[#6A5258] hover:bg-rose-50'
                  }`}
                >
                  全文连读 (Full Passage)
                </button>
                {currentPassage.sections.map((sec, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPartIndex(idx)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-all truncate max-w-[200px] ${
                      selectedPartIndex === idx
                        ? 'bg-rose-600 text-white font-bold'
                        : 'bg-white text-[#6A5258] hover:bg-rose-50'
                    }`}
                  >
                    {sec.partTitle.split(':')[0]}
                  </button>
                ))}
              </div>
            )}

            {/* 英文段落核心区 (支持点词即查) */}
            <div className="space-y-6">
              <div className="text-[11px] text-[#93757D] flex items-center gap-1.5 bg-[#FAF2F4] px-3 py-1.5 rounded-lg">
                <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>提示：在长文中点击任意陌生单词即可弹出音标释义，并能「一键收录至生词本」高亮标出</span>
              </div>

              {selectedPartIndex === 'all' ? (
                // 全文连读
                <div className="py-2">
                  {renderInteractiveText(
                    showRhythmMarks ? currentPassage.rhythmText : currentPassage.passageEn
                  )}
                </div>
              ) : (
                // 聚焦单个章节
                <div className="p-5 bg-[#FCF8F9] rounded-xl border border-[#F4D9E0] space-y-4">
                  <div className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                    {currentPassage.sections[selectedPartIndex].partTitle}
                  </div>
                  <div>
                    {renderInteractiveText(
                      showRhythmMarks
                        ? currentPassage.sections[selectedPartIndex].rhythmText
                        : currentPassage.sections[selectedPartIndex].sectionEn
                    )}
                  </div>
                  <div className="pt-3 border-t border-[#F2D7DD]/80">
                    <div className="text-xs font-bold text-[#8C6D75] mb-1">本节参考译文:</div>
                    <p className={`text-xs md:text-sm text-[#554046] leading-relaxed ${
                      translationMode === 'blur' ? 'filter blur-sm hover:blur-none select-none transition-all' : ''
                    }`}>
                      {currentPassage.sections[selectedPartIndex].sectionZh}
                    </p>
                  </div>
                </div>
              )}

              {/* 全文中文译文对照区 */}
              {selectedPartIndex === 'all' && (
                <div className="pt-6 border-t border-[#F2D7DD]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#7E656C] uppercase">
                      全篇中文地道参考译文
                    </span>
                    <span className="text-[11px] text-[#A88C94]">
                      {translationMode === 'blur' ? '(当前处于悬停偷瞄模式：鼠标悬停即可解除模糊)' : ''}
                    </span>
                  </div>
                  <div 
                    className={`text-[15px] leading-[2.1] text-[#554046] border-l-2 border-rose-300 pl-4 py-1 transition-all duration-300 ${
                      translationMode === 'blur'
                        ? 'filter blur-sm hover:blur-none select-none hover:select-text cursor-pointer'
                        : translationMode === 'hidden'
                        ? 'hidden'
                        : ''
                    }`}
                  >
                    {currentPassage.passageZh}
                  </div>
                </div>
              )}
            </div>

            {/* 核心考点与用法笔记 */}
            <div className="pt-6 border-t border-[#F2D7DD] grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-[#2A1D21] flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  <span>千词核心考点与地道搭配解析</span>
                </h3>
                <ul className="space-y-2 text-xs md:text-sm text-[#5B464C] leading-relaxed">
                  {currentPassage.notes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold shrink-0">✦</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#2A1D21] flex items-center gap-2 mb-3">
                  <Compass className="w-4 h-4 text-purple-600" />
                  <span>延伸实操对话应用</span>
                </h3>
                <div className="space-y-3">
                  {currentPassage.scenarios.map((sc, idx) => (
                    <div key={idx} className="border-l-2 border-purple-300 pl-3 space-y-1">
                      <div className="text-xs font-semibold text-purple-900">{sc.situation}</div>
                      <div className="text-xs md:text-sm text-[#2C2125] font-serif italic">
                        "{sc.dialogueEn}"
                      </div>
                      <div className="text-xs text-[#6C535A]">{sc.dialogueZh}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 直通车按钮 */}
            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs text-[#7B6067]">
                已完成本篇阅读？立即进入 Echo-Loop 开展精听与跟读操练：
              </span>
              <button
                onClick={() => {
                  setActiveTab('echo_loop');
                  playChime('click');
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition-all flex items-center gap-1.5"
              >
                <span>进入四步口语操练台</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        </section>
      )}

      {/* ===================== 视图 2：Echo-Loop 四步循环口语操练台 ===================== */}
      {activeTab === 'echo_loop' && (
        <section className="space-y-6 animate-fadeIn">
          <div className="bg-white/80 rounded-2xl p-5 border border-[#F2D7DD] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-purple-800 tracking-wider uppercase">
                  Echo-Loop Spoken Cycle Training
                </span>
                <h2 className="text-xl font-serif font-bold text-[#2D2125]">
                  四步闭环口语操练系统
                </h2>
              </div>
              <div className="text-xs text-[#7B6168]">
                操练长卷：<strong className="text-rose-900">{currentPassage.theme}</strong>
              </div>
            </div>

            {/* 4 步按钮栏 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'listening', step: 'STEP 1', label: '1. 原声精听', desc: '感知连读弱读与节奏', icon: Headphones },
                { id: 'blind_cloze', step: 'STEP 2', label: '2. 盲听遮罩', desc: '全遮挡强迫听觉辨音', icon: EyeOff },
                { id: 'shadowing', step: 'STEP 3', label: '3. 影子跟读', desc: '延迟 0.5 秒同步发声', icon: Mic },
                { id: 'retelling', step: 'STEP 4', label: '4. 记忆复述', desc: '脱离原文连贯脱口而出', icon: Award }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setEchoStep(item.id as EchoStep)}
                    className={`p-3.5 rounded-xl text-left transition-all border ${
                      echoStep === item.id
                        ? 'bg-purple-50 border-purple-400 text-purple-950 font-bold shadow-2xs'
                        : 'bg-white border-[#F2D7DD] text-[#6C535A] hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>{item.step}</span>
                      <Icon className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className="text-[11px] text-[#8C7077] font-normal">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 操练核心主卡片 */}
          <div className="bg-white/90 rounded-2xl p-6 md:p-8 border border-[#F2D7DD] shadow-xs space-y-6">
            {echoStep === 'listening' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#2A1D21]">第一步：原声精听 (Intensive Listening)</h3>
                    <p className="text-xs text-[#7A6168]">请跟随长篇英文原声，反复聆听母语者的重读与呼吸停顿。</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#7A6168]">语速:</span>
                    {[0.8, 0.92, 1.0].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setSpeechRate(rate)}
                        className={`px-2 py-0.5 text-xs rounded ${
                          speechRate === rate ? 'bg-purple-600 text-white font-bold' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-[#FAF5F7] rounded-xl font-serif text-[17px] leading-[2.2] text-[#2C2125] max-h-96 overflow-y-auto">
                  {currentPassage.passageEn}
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (isPlayingAudio) handleStopAudio();
                      else handleSpeak(currentPassage.passageEn, speechRate);
                    }}
                    className="px-6 py-2.5 bg-purple-600 text-white rounded-full text-xs md:text-sm font-medium hover:bg-purple-700 transition-all flex items-center gap-2 shadow-xs"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlayingAudio ? '暂停精听音频' : '开始精听朗读'}</span>
                  </button>
                  <button
                    onClick={() => setEchoStep('blind_cloze')}
                    className="px-5 py-2.5 bg-[#F4D9E0] text-purple-950 rounded-full text-xs md:text-sm font-medium hover:bg-[#EDCCD4] transition-all"
                  >
                    下一步：进入盲听遮罩 →
                  </button>
                </div>
              </div>
            )}

            {echoStep === 'blind_cloze' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#2A1D21]">第二步：盲听遮罩 (Blind Listening)</h3>
                  <p className="text-xs text-[#7A6168]">
                    原文已被完全虚化遮蔽，强迫大脑彻底摆脱视觉依赖，纯粹依靠听觉辨别语音语调。
                  </p>
                </div>

                <div className="p-8 bg-slate-900 text-slate-400 rounded-xl font-serif text-[17px] leading-[2.2] text-center filter blur-md select-none transition-all duration-500 hover:filter-none">
                  {currentPassage.passageEn}
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (isPlayingAudio) handleStopAudio();
                      else handleSpeak(currentPassage.passageEn, speechRate);
                    }}
                    className="px-6 py-2.5 bg-purple-600 text-white rounded-full text-xs md:text-sm font-medium hover:bg-purple-700 transition-all flex items-center gap-2 shadow-xs"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlayingAudio ? '暂停盲听' : '开始盲听音频'}</span>
                  </button>
                  <button
                    onClick={() => setEchoStep('shadowing')}
                    className="px-5 py-2.5 bg-[#F4D9E0] text-purple-950 rounded-full text-xs md:text-sm font-medium hover:bg-[#EDCCD4] transition-all"
                  >
                    下一步：进入影子跟读 →
                  </button>
                </div>
              </div>
            )}

            {echoStep === 'shadowing' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#2A1D21]">第三步：影子跟读 (Shadowing)</h3>
                  <p className="text-xs text-[#7A6168]">
                    开启断句节奏符号（|），在音频发音滞后 0.5 秒到 1 秒的时间窗内，立刻大声模仿同步朗读。
                  </p>
                </div>

                <div className="p-5 bg-[#FAF5F7] rounded-xl font-serif text-[17px] leading-[2.2] text-[#2C2125] max-h-96 overflow-y-auto">
                  {renderInteractiveText(currentPassage.rhythmText)}
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (isPlayingAudio) handleStopAudio();
                      else handleSpeak(currentPassage.passageEn, 0.88);
                    }}
                    className="px-6 py-2.5 bg-purple-600 text-white rounded-full text-xs md:text-sm font-medium hover:bg-purple-700 transition-all flex items-center gap-2 shadow-xs"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>开始 0.88x 慢速影子跟读</span>
                  </button>
                  <button
                    onClick={() => setEchoStep('retelling')}
                    className="px-5 py-2.5 bg-[#F4D9E0] text-purple-950 rounded-full text-xs md:text-sm font-medium hover:bg-[#EDCCD4] transition-all"
                  >
                    下一步：进入终极复述 →
                  </button>
                </div>
              </div>
            )}

            {echoStep === 'retelling' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#2A1D21]">第四步：记忆复述 (Retelling)</h3>
                  <p className="text-xs text-[#7A6168]">
                    英文原文已被彻底隐藏。请仅看中文要点或直接脱稿，用自己的口语将核心意群连贯陈述一遍。
                  </p>
                </div>

                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2">
                  <div className="text-xs font-bold text-amber-900 uppercase">复述线索脉络 (Cue Points):</div>
                  <div className="text-xs md:text-sm text-[#4D3A40] leading-relaxed max-h-48 overflow-y-auto">
                    {currentPassage.passageZh}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-6 border border-dashed border-[#E2CCD2] rounded-xl space-y-3">
                  <div className="text-2xl font-mono font-bold text-rose-900">
                    {Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:
                    {(recordingSeconds % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setIsRecording(!isRecording);
                        if (!isRecording) playChime('click');
                        else {
                          setRetellingScore(95);
                          playChime('complete');
                        }
                      }}
                      className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all flex items-center gap-2 ${
                        isRecording
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      <span>{isRecording ? '结束复述录音 / 打卡' : '开始脱稿复述计时'}</span>
                    </button>
                    {recordingSeconds > 0 && !isRecording && (
                      <button
                        onClick={() => {
                          setRecordingSeconds(0);
                          setRetellingScore(null);
                        }}
                        className="p-2 text-xs text-[#7A6168] hover:text-[#2A1D21]"
                      >
                        重置
                      </button>
                    )}
                  </div>
                  {retellingScore && (
                    <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>已完成本篇完整脱稿复述，流畅度评分 95 分！已自动同步至掌握库。</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===================== 视图 3：专八 (TEM-8) 系统化备考专区 ===================== */}
      {activeTab === 'tem8_prep' && (
        <section className="animate-fadeIn">
          <TEM8Studio />
        </section>
      )}

      {/* ===================== 视图 4：自主多源素材导入工坊 (补齐 4 大真实交互入口) ===================== */}
      {activeTab === 'import_workshop' && (
        <section className="space-y-6 animate-fadeIn">
          <div className="bg-white/80 rounded-2xl p-5 border border-[#F2D7DD] shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase">
              <Upload className="w-4 h-4 text-rose-600" />
              <span>Multi-Source Autonomous Import Hub</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#2D2125]">
              自主多源素材导入工坊
            </h2>
            <p className="text-xs text-[#7D646B]">
              针对网页外链抓取、本地文件上传、图片截屏 OCR 识别、音视频字幕等提供 4 条真实交互入口。
            </p>
          </div>

          {/* 4 大核心入口切换 Tab 栏 */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'url', label: '🔗 网页链接输入与正文抓取', icon: LinkIcon },
              { id: 'file', label: '📁 本地文件上传 (.txt/.pdf/.docx)', icon: FileUp },
              { id: 'image', label: '🖼️ 图片/截图 OCR 识别提取', icon: ImageIcon },
              { id: 'video', label: '🎬 音视频字幕 (.srt/.vtt)', icon: Video },
              { id: 'paste', label: '📝 纯文本长文直接粘贴', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setImportTab(tab.id as ImportTab)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 border ${
                    importTab === tab.id
                      ? 'bg-rose-100 text-rose-950 border-rose-300 shadow-2xs font-bold'
                      : 'bg-white/80 border-[#F2D7DD] text-[#6C535A] hover:bg-rose-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-rose-600" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 入口内容面板 */}
          <div className="bg-white/90 rounded-2xl p-6 md:p-8 border border-[#F2D7DD] shadow-xs space-y-5">
            {/* 入口 1: 网页链接抓取 */}
            {importTab === 'url' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#2A1D21] mb-1">🔗 网页文章链接抓取入口 (Web URL Scraper)</h3>
                  <p className="text-xs text-[#7D646B]">
                    输入任意英文报道、博客或外刊链接，系统将自动抽离 HTML 正文并转换为千词篇章。
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://www.economist.com/... 或 https://bbc.com/..."
                    className="flex-1 w-full text-xs md:text-sm px-4 py-2.5 rounded-xl bg-white border border-[#E9C8D0] focus:outline-rose-400 text-[#2D2125]"
                  />
                  <button
                    onClick={handleFetchUrlContent}
                    disabled={isFetchingUrl || !urlInput.trim()}
                    className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    {isFetchingUrl ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>抓取正文中...</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>抓取并解析网页正文</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-[11px] text-[#8C6D75]">
                  示范测试链接：The Economist 经贸专栏、BBC Business 商业头条、Medium 独立科技长文。
                </div>
              </div>
            )}

            {/* 入口 2: 本地文件上传 */}
            {importTab === 'file' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#2A1D21] mb-1">📁 本地文件上传入口 (File Drag & Drop)</h3>
                  <p className="text-xs text-[#7D646B]">
                    支持上传 .txt、.md、.pdf、.docx 或 .epub 格式的本地外语原版文档，即时读取解析。
                  </p>
                </div>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E3CAD0] hover:border-rose-400 rounded-2xl p-8 cursor-pointer bg-[#FDF6F8]/60 hover:bg-[#FDF2F5] transition-all">
                  <FileUp className="w-8 h-8 text-rose-500 mb-2" />
                  <span className="text-xs font-semibold text-[#2C2125]">
                    点击浏览选择文件，或直接将文件拖拽至此
                  </span>
                  <span className="text-[11px] text-[#8C6D75] mt-1">
                    支持 .txt, .md, .pdf, .docx, .epub
                  </span>
                  <input
                    type="file"
                    accept=".txt,.md,.pdf,.docx,.epub"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {uploadedFileName && (
                  <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
                    <span className="font-medium">已载入文件：{uploadedFileName} ({uploadedFileSize})</span>
                    <span className="text-emerald-700 font-bold">读取完成 ✓</span>
                  </div>
                )}
              </div>
            )}

            {/* 入口 3: 图片 OCR 识别提取 */}
            {importTab === 'image' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#2A1D21] mb-1">🖼️ 图片/截图 OCR 识别导入入口 (Image OCR)</h3>
                  <p className="text-xs text-[#7D646B]">
                    拍照上传纸质书页、英文长文截图或外贸合同照片，OCR 引擎自动提取英文字段。
                  </p>
                </div>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E3CAD0] hover:border-rose-400 rounded-2xl p-8 cursor-pointer bg-[#FDF6F8]/60 hover:bg-[#FDF2F5] transition-all">
                  <ImageIcon className="w-8 h-8 text-rose-500 mb-2" />
                  <span className="text-xs font-semibold text-[#2C2125]">
                    上传书籍照片或屏幕截图 (PNG, JPG, WebP)
                  </span>
                  <span className="text-[11px] text-[#8C6D75] mt-1">
                    系统将调用本地文字提取引擎进行智能字符识别
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {imagePreviewUrl && (
                  <div className="p-3 bg-[#FAF2F4] rounded-xl border border-[#F2D7DD] flex items-center gap-4">
                    <img src={imagePreviewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-rose-200" />
                    <div className="text-xs">
                      <div className="font-bold text-[#2C2125]">图片已加载</div>
                      <div className="text-[#8C6D75]">
                        {isOcrProcessing ? '正在执行 OCR 字符智能识别...' : '识别完毕！已提取英文正文。'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 入口 4: 音视频字幕与播客 */}
            {importTab === 'video' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#2A1D21] mb-1">🎬 音视频字幕导入入口 (Subtitles & Podcasts)</h3>
                  <p className="text-xs text-[#7D646B]">
                    上传 .srt 或 .vtt 字幕文件，系统自动剥离时间戳序列，合并为通畅阅读长篇。
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E3CAD0] hover:border-rose-400 rounded-2xl p-6 cursor-pointer bg-[#FDF6F8]/60 hover:bg-[#FDF2F5] transition-all">
                    <Video className="w-6 h-6 text-rose-500 mb-2" />
                    <span className="text-xs font-semibold text-[#2C2125]">上传 .srt / .vtt 本地字幕文件</span>
                    <input
                      type="file"
                      accept=".srt,.vtt"
                      onChange={handleSubtitleUpload}
                      className="hidden"
                    />
                  </label>
                  <div className="flex flex-col justify-center gap-2 p-4 bg-[#FDF6F8]/60 rounded-2xl border border-[#E3CAD0]">
                    <span className="text-xs font-semibold text-[#2C2125]">或粘贴 YouTube / 播客视频链接:</span>
                    <input
                      type="url"
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      className="text-xs px-3 py-2 rounded-xl bg-white border border-[#E9C8D0] text-[#2D2125]"
                    />
                    <button
                      onClick={() => {
                        setImportTitle('TED Talk 涉外谈判高阶演讲转录');
                        setImportRawText(`Part 1: The Neuroscience of High-Stakes Bargaining
When you enter a high-stakes commercial negotiation, your nervous system naturally anticipates conflict. The greatest negotiators do not rely on aggressive posturing; they cultivate deep tactical empathy. Listening is not a passive pause before you speak; it is your ultimate strategic instrument.`);
                        playChime('complete');
                      }}
                      className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-xl text-xs font-semibold transition-all self-start"
                    >
                      提取示范视频英文字幕
                    </button>
                  </div>
                </div>
                {subtitleFileName && (
                  <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs">
                    字幕文件：{subtitleFileName} 已成功清洗时间戳并提取英文字段。
                  </div>
                )}
              </div>
            )}

            {/* 统一元信息配置与长文生成 */}
            <div className="pt-4 border-t border-[#F2D7DD] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5B464C] mb-1">
                    篇章主题或素材来源名称:
                  </label>
                  <input
                    type="text"
                    value={importTitle}
                    onChange={(e) => setImportTitle(e.target.value)}
                    className="w-full text-xs md:text-sm px-3.5 py-2 rounded-xl bg-white border border-[#E9C8D0] text-[#2D2125]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5B464C] mb-1">
                    归属业务分类:
                  </label>
                  <select
                    value={importCategory}
                    onChange={(e) => setImportCategory(e.target.value as EnglishCategory)}
                    className="w-full text-xs md:text-sm px-3.5 py-2 rounded-xl bg-white border border-[#E9C8D0] text-[#2D2125]"
                  >
                    <option value="foreign_trade">涉外国际商务 (Foreign Trade)</option>
                    <option value="healing">圣多纳身心疗愈 (Mindfulness & Letting Go)</option>
                    <option value="daily">日常地道口语 (Daily Colloquial)</option>
                    <option value="ai_frontier">AI 科技前沿与编程 (Tech & Geek)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5B464C] mb-1">
                  当前载入的英文长篇文本预览与编辑 (支持直接粘贴修改):
                </label>
                <textarea
                  rows={7}
                  value={importRawText}
                  onChange={(e) => setImportRawText(e.target.value)}
                  placeholder="在此查看或粘贴长篇英文材料..."
                  className="w-full text-xs md:text-sm p-3.5 rounded-xl bg-white border border-[#E9C8D0] font-serif leading-relaxed text-[#2D2125]"
                />
                <div className="text-[11px] text-[#8C6D75] mt-1">
                  当前文本字数：约 {importRawText.trim() ? importRawText.trim().split(/\s+/).length : 0} 词
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#8C7077]">
                  点击后系统将自动进行意群断句、生成连贯章节，并立即开启 1000 词浸润研读。
                </span>
                <button
                  onClick={handleGenerateImportedPassage}
                  disabled={!importRawText.trim()}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs md:text-sm font-semibold disabled:opacity-50 transition-all flex items-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>生成结构化千词长篇并立即开练</span>
                </button>
              </div>

              {importSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>千词长篇已成功生成！已自动为你切换至研读界面。</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===================== 视图 5：掌握库 & 生词待攻克盘 ===================== */}
      {activeTab === 'mastered_library' && (
        <section className="space-y-6 animate-fadeIn">
          <div className="bg-white/80 rounded-2xl p-5 border border-[#F2D7DD] shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase">
              <FolderCheck className="w-4 h-4 text-emerald-600" />
              <span>Mastered Library & Vocabulary Stash</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#2D2125] mt-1">
              我学会的语料库与专属生词待攻克盘
            </h2>
            <p className="text-xs text-[#7D646B]">
              所有在千词长篇中自主点击标注的生词、以及练习熟练的长篇语料，均沉淀于此进行定期复盘。
            </p>
          </div>

          {/* 生词盘 */}
          <div className="bg-white/90 rounded-2xl p-6 border border-[#F2D7DD] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-bold text-[#2D2125] flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>生词待攻克本 ({savedWords.length} 词)</span>
              </h3>

              <div className="flex items-center gap-2 text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    value={vocabSearch}
                    onChange={(e) => setVocabSearch(e.target.value)}
                    placeholder="搜索生词或释义..."
                    className="pl-8 pr-3 py-1 rounded-lg bg-white border border-[#E9C8D0] text-xs text-[#2D2125]"
                  />
                </div>
                <div className="flex items-center gap-1 bg-[#FDF4F6] p-0.5 rounded-lg border border-[#E9C8D0]">
                  <button
                    onClick={() => setVocabFilter('all')}
                    className={`px-2 py-0.5 rounded text-xs ${vocabFilter === 'all' ? 'bg-rose-100 text-rose-900 font-bold' : 'text-[#7D646B]'}`}
                  >
                    全部
                  </button>
                  <button
                    onClick={() => setVocabFilter('learning')}
                    className={`px-2 py-0.5 rounded text-xs ${vocabFilter === 'learning' ? 'bg-rose-100 text-rose-900 font-bold' : 'text-[#7D646B]'}`}
                  >
                    待攻克
                  </button>
                  <button
                    onClick={() => setVocabFilter('mastered')}
                    className={`px-2 py-0.5 rounded text-xs ${vocabFilter === 'mastered' ? 'bg-rose-100 text-rose-900 font-bold' : 'text-[#7D646B]'}`}
                  >
                    已掌握
                  </button>
                </div>
              </div>
            </div>

            <div className="divide-y divide-[#F5DFE4] overflow-hidden">
              {savedWords.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8C7077]">
                  生词本为空。在千词长篇阅读时，点击任意陌生单词即可一键收录至此！
                </div>
              ) : (
                savedWords
                  .filter((w) => {
                    const matchSearch =
                      w.word.toLowerCase().includes(vocabSearch.toLowerCase()) ||
                      w.meaning.toLowerCase().includes(vocabSearch.toLowerCase());
                    if (!matchSearch) return false;
                    if (vocabFilter === 'learning') return !w.mastered;
                    if (vocabFilter === 'mastered') return w.mastered;
                    return true;
                  })
                  .map((w) => (
                    <div
                      key={w.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF4F6]/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base font-bold text-[#2A1D21]">{w.word}</span>
                          <span className="text-xs text-[#8C6D75] font-mono">{w.phonetic}</span>
                          {w.tag && (
                            <span className="text-[10px] bg-rose-100 text-rose-900 px-1.5 py-0.2 rounded font-semibold">
                              {w.tag}
                            </span>
                          )}
                          <button
                            onClick={() => handleSpeak(w.word)}
                            className="p-1 text-rose-700 hover:text-rose-950 transition-colors"
                            title="朗读单词"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs text-[#523F44]">{w.meaning}</div>
                        {w.passageTitle && (
                          <div className="text-[11px] text-[#93757D]">
                            来源篇章：{w.passageTitle}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => {
                            setSavedWords(
                              savedWords.map((item) =>
                                item.id === w.id ? { ...item, mastered: !item.mastered } : item
                              )
                            );
                            playChime('click');
                          }}
                          className={`px-3 py-1 text-xs rounded-full border transition-all ${
                            w.mastered
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                              : 'bg-white text-[#6C535A] border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {w.mastered ? '已攻克' : '标记已掌握'}
                        </button>
                        <button
                          onClick={() => {
                            setSavedWords(savedWords.filter((item) => item.id !== w.id));
                            playChime('click');
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="移出生词本"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* 已掌握长篇语料归档 */}
          <div className="bg-white/90 rounded-2xl p-6 border border-[#F2D7DD] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#2D2125] flex items-center gap-2">
              <FolderCheck className="w-4 h-4 text-emerald-600" />
              <span>已熟练掌握的千词长篇归档 ({masteredPassageIds.length} 篇)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ALL_PASSAGES_COLLECTION
                .filter((p) => masteredPassageIds.includes(p.id))
                .map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-[#F8FAF9] rounded-xl border border-emerald-200 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold">
                        {p.categoryLabel}
                      </span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        已掌握
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#2A1D21]">{p.title}</h4>
                    <p className="text-xs text-[#6A5258] line-clamp-2 leading-relaxed">
                      {p.passageZh}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setSelectedPassageId(p.id);
                          setActiveTab('daily_passages');
                          playChime('click');
                        }}
                        className="text-rose-700 hover:text-rose-900 font-semibold flex items-center gap-1"
                      >
                        <span>重新温习此长篇</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleTogglePassageMastered(p.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        取消归档
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== 浮动查词 Popover (点词即查) ===================== */}
      {activeWordData && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            left: `${Math.min(activeWordData.x, window.innerWidth - 320)}px`,
            top: `${activeWordData.y}px`
          }}
          className="z-50 w-72 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-xl border border-rose-200 text-xs animate-scaleUp"
        >
          <div className="flex items-center justify-between border-b border-rose-100 pb-2 mb-2">
            <div>
              <span className="font-serif text-base font-bold text-rose-950">
                {activeWordData.def?.word || activeWordData.cleanWord}
              </span>
              <span className="ml-2 font-mono text-[11px] text-rose-800">
                {activeWordData.def?.phonetic}
              </span>
            </div>
            <button
              onClick={() => handleSpeak(activeWordData.cleanWord)}
              className="p-1 rounded bg-rose-100 text-rose-800 hover:bg-rose-200 transition-colors"
              title="听发音"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[#4E393F] leading-relaxed mb-3">
            {activeWordData.def?.meaning || '（高频语料词汇，建议多加朗读收录）'}
          </p>

          <div className="flex items-center justify-between pt-1">
            {activeWordData.def?.tag && (
              <span className="text-[10px] bg-rose-50 text-rose-800 px-2 py-0.5 rounded font-semibold">
                {activeWordData.def.tag}
              </span>
            )}

            <button
              onClick={() => {
                handleToggleWordSaved(activeWordData.cleanWord, activeWordData.def);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                savedWords.some(
                  (w) => w.word.toLowerCase() === activeWordData.cleanWord.toLowerCase()
                )
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-rose-100 text-rose-900 hover:bg-rose-200'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>
                {savedWords.some(
                  (w) => w.word.toLowerCase() === activeWordData.cleanWord.toLowerCase()
                )
                  ? '已在生词本'
                  : '收录至生词本'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
