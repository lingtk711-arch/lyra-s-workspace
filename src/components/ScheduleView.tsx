import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Target,
  Layers,
  ArrowUpRight,
  Flame,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { DailyTask, TaskPriority, TaskQuadrant, ContentItem, PlanningLevel, WeekGoal } from '../types';
import { MEDIA_ACCOUNTS, INITIAL_WEEK_GOALS } from '../utils/mediaPresets';
import { playChime } from '../utils/audio';

interface ScheduleViewProps {
  tasks: DailyTask[];
  onUpdateTasks: (tasks: DailyTask[]) => void;
  contentItems: ContentItem[];
  onSelectAccount: (accountId: string) => void;
  onNavigateToMedia: () => void;
}

const QUADRANT_CONFIG: Record<TaskQuadrant, {
  label: string;
  sub: string;
  badge: string;
  color: string;
  border: string;
  bg: string;
  badgeBg: string;
  icon: string;
}> = {
  q1_urgent_important: {
    label: '核心推进 · 必须完成',
    sub: '第一象限 · 重要且紧急 · 今日决定性胜仗',
    badge: 'Q1 核心',
    color: 'text-rose-950',
    border: 'border-rose-200/90',
    bg: 'bg-rose-50/30',
    badgeBg: 'bg-rose-100 text-rose-800',
    icon: '🎯'
  },
  q2_important_not_urgent: {
    label: '稳健推进 · 次要完成',
    sub: '第二象限 · 重要不紧急 · 习惯、沉淀与复盘',
    badge: 'Q2 稳健',
    color: 'text-amber-950',
    border: 'border-amber-200/90',
    bg: 'bg-amber-50/30',
    badgeBg: 'bg-amber-100 text-amber-800',
    icon: '🌱'
  },
  q3_urgent_not_important: {
    label: '备案顺延 · 临时委派',
    sub: '第三象限 · 紧急不重要 · 琐事、回复与物料对接',
    badge: 'Q3 顺延',
    color: 'text-sky-950',
    border: 'border-sky-200/90',
    bg: 'bg-sky-50/30',
    badgeBg: 'bg-sky-100 text-sky-800',
    icon: '📬'
  },
  q4_neither: {
    label: '稍后待办 · 低优备选',
    sub: '第四象限 · 不紧急不重要 · 灵感沉淀与闲暇探索',
    badge: 'Q4 备选',
    color: 'text-stone-900',
    border: 'border-stone-200/90',
    bg: 'bg-stone-50/40',
    badgeBg: 'bg-stone-100 text-stone-700',
    icon: '☕'
  }
};

const WEEKDAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// Helper to normalize task quadrant
function getTaskQuadrant(task: DailyTask): TaskQuadrant {
  if (task.quadrant) return task.quadrant;
  if (task.priority === 'P1') return 'q1_urgent_important';
  if (task.priority === 'P2') return 'q2_important_not_urgent';
  return 'q4_neither';
}

// Helper to format date YYYY-MM-DD
function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  tasks,
  onUpdateTasks,
  contentItems,
  onSelectAccount,
  onNavigateToMedia,
}) => {
  // 1. Planning Level Tabs: Month -> Week -> Day
  const [planningLevel, setPlanningLevel] = useState<PlanningLevel>('month');

  // 2. Focused Date (Default to today: 2026-10-11)
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-11');

  // Month navigation state: defaults to October 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October

  // Week Goals state
  const [weekGoals, setWeekGoals] = useState<WeekGoal[]>(() => {
    try {
      const saved = localStorage.getItem('kansodesk_week_goals_v1');
      return saved ? JSON.parse(saved) : INITIAL_WEEK_GOALS;
    } catch {
      return INITIAL_WEEK_GOALS;
    }
  });

  const handleToggleWeekGoal = (id: string) => {
    const updated = weekGoals.map((g) => {
      if (g.id === id) {
        if (!g.completed) playChime('complete');
        return { ...g, completed: !g.completed };
      }
      return g;
    });
    setWeekGoals(updated);
    try {
      localStorage.setItem('kansodesk_week_goals_v1', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Safe task normalization
  const safeTasks = useMemo(() => {
    return (Array.isArray(tasks) ? tasks : []).map((t) => ({
      ...t,
      quadrant: getTaskQuadrant(t),
      date: t.date || '2026-10-11'
    }));
  }, [tasks]);

  // Tasks mapped by date
  const tasksByDate = useMemo(() => {
    const map = new Map<string, DailyTask[]>();
    safeTasks.forEach((task) => {
      const d = task.date || '2026-10-11';
      const list = map.get(d) || [];
      list.push(task);
      map.set(d, list);
    });
    return map;
  }, [safeTasks]);

  // Staged content mapped by targetDate prefix (YYYY-MM-DD)
  const scheduledContentsByDate = useMemo(() => {
    const map = new Map<string, ContentItem[]>();
    (Array.isArray(contentItems) ? contentItems : []).forEach((item) => {
      if (item.stage === 'staging' && item.targetDate) {
        const datePrefix = item.targetDate.split(' ')[0].trim();
        const list = map.get(datePrefix) || [];
        list.push(item);
        map.set(datePrefix, list);
      }
    });
    return map;
  }, [contentItems]);

  // Daily Tasks for the currently selected date
  const currentDayTasks = useMemo(() => {
    return safeTasks.filter((t) => (t.date || '2026-10-11') === selectedDate);
  }, [safeTasks, selectedDate]);

  const currentDayScheduledContents = useMemo(() => {
    return scheduledContentsByDate.get(selectedDate) || [];
  }, [scheduledContentsByDate, selectedDate]);

  // New Task Form in Daily View
  const [newTitle, setNewTitle] = useState('');
  const [newQuadrant, setNewQuadrant] = useState<TaskQuadrant>('q1_urgent_important');
  const [newDueTime, setNewDueTime] = useState('18:00');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const priorityMap: Record<TaskQuadrant, TaskPriority> = {
      q1_urgent_important: 'P1',
      q2_important_not_urgent: 'P2',
      q3_urgent_not_important: 'P3',
      q4_neither: 'P3'
    };

    const newTask: DailyTask = {
      id: 'dt_' + Date.now(),
      title: newTitle.trim(),
      completed: false,
      priority: priorityMap[newQuadrant],
      quadrant: newQuadrant,
      date: selectedDate,
      dueDate: newDueTime.trim() || undefined,
      createdAt: Date.now(),
    };

    onUpdateTasks([newTask, ...tasks]);
    setNewTitle('');
    playChime('click');
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        if (!t.completed) playChime('complete');
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    onUpdateTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    onUpdateTasks(tasks.filter((t) => t.id !== id));
    playChime('click');
  };

  const handleMoveQuadrant = (id: string, targetQuadrant: TaskQuadrant) => {
    const priorityMap: Record<TaskQuadrant, TaskPriority> = {
      q1_urgent_important: 'P1',
      q2_important_not_urgent: 'P2',
      q3_urgent_not_important: 'P3',
      q4_neither: 'P3'
    };

    const updated = tasks.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          quadrant: targetQuadrant,
          priority: priorityMap[targetQuadrant]
        };
      }
      return t;
    });
    onUpdateTasks(updated);
    playChime('click');
  };

  // Calendar Days Computation
  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Day of week: 0=Sun, 1=Mon, ..., 6=Sat
    // We want Monday to be 0
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const cells: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevDate = new Date(currentYear, currentMonth - 1, d);
      cells.push({
        dateStr: formatDate(prevDate),
        dayNumber: d,
        isCurrentMonth: false,
        isToday: formatDate(prevDate) === '2026-10-11'
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(currentYear, currentMonth, day);
      const str = formatDate(thisDate);
      cells.push({
        dateStr: str,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: str === '2026-10-11'
      });
    }

    // Next month padding to fill complete weeks (multiples of 7)
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const nextDate = new Date(currentYear, currentMonth + 1, day);
      cells.push({
        dateStr: formatDate(nextDate),
        dayNumber: day,
        isCurrentMonth: false,
        isToday: formatDate(nextDate) === '2026-10-11'
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  // Jump from Calendar Click straight to Day 4-Quadrant View!
  const handleCalendarDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setPlanningLevel('day');
    playChime('click');
  };

  // Day navigation helpers
  const handlePrevDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    setSelectedDate(formatDate(current));
    playChime('click');
  };

  const handleNextDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    setSelectedDate(formatDate(current));
    playChime('click');
  };

  const handleGoToday = () => {
    setSelectedDate('2026-10-11');
    setCurrentYear(2026);
    setCurrentMonth(9);
    playChime('click');
  };

  // Calculate day completion
  const dayDoneCount = currentDayTasks.filter((t) => t.completed).length;
  const dayTotalCount = currentDayTasks.length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Planning Tier Navigation Bar (月度 / 每周 / 每日) */}
      <div className="pb-4 border-b border-[#F2DFE4]/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#8C5D68] font-medium flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>三级联动规划体系 · 战略日历与四象限推进</span>
          </div>
          <h1 className="text-xl font-bold text-[#2D2326] mt-1 flex items-center gap-2">
            <span>{planningLevel === 'month' ? '月度规划日历' : planningLevel === 'week' ? '每周战役与负载规划' : '每日待办 · 四象限执行看板'}</span>
            <span className="text-xs font-normal text-neutral-400 font-mono">
              ({selectedDate === '2026-10-11' ? '今日 10月11日' : selectedDate})
            </span>
          </h1>
        </div>

        {/* Level Switcher (月 / 周 / 日) */}
        <div className="flex items-center gap-1 bg-[#F5E6E8]/70 p-1 rounded-xl border border-[#ECD1D8]">
          <button
            onClick={() => { setPlanningLevel('month'); playChime('click'); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              planningLevel === 'month'
                ? 'bg-white text-[#2D2326] shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-rose-600" />
            <span>月度规划 (日历表)</span>
          </button>

          <button
            onClick={() => { setPlanningLevel('week'); playChime('click'); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              planningLevel === 'week'
                ? 'bg-white text-[#2D2326] shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-amber-600" />
            <span>每周战役规划</span>
          </button>

          <button
            onClick={() => { setPlanningLevel('day'); playChime('click'); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              planningLevel === 'day'
                ? 'bg-white text-[#2D2326] shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>每日待办 (四象限)</span>
          </button>
        </div>
      </div>

      {/* ======================= LEVEL 1: 月度规划 (日历表) ======================= */}
      {planningLevel === 'month' && (
        <div className="space-y-4">
          {/* Calendar Controls & Month Switcher */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                    playChime('click');
                  }}
                  className="p-1.5 rounded-lg text-neutral-600 hover:bg-white border border-[#F2DFE4]/80 transition-colors"
                  title="上个月"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-[#2D2326] px-2 font-mono">
                  {currentYear} 年 {currentMonth + 1} 月
                </span>
                <button
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear(currentYear + 1);
                    } else {
                      setCurrentMonth(currentMonth + 1);
                    }
                    playChime('click');
                  }}
                  className="p-1.5 rounded-lg text-neutral-600 hover:bg-white border border-[#F2DFE4]/80 transition-colors"
                  title="下个月"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleGoToday}
                className="px-2.5 py-1 text-xs font-semibold bg-white text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-lg transition-colors"
              >
                回到今日 (10月11日)
              </button>
            </div>

            <div className="text-xs text-neutral-500 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                <span>Q1 核心必须完成</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span>Q2 稳健推进</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                <span>📌 矩阵排期发布</span>
              </span>
              <span className="text-neutral-400">· 点击日期立即进入该日四象限待办</span>
            </div>
          </div>

          {/* Calendar Table Grid (去卡片化，扁平利落无嵌套边框) */}
          <div className="border border-[#ECD1D8] rounded-2xl overflow-hidden bg-white/90 shadow-2xs">
            {/* Weekdays Row */}
            <div className="grid grid-cols-7 border-b border-[#F2DFE4] bg-[#FDF0F2]/50 text-center py-2.5 text-xs font-bold text-[#5C454B]">
              {WEEKDAY_NAMES.map((name, idx) => (
                <div key={name} className={idx >= 5 ? 'text-rose-600' : ''}>
                  {name}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-[#F2DFE4]">
              {calendarCells.map((cell) => {
                const cellTasks = tasksByDate.get(cell.dateStr) || [];
                const cellStaged = scheduledContentsByDate.get(cell.dateStr) || [];
                const q1Count = cellTasks.filter((t) => t.quadrant === 'q1_urgent_important').length;
                const q2Count = cellTasks.filter((t) => t.quadrant === 'q2_important_not_urgent').length;
                const q34Count = cellTasks.length - q1Count - q2Count;
                const isSelected = selectedDate === cell.dateStr;

                return (
                  <div
                    key={cell.dateStr}
                    onClick={() => handleCalendarDayClick(cell.dateStr)}
                    className={`min-h-[96px] p-2 transition-all cursor-pointer flex flex-col justify-between group ${
                      !cell.isCurrentMonth
                        ? 'bg-neutral-50/60 text-neutral-300'
                        : isSelected
                        ? 'bg-rose-50/40 ring-2 ring-inset ring-rose-400'
                        : 'bg-white hover:bg-rose-50/20'
                    }`}
                  >
                    {/* Top Row: Date Number & Badges */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        cell.isToday
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : isSelected
                          ? 'bg-[#2D2326] text-white'
                          : cell.isCurrentMonth
                          ? 'text-[#2D2326]'
                          : 'text-neutral-400'
                      }`}>
                        {cell.dayNumber}
                      </span>

                      {cell.isToday && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded border border-rose-200">
                          今日
                        </span>
                      )}
                    </div>

                    {/* Middle: Content/Task Indicators */}
                    <div className="space-y-1 my-1">
                      {/* Scheduled Media Content Chip */}
                      {cellStaged.length > 0 && (
                        <div className="text-[10px] font-medium bg-purple-50 text-purple-800 px-1.5 py-0.5 rounded border border-purple-200/80 truncate flex items-center gap-1" title={cellStaged.map((s) => s.title).join(' / ')}>
                          <span>📌</span>
                          <span className="truncate">{cellStaged[0].finalDraftTitle || cellStaged[0].title}</span>
                        </div>
                      )}

                      {/* Daily Tasks Badges */}
                      {cellTasks.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          {q1Count > 0 && (
                            <span className="text-[9px] font-mono font-bold bg-rose-100 text-rose-800 px-1 rounded" title={`${q1Count} 项核心待办`}>
                              Q1: {q1Count}
                            </span>
                          )}
                          {q2Count > 0 && (
                            <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-1 rounded" title={`${q2Count} 项稳健推进`}>
                              Q2: {q2Count}
                            </span>
                          )}
                          {q34Count > 0 && (
                            <span className="text-[9px] font-mono text-neutral-500 bg-neutral-100 px-1 rounded" title={`${q34Count} 项备忘/备选`}>
                              +{q34Count}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom: Quick prompt on hover */}
                    <div className="text-[10px] text-neutral-400 group-hover:text-rose-600 flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>穿透待办</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================= LEVEL 2: 每周规划 (周战役与负荷) ======================= */}
      {planningLevel === 'week' && (
        <div className="space-y-6">
          {/* Week OKRs & Battlegrounds */}
          <div className="border border-[#ECD1D8] rounded-2xl p-5 bg-white/90 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2DFE4]">
              <div>
                <h2 className="text-sm font-bold text-[#2D2326] flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-rose-600" />
                  <span>本周核心战役攻坚 (战略 OKR 与关键交付)</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  以周为单位锁定关键交付，拒绝低水平忙碌，确保自媒体、学习与生活稳步前行
                </p>
              </div>
              <div className="text-xs font-mono text-neutral-500">
                完成率: {weekGoals.filter((g) => g.completed).length} / {weekGoals.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {weekGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => handleToggleWeekGoal(goal.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    goal.completed
                      ? 'bg-emerald-50/40 border-emerald-200/70 text-neutral-400'
                      : 'bg-[#FDF9F9] hover:bg-white border-[#F2DFE4] text-[#2D2326]'
                  }`}
                >
                  <button className="mt-0.5">
                    {goal.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold ${goal.completed ? 'line-through' : ''}`}>
                      {goal.title}
                    </div>
                    {goal.targetCount && (
                      <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                        目标考核: {goal.targetCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Sprint Horizon Strip */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#5C454B] flex items-center justify-between">
              <span>本周 7 天时间轴负载与任务分布</span>
              <span className="text-[11px] text-neutral-400">点击任意一天即可展开每日四象限待办</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
              {[
                { date: '2026-10-05', dayName: '周一' },
                { date: '2026-10-06', dayName: '周二' },
                { date: '2026-10-07', dayName: '周三' },
                { date: '2026-10-08', dayName: '周四' },
                { date: '2026-10-09', dayName: '周五' },
                { date: '2026-10-10', dayName: '周六' },
                { date: '2026-10-11', dayName: '周日' },
              ].map((item) => {
                const dayTasks = tasksByDate.get(item.date) || [];
                const dayStaged = scheduledContentsByDate.get(item.date) || [];
                const isToday = item.date === '2026-10-11';
                const isSelected = selectedDate === item.date;

                return (
                  <div
                    key={item.date}
                    onClick={() => handleCalendarDayClick(item.date)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[120px] ${
                      isSelected
                        ? 'border-rose-400 bg-rose-50/50 shadow-2xs'
                        : isToday
                        ? 'border-rose-200 bg-white ring-1 ring-rose-200'
                        : 'border-[#F2DFE4] bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2D2326]">{item.dayName}</span>
                        <span className="text-[10px] font-mono text-neutral-400">{item.date.slice(5)}</span>
                      </div>
                      {isToday && (
                        <div className="mt-1">
                          <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1 py-0.2 rounded">
                            今日执行
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 my-2">
                      {dayStaged.length > 0 && (
                        <div className="text-[10px] text-purple-800 bg-purple-50 px-1 rounded truncate border border-purple-200">
                          📌 {dayStaged[0].finalDraftTitle || dayStaged[0].title}
                        </div>
                      )}
                      <div className="text-[11px] font-mono text-neutral-600">
                        {dayTasks.length} 项待办 ({dayTasks.filter((t) => t.completed).length} 完)
                      </div>
                    </div>

                    <div className="text-[10px] text-rose-700 font-semibold flex items-center justify-between pt-1 border-t border-[#F2DFE4]/50">
                      <span>进入日历</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================= LEVEL 3: 每日待办 (四象限法) ======================= */}
      {planningLevel === 'day' && (
        <div className="space-y-6">
          {/* Day Stepper & Quick Add Bar */}
          <div className="p-4 rounded-2xl border border-[#ECD1D8] bg-white/90 shadow-2xs space-y-4">
            {/* Date Navigation Strip */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#F2DFE4]">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevDay}
                  className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100 border border-[#F2DFE4] transition-colors"
                  title="前一天"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#2D2326] font-mono">
                    {selectedDate}
                  </span>
                  {selectedDate === '2026-10-11' ? (
                    <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
                      今日
                    </span>
                  ) : (
                    <button
                      onClick={handleGoToday}
                      className="text-[10px] text-neutral-500 hover:text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded"
                    >
                      回到今日
                    </button>
                  )}
                </div>
                <button
                  onClick={handleNextDay}
                  className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100 border border-[#F2DFE4] transition-colors"
                  title="后一天"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day Progress & Return to Calendar */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-500">
                  当日完成率：<strong className="font-mono text-[#2D2326]">{dayDoneCount} / {dayTotalCount}</strong> ({dayTotalCount > 0 ? Math.round((dayDoneCount / dayTotalCount) * 100) : 0}%)
                </span>
                <button
                  onClick={() => { setPlanningLevel('month'); playChime('click'); }}
                  className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/70"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>返回月历表</span>
                </button>
              </div>
            </div>

            {/* If there is scheduled media content for today */}
            {currentDayScheduledContents.length > 0 && (
              <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-base">📌</span>
                  <span className="font-bold text-purple-950">今日排期发布：</span>
                  <span className="text-purple-800 font-medium">
                    {currentDayScheduledContents[0].finalDraftTitle || currentDayScheduledContents[0].title}
                  </span>
                  <span className="text-[10px] font-mono text-purple-600 bg-white px-1.5 py-0.2 rounded border border-purple-200">
                    {currentDayScheduledContents[0].targetDate}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onSelectAccount(currentDayScheduledContents[0].accountId);
                    onNavigateToMedia();
                  }}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 shrink-0"
                >
                  <span>前往文案定稿</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Quick Add Form */}
            <form onSubmit={handleAddTask} className="flex items-center gap-2 flex-wrap pt-1">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={`新增 ${selectedDate} 待办事项...`}
                className="px-3 py-2 text-xs bg-white border border-[#F2DFE4] rounded-xl text-[#2D2326] placeholder-neutral-400 focus:outline-none focus:border-[#D9AAB6] flex-1 min-w-[200px]"
              />
              <select
                value={newQuadrant}
                onChange={(e) => setNewQuadrant(e.target.value as TaskQuadrant)}
                className="px-2.5 py-2 text-xs bg-white border border-[#F2DFE4] rounded-xl text-[#2D2326] focus:outline-none"
              >
                <option value="q1_urgent_important">🎯 Q1 核心推进 (必须完成)</option>
                <option value="q2_important_not_urgent">🌱 Q2 稳健推进 (习惯/学习)</option>
                <option value="q3_urgent_not_important">📬 Q3 备案顺延 (临时/琐事)</option>
                <option value="q4_neither">☕ Q4 稍后待办 (低优备选)</option>
              </select>
              <input
                type="text"
                value={newDueTime}
                onChange={(e) => setNewDueTime(e.target.value)}
                placeholder="时间如 18:00"
                className="px-2.5 py-2 text-xs bg-white border border-[#F2DFE4] rounded-xl text-[#2D2326] w-24 text-center focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#2D2326] text-white hover:bg-[#45373B] rounded-xl transition-colors shrink-0 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加到当前日</span>
              </button>
            </form>
          </div>

          {/* 4 Quadrants Matrix Layout (2x2 Grid or Editorial Bays) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(['q1_urgent_important', 'q2_important_not_urgent', 'q3_urgent_not_important', 'q4_neither'] as TaskQuadrant[]).map((quadrantKey) => {
              const cfg = QUADRANT_CONFIG[quadrantKey];
              const quadTasks = currentDayTasks.filter((t) => t.quadrant === quadrantKey);

              return (
                <div
                  key={quadrantKey}
                  className={`p-4 rounded-2xl border ${cfg.border} ${cfg.bg} space-y-3 transition-colors`}
                >
                  {/* Quadrant Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2DFE4]/80">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cfg.icon}</span>
                      <div>
                        <div className={`text-xs font-bold ${cfg.color}`}>
                          {cfg.label}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {cfg.sub}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${cfg.badgeBg}`}>
                      {quadTasks.length} 项
                    </span>
                  </div>

                  {/* Tasks List in this Quadrant */}
                  <div className="divide-y divide-[#F2DFE4]/60 min-h-[90px]">
                    {quadTasks.length > 0 ? (
                      quadTasks.map((task) => (
                        <div
                          key={task.id}
                          className="group py-2 flex items-center justify-between gap-2.5 hover:bg-white/60 px-1.5 rounded-lg transition-colors"
                        >
                          {/* Checkbox and Title */}
                          <button
                            onClick={() => handleToggleTask(task.id)}
                            className="flex items-center gap-2 flex-1 text-left min-w-0"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-neutral-400 group-hover:text-rose-500 shrink-0" />
                            )}
                            <span className={`text-xs ${task.completed ? 'line-through text-neutral-400' : 'text-[#2D2326] font-medium'}`}>
                              {task.title}
                            </span>
                          </button>

                          {/* Time & Quadrant Migration controls */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {task.dueDate && (
                              <span className="text-[10px] font-mono text-neutral-500 bg-white/80 px-1.5 py-0.5 rounded border border-[#F2DFE4]">
                                {task.dueDate}
                              </span>
                            )}

                            {/* Quick Quadrant Switch Menu */}
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                              {quadrantKey !== 'q1_urgent_important' && (
                                <button
                                  onClick={() => handleMoveQuadrant(task.id, 'q1_urgent_important')}
                                  title="升为 Q1 核心推进"
                                  className="text-[9px] text-rose-700 bg-white px-1 py-0.5 rounded border border-rose-200 hover:bg-rose-50"
                                >
                                  →Q1
                                </button>
                              )}
                              {quadrantKey !== 'q2_important_not_urgent' && (
                                <button
                                  onClick={() => handleMoveQuadrant(task.id, 'q2_important_not_urgent')}
                                  title="移至 Q2 稳健推进"
                                  className="text-[9px] text-amber-700 bg-white px-1 py-0.5 rounded border border-amber-200 hover:bg-amber-50"
                                >
                                  →Q2
                                </button>
                              )}
                              {quadrantKey !== 'q3_urgent_not_important' && (
                                <button
                                  onClick={() => handleMoveQuadrant(task.id, 'q3_urgent_not_important')}
                                  title="移至 Q3 临时顺延"
                                  className="text-[9px] text-sky-700 bg-white px-1 py-0.5 rounded border border-sky-200 hover:bg-sky-50"
                                >
                                  →Q3
                                </button>
                              )}
                              {quadrantKey !== 'q4_neither' && (
                                <button
                                  onClick={() => handleMoveQuadrant(task.id, 'q4_neither')}
                                  title="移至 Q4 稍后备选"
                                  className="text-[9px] text-neutral-700 bg-white px-1 py-0.5 rounded border border-neutral-200 hover:bg-neutral-50"
                                >
                                  →Q4
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                                title="删除该待办"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-[11px] text-neutral-400">
                        暂无此象限事项，保持专注
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily Sedona Healing Affirmation (去卡片化，自然留白) */}
          <div className="pt-4 border-t border-[#F2DFE4]/80 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>圣多纳心法提示：优先清空第一象限核心胜仗，给第二象限留出呼吸与反思时间。</span>
            </div>
            <button
              onClick={() => { setPlanningLevel('month'); playChime('click'); }}
              className="text-xs text-rose-700 hover:underline font-semibold"
            >
              查看月历全貌 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
