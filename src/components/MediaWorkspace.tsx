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
  Link as LinkIcon, 
  CheckCircle2, 
  FileCheck, 
  Zap, 
  Radio, 
  ShieldCheck, 
  Globe, 
  BookOpen, 
  Wand2,
  RefreshCw,
  User,
  ThumbsUp,
  MessageSquare,
  Share2
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
  topic: { label: '选题池', icon: '💡', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  script: { label: '文案创作', icon: '✍️', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800' },
  staging: { label: '预发布排期', icon: '📅', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
  published: { label: '已发布归档', icon: '🎉', bg: 'bg-sky-50 border-sky-200', text: 'text-sky-700' },
  analytics: { label: '数据复盘', icon: '📊', bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700' },
};

const COVER_COLOR_MAP: Record<string, { bg: string; border: string; text: string; badgeBg: string }> = {
  sage: { bg: 'bg-[#EBF3EF]', border: 'border-[#D2E4DA]', text: 'text-[#2D4538]', badgeBg: 'bg-[#DCECE3] text-[#24533C]' },
  lilac: { bg: 'bg-[#F4EEF7]', border: 'border-[#E3D6E9]', text: 'text-[#442D4F]', badgeBg: 'bg-[#EAE0F0] text-[#4F2B61]' },
  cyan: { bg: 'bg-[#EAF3F7]', border: 'border-[#D0E4EE]', text: 'text-[#243F4D]', badgeBg: 'bg-[#D9EAF3] text-[#1E4C63]' },
  apricot: { bg: 'bg-[#FDF2EB]', border: 'border-[#F7DEC9]', text: 'text-[#543825]', badgeBg: 'bg-[#FAE4D4] text-[#693917]' },
};

export const MediaWorkspace: React.FC<MediaWorkspaceProps> = ({
  contentItems,
  onUpdateItems,
  selectedAccountId,
  onSelectAccount,
}) => {
  const currentAccount = MEDIA_ACCOUNTS.find((a) => a.id === selectedAccountId) || MEDIA_ACCOUNTS[0];

  // Stage Filter
  const [selectedStage, setSelectedStage] = useState<PipelineStage | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTrendsDrawer, setShowTrendsDrawer] = useState(false);
  const [showAIIntelDrawer, setShowAIIntelDrawer] = useState(currentAccount.id === 'acc_ai');
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
        colorTheme: 'sage'
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onUpdateItems([newItem, ...contentItems]);
    setSelectedItemId(newItem.id);
    playChime('click');
  };

  // Adopt from Xiaohongshu Trending Topic
  const handleAdoptTrendingTopic = (trend: TrendingTopic, autoGenerate: boolean = false) => {
    const defaultColor = currentAccount.id === 'acc_sedona' ? 'sage' : currentAccount.id === 'acc_ai' ? 'cyan' : 'apricot';
    
    let generatedScript = '';
    if (autoGenerate) {
      if (currentAccount.id === 'acc_sedona') {
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
      accountId: selectedAccountId,
      title: trend.keyword,
      stage: autoGenerate ? 'script' : 'topic',
      topicSource: topicSourceText,
      topicNotes: `【来源出处】${topicSourceText}\n【推荐切入视角】${trend.suggestedAngle}${trend.discussionMetrics ? `\n【热议数据】点赞 ${trend.discussionMetrics.likes || '-'} · 评论讨论 ${trend.discussionMetrics.comments || '-'} · 转推 ${trend.discussionMetrics.reposts || '-'}` : ''}`,
      hook: trend.sampleHook,
      scriptText: generatedScript || undefined,
      tags: trend.tags,
      platforms: currentAccount.platforms,
      coverLayout: {
        mainHeadline: trend.keyword,
        subHeadline: trend.sampleHook.slice(0, 24) + '...',
        badgeText: trend.author ? trend.author.split(' ')[0] : (trend.tags[0] || currentAccount.badge),
        colorTheme: defaultColor
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onUpdateItems([newItem, ...contentItems]);
    setSelectedItemId(newItem.id);
    setShowTrendsDrawer(false);
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
      topicSource: `官方权威一手验证：${intel.organization} (${intel.credibility})`,
      topicNotes: `【权威信源】${intel.officialUrl}\n【传播角度】${intel.contentAngle}`,
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
    setShowAIIntelDrawer(false);
    playChime('complete');
  };

  // Generate Content for Active Item (智能生成完整方案)
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
      scriptText: generatedScript,
      finalDraftTitle: activeItem.title + (isHealing ? ' 🌿 圣多纳释放练习' : ' 💻 高效实操拆解'),
      finalDraftBody: generatedScript,
      coverLayout: {
        mainHeadline: activeItem.title,
        subHeadline: generatedHook.slice(0, 24) + '...',
        badgeText: activeItem.tags[0] || currentAccount.badge,
        colorTheme: isHealing ? 'sage' : currentAccount.id === 'acc_ai' ? 'cyan' : 'apricot'
      },
      stage: 'script'
    });
    playChime('complete');
  };

  // Update Item field
  const handleUpdateActiveItem = (updates: Partial<ContentItem>) => {
    if (!activeItem) return;
    const updatedList = contentItems.map((item) => {
      if (item.id === activeItem.id) {
        return { ...item, ...updates, updatedAt: Date.now() };
      }
      return item;
    });
    onUpdateItems(updatedList);
  };

  // Stage Advancement
  const handleAdvanceStage = (nextStage: PipelineStage) => {
    if (!activeItem) return;
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

  const accountTrendsRaw = ACCOUNT_TRENDING_TOPICS.filter((t) => t.accountId === selectedAccountId);
  const accountTrends = currentAccount.id === 'acc_ai' && aiRadarFilter !== 'all'
    ? accountTrendsRaw.filter((t) => t.authorType === aiRadarFilter)
    : accountTrendsRaw;
  const bloggerCount = accountTrendsRaw.filter((t) => t.authorType === 'blogger').length;
  const officialCount = accountTrendsRaw.filter((t) => t.authorType === 'official').length;

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-6">
      {/* 1. Leftmost Account Sub-Sidebar (去卡片化精炼导览) */}
      <div className="w-full lg:w-64 shrink-0 space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-1">
          自媒体矩阵独立空间
        </div>

        {/* 账号选择列表：去卡片化，采用极简无界条目 */}
        <div className="space-y-1">
          {MEDIA_ACCOUNTS.map((account) => {
            const isSelected = account.id === selectedAccountId;
            const count = contentItems.filter((i) => i.accountId === account.id).length;
            return (
              <button
                key={account.id}
                onClick={() => {
                  onSelectAccount(account.id);
                  const firstOfAccount = contentItems.find((i) => i.accountId === account.id);
                  setSelectedItemId(firstOfAccount?.id || null);
                  if (account.id === 'acc_ai') setShowAIIntelDrawer(true);
                  playChime('click');
                }}
                className={`w-full p-2.5 rounded-xl text-left transition-all duration-150 flex items-start gap-3 border ${
                  isSelected
                    ? 'bg-white text-[#2D2326] border-[#E2BDC6] shadow-2xs font-medium'
                    : 'bg-transparent text-neutral-600 border-transparent hover:bg-white/60 hover:text-neutral-900'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  account.id === 'acc_sedona' ? 'bg-emerald-100 text-emerald-800' :
                  account.id === 'acc_ai' ? 'bg-sky-100 text-sky-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {account.id === 'acc_sedona' && <Sparkles className="w-3.5 h-3.5" />}
                  {account.id === 'acc_ai' && <Cpu className="w-3.5 h-3.5" />}
                  {(account.id === 'acc_bot1' || account.id === 'acc_bot2') && <Bot className="w-3.5 h-3.5" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2D2326] truncate">
                      {account.name}
                    </span>
                    <span className="text-[10px] font-mono tabular-nums text-neutral-400">
                      {count}篇
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                    {account.subTitle}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-neutral-400">
                    <span>{account.statusTag || account.badge}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Global Pipeline Statistics (去多层嵌套卡片，化为纯净紧凑的统计流) */}
        <div className="pt-3 border-t border-[#F2DFE4]/80 space-y-2 px-1">
          <div className="text-xs font-semibold text-[#5C454B] flex items-center justify-between">
            <span>当前账号漏斗</span>
            <span className="text-[10px] text-neutral-400 font-mono">{currentAccount.followerGoal}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {(['topic', 'script', 'staging', 'published'] as PipelineStage[]).map((st) => {
              const c = accountItems.filter((i) => i.stage === st).length;
              const cfg = STAGE_CONFIG[st];
              return (
                <div key={st} className="p-2 rounded-lg bg-white/60 hover:bg-white transition-colors">
                  <div className="text-neutral-500 text-[10px] flex items-center gap-1">
                    <span>{cfg.icon}</span>
                    <span>{cfg.label}</span>
                  </div>
                  <div className="text-xs font-bold text-[#2D2326] font-mono mt-0.5 tabular-nums">
                    {c} 篇
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Account Specific: Quick Trigger for AI Intelligence Stream & Blogger Trends */}
        {currentAccount.id === 'acc_ai' && (
          <div className="space-y-1.5 pt-2 border-t border-[#F2DFE4]/80 px-1">
            <button
              onClick={() => {
                setShowTrendsDrawer(true);
                setShowAIIntelDrawer(false);
                playChime('click');
              }}
              className="w-full p-2.5 rounded-xl border border-rose-200/80 bg-rose-50/50 hover:bg-rose-100/60 text-left transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <div>
                  <div className="text-xs font-bold text-rose-950">AI 热点雷达</div>
                  <div className="text-[10px] text-rose-700">知名博主 + 官方一手</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-rose-800 bg-white/90 px-2 py-0.5 rounded border border-rose-200/70 font-mono">
                {accountTrendsRaw.length}
              </span>
            </button>

            <button
              onClick={() => {
                setShowAIIntelDrawer(!showAIIntelDrawer);
                playChime('click');
              }}
              className="w-full p-2.5 rounded-xl border border-sky-200/80 bg-sky-50/50 hover:bg-sky-100/60 text-left transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-sky-600" />
                <div>
                  <div className="text-xs font-bold text-sky-950">官方原厂情报流</div>
                  <div className="text-[10px] text-sky-700">OpenAI · Anthropic · Google</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-sky-800 bg-white/90 px-2 py-0.5 rounded border border-sky-200/70 font-mono">
                {DAILY_AI_INTELLIGENCE.length}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Form C: Dual-Pane Layout (形态 C 双版面) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* --- PANE 1: Left List & Stage Pipeline (42% width) --- */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-2xl border border-[#F2DFE4]/80 bg-white/80 shadow-2xs space-y-3">
            {/* Account Title & Add Action */}
            <div className="flex items-center justify-between pb-2 border-b border-[#F2DFE4]/60">
              <div>
                <h2 className="text-sm font-bold text-[#2D2326] flex items-center gap-1.5">
                  <span>{currentAccount.name}</span>
                </h2>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  {currentAccount.platforms.join(' · ')}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowTrendsDrawer(!showTrendsDrawer)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#FDF0F2] text-[#8C5D68] hover:bg-[#FBE4E9] rounded-lg transition-colors border border-[#F5D8E0]"
                  title="查看真实热门话题雷达"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>热点雷达</span>
                </button>

                <button
                  onClick={handleAddNewContent}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#2D2326] hover:bg-[#433539] text-white rounded-lg transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新建</span>
                </button>
              </div>
            </div>

            {/* Trending Topics Drawer (去卡片化流式信息雷达) */}
            {showTrendsDrawer && (
              <div className="p-3 rounded-xl border border-rose-200/80 bg-rose-50/30 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Flame className="w-3.5 h-3.5 text-rose-600" />
                    <span className="text-xs font-bold text-rose-950">
                      {currentAccount.id === 'acc_sedona' ? '圣多纳疗愈 IP · 高赞高互动爆款雷达' :
                       currentAccount.id === 'acc_ai' ? 'AI 科技前沿 · 知名博主高赞 + 官方一手' :
                       `${currentAccount.name} · 高赞高互动爆款雷达`}
                    </span>
                    <span className="text-[10px] text-rose-700 bg-white/90 px-2 py-0.2 rounded border border-rose-200/70 font-mono">
                      今日 {accountTrends.length} 条
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playChime('click')}
                      className="text-[10px] text-rose-700 hover:text-rose-900 font-semibold flex items-center gap-0.5 bg-white/90 px-2 py-0.5 rounded border border-rose-200/70"
                      title="基于日历基准自动轮换最新推荐"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>轮换排序</span>
                    </button>
                    <button
                      onClick={() => setShowTrendsDrawer(false)}
                      className="text-[10px] text-neutral-400 hover:text-neutral-700"
                    >
                      收起
                    </button>
                  </div>
                </div>

                {/* AI 账号专属分类过滤器 */}
                {currentAccount.id === 'acc_ai' && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => { setAiRadarFilter('all'); playChime('click'); }}
                      className={`px-2.5 py-1 text-[11px] rounded-lg transition-all font-semibold ${
                        aiRadarFilter === 'all'
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-white/80 text-[#6C5259] hover:bg-white border border-rose-200/60'
                      }`}
                    >
                      全部精选 ({accountTrendsRaw.length})
                    </button>
                    <button
                      onClick={() => { setAiRadarFilter('blogger'); playChime('click'); }}
                      className={`px-2.5 py-1 text-[11px] rounded-lg transition-all font-semibold flex items-center gap-1 ${
                        aiRadarFilter === 'blogger'
                          ? 'bg-purple-700 text-white shadow-2xs'
                          : 'bg-white/80 text-purple-900 hover:bg-white border border-purple-200/60'
                      }`}
                    >
                      <span>🔥 知名 AI 博主顶流</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-1 py-0.2 rounded font-mono">
                        {bloggerCount}
                      </span>
                    </button>
                    <button
                      onClick={() => { setAiRadarFilter('official'); playChime('click'); }}
                      className={`px-2.5 py-1 text-[11px] rounded-lg transition-all font-semibold flex items-center gap-1 ${
                        aiRadarFilter === 'official'
                          ? 'bg-sky-700 text-white shadow-2xs'
                          : 'bg-white/80 text-sky-900 hover:bg-white border border-sky-200/60'
                      }`}
                    >
                      <span>🏛️ 官方原厂一手</span>
                      <span className="text-[10px] bg-sky-100 text-sky-800 px-1 py-0.2 rounded font-mono">
                        {officialCount}
                      </span>
                    </button>
                  </div>
                )}

                {/* 每日自动更新机制说明提示条 */}
                <div className="py-1 px-2 text-[11px] text-rose-900/80 flex items-start gap-1.5 leading-relaxed">
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span>每日抓取真实高热选题，涵盖知名技术 KOL（Karpathy、宝玉、归藏等）与官方前沿发布，支持一键采纳。</span>
                  </div>
                </div>

                {/* 热点条目流：去内层套娃卡片，采用轻透优雅的条目行 */}
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 divide-y divide-rose-100/70">
                  {accountTrends.map((trend, idx) => (
                    <div
                      key={trend.id}
                      className="pt-2 first:pt-0 space-y-1.5 transition-colors"
                    >
                      {/* 标题与热度 */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-1.5 min-w-0">
                          <span className="text-[10px] font-bold text-rose-600 font-mono mt-0.5 shrink-0">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-[#2D2326] leading-snug">{trend.keyword}</span>
                        </div>
                        <span className="text-[10px] text-rose-700 font-mono shrink-0">
                          {trend.heat}
                        </span>
                      </div>

                      {/* 博主与来源出处条 */}
                      {trend.author && (
                        <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-[#7A5B64]">
                          <span className="font-semibold text-[#2D2326] flex items-center gap-1">
                            <User className="w-2.5 h-2.5 text-neutral-400" />
                            <span>{trend.author}</span>
                          </span>
                          {trend.authorRole && (
                            <span className="text-neutral-400 text-[10px]">· {trend.authorRole}</span>
                          )}
                          {trend.postTime && (
                            <span className="text-[10px] text-neutral-400 font-mono ml-auto">
                              {trend.postTime}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        {trend.suggestedAngle}
                      </p>

                      {/* 讨论度数据指标 (点赞/讨论/转推) */}
                      {trend.discussionMetrics && (
                        <div className="flex items-center gap-3 text-[10px] text-neutral-500">
                          {trend.discussionMetrics.likes && (
                            <span className="flex items-center gap-0.5 font-medium">
                              <ThumbsUp className="w-2.5 h-2.5 text-rose-500" />
                              <span>{trend.discussionMetrics.likes}</span>
                            </span>
                          )}
                          {trend.discussionMetrics.comments && (
                            <span className="flex items-center gap-0.5 font-medium">
                              <MessageSquare className="w-2.5 h-2.5 text-sky-500" />
                              <span>{trend.discussionMetrics.comments}</span>
                            </span>
                          )}
                          {trend.discussionMetrics.reposts && (
                            <span className="flex items-center gap-0.5 font-medium">
                              <Share2 className="w-2.5 h-2.5 text-emerald-500" />
                              <span>{trend.discussionMetrics.reposts}</span>
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[10px]">
                        <span className="text-neutral-400">出处: {trend.sourceType}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleAdoptTrendingTopic(trend, false)}
                            className="px-2 py-0.5 text-[11px] font-semibold text-rose-700 hover:text-rose-900"
                          >
                            采纳选题
                          </button>
                          <button
                            onClick={() => handleAdoptTrendingTopic(trend, true)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-[#2D2326] text-white hover:bg-[#45373B] rounded-lg shadow-2xs"
                            title="采纳并直接生成初版文案与封面方案"
                          >
                            <Wand2 className="w-3 h-3 text-amber-300" />
                            <span>生成文案</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Account: Verified Intelligence Drawer (每日 AI 权威情报流) */}
            {currentAccount.id === 'acc_ai' && showAIIntelDrawer && (
              <div className="p-3 rounded-xl border border-sky-200/80 bg-sky-50/40 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-700" />
                    <span className="text-xs font-bold text-sky-950">
                      今日 AI 权威情报推送（官方一手发布）
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAIIntelDrawer(false)}
                    className="text-[10px] text-neutral-400 hover:text-neutral-700"
                  >
                    收起
                  </button>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 divide-y divide-sky-100">
                  {DAILY_AI_INTELLIGENCE.map((intel) => (
                    <div
                      key={intel.id}
                      className="pt-2 first:pt-0 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-sky-800 bg-sky-100/70 px-1.5 py-0.5 rounded">
                          {intel.organization} · {intel.credibility}
                        </span>
                        <a
                          href={intel.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-sky-600 hover:underline flex items-center gap-0.5"
                        >
                          <span>原厂公告</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      <h4 className="text-xs font-bold text-[#2D2326] leading-snug">
                        {intel.title}
                      </h4>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        {intel.summary}
                      </p>

                      <div className="text-[11px] text-sky-950">
                        <strong>自媒体切角：</strong>{intel.contentAngle}
                      </div>

                      <div className="pt-1 flex items-center justify-end">
                        <button
                          onClick={() => handleConvertAIIntelToContent(intel)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-[#2D2326] text-white hover:bg-[#433539] rounded-lg shadow-2xs transition-colors"
                        >
                          <Zap className="w-3 h-3 text-amber-300" />
                          <span>一键转为本号文案</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="快速搜索选题、来源、文案或标签..."
              className="w-full px-3 py-1.5 text-xs bg-[#FDF4F5]/70 border border-[#F2DFE4] rounded-lg text-[#2D2326] placeholder-neutral-400 focus:outline-none focus:border-[#D9AAB6] focus:bg-white"
            />

            {/* Stage Filter Segmented Buttons */}
            <div className="flex items-center gap-1 p-1 bg-[#FDF4F5]/80 border border-[#F5E2E7] rounded-lg overflow-x-auto scrollbar-none text-[11px]">
              <button
                onClick={() => setSelectedStage('all')}
                className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                  selectedStage === 'all'
                    ? 'bg-white text-[#2D2326] font-semibold shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                全部 ({accountItems.length})
              </button>
              {(['topic', 'script', 'staging', 'published'] as PipelineStage[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStage(st)}
                  className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                    selectedStage === st
                      ? 'bg-white text-[#2D2326] font-semibold shadow-2xs'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {STAGE_CONFIG[st].label} ({accountItems.filter((i) => i.stage === st).length})
                </button>
              ))}
            </div>

            {/* Content Item List (去卡片化，采用具有轻微留白与细发丝线分隔的编辑流) */}
            <div className="divide-y divide-[#F2DFE4]/60 max-h-[580px] overflow-y-auto pr-1">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isSelected = item.id === (activeItem?.id || '');
                  const stageCfg = STAGE_CONFIG[item.stage];
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedItemId(item.id);
                        playChime('click');
                      }}
                      className={`p-3 text-left cursor-pointer transition-all duration-150 rounded-xl relative ${
                        isSelected
                          ? 'bg-[#FFF6F8] ring-1 ring-[#ECC4CE]'
                          : 'bg-transparent hover:bg-neutral-50/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-[#2D2326] line-clamp-2 leading-snug">
                          {item.finalDraftTitle || item.title}
                        </span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0 ${stageCfg.bg} ${stageCfg.text}`}>
                          {stageCfg.icon} {stageCfg.label}
                        </span>
                      </div>

                      {item.topicSource && (
                        <div className="text-[10px] text-[#8C5D68] truncate mt-1">
                          📍 {item.topicSource}
                        </div>
                      )}

                      {item.hook && (
                        <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5 font-sans italic">
                          "{item.hook}"
                        </p>
                      )}

                      <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(item.tags || []).slice(0, 2).map((t) => (
                            <span key={t} className="text-neutral-400">#{t}</span>
                          ))}
                        </div>

                        {item.targetDate && (
                          <span className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                            {item.targetDate.slice(5)}
                          </span>
                        )}
                        {item.metrics?.views && (
                          <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {item.metrics.views.toLocaleString()} 播放
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-xs text-neutral-400">
                  当前阶段暂无内容，点击上方热点雷达或新建按钮
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- PANE 2: Right Focused Bi-directional Canvas (58% width, 去除内部套娃卡片) --- */}
        <div className="lg:col-span-7 space-y-4">
          {activeItem ? (
            <div className="p-6 md:p-8 rounded-2xl border border-[#F2DFE4]/80 bg-white shadow-2xs space-y-6">
              {/* Top: Bi-directional Leap Bar (去厚重卡片，采用轻透导览条) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F2DFE4]/70">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <LinkIcon className="w-3 h-3 text-neutral-400" />
                    <span>双向跃迁链路 · 当前处于</span>
                  </div>
                  <div className="text-sm text-[#2D2326] mt-0.5 font-bold flex items-center gap-1.5">
                    <span>{STAGE_CONFIG[activeItem.stage].icon}</span>
                    <span>{STAGE_CONFIG[activeItem.stage].label}</span>
                  </div>
                </div>

                {/* Stage Leap Buttons + Generate Content Button */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={handleGenerateContentForActiveItem}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-[#FAF0F3] text-[#8C5D68] hover:bg-[#FCE5EB] rounded-lg transition-colors border border-[#F2CCD6]"
                    title="根据选题一键生成完整爆款方案与文案"
                  >
                    <Wand2 className="w-3 h-3 text-amber-500" />
                    <span>一键生成文案</span>
                  </button>

                  <div className="flex items-center gap-1 bg-[#FAF0F3]/70 p-1 rounded-lg border border-[#F5DFE5]">
                    {(['topic', 'script', 'staging', 'published'] as PipelineStage[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleAdvanceStage(st)}
                        className={`px-2 py-1 text-xs rounded-md transition-colors ${
                          activeItem.stage === st
                            ? 'bg-[#2D2326] text-white font-semibold shadow-2xs'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
                        }`}
                        title={`跳跃至 ${STAGE_CONFIG[st].label}`}
                      >
                        {STAGE_CONFIG[st].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title & Hook Inputs (去卡片化，自然呼吸的编辑字段) */}
              <div className="space-y-4">
                {/* 选题来源 (Topic Source) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#8C5D68]">
                      📍 选题来源与背景出处
                    </label>
                    <span className="text-[10px] text-neutral-400">小红书热搜 / 官方一手发布 / 私信灵感</span>
                  </div>
                  <input
                    type="text"
                    value={activeItem.topicSource || ''}
                    onChange={(e) => handleUpdateActiveItem({ topicSource: e.target.value })}
                    placeholder="例如: 小红书今日热搜 #允许一切发生 / Karpathy 知名博主深度拆解..."
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF5F7]/60 border border-[#F2DFE4]/80 rounded-xl text-[#2D2326] focus:outline-none focus:border-[#D9AAB6] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D2326] mb-1">
                    内容主题与主标题
                  </label>
                  <input
                    type="text"
                    value={activeItem.title}
                    onChange={(e) => handleUpdateActiveItem({ title: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm font-semibold bg-[#FAF5F7]/60 border border-[#F2DFE4]/80 rounded-xl text-[#2D2326] focus:outline-none focus:border-[#D9AAB6] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D2326] mb-1 flex items-center justify-between">
                    <span>黄金前3秒抓手 (Hook)</span>
                    <span className="text-[10px] text-neutral-400">首句痛点爆款钩子</span>
                  </label>
                  <input
                    type="text"
                    value={activeItem.hook || ''}
                    onChange={(e) => handleUpdateActiveItem({ hook: e.target.value })}
                    placeholder="如：你越用力想把焦虑赶走，它就越死死抓着你..."
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF5F7]/60 border border-[#F2DFE4]/80 rounded-xl text-[#2D2326] focus:outline-none focus:border-[#D9AAB6] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* STAGE-SPECIFIC VIEWS: 预发布定稿版面 VS 文案创作草稿 */}
              {activeItem.stage === 'staging' ? (
                <div className="space-y-5 pt-2">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-purple-700" />
                      <div>
                        <h3 className="text-xs font-bold text-purple-950">
                          预发布定稿排版与 3:4 封面呈现
                        </h3>
                        <p className="text-[10px] text-purple-600">小红书真实比例真实渲染</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(`${activeItem.finalDraftTitle || activeItem.title}\n\n${activeItem.finalDraftBody || activeItem.scriptText || ''}\n\n${(activeItem.tags || []).map(t => '#' + t).join(' ')}`, 'final')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-lg shadow-2xs transition-colors"
                    >
                      {copiedFinalPackage ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedFinalPackage ? '已复制全套发布包' : '一键复制发布包'}</span>
                    </button>
                  </div>

                  {/* 2-Column: Left 3:4 Mockup Card + Right Final Title/Body */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Left 5 Cols: 小红书 3:4 模拟封面展示卡片（此卡片为真实封面图形，必要保留） */}
                    <div className="md:col-span-5 space-y-2">
                      <span className="text-[11px] font-bold text-neutral-500 block">
                        小红书 3:4 封面图预览
                      </span>

                      {/* The 3:4 Mock Card */}
                      {(() => {
                        const themeKey = activeItem.coverLayout?.colorTheme || 'sage';
                        const themeStyles = COVER_COLOR_MAP[themeKey] || COVER_COLOR_MAP.sage;
                        return (
                          <div
                            className={`w-full aspect-3/4 rounded-2xl border p-5 flex flex-col justify-between shadow-2xs relative overflow-hidden transition-all ${themeStyles.bg} ${themeStyles.border} ${themeStyles.text}`}
                          >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none" />

                            {/* Top Badge */}
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${themeStyles.badgeBg}`}>
                                {activeItem.coverLayout?.badgeText || currentAccount.badge}
                              </span>
                              <Sparkles className="w-3.5 h-3.5 opacity-70" />
                            </div>

                            {/* Center Main Headline */}
                            <div className="space-y-2 my-auto">
                              <h4 className="text-base font-extrabold leading-snug whitespace-pre-line tracking-tight select-all">
                                {activeItem.coverLayout?.mainHeadline || activeItem.title}
                              </h4>
                              {activeItem.coverLayout?.subHeadline && (
                                <p className="text-xs opacity-80 font-medium">
                                  {activeItem.coverLayout.subHeadline}
                                </p>
                              )}
                            </div>

                            {/* Bottom Author Tag */}
                            <div className="pt-2 border-t border-current/15 flex items-center justify-between text-[10px] opacity-80 font-mono">
                              <span>@{currentAccount.name}</span>
                              <span>首发实录</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Color Palette Switcher for Cover */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-neutral-400">色调:</span>
                        {[
                          { key: 'sage', label: '鼠尾草绿', bg: 'bg-[#DCECE3]' },
                          { key: 'lilac', label: '轻柔紫', bg: 'bg-[#EAE0F0]' },
                          { key: 'cyan', label: '天青蓝', bg: 'bg-[#D9EAF3]' },
                          { key: 'apricot', label: '暖杏桃', bg: 'bg-[#FAE4D4]' },
                        ].map((c) => (
                          <button
                            key={c.key}
                            onClick={() => handleUpdateActiveItem({
                              coverLayout: {
                                mainHeadline: activeItem.coverLayout?.mainHeadline || activeItem.title,
                                subHeadline: activeItem.coverLayout?.subHeadline || activeItem.hook,
                                badgeText: activeItem.coverLayout?.badgeText || currentAccount.badge,
                                colorTheme: c.key
                              }
                            })}
                            className={`w-4 h-4 rounded-full border border-neutral-300 ${c.bg} transition-transform ${
                              (activeItem.coverLayout?.colorTheme || 'sage') === c.key ? 'scale-125 ring-2 ring-purple-400' : 'hover:scale-110'
                            }`}
                            title={c.label}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right 7 Cols: 终版定稿标题与正文（去卡片化编辑） */}
                    <div className="md:col-span-7 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          终版定稿大标题
                        </label>
                        <input
                          type="text"
                          value={activeItem.finalDraftTitle || activeItem.title}
                          onChange={(e) => handleUpdateActiveItem({ finalDraftTitle: e.target.value })}
                          placeholder="例如: 越用力越焦虑？3个呼吸，用圣多纳释放胸口那团闷气 🌿"
                          className="w-full px-3 py-2 text-xs font-bold bg-[#FAF5F7]/50 border border-neutral-200 rounded-xl text-[#2D2326] focus:outline-none focus:border-purple-400 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center justify-between">
                          <span>终版定稿排版正文</span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {(activeItem.finalDraftBody || '').length} 字符
                          </span>
                        </label>
                        <textarea
                          value={activeItem.finalDraftBody || activeItem.scriptText || ''}
                          onChange={(e) => handleUpdateActiveItem({ finalDraftBody: e.target.value })}
                          rows={8}
                          className="w-full p-3 text-xs leading-relaxed font-sans bg-[#FAF5F7]/50 border border-neutral-200 rounded-xl text-[#2D2326] focus:outline-none focus:border-purple-400 focus:bg-white resize-y"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1">
                          预定发布时间与平台
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={activeItem.targetDate || ''}
                            onChange={(e) => handleUpdateActiveItem({ targetDate: e.target.value })}
                            placeholder="如: 2026-10-12 20:00"
                            className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-neutral-200 rounded-lg text-[#2D2326]"
                          />
                          <input
                            type="text"
                            value={activeItem.platforms.join(' · ')}
                            readOnly
                            className="w-full px-2.5 py-1.5 text-xs bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-700 font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* 选题痛点与切入视角 (无卡片化，自然融入画卷) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#8C5D68]">
                      <span>💡 选题痛点备忘 & 推荐切入视角</span>
                      <span className="text-[10px] text-neutral-400">双向绑定选题源头</span>
                    </div>
                    <textarea
                      value={activeItem.topicNotes || ''}
                      onChange={(e) => handleUpdateActiveItem({ topicNotes: e.target.value })}
                      placeholder="记录为什么要做这个选题？读者最扎心的痛点是什么？"
                      rows={2}
                      className="w-full p-2.5 text-xs bg-[#FAF5F7]/50 border border-[#F2DFE4]/80 rounded-xl text-[#2D2326] focus:outline-none focus:border-[#D9AAB6] focus:bg-white resize-none transition-all"
                    />
                  </div>

                  {/* 文案正文草稿 (沉浸式编辑，无卡片框束缚) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#2D2326]">
                      <div className="flex items-center gap-2">
                        <span>✍️ 正文草稿与分镜脚本</span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {(activeItem.scriptText || '').length} 字 (建议 600~1000 字)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleGenerateContentForActiveItem}
                          className="flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 font-semibold"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>一键生成文案</span>
                        </button>
                        <button
                          onClick={() => handleCopy(activeItem.scriptText || '', 'script')}
                          className="flex items-center gap-1 text-[11px] text-[#8C5D68] hover:text-[#5E3B44] transition-colors"
                        >
                          {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedScript ? '已复制草稿' : '复制草稿'}</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={activeItem.scriptText || ''}
                      onChange={(e) => handleUpdateActiveItem({ scriptText: e.target.value })}
                      placeholder="在此沉浸撰写你的文案草稿... 或点击右上角【一键生成文案】启动创作..."
                      rows={8}
                      className="w-full p-3.5 text-xs font-sans leading-relaxed bg-[#FAF5F7]/40 border border-[#F2DFE4]/80 rounded-xl text-[#2D2326] focus:outline-none focus:border-[#D9AAB6] focus:bg-white resize-y transition-all"
                    />
                  </div>
                </>
              )}

              {/* 话题标签 */}
              <div className="pt-2 border-t border-[#F5E2E7]/80">
                <label className="block text-xs font-semibold text-[#2D2326] mb-1">
                  小红书话题标签 (以空格分隔)
                </label>
                <input
                  type="text"
                  value={(activeItem.tags || []).join(' ')}
                  onChange={(e) => handleUpdateActiveItem({ tags: e.target.value.split(/\s+/).filter(Boolean) })}
                  placeholder="圣多纳释放法 情绪急救 深度冥想"
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF5F7]/50 border border-[#F2DFE4]/80 rounded-xl text-[#2D2326] focus:outline-none focus:border-[#D9AAB6] focus:bg-white"
                />
              </div>

              {/* 阶段 5 数据复盘 (去卡片化平铺网格) */}
              {(activeItem.stage === 'published' || activeItem.stage === 'analytics') && (
                <div className="pt-3 border-t border-sky-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-950">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-sky-600" />
                      <span>已发布数据复盘与经验沉淀</span>
                    </span>
                    <span className="text-[10px] text-sky-700">反哺选题与口吻</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">展现/播放量</span>
                      <input
                        type="number"
                        value={activeItem.metrics?.views || ''}
                        onChange={(e) => handleUpdateActiveItem({
                          metrics: { ...activeItem.metrics, views: Number(e.target.value) }
                        })}
                        placeholder="0"
                        className="w-full px-2 py-1 text-xs font-mono bg-white border border-neutral-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">点赞数</span>
                      <input
                        type="number"
                        value={activeItem.metrics?.likes || ''}
                        onChange={(e) => handleUpdateActiveItem({
                          metrics: { ...activeItem.metrics, likes: Number(e.target.value) }
                        })}
                        placeholder="0"
                        className="w-full px-2 py-1 text-xs font-mono bg-white border border-neutral-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">收藏数</span>
                      <input
                        type="number"
                        value={activeItem.metrics?.collects || ''}
                        onChange={(e) => handleUpdateActiveItem({
                          metrics: { ...activeItem.metrics, collects: Number(e.target.value) }
                        })}
                        placeholder="0"
                        className="w-full px-2 py-1 text-xs font-mono bg-white border border-neutral-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-1">复盘心得与下期迭代建议</span>
                    <input
                      type="text"
                      value={activeItem.metrics?.keyTakeaway || ''}
                      onChange={(e) => handleUpdateActiveItem({
                        metrics: { ...activeItem.metrics, keyTakeaway: e.target.value }
                      })}
                      placeholder="如：真实第一人称故事互动率极高，封面大字要更精炼..."
                      className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-[#2D2326]"
                    />
                  </div>
                </div>
              )}

              {/* Bottom Actions Bar */}
              <div className="pt-3 border-t border-[#F5E2E7] flex items-center justify-between text-xs">
                <span className="text-neutral-400 text-[11px]">
                  最后更新: {new Date(activeItem.updatedAt).toLocaleTimeString('zh-CN')} · 本地已自动保存
                </span>

                <button
                  onClick={() => handleDeleteItem(activeItem.id)}
                  className="flex items-center gap-1 text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除本篇</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-16 rounded-2xl border border-[#F2DFE4] bg-white text-center text-xs text-neutral-400 space-y-2">
              <Sparkles className="w-8 h-8 text-[#E2BDC6] mx-auto opacity-80" />
              <p>请在左侧选择一篇内容，或点击上方热点雷达采纳选题</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
