import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Cpu, 
  Layers, 
  Plus, 
  Trash2, 
  Calendar, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  TrendingUp, 
  Flame, 
  CheckCircle2, 
  FileCheck, 
  Zap, 
  Radio, 
  Globe, 
  RefreshCw,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Search,
  Share2,
  Bookmark,
  ShieldCheck
} from 'lucide-react';
import { MediaAccount, ContentItem, PipelineStage, TrendingTopic, AIIntelligenceItem } from '../types';
import { MEDIA_ACCOUNTS, ACCOUNT_TRENDING_TOPICS, DAILY_AI_INTELLIGENCE } from '../utils/mediaPresets';
import { playChime } from '../utils/audio';

interface MediaWorkspaceProps {
  contentItems: ContentItem[];
  onUpdateItems: (items: ContentItem[]) => void;
  selectedAccountId: string;
  onSelectAccount: (id: string) => void;
}

const STAGE_CONFIG: Record<PipelineStage, { label: string; icon: string; bg: string; text: string }> = {
  topic: { label: '选题池', icon: '💡', bg: 'bg-emerald-50/90 border-emerald-200/80', text: 'text-emerald-800' },
  script: { label: '文案创作', icon: '✍️', bg: 'bg-pink-50/90 border-pink-200/80', text: 'text-pink-800' },
  staging: { label: '预发布排期', icon: '📅', bg: 'bg-amber-50/90 border-amber-200/80', text: 'text-amber-800' },
  published: { label: '已发布归档', icon: '🎉', bg: 'bg-teal-50/90 border-teal-200/80', text: 'text-teal-800' },
  analytics: { label: '数据复盘', icon: '📊', bg: 'bg-purple-50/90 border-purple-200/80', text: 'text-purple-800' },
};

const COVER_COLOR_MAP: Record<string, { bg: string; border: string; text: string; badgeBg: string }> = {
  sage: { bg: 'bg-emerald-50/90', border: 'border-emerald-200/80', text: 'text-emerald-950', badgeBg: 'bg-emerald-100 text-emerald-800' },
  lilac: { bg: 'bg-purple-50/90', border: 'border-purple-200/80', text: 'text-purple-950', badgeBg: 'bg-purple-100 text-purple-800' },
  cyan: { bg: 'bg-teal-50/90', border: 'border-teal-200/80', text: 'text-teal-950', badgeBg: 'bg-teal-100 text-teal-800' },
  apricot: { bg: 'bg-pink-50/90', border: 'border-pink-200/80', text: 'text-pink-950', badgeBg: 'bg-pink-100 text-pink-800' },
};

export const MediaWorkspace: React.FC<MediaWorkspaceProps> = ({
  contentItems,
  onUpdateItems,
  selectedAccountId,
  onSelectAccount,
}) => {
  // Navigation mode: 'portal' (矩阵总控大厅) vs 'account' (专属账号独立工作台)
  const [viewMode, setViewMode] = useState<'portal' | 'account'>('portal');

  // Category filter in portal: 'all' | 'ip' | 'auto'
  const [accountCategoryFilter, setAccountCategoryFilter] = useState<'all' | 'ip' | 'auto'>('all');

  const currentAccount = MEDIA_ACCOUNTS.find((a) => a.id === selectedAccountId) || MEDIA_ACCOUNTS[0];

  // Stage Filter inside account view
  const [selectedStage, setSelectedStage] = useState<PipelineStage | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Trending Topics & AI intelligence modal state
  const [showTrendsModal, setShowTrendsModal] = useState(false);
  const [trendsAccountFilter, setTrendsAccountFilter] = useState<string>('all');
  const [showAIIntelModal, setShowAIIntelModal] = useState(false);
  const [aiRadarFilter, setAiRadarFilter] = useState<'all' | 'blogger' | 'official'>('all');

  // Filter content items for this account
  const accountItems = contentItems.filter((i) => i.accountId === selectedAccountId);
  
  const filteredItems = accountItems.filter((i) => {
    const matchesStage = selectedStage === 'all' || i.stage === selectedStage;
    const matchesSearch = 
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.scriptText && i.scriptText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (i.finalDraftTitle && i.finalDraftTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (i.tags || []).some((t) => typeof t === 'string' && t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStage && matchesSearch;
  });

  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    accountItems[0]?.id || null
  );

  const activeItem = contentItems.find((i) => i.id === selectedItemId) || filteredItems[0] || null;

  // Copy status
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedFinalPackage, setCopiedFinalPackage] = useState(false);

  const handleCopy = (text: string, type: 'script' | 'final') => {
    navigator.clipboard.writeText(text);
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedFinalPackage(true);
      setTimeout(() => setCopiedFinalPackage(false), 2000);
    }
    playChime('click');
  };

  // Enter a specific account dedicated workspace
  const handleEnterAccount = (accId: string) => {
    onSelectAccount(accId);
    const firstOfAccount = contentItems.find((i) => i.accountId === accId);
    setSelectedItemId(firstOfAccount?.id || null);
    setSelectedStage('all');
    setSearchQuery('');
    setViewMode('account');
    playChime('click');
  };

  // Enter account directly targeting a specific stage
  const handleEnterAccountWithStage = (accId: string, stage: PipelineStage | 'all') => {
    onSelectAccount(accId);
    const firstOfStage = contentItems.find((i) => i.accountId === accId && (stage === 'all' || i.stage === stage));
    const fallbackFirst = contentItems.find((i) => i.accountId === accId);
    setSelectedItemId(firstOfStage?.id || fallbackFirst?.id || null);
    setSelectedStage(stage);
    setSearchQuery('');
    setViewMode('account');
    playChime('click');
  };

  // Add new content manually
  const handleAddNewContent = () => {
    const newItem: ContentItem = {
      id: 'content_' + Date.now(),
      accountId: selectedAccountId,
      title: '新灵感：待拟定标题',
      stage: 'topic',
      topicSource: '个人日常灵感洞察',
      topicNotes: '记录读者痛点、对标账号爆款素材或内心灵感...',
      tags: [currentAccount.name.includes('圣多纳') ? '圣多纳释放法' : '干货分享'],
      platforms: currentAccount.platforms,
      coverLayout: {
        mainHeadline: '主标题待定',
        subHeadline: '副标题/痛点钩子',
        badgeText: currentAccount.badge,
        colorTheme: currentAccount.id === 'acc_sedona' ? 'sage' : currentAccount.id === 'acc_ai' ? 'cyan' : 'apricot'
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onUpdateItems([newItem, ...contentItems]);
    setSelectedItemId(newItem.id);
    playChime('click');
  };

  // Adopt from Trending Topic (with real verified URL tracked)
  const handleAdoptTrendingTopic = (trend: TrendingTopic, autoGenerate: boolean = false) => {
    const targetAccId = trend.accountId || selectedAccountId;
    const targetAcc = MEDIA_ACCOUNTS.find((a) => a.id === targetAccId) || currentAccount;
    const defaultColor = targetAcc.id === 'acc_sedona' ? 'sage' : targetAcc.id === 'acc_ai' ? 'cyan' : 'apricot';
    
    let generatedScript = '';
    if (autoGenerate) {
      if (targetAcc.id === 'acc_sedona') {
        generatedScript = `【黄金开头】\n${trend.sampleHook}\n\n【痛点剖析】\n很多人总以为情绪是需要被“战胜”的敌人，但圣多纳释放法的第一条秘密是：所有的对抗，都会转化为潜意识深处的更强压抑。\n\n【实操三问】\n1. 此刻，我能否允许这股情绪存在片刻？（可以）\n2. 我能否放下对它的抗拒？（可以）\n3. 什么时候？（就是现在）\n\n【行动号召】\n试着深呼吸，在评论区留下【允许】，给身体一次松弛的机会。`;
      } else {
        generatedScript = `【黄金开头】\n${trend.sampleHook}\n\n【核心价值拆解】\n1. 核心误区：把大需求一次性丢给工具，陷入报错死循环\n2. 破局关键：模块化拆解与小步迭代\n3. 实战避坑：善用精准上下文定向投喂\n\n【行动号召】\n收藏备用，下期带来手把手保姆级演示！`;
      }
    }

    const topicSourceText = trend.author
      ? `${trend.author} (${trend.authorRole || trend.sourceType}) · ${trend.heat}`
      : `${trend.sourceType} · ${trend.heat}`;

    const newItem: ContentItem = {
      id: 'content_' + Date.now(),
      accountId: targetAcc.id,
      title: trend.keyword,
      stage: autoGenerate ? 'script' : 'topic',
      topicSource: `${topicSourceText}\n【真实出处外链】${trend.url}`,
      topicNotes: `【来源出处】${topicSourceText}\n【真实验证外链】${trend.url}\n【推荐切入视角】${trend.suggestedAngle}${trend.discussionMetrics ? `\n【热议数据】点赞 ${trend.discussionMetrics.likes || '-'} · 评论 ${trend.discussionMetrics.comments || '-'} · 转发 ${trend.discussionMetrics.reposts || '-'}` : ''}`,
      hook: trend.sampleHook,
      scriptText: generatedScript || undefined,
      tags: trend.tags,
      platforms: targetAcc.platforms,
      coverLayout: {
        mainHeadline: trend.keyword,
        subHeadline: trend.sampleHook.slice(0, 24) + '...',
        badgeText: trend.author ? trend.author.split(' ')[0] : (trend.tags[0] || targetAcc.badge),
        colorTheme: defaultColor
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onUpdateItems([newItem, ...contentItems]);
    if (viewMode === 'account') {
      onSelectAccount(targetAcc.id);
      setSelectedItemId(newItem.id);
    }
    setShowTrendsModal(false);
    playChime('complete');
  };

  // Convert AI Intelligence Item to Account Content
  const handleConvertAIIntelToContent = (intel: AIIntelligenceItem) => {
    const generatedScript = `【黄金开头抓手】\n${intel.sampleHook}\n\n【官方一手事实权威快讯】\n${intel.summary}\n\n【核心技术突破与影响】\n${intel.technicalImpact}\n\n【自媒体落地应用切入】\n${intel.contentAngle}\n\n【分发提示】\n建议小红书以“官方原厂发布拆解”图文发布，抖音同步录制 60 秒实操解读视频！`;

    const newItem: ContentItem = {
      id: 'content_' + Date.now(),
      accountId: 'acc_ai',
      title: intel.title,
      stage: 'script',
      topicSource: `官方权威一手验证：${intel.organization} (${intel.credibility}) · 链接: ${intel.officialUrl}`,
      topicNotes: `【官方原厂信源】${intel.officialUrl}\n【传播角度】${intel.contentAngle}`,
      hook: intel.sampleHook,
      scriptText: generatedScript,
      tags: intel.tags,
      platforms: ['小红书', '抖音'],
      coverLayout: {
        mainHeadline: intel.organization + ' 重磅官宣：\n' + intel.title.slice(0, 18) + '...',
        subHeadline: intel.sampleHook.slice(0, 24) + '...',
        badgeText: intel.organization + ' 官方权威',
        colorTheme: 'cyan'
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onUpdateItems([newItem, ...contentItems]);
    onSelectAccount('acc_ai');
    setSelectedItemId(newItem.id);
    setShowAIIntelModal(false);
    setViewMode('account');
    playChime('complete');
  };

  // Generate Content for Active Item
  const handleGenerateContentForActiveItem = () => {
    if (!activeItem) return;
    const isHealing = currentAccount.id === 'acc_sedona';
    const generatedHook = activeItem.hook || (isHealing ? '为什么你越努力克服情绪，情绪反扑越剧烈？' : '2026 年别再手动蛮干了，这一套工作流直接省下 80% 时间！');
    
    let generatedScript = '';
    if (isHealing) {
      generatedScript = `【黄金前3秒抓手】\n${generatedHook}\n\n【痛点共鸣】\n很多时候，我们之所以深陷内耗，不是因为事情本身有多难，而是头脑中那股“必须立刻解决、必须完全掌控”的抓取心在作祟。\n\n【圣多纳释放三部曲】\n🌿 第一步：闭上眼，把注意力从思维评判移回身体，允许那一股紧绷流淌。\n🌿 第二步：向内心温和发问：我能否松开对它的抗拒？（可以）\n🌿 第三步：什么时候？（就是现在）\n\n【结语】\n真正的平静不是没有波澜，而是成为包容波澜的整片海洋。\n💬 在评论区留下【允许】，给疲惫的心灵松绑吧。`;
    } else {
      generatedScript = `【黄金前3秒抓手】\n${generatedHook}\n\n【核心痛点拆解】\n很多创作者与开发者之所以效率受限，核心在于缺少标准化的流水线架构。\n\n【破局 3 步法】\n1. 明确定义输入与契约层\n2. 借助自动化工具打通数据链路\n3. 小步快跑，高频交付真实结果\n\n【行动建议】\n收藏对照实操，关注我持续同步最硬核的自动化工作流！`;
    }

    handleUpdateActiveItem({
      hook: generatedHook,
      scriptText: activeItem.scriptText || generatedScript,
      stage: activeItem.stage === 'topic' ? 'script' : activeItem.stage
    });
    playChime('complete');
  };

  // Update item
  const handleUpdateActiveItem = (updates: Partial<ContentItem>) => {
    if (!activeItem) return;
    const updated = contentItems.map((i) => {
      if (i.id === activeItem.id) {
        return { ...i, ...updates, updatedAt: Date.now() };
      }
      return i;
    });
    onUpdateItems(updated);
  };

  // Stage advance
  const handleAdvanceStage = () => {
    if (!activeItem) return;
    const stages: PipelineStage[] = ['topic', 'script', 'staging', 'published', 'analytics'];
    const currentIndex = stages.indexOf(activeItem.stage);
    if (currentIndex >= stages.length - 1) return;
    const nextStage = stages[currentIndex + 1];

    const updates: Partial<ContentItem> = { stage: nextStage };
    if (nextStage === 'staging') {
      if (!activeItem.finalDraftTitle) updates.finalDraftTitle = activeItem.title;
      if (!activeItem.finalDraftBody) updates.finalDraftBody = activeItem.scriptText || '';
      if (!activeItem.coverLayout) {
        updates.coverLayout = {
          mainHeadline: activeItem.title,
          subHeadline: activeItem.hook || '让改变自然发生',
          badgeText: activeItem.tags[0] || currentAccount.badge,
          colorTheme: currentAccount.id === 'acc_sedona' ? 'sage' : 'cyan'
        };
      }
    }
    handleUpdateActiveItem(updates);
    playChime('complete');
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    if (window.confirm('确认删除该内容条目吗？')) {
      const remaining = contentItems.filter((i) => i.id !== id);
      onUpdateItems(remaining);
      const remainingAccountItems = remaining.filter((i) => i.accountId === selectedAccountId);
      setSelectedItemId(remainingAccountItems[0]?.id || null);
      playChime('click');
    }
  };

  // Filtered trends for modal
  const displayedTrends = ACCOUNT_TRENDING_TOPICS.filter((t) => {
    const matchesAccount = trendsAccountFilter === 'all' || t.accountId === trendsAccountFilter;
    const matchesAI = trendsAccountFilter !== 'acc_ai' || aiRadarFilter === 'all' || t.authorType === aiRadarFilter;
    return matchesAccount && matchesAI;
  });

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* MODE 1: 矩阵大厅入口页 (Architectural Executive Dossier Registry - 坚决去卡片化) */}
      {/* ========================================================================= */}
      {viewMode === 'portal' && (
        <div className="space-y-6 text-[#684852]">
          {/* Header Banner (去卡片化，轻盈水幕雅致格调) */}
          <div className="pb-4 border-b border-pink-200/60 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-pink-500" />
                <span>全域自媒体矩阵总控台 · 独立空间架构</span>
              </div>
              <h1 className="text-2xl font-bold text-[#684852] mt-1 tracking-tight flex items-center gap-2 font-serif">
                <span>4 大账号独立矩阵，点击账号进入专属工作台</span>
              </h1>
              <p className="text-xs text-[#8F727C] mt-1">
                每个账号拥有专属独立的选题池、文案工作流、预发布定稿与复盘体系，互不干扰，静水深流。
              </p>
            </div>

            {/* Quick Action Triggers */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setTrendsAccountFilter('all');
                  setShowTrendsModal(true);
                  playChime('click');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-300 rounded-xl transition-all shadow-xs"
              >
                <Flame className="w-3.5 h-3.5 text-pink-600 animate-pulse" />
                <span>全矩阵热点雷达 (45 条带真实外链)</span>
              </button>

              <button
                onClick={() => {
                  setShowAIIntelModal(true);
                  playChime('click');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl transition-all shadow-xs"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI 原厂权威情报流</span>
              </button>
            </div>
          </div>

          {/* Telemetry Strip (Swiss Minimalist Inline Data, NO NESTED CARDS) */}
          <div className="flex items-center gap-6 text-xs text-[#7A666D] px-1 border-b border-pink-200/40 pb-3 flex-wrap font-mono">
            <span>活跃账号 <strong className="text-pink-700 font-bold">4 个</strong></span>
            <span>·</span>
            <span>矩阵在编内容 <strong className="text-emerald-800 font-bold">{contentItems.length} 篇</strong></span>
            <span>·</span>
            <span>待发布排期 <strong className="text-purple-700 font-bold">{contentItems.filter((i) => i.stage === 'staging').length} 篇</strong></span>
            <span>·</span>
            <span>已发布归档 <strong className="text-teal-700 font-bold">{contentItems.filter((i) => i.stage === 'published').length} 篇</strong></span>
            <span>·</span>
            <span>全网粉丝目标 <strong className="text-amber-800 font-bold">65,000+</strong></span>
          </div>

          {/* Live Radar Ticker Bar (Bloomberg/Linear Style Live Hot Ticker with Verified Real Links) */}
          <div className="bg-white/80 border border-pink-200/80 backdrop-blur-md rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex items-center gap-1 text-pink-700 font-bold shrink-0">
                <Flame className="w-4 h-4 text-pink-500 animate-pulse" />
                <span>全矩阵爆款速报</span>
              </span>
              <span className="text-pink-200">|</span>
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-0.5">
                {ACCOUNT_TRENDING_TOPICS.slice(0, 3).map((topTrend, i) => (
                  <div key={topTrend.id} className="flex items-center gap-1.5 shrink-0 text-[#684852]">
                    <span className="font-mono text-[10px] font-bold text-pink-600">#{i + 1}</span>
                    <span className="font-semibold text-[#684852]">{topTrend.keyword}</span>
                    <span className="text-[10px] font-mono text-amber-700">({topTrend.heat})</span>
                    <a
                      href={topTrend.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-teal-700 hover:text-teal-900 underline flex items-center gap-0.5"
                    >
                      <span>原帖/信源</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setTrendsAccountFilter('all');
                setShowTrendsModal(true);
                playChime('click');
              }}
              className="text-xs font-semibold text-pink-700 hover:text-pink-900 shrink-0 flex items-center gap-1"
            >
              <span>查看全部 45 条</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#7A666D] font-medium mr-1">矩阵赛道筛选:</span>
              <button
                onClick={() => { setAccountCategoryFilter('all'); playChime('click'); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  accountCategoryFilter === 'all'
                    ? 'bg-pink-100 text-pink-900 border border-pink-300 shadow-xs'
                    : 'bg-white/80 text-[#7A666D] hover:bg-white border border-pink-200/60'
                }`}
              >
                全部矩阵 (4)
              </button>
              <button
                onClick={() => { setAccountCategoryFilter('ip'); playChime('click'); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  accountCategoryFilter === 'ip'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs'
                    : 'bg-white/80 text-[#7A666D] hover:bg-white border border-pink-200/60'
                }`}
              >
                🌿 个人IP与深度疗愈 (1)
              </button>
              <button
                onClick={() => { setAccountCategoryFilter('auto'); playChime('click'); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  accountCategoryFilter === 'auto'
                    ? 'bg-teal-100 text-teal-900 border border-teal-300 shadow-xs'
                    : 'bg-white/80 text-[#7A666D] hover:bg-white border border-pink-200/60'
                }`}
              >
                🤖 AI与自动化硬件矩阵 (3)
              </button>
            </div>

            <div className="text-[11px] text-[#7A666D]">
              提示：点击行直接进入工作台，点击阶段数字穿透进入对应工位
            </div>
          </div>

          {/* Architectural Registry Table (无卡片，纯粹的高密度行政注册表) */}
          <div className="border border-pink-200/70 rounded-2xl overflow-hidden bg-white/75 backdrop-blur-xl shadow-md">
            {/* Table Header Row */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-pink-50/70 border-b border-pink-200/60 text-xs font-bold text-[#6D424F]">
              <div className="col-span-12 md:col-span-4">账号品牌与定位</div>
              <div className="col-span-6 md:col-span-3">主营平台与粉丝目标</div>
              <div className="col-span-6 md:col-span-3">流水线健康度 (选题/草稿/排期/已发)</div>
              <div className="col-span-12 md:col-span-2 text-right">专属工作空间</div>
            </div>

            {/* Account Rows */}
            <div className="divide-y divide-pink-100">
              {MEDIA_ACCOUNTS
                .filter((acc) => {
                  if (accountCategoryFilter === 'ip') return acc.id === 'acc_sedona';
                  if (accountCategoryFilter === 'auto') return acc.id !== 'acc_sedona';
                  return true;
                })
                .map((account) => {
                  const accItems = contentItems.filter((i) => i.accountId === account.id);
                  const topicCount = accItems.filter((i) => i.stage === 'topic').length;
                  const scriptCount = accItems.filter((i) => i.stage === 'script').length;
                  const stagingCount = accItems.filter((i) => i.stage === 'staging').length;
                  const pubCount = accItems.filter((i) => i.stage === 'published').length;
                  const trendsCount = ACCOUNT_TRENDING_TOPICS.filter((t) => t.accountId === account.id).length;
                  const accTotal = accItems.length;

                  return (
                    <div
                      key={account.id}
                      onClick={() => handleEnterAccount(account.id)}
                      className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-pink-50/40 transition-all cursor-pointer group"
                    >
                      {/* Col 1: Account Brand & Niche */}
                      <div className="col-span-12 md:col-span-4 flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                          account.id === 'acc_sedona' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          account.id === 'acc_ai' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                          account.id === 'acc_bot1' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}>
                          {account.id === 'acc_sedona' && <Sparkles className="w-5 h-5 text-emerald-600" />}
                          {account.id === 'acc_ai' && <Cpu className="w-5 h-5 text-teal-600" />}
                          {account.id === 'acc_bot1' && <Bot className="w-5 h-5 text-amber-600" />}
                          {account.id === 'acc_bot2' && <Layers className="w-5 h-5 text-purple-600" />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-[#684852] group-hover:text-pink-600 transition-colors">
                              {account.name}
                            </h3>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              account.id === 'acc_sedona' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                              account.id === 'acc_ai' ? 'bg-teal-50 text-teal-800 border-teal-200' :
                              'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {account.badge}
                            </span>
                          </div>
                          <p className="text-xs text-[#8F727C] mt-1 line-clamp-1">
                            {account.subTitle}
                          </p>
                          <p className="text-[11px] text-[#A68F97] mt-0.5 line-clamp-1">
                            {account.description}
                          </p>
                        </div>
                      </div>

                      {/* Col 2: Platform & Goal */}
                      <div className="col-span-6 md:col-span-3 space-y-1">
                        <div className="text-xs font-medium text-[#684852] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{account.platforms.join(' · ')}</span>
                        </div>
                        <div className="text-[11px] font-mono text-[#8F727C]">
                          阶段目标: <strong className="text-pink-700 font-bold">{account.followerGoal}</strong>
                        </div>
                        <div className="text-[10px] text-pink-600 font-medium">
                          {account.statusTag}
                        </div>
                      </div>

                      {/* Col 3: Pipeline Breakdown & Linear Segmented Waterline */}
                      <div className="col-span-6 md:col-span-3 space-y-2">
                        {/* Interactive Stage Triggers */}
                        <div className="flex items-center gap-1.5 text-[11px] font-mono">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnterAccountWithStage(account.id, 'topic');
                            }}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 transition-colors cursor-pointer"
                            title="点击直接穿透到该账号的选题池"
                          >
                            💡 {topicCount}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnterAccountWithStage(account.id, 'script');
                            }}
                            className="bg-pink-50 hover:bg-pink-100 text-pink-800 px-1.5 py-0.5 rounded border border-pink-200 transition-colors cursor-pointer"
                            title="点击直接穿透到该账号的文案创作"
                          >
                            ✍️ {scriptCount}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnterAccountWithStage(account.id, 'staging');
                            }}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 transition-colors cursor-pointer"
                            title="点击直接穿透到该账号的预发布排期"
                          >
                            📅 {stagingCount}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnterAccountWithStage(account.id, 'published');
                            }}
                            className="bg-teal-50 hover:bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded border border-teal-200 transition-colors cursor-pointer"
                            title="点击直接穿透到该账号的已发归档"
                          >
                            🎉 {pubCount}
                          </button>
                        </div>

                        {/* Linear Segmented Pipeline Waterline */}
                        <div className="w-full h-1.5 bg-pink-100/60 rounded-full overflow-hidden flex items-center border border-pink-200/50">
                          <div style={{ width: `${accTotal > 0 ? (topicCount / accTotal) * 100 : 25}%` }} className="h-full bg-emerald-400 transition-all shadow-xs" title={`选题池: ${topicCount} 篇`} />
                          <div style={{ width: `${accTotal > 0 ? (scriptCount / accTotal) * 100 : 25}%` }} className="h-full bg-pink-400 transition-all shadow-xs" title={`文案撰写: ${scriptCount} 篇`} />
                          <div style={{ width: `${accTotal > 0 ? (stagingCount / accTotal) * 100 : 25}%` }} className="h-full bg-amber-400 transition-all shadow-xs" title={`预发排期: ${stagingCount} 篇`} />
                          <div style={{ width: `${accTotal > 0 ? (pubCount / accTotal) * 100 : 25}%` }} className="h-full bg-teal-400 transition-all shadow-xs" title={`已发归档: ${pubCount} 篇`} />
                        </div>

                        <div className="text-[11px] text-[#7A666D] flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-pink-500" />
                            <span>雷达: {trendsCount} 条爆款带真实外链</span>
                          </span>
                          <span className="text-[10px] text-[#8C767E] font-mono">
                            总计 {accTotal} 篇
                          </span>
                        </div>
                      </div>

                      {/* Col 4: Action button */}
                      <div className="col-span-12 md:col-span-2 flex items-center justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnterAccount(account.id);
                          }}
                          className="px-3.5 py-2 text-xs font-semibold bg-pink-50 text-pink-800 hover:bg-pink-100 border border-pink-200 group-hover:border-pink-300 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <span>进入专属工作台</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: 独立账号专属工作台 (Dedicated Focused Studio for the Selected Account) */}
      {/* ========================================================================= */}
      {viewMode === 'account' && (
        <div className="space-y-5 text-[#684852]">
          {/* Top Breadcrumb & Fast Switcher Bar (去卡片化极简条) */}
          <div className="pb-3 border-b border-pink-200/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setViewMode('portal');
                  playChime('click');
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-white/80 hover:bg-white text-pink-900 border border-pink-200/80 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-pink-500" />
                <span>返回矩阵总控大厅</span>
              </button>

              <span className="text-pink-200">|</span>

              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shadow-xs ${
                  currentAccount.id === 'acc_sedona' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  currentAccount.id === 'acc_ai' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                  'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {currentAccount.id === 'acc_sedona' && <Sparkles className="w-3 h-3 text-emerald-600" />}
                  {currentAccount.id === 'acc_ai' && <Cpu className="w-3 h-3 text-teal-600" />}
                  {(currentAccount.id === 'acc_bot1' || currentAccount.id === 'acc_bot2') && <Bot className="w-3 h-3 text-amber-600" />}
                </div>
                <h2 className="text-base font-bold text-[#684852]">
                  {currentAccount.name}
                </h2>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {currentAccount.badge}
                </span>
                <span className="text-xs text-[#8F727C] hidden sm:inline">
                  {currentAccount.subTitle}
                </span>
              </div>
            </div>

            {/* Fast Account Switcher Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8F727C]">切换账号:</span>
              <div className="flex items-center gap-1">
                {MEDIA_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => handleEnterAccount(acc.id)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-all font-medium ${
                      acc.id === selectedAccountId
                        ? 'bg-pink-100 text-pink-900 border border-pink-300 shadow-xs'
                        : 'bg-white/80 text-[#8F727C] hover:bg-white border border-pink-200/60'
                    }`}
                  >
                    {acc.badge}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dedicated Studio Funnel Header & Action Strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/75 backdrop-blur-xl p-3 rounded-2xl border border-pink-200/70 shadow-md">
            {/* Stage Filter Tabs */}
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => { setSelectedStage('all'); playChime('click'); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedStage === 'all'
                    ? 'bg-pink-100 text-pink-900 border border-pink-300 shadow-xs'
                    : 'text-[#8F727C] hover:text-[#684852]'
                }`}
              >
                全部 ({accountItems.length})
              </button>

              {(['topic', 'script', 'staging', 'published', 'analytics'] as PipelineStage[]).map((stage) => {
                const cfg = STAGE_CONFIG[stage];
                const count = accountItems.filter((i) => i.stage === stage).length;
                return (
                  <button
                    key={stage}
                    onClick={() => { setSelectedStage(stage); playChime('click'); }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                      selectedStage === stage
                        ? 'bg-white text-pink-900 border border-pink-300 shadow-xs'
                        : 'text-[#8F727C] hover:text-[#684852]'
                    }`}
                  >
                    <span>{cfg.icon}</span>
                    <span>{cfg.label}</span>
                    <span className="text-[10px] font-mono text-pink-600 font-bold">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Actions for current account */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTrendsAccountFilter(selectedAccountId);
                  setShowTrendsModal(true);
                  playChime('click');
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-pink-50 text-pink-900 hover:bg-pink-100 rounded-xl transition-all border border-pink-300 shadow-xs"
              >
                <Flame className="w-3.5 h-3.5 text-pink-500" />
                <span>本号专属热点雷达 (附真实外链)</span>
              </button>

              <button
                onClick={handleAddNewContent}
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增选题</span>
              </button>
            </div>
          </div>

          {/* Main Dual-Pane Studio Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Pane: Content Item Stream for this Account (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-pink-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索本账号标题、正文、标签..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white/80 border border-pink-200/80 rounded-xl text-[#684852] placeholder-[#A68F97] focus:outline-none focus:border-pink-400 shadow-xs"
                />
              </div>

              {/* Items List */}
              <div className="border border-pink-200/70 rounded-2xl bg-white/75 backdrop-blur-xl divide-y divide-pink-100 overflow-hidden shadow-md max-h-[700px] overflow-y-auto">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const isSelected = item.id === (activeItem?.id || selectedItemId);
                    const stageCfg = STAGE_CONFIG[item.stage];

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedItemId(item.id);
                          playChime('click');
                        }}
                        className={`p-3.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-pink-50/80 border-l-4 border-l-pink-500'
                            : 'hover:bg-pink-50/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${stageCfg.bg} ${stageCfg.text}`}>
                            {stageCfg.icon} {stageCfg.label}
                          </span>
                          <span className="text-[10px] font-mono text-[#8C767E]">
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-[#684852] mt-1.5 line-clamp-2">
                          {item.title}
                        </h4>

                        {item.hook && (
                          <p className="text-[11px] text-[#8F727C] mt-1 line-clamp-1 italic">
                            “{item.hook}”
                          </p>
                        )}

                        <div className="mt-2 flex items-center justify-between text-[10px] text-[#8C767E]">
                          <div className="flex items-center gap-1 flex-wrap">
                            {(item.tags || []).slice(0, 2).map((tag) => (
                              <span key={tag} className="bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          {item.targetDate && (
                            <span className="text-purple-700 font-mono font-medium">
                              {item.targetDate}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-xs text-[#8C767E]">
                    暂无符合条件的内容条目，点击上方“新增选题”开启创作
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Deep Inspector & Full Editor for Active Content (7 cols) */}
            <div className="lg:col-span-7">
              {activeItem ? (
                <div className="border border-pink-200/70 rounded-2xl bg-white/85 backdrop-blur-xl p-5 space-y-5 shadow-lg">
                  {/* Top Header of Editor */}
                  <div className="flex items-center justify-between pb-3 border-b border-pink-100">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${STAGE_CONFIG[activeItem.stage].bg} ${STAGE_CONFIG[activeItem.stage].text}`}>
                        {STAGE_CONFIG[activeItem.stage].icon} {STAGE_CONFIG[activeItem.stage].label}
                      </span>
                      <span className="text-xs text-[#8C767E] font-mono">
                        ID: {activeItem.id.slice(-6)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeItem.stage !== 'analytics' && (
                        <button
                          onClick={handleAdvanceStage}
                          className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <span>推进下一阶段</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteItem(activeItem.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors"
                        title="删除该内容"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#856771]">内容工作标题</label>
                    <input
                      type="text"
                      value={activeItem.title}
                      onChange={(e) => handleUpdateActiveItem({ title: e.target.value })}
                      className="w-full px-3 py-2 text-sm font-bold text-[#684852] bg-white border border-pink-200 rounded-xl focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  {/* Stage-Specific Editor Sections */}

                  {/* STAGE 1: 选题池 (Topic Pool & Hook) */}
                  <div className="space-y-3 p-3.5 rounded-xl border border-emerald-200/80 bg-emerald-50/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <span>💡 选题痛点、灵感与黄金前3秒抓手 (Hook)</span>
                      </span>
                      <button
                        onClick={handleGenerateContentForActiveItem}
                        className="text-xs font-semibold text-emerald-900 hover:text-emerald-950 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-emerald-300 shadow-2xs"
                      >
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>一键生成文案草案</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-emerald-900/80">黄金抓手 (前3秒停顿大字或视频开头)</label>
                      <input
                        type="text"
                        value={activeItem.hook || ''}
                        onChange={(e) => handleUpdateActiveItem({ hook: e.target.value })}
                        placeholder="例如：为什么你读了那么多心理学书，依然在深夜胸口发堵？"
                        className="w-full px-3 py-2 text-xs bg-white border border-emerald-200 rounded-lg text-[#684852] placeholder-neutral-400 focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-emerald-900/80">选题来源与真实外链备注</label>
                      <textarea
                        rows={2}
                        value={activeItem.topicSource || ''}
                        onChange={(e) => handleUpdateActiveItem({ topicSource: e.target.value })}
                        placeholder="记录小红书热搜词、知名博主推特或官方一手发布链接..."
                        className="w-full px-3 py-2 text-xs bg-white border border-emerald-200 rounded-lg text-[#684852] placeholder-neutral-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* STAGE 2: 文案草稿正文 */}
                  <div className="space-y-2 p-3.5 rounded-xl border border-pink-200/80 bg-pink-50/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-900 flex items-center gap-1.5">
                        <span>✍️ 文案正文草稿排版</span>
                      </span>
                      <button
                        onClick={() => handleCopy(activeItem.scriptText || '', 'script')}
                        className="text-xs font-semibold text-pink-900 hover:text-pink-950 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-pink-300 shadow-2xs"
                      >
                        {copiedScript ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript ? '已复制正文' : '一键复制正文'}</span>
                      </button>
                    </div>

                    <textarea
                      rows={6}
                      value={activeItem.scriptText || ''}
                      onChange={(e) => handleUpdateActiveItem({ scriptText: e.target.value })}
                      placeholder="编写正文草稿，支持段落空行与分点排版..."
                      className="w-full px-3 py-2 text-xs bg-white border border-pink-200 rounded-lg text-[#684852] placeholder-neutral-400 focus:outline-none font-sans leading-relaxed"
                    />

                    {/* Tags input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-pink-900/80">话题标签 (以空格分隔)</label>
                      <input
                        type="text"
                        value={(activeItem.tags || []).join(' ')}
                        onChange={(e) => handleUpdateActiveItem({ tags: e.target.value.split(/\s+/).filter(Boolean) })}
                        placeholder="例如：圣多纳释放法 精神内耗 情绪急救"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-pink-200 rounded-lg text-[#684852] placeholder-neutral-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* STAGE 3: 预发布定稿版面与排期 */}
                  <div className="space-y-3 p-3.5 rounded-xl border border-purple-200/80 bg-purple-50/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                        <span>📅 预发布封面版面与分发排期</span>
                      </span>
                      <button
                        onClick={() => {
                          const fullPackage = `【定稿标题】\n${activeItem.finalDraftTitle || activeItem.title}\n\n【封面大字】\n${activeItem.coverLayout?.mainHeadline || activeItem.title}\n\n【精修正文】\n${activeItem.finalDraftBody || activeItem.scriptText || ''}\n\n【话题标签】\n${(activeItem.tags || []).map((t) => '#' + t).join(' ')}`;
                          handleCopy(fullPackage, 'final');
                        }}
                        className="text-xs font-semibold text-purple-900 hover:text-purple-950 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-purple-300 shadow-2xs"
                      >
                        {copiedFinalPackage ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedFinalPackage ? '已打包复制' : '一键复制全套发布包'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-purple-900/80">终版定稿标题</label>
                        <input
                          type="text"
                          value={activeItem.finalDraftTitle || ''}
                          onChange={(e) => handleUpdateActiveItem({ finalDraftTitle: e.target.value })}
                          placeholder="小红书吸睛定稿大标题..."
                          className="w-full px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-lg text-[#684852] placeholder-neutral-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-purple-900/80">预定发布时间 (联动月历)</label>
                        <input
                          type="text"
                          value={activeItem.targetDate || ''}
                          onChange={(e) => handleUpdateActiveItem({ targetDate: e.target.value })}
                          placeholder="例如 2026-10-11 18:00"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-lg text-[#684852] placeholder-neutral-400 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    {/* Cover Preview Mini Component */}
                    {activeItem.coverLayout && (
                      <div className="p-3 rounded-lg border border-purple-200/80 bg-white/70 space-y-2">
                        <div className="text-[11px] font-bold text-purple-900 flex items-center justify-between">
                          <span>封面版面排版预览</span>
                          <span className="text-[10px] text-purple-600">小红书 3:4 黄金视觉比</span>
                        </div>
                        <div className={`p-4 rounded-lg border text-center space-y-1.5 ${
                          COVER_COLOR_MAP[activeItem.coverLayout.colorTheme || 'sage']?.bg || 'bg-emerald-50/90'
                        } ${COVER_COLOR_MAP[activeItem.coverLayout.colorTheme || 'sage']?.border || 'border-emerald-200/80'}`}>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            COVER_COLOR_MAP[activeItem.coverLayout.colorTheme || 'sage']?.badgeBg || 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {activeItem.coverLayout.badgeText || currentAccount.badge}
                          </span>
                          <div className={`text-base font-bold whitespace-pre-line leading-snug ${
                            COVER_COLOR_MAP[activeItem.coverLayout.colorTheme || 'sage']?.text || 'text-emerald-900'
                          }`}>
                            {activeItem.coverLayout.mainHeadline}
                          </div>
                          {activeItem.coverLayout.subHeadline && (
                            <div className="text-xs text-[#8F727C]">
                              {activeItem.coverLayout.subHeadline}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border border-pink-200/70 rounded-2xl bg-white/75 backdrop-blur-xl p-12 text-center text-xs text-[#8C767E]">
                  请在左侧选择或新建一条内容进行深度编辑与排版
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: 全矩阵热点雷达 (每个热点附带真实有效的原帖/官方外链) */}
      {/* ========================================================================= */}
      {showTrendsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/20 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white/95 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-pink-200 overflow-hidden text-[#684852]">
            {/* Modal Header */}
            <div className="p-5 border-b border-pink-100 flex items-center justify-between bg-pink-50/70">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-pink-500" />
                <div>
                  <h3 className="text-base font-bold text-[#684852]">
                    自媒体热点雷达 · 真实信源与权威爆款库
                  </h3>
                  <p className="text-xs text-[#8F727C] mt-0.5">
                    每条热点均附带真实可点击的原帖/小红书话题/官方公告外部直达链接
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTrendsModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Selector filter */}
            <div className="p-3 border-b border-pink-100 bg-white/70 flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-[#8F727C]">筛选账号:</span>
              <button
                onClick={() => { setTrendsAccountFilter('all'); playChime('click'); }}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  trendsAccountFilter === 'all'
                    ? 'bg-pink-100 text-pink-900 border border-pink-300 shadow-xs'
                    : 'bg-white text-[#8F727C] border border-pink-200 hover:bg-pink-50'
                }`}
              >
                全矩阵 ({ACCOUNT_TRENDING_TOPICS.length})
              </button>
              {MEDIA_ACCOUNTS.map((acc) => {
                const count = ACCOUNT_TRENDING_TOPICS.filter((t) => t.accountId === acc.id).length;
                return (
                  <button
                    key={acc.id}
                    onClick={() => { setTrendsAccountFilter(acc.id); playChime('click'); }}
                    className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                      trendsAccountFilter === acc.id
                        ? 'bg-pink-100 text-pink-900 border border-pink-300 shadow-xs'
                        : 'bg-white text-[#8F727C] border border-pink-200 hover:bg-pink-50'
                    }`}
                  >
                    {acc.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Trend Items Scroll Stream */}
            <div className="flex-1 overflow-y-auto p-5 divide-y divide-pink-100 space-y-4">
              {displayedTrends.map((trend) => {
                const acc = MEDIA_ACCOUNTS.find((a) => a.id === trend.accountId);

                return (
                  <div key={trend.id} className="pt-4 first:pt-0 space-y-2.5">
                    {/* Top Row: Account Badge, Heat, & REAL EXTERNAL LINK */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {acc?.name}
                        </span>
                        <span className="text-[10px] font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                          {trend.heat}
                        </span>
                        <span className="text-[10px] text-[#8C767E]">
                          {trend.sourceType}
                        </span>
                      </div>

                      {/* Clickable Real External URL */}
                      <a
                        href={trend.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors shadow-2xs"
                        title={`打开真实外链: ${trend.url}`}
                      >
                        <span>{trend.urlTitle || '查看原帖 / 官方一手'}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
                      </a>
                    </div>

                    {/* Topic Keyword */}
                    <h4 className="text-sm font-bold text-[#684852]">
                      {trend.keyword}
                    </h4>

                    {/* Hook & Angle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-pink-100">
                      <div>
                        <div className="text-[10px] font-bold text-[#8F727C] uppercase">推荐爆款切入视角</div>
                        <p className="text-[#684852] mt-0.5 leading-relaxed">{trend.suggestedAngle}</p>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-pink-600 uppercase">黄金抓手开头 (Hook)</div>
                        <p className="text-pink-900 font-medium mt-0.5 leading-relaxed italic">“{trend.sampleHook}”</p>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {trend.tags.map((tag) => (
                          <span key={tag} className="text-[10px] text-[#8F727C] bg-neutral-100 px-1.5 py-0.2 rounded border border-neutral-200">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAdoptTrendingTopic(trend, false)}
                          className="px-3 py-1 text-xs font-semibold bg-white hover:bg-neutral-50 text-[#684852] border border-neutral-200 rounded-lg transition-colors"
                        >
                          导入为选题
                        </button>
                        <button
                          onClick={() => handleAdoptTrendingTopic(trend, true)}
                          className="px-3 py-1 text-xs font-semibold bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-300 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>一键智能生成草案</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: 每日 AI 权威情报流 (OpenAI, Anthropic, Google DeepMind 原厂直通) */}
      {/* ========================================================================= */}
      {showAIIntelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/20 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white/95 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-teal-200 overflow-hidden text-[#684852]">
            <div className="p-5 border-b border-teal-100 flex items-center justify-between bg-teal-50/70">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="text-base font-bold text-[#684852]">
                    每日 AI 权威原厂情报流 (官方一手白皮书与技术发布)
                  </h3>
                  <p className="text-xs text-teal-800 mt-0.5">
                    严格筛选 OpenAI, Anthropic, Google DeepMind, Cursor, DeepSeek 官方技术公告
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAIIntelModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 divide-y divide-teal-100 space-y-4">
              {DAILY_AI_INTELLIGENCE.map((intel) => (
                <div key={intel.id} className="pt-4 first:pt-0 space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {intel.organization}
                      </span>
                      <span className="text-[10px] text-[#8F727C] bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 font-mono">
                        {intel.date} · {intel.credibility}
                      </span>
                    </div>

                    <a
                      href={intel.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors shadow-2xs"
                    >
                      <span>原厂公告直达</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <h4 className="text-sm font-bold text-[#684852]">
                    {intel.title}
                  </h4>

                  <p className="text-xs text-[#684852] leading-relaxed bg-white p-2.5 rounded-xl border border-teal-100">
                    {intel.summary}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#8F727C] font-mono truncate max-w-md">
                      信源: {intel.officialUrl}
                    </span>
                    <button
                      onClick={() => handleConvertAIIntelToContent(intel)}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-xs"
                    >
                      转录为 AI 矩阵图文草稿 →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
