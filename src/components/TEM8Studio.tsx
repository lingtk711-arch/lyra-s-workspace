import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  BookOpen, 
  CheckSquare, 
  FileEdit, 
  Mic, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Check, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  Award, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Layers, 
  Lightbulb 
} from 'lucide-react';
import { TEM8Section } from '../types';
import { 
  TEM8_LISTENING_DATA, 
  TEM8_READING_DATA, 
  TEM8_PROOFREADING_DATA, 
  TEM8_WRITING_DATA, 
  TEM8_ORAL_DATA 
} from '../utils/tem8Presets';
import { playChime } from '../utils/audio';

export const TEM8Studio: React.FC = () => {
  const [activeSection, setActiveSection] = useState<TEM8Section>('listening');

  // --- 1. 听力模块状态 ---
  const [selectedListeningId, setSelectedListeningId] = useState<string>(TEM8_LISTENING_DATA[0].id);
  const currentListening = TEM8_LISTENING_DATA.find((l) => l.id === selectedListeningId) || TEM8_LISTENING_DATA[0];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.92);
  const [userGapAnswers, setUserGapAnswers] = useState<Record<number, string>>({});
  const [showGapSolutions, setShowGapSolutions] = useState(false);
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  // 朗读控制
  const handlePlayLecture = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        if (isPlayingAudio) {
          window.speechSynthesis.cancel();
          setIsPlayingAudio(false);
          return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-GB'; // 专八听力偏英音/标准学术发音
        utterance.rate = speechRate;
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

  // --- 2. 阅读模块状态 ---
  const [selectedReadingId, setSelectedReadingId] = useState<string>(TEM8_READING_DATA[0].id);
  const currentReading = TEM8_READING_DATA.find((r) => r.id === selectedReadingId) || TEM8_READING_DATA[0];
  const [userSelectedOptions, setUserSelectedOptions] = useState<Record<string, number>>({});
  const [showReadingExplanations, setShowReadingExplanations] = useState(false);
  const [showShortAnswerSolution, setShowShortAnswerSolution] = useState(false);

  // --- 3. 改错模块状态 ---
  const [selectedProofreadingId] = useState<string>(TEM8_PROOFREADING_DATA[0].id);
  const currentProofreading = TEM8_PROOFREADING_DATA.find((p) => p.id === selectedProofreadingId) || TEM8_PROOFREADING_DATA[0];
  const [expandedLineNo, setExpandedLineNo] = useState<number | null>(null);
  const [showAllProofreadingSolutions, setShowAllProofreadingSolutions] = useState(false);

  // --- 4. 写作模块状态 ---
  const [selectedWritingId] = useState<string>(TEM8_WRITING_DATA[0].id);
  const currentWriting = TEM8_WRITING_DATA.find((w) => w.id === selectedWritingId) || TEM8_WRITING_DATA[0];
  const [copiedWritingSnippet, setCopiedWritingSnippet] = useState(false);

  // --- 5. 口语模块状态 ---
  const [selectedOralId] = useState<string>(TEM8_ORAL_DATA[0].id);
  const currentOral = TEM8_ORAL_DATA.find((o) => o.id === selectedOralId) || TEM8_ORAL_DATA[0];
  const [oralTimerSeconds, setOralTimerSeconds] = useState(3 * 60);
  const [isOralTimerRunning, setIsOralTimerRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isOralTimerRunning && oralTimerSeconds > 0) {
      timer = setInterval(() => setOralTimerSeconds((s) => s - 1), 1000);
    } else if (isOralTimerRunning && oralTimerSeconds === 0) {
      setIsOralTimerRunning(false);
      playChime('complete');
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOralTimerRunning, oralTimerSeconds]);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWritingSnippet(true);
    setTimeout(() => setCopiedWritingSnippet(false), 2000);
    playChime('click');
  };

  return (
    <div className="space-y-6">
      {/* 顶部专八旗帜导航 */}
      <div className="p-6 rounded-2xl border border-indigo-200 bg-linear-to-r from-indigo-50/80 via-white to-purple-50/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
            <Award className="w-4 h-4 text-indigo-700" />
            <span>全国英语专业八级考试 (TEM-8) 全景系统化备考专区</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-mono">
              考纲深度对标
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#2D2326] mt-1.5">
            听力讲座 · 外刊精读 · 改错攻坚 · 思辨写作 · 口语辩论
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            系统导入真题题源、经济学人原版语篇、学术讲座大纲填空与考官级高分写作架构，助你攻克专八核心关卡。
          </p>
        </div>

        {/* 备考五大核心模块切换器 */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-indigo-200 rounded-xl shadow-2xs overflow-x-auto scrollbar-none">
          {[
            { id: 'listening', label: '🎧 听力讲座', desc: 'Mini-lecture' },
            { id: 'reading', label: '📖 外刊精读', desc: 'Reading' },
            { id: 'proofreading', label: '✏️ 短文改错', desc: 'Language Usage' },
            { id: 'writing', label: '📝 思辨写作', desc: 'Writing' },
            { id: 'oral', label: '🎙️ 口试演讲', desc: 'Oral Task' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSection(sec.id as TEM8Section);
                handleStopAudio();
                playChime('click');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex flex-col items-center ${
                activeSection === sec.id
                  ? 'bg-indigo-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-indigo-900 hover:bg-indigo-50/60'
              }`}
            >
              <span>{sec.label}</span>
              <span className="text-[9px] opacity-70 font-normal">{sec.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= SECTION 1: 听力 (LISTENING) ================= */}
      {activeSection === 'listening' && (
        <div className="space-y-5 animate-in fade-in">
          {/* 讲座选择与播放条 */}
          <div className="p-5 rounded-2xl border border-[#F2DFE4] bg-white shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900">
                    {currentListening.type === 'mini_lecture' ? 'Mini-lecture 讲座速记填空' : 'Interview 深度访谈'}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">
                    时长: {currentListening.audioDuration} · 讲者: {currentListening.speaker}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#2D2326] mt-1">
                  {currentListening.title}
                </h3>
              </div>

              {/* 播放器与语速控制 */}
              <div className="flex items-center gap-2">
                <select
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="px-2 py-1 text-xs bg-[#FDF4F5] border border-[#F2DFE4] rounded-lg text-[#2D2326]"
                  title="调整播放语速"
                >
                  <option value={0.85}>0.85x 较慢</option>
                  <option value={0.92}>0.92x 考试原速</option>
                  <option value={1.0}>1.0x 标准速</option>
                  <option value={1.1}>1.1x 挑战速</option>
                </select>

                <button
                  onClick={() => handlePlayLecture(currentListening.fullTranscript)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isPlayingAudio
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-indigo-900 text-white hover:bg-indigo-950 shadow-xs'
                  }`}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlayingAudio ? '暂停朗读' : '播放原音讲座'}</span>
                </button>
              </div>
            </div>

            {/* 背景提示 */}
            <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
              <strong>题材考点背景：</strong>{currentListening.topicBackground}
            </div>

            {/* 切换不同听力材料 */}
            <div className="flex items-center gap-2 pt-1 border-t border-neutral-100">
              <span className="text-[11px] font-semibold text-neutral-500">讲座库切换:</span>
              {TEM8_LISTENING_DATA.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    handleStopAudio();
                    setSelectedListeningId(l.id);
                    setUserGapAnswers({});
                    setShowGapSolutions(false);
                    playChime('click');
                  }}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors font-medium ${
                    selectedListeningId === l.id
                      ? 'bg-indigo-900 text-white font-bold'
                      : 'bg-[#FDF4F5] text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {l.type === 'mini_lecture' ? '讲座一: 认知负荷理论' : '访谈二: 人文学科与AI'}
                </button>
              ))}
            </div>
          </div>

          {/* 讲座 Outline 速记填空答题区 (核心考点) */}
          <div className="p-6 rounded-2xl border border-indigo-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-indigo-700" />
                  <span>Mini-lecture 大纲速记与挖空填空实战 (GAP Filling)</span>
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  边听录音边在横线处填入答案（要求每个空格填入不超过3个单词），提交后即刻核对题眼与得分点。
                </p>
              </div>

              <button
                onClick={() => {
                  setShowGapSolutions(!showGapSolutions);
                  playChime('click');
                }}
                className="px-3.5 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg transition-colors border border-indigo-200"
              >
                {showGapSolutions ? '隐藏参考答案' : '对答案 / 考点核验'}
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {currentListening.outlineNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-neutral-200 bg-[#FAFBFD] space-y-2 hover:border-indigo-300 transition-colors"
                >
                  <div className="text-[11px] font-bold text-indigo-900">
                    {note.heading}
                  </div>
                  <div className="text-xs text-[#2D2326] leading-relaxed">
                    {note.textWithGap}
                  </div>

                  {/* 填空交互 */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder={`在此输入第 ${note.gapNumber} 空的答案...`}
                      value={userGapAnswers[note.gapNumber || idx] || ''}
                      onChange={(e) =>
                        setUserGapAnswers({
                          ...userGapAnswers,
                          [note.gapNumber || idx]: e.target.value
                        })
                      }
                      className="px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg text-[#2D2326] focus:outline-none focus:border-indigo-500 w-full sm:w-72"
                    />

                    {showGapSolutions && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                          标准答案: {note.correctAnswer}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          ({note.notesHint})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 讲座全文字文稿 (折叠查看) */}
            <div className="pt-3 border-t border-neutral-100">
              <button
                onClick={() => setShowFullTranscript(!showFullTranscript)}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              >
                <span>{showFullTranscript ? '收起完整英文听力文稿' : '展开完整讲座英文文稿 (用于精听精读与复盘)'}</span>
                {showFullTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showFullTranscript && (
                <div className="mt-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-sans leading-relaxed text-[#2D2326] whitespace-pre-line max-h-96 overflow-y-auto">
                  {currentListening.fullTranscript}
                </div>
              )}
            </div>

            {/* 核心高频生词表 */}
            <div className="pt-2">
              <span className="text-xs font-bold text-indigo-950 block mb-2">
                本讲座专八级学术生词与图式表达：
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {currentListening.keyVocabulary.map((v, i) => (
                  <div key={i} className="p-2 rounded-lg bg-indigo-50/40 border border-indigo-100 text-[11px]">
                    <div className="font-bold text-indigo-950">{v.word} <span className="font-mono text-neutral-400 font-normal">{v.phonetic}</span></div>
                    <div className="text-neutral-600 mt-0.5">{v.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 2: 阅读 (READING) ================= */}
      {activeSection === 'reading' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="p-5 rounded-2xl border border-sky-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-900">
                  {currentReading.source} 经典题源
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  篇幅: {currentReading.wordCount} 词 · {currentReading.sourceIssue}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#2D2326]">
              {currentReading.title}
            </h3>

            <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 text-xs text-sky-950 leading-relaxed">
              <strong>中文速览：</strong>{currentReading.chineseSummary}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* 左侧 7 列：原版外刊正文 */}
            <div className="lg:col-span-7 p-6 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-4 max-h-[640px] overflow-y-auto">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Article Passage (真题级学术社论)
              </h4>
              <div className="text-xs font-sans leading-relaxed text-[#2D2326] whitespace-pre-line space-y-3">
                {currentReading.articlePassage}
              </div>

              {/* 生词助记 */}
              <div className="pt-4 border-t border-neutral-200">
                <span className="text-xs font-bold text-sky-950 block mb-2">文章高难核心考点词：</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {currentReading.criticalVocab.map((w, idx) => (
                    <div key={idx} className="p-2 rounded bg-sky-50/40 border border-sky-100">
                      <span className="font-bold text-sky-950">{w.word}</span> <span className="text-neutral-400 font-mono">{w.phonetic}</span>
                      <div className="text-neutral-600 mt-0.5">{w.meaning}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧 5 列：Section A 多选 + Section B 简答题 */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl border border-sky-200 bg-white shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-sky-950">
                    Section A: 多项选择题 (MCQs)
                  </h4>
                  <button
                    onClick={() => {
                      setShowReadingExplanations(!showReadingExplanations);
                      playChime('click');
                    }}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900"
                  >
                    {showReadingExplanations ? '隐藏精析' : '核对答案与深度解析'}
                  </button>
                </div>

                <div className="space-y-4">
                  {currentReading.questions.map((q, qidx) => (
                    <div key={q.id} className="p-3.5 rounded-xl border border-neutral-200 bg-[#FAFAFA] space-y-2.5">
                      <p className="text-xs font-bold text-[#2D2326] leading-snug">
                        {qidx + 1}. {q.question}
                      </p>

                      <div className="space-y-1.5">
                        {q.options.map((opt, oidx) => {
                          const isSelected = userSelectedOptions[q.id] === oidx;
                          const isCorrect = q.correctIndex === oidx;
                          return (
                            <button
                              key={oidx}
                              onClick={() => {
                                setUserSelectedOptions({ ...userSelectedOptions, [q.id]: oidx });
                                playChime('click');
                              }}
                              className={`w-full text-left p-2 rounded-lg text-[11px] leading-snug transition-colors border ${
                                isSelected
                                  ? showReadingExplanations
                                    ? isCorrect
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                      : 'bg-rose-50 border-rose-300 text-rose-900'
                                    : 'bg-sky-50 border-sky-300 text-sky-950 font-semibold'
                                  : showReadingExplanations && isCorrect
                                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800 font-bold'
                                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {showReadingExplanations && (
                        <div className="p-2.5 rounded-lg bg-sky-50 text-[11px] text-sky-950 leading-relaxed border border-sky-200">
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Section B 简答题 */}
                <div className="pt-3 border-t border-neutral-200 space-y-2">
                  <h4 className="text-xs font-bold text-sky-950">
                    Section B: 简答题 (不超过10个词)
                  </h4>
                  <p className="text-xs text-[#2D2326]">{currentReading.shortAnswer.prompt}</p>
                  
                  <button
                    onClick={() => setShowShortAnswerSolution(!showShortAnswerSolution)}
                    className="text-[11px] text-sky-700 font-semibold hover:underline"
                  >
                    {showShortAnswerSolution ? '收起参考答案' : '查看简答题采分点'}
                  </button>

                  {showShortAnswerSolution && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-[11px] text-emerald-950 border border-emerald-200 space-y-1">
                      <div><strong>参考答案：</strong>{currentReading.shortAnswer.referenceAnswer}</div>
                      <div><strong>采分法则：</strong>{currentReading.shortAnswer.scoringKey}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 3: 改错 (PROOFREADING) ================= */}
      {activeSection === 'proofreading' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="p-5 rounded-2xl border border-amber-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                Language Usage (Proofreading & Error Correction)
              </span>
              <button
                onClick={() => {
                  setShowAllProofreadingSolutions(!showAllProofreadingSolutions);
                  playChime('click');
                }}
                className="text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg border border-amber-200"
              >
                {showAllProofreadingSolutions ? '收起考点精析' : '一键查看全部 10 处考点精析'}
              </button>
            </div>

            <h3 className="text-base font-bold text-[#2D2326]">
              {currentProofreading.title}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {currentProofreading.summary}
            </p>
          </div>

          {/* 逐行短文纠错列表 */}
          <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-3">
            <div className="text-xs font-bold text-neutral-500 mb-2">
              点击有语病的行可即时展开语法考点深度拆解：
            </div>

            <div className="space-y-2">
              {currentProofreading.lines.map((l) => {
                const isExpanded = expandedLineNo === l.lineNo || showAllProofreadingSolutions;
                return (
                  <div
                    key={l.lineNo}
                    onClick={() => setExpandedLineNo(isExpanded ? null : l.lineNo)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      l.hasError
                        ? isExpanded
                          ? 'border-rose-300 bg-rose-50/40 ring-1 ring-rose-200'
                          : 'border-neutral-200 bg-white hover:border-amber-300'
                        : 'border-neutral-200 bg-neutral-50/50 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="font-mono text-neutral-400 font-bold shrink-0 w-6">
                          ({l.lineNo.toString().padStart(2, '0')})
                        </span>
                        <span className="font-sans leading-relaxed text-[#2D2326]">
                          {l.text}
                        </span>
                      </div>

                      {l.hasError ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded shrink-0">
                          有语病 [{l.errorType === 'collocation' ? '固定搭配' : l.errorType === 'grammar' ? '语法结构' : '篇章逻辑'}]
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-400 shrink-0">
                          (正确)
                        </span>
                      )}
                    </div>

                    {/* 错误解析与修改方案 */}
                    {isExpanded && l.hasError && (
                      <div className="mt-2.5 pt-2.5 border-t border-rose-200 text-xs space-y-1 animate-in fade-in">
                        <div className="font-bold text-rose-900">
                          修改方式：<span className="font-mono underline">{l.correction}</span>
                        </div>
                        <p className="text-neutral-700 leading-relaxed text-[11px]">
                          <strong>考点精解：</strong>{l.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 4: 写作 (WRITING) ================= */}
      {activeSection === 'writing' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="p-5 rounded-2xl border border-purple-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                {currentWriting.sourceExam}
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                要求字数: {currentWriting.requiredWordCount}
              </span>
            </div>

            <h3 className="text-base font-bold text-[#2D2326]">
              {currentWriting.title}
            </h3>

            <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 text-xs text-purple-950 whitespace-pre-line leading-relaxed">
              {currentWriting.materialsExcerpt}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* 左侧 5 列：四段式高分架构与学术衔接词 */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-purple-950 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-700" />
                  <span>专八高分四段式思辨立意框架</span>
                </h4>

                <div className="space-y-3">
                  {currentWriting.framework.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#FAF9FC] border border-purple-100 text-xs space-y-1">
                      <div className="font-bold text-purple-900">{step.step}</div>
                      <p className="text-[11px] text-neutral-500">{step.purpose}</p>
                      <div className="pt-1 space-y-0.5">
                        {step.keySentences.map((sent, sidx) => (
                          <div key={sidx} className="text-[10px] text-neutral-700 bg-white p-1 rounded border border-neutral-200 font-sans">
                            &quot;{sent}&quot;
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 学术逻辑衔接句库 */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 text-xs space-y-2">
                <span className="font-bold text-purple-950 block">高阶思辨衔接词句库：</span>
                <div className="space-y-1">
                  {currentWriting.linkingDevices.map((link, idx) => (
                    <div key={idx} className="text-[11px] text-neutral-700 flex items-center justify-between">
                      <span>• {link}</span>
                      <button
                        onClick={() => handleCopyText(link)}
                        className="text-[10px] text-purple-700 hover:underline"
                      >
                        复制
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧 7 列：考官级满分范文精读 (442 词) */}
            <div className="lg:col-span-7 p-6 rounded-2xl border border-purple-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-purple-950">
                    专八考官级高分满分范文 (Model Essay · 442 Words)
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    深度论证 · 词汇考究 · 彻底摒弃中式套话
                  </p>
                </div>

                <button
                  onClick={() => handleCopyText(currentWriting.modelEssay)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-purple-900 text-white hover:bg-purple-950 rounded-lg shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedWritingSnippet ? '已复制范文' : '一键复制范文'}</span>
                </button>
              </div>

              <div className="text-xs font-sans leading-relaxed text-[#2D2326] whitespace-pre-line p-4 rounded-xl bg-[#FAF9FC] border border-purple-100 max-h-[520px] overflow-y-auto">
                {currentWriting.modelEssay}
              </div>

              <div className="p-3 rounded-xl bg-purple-50 text-[11px] text-purple-900 leading-relaxed border border-purple-200">
                <strong>范文亮点剖析：</strong>{currentWriting.essayAnalysis}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 5: 口试 (ORAL) ================= */}
      {activeSection === 'oral' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="p-5 rounded-2xl border border-emerald-200 bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  TEM-8 专八口试全真演练
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  构思: {currentOral.preparationTime} · 答题: {currentOral.speakingTime}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#2D2326] mt-1">
                {currentOral.title}
              </h3>
            </div>

            {/* 3分钟口试计时时钟 */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50">
              <div>
                <div className="text-[10px] font-bold text-emerald-800 uppercase">3分钟口试倒计时</div>
                <div className="text-2xl font-mono font-bold text-emerald-950 tabular-nums">
                  {Math.floor(oralTimerSeconds / 60).toString().padStart(2, '0')}:{(oralTimerSeconds % 60).toString().padStart(2, '0')}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setIsOralTimerRunning(!isOralTimerRunning);
                    playChime('click');
                  }}
                  className="p-2 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors"
                >
                  {isOralTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setIsOralTimerRunning(false);
                    setOralTimerSeconds(3 * 60);
                    playChime('click');
                  }}
                  className="p-2 rounded-lg bg-white text-neutral-600 hover:text-emerald-950 border border-emerald-200"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* 左侧 5 列：题目背景与时间分配指南 */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Prompt Material (口试背景材料)
                </h4>
                <p className="text-xs leading-relaxed text-[#2D2326]">
                  {currentOral.backgroundMaterial}
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>3分钟陈述时间把控指南 (Time Allocation)</span>
                </h4>

                <div className="space-y-2">
                  {currentOral.structureGuidelines.map((guideline, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/40 border border-emerald-100 text-xs space-y-0.5">
                      <div className="font-bold text-emerald-950 flex items-center justify-between">
                        <span>{guideline.phase}</span>
                        <span className="text-[10px] text-emerald-700 font-mono">{guideline.duration}</span>
                      </div>
                      <div className="text-[11px] text-neutral-600 pl-1">
                        {guideline.talkingPoints.map((tp, tidx) => (
                          <div key={tidx}>• {tp}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 口试黄金加分表达 */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 text-xs space-y-2">
                <span className="font-bold text-emerald-950 block">口试高阶学术修辞词汇：</span>
                <div className="space-y-1.5">
                  {currentOral.goldenExpressions.map((expr, idx) => (
                    <div key={idx} className="text-[11px] p-1.5 rounded bg-white border border-emerald-100">
                      <div className="font-bold text-emerald-950">{expr.en}</div>
                      <div className="text-neutral-500 text-[10px]">{expr.zh} ({expr.usage})</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧 7 列：满分示范口语演讲 + 一键朗读 */}
            <div className="lg:col-span-7 p-6 rounded-2xl border border-emerald-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    高分口语演讲范本 (Sample Presentation)
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    点击朗读听标准英音发音，感受停顿节奏与气口
                  </p>
                </div>

                <button
                  onClick={() => handlePlayLecture(currentOral.samplePresentation)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 rounded-lg shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? '暂停示范朗读' : '朗读示范演讲'}</span>
                </button>
              </div>

              <div className="text-xs font-sans leading-relaxed text-[#2D2326] whitespace-pre-line p-4 rounded-xl bg-emerald-50/20 border border-emerald-100">
                {currentOral.samplePresentation}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
