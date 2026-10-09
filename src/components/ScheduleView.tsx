import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  Sparkles, 
  AlertCircle, 
  Check, 
  ExternalLink,
  Flame,
  ArrowRight
} from 'lucide-react';
import { DailyTask, TaskPriority, ContentItem } from '../types';
import { MEDIA_ACCOUNTS } from '../utils/mediaPresets';
import { playChime } from '../utils/audio';

interface ScheduleViewProps {
  tasks: DailyTask[];
  onUpdateTasks: (tasks: DailyTask[]) => void;
  contentItems: ContentItem[];
  onSelectAccount: (accountId: string) => void;
  onNavigateToMedia: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  tasks,
  onUpdateTasks,
  contentItems,
  onSelectAccount,
  onNavigateToMedia,
}) => {
  // New Task form
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('P1');
  const [newDueDate, setNewDueDate] = useState('今天');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const task: DailyTask = {
      id: 'dt_' + Date.now(),
      title: newTitle.trim(),
      completed: false,
      priority: newPriority,
      dueDate: newDueDate.trim() || undefined,
      createdAt: Date.now(),
    };
    onUpdateTasks([task, ...tasks]);
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

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeContentItems = Array.isArray(contentItems) ? contentItems : [];

  // Cross-account Scheduled Pipeline Items (自动聚合所有账号中定有发布时间的内容)
  const scheduledContents = safeContentItems.filter((i) => i.targetDate && i.stage === 'staging');

  const p1Tasks = safeTasks.filter((t) => t.priority === 'P1');
  const p2Tasks = safeTasks.filter((t) => t.priority === 'P2');
  const p3Tasks = safeTasks.filter((t) => t.priority === 'P3');
  const completedCount = safeTasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header Overview Banner (去卡片化，扁平轻快) */}
      <div className="pb-4 border-b border-[#F2DFE4]/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#8C5D68] font-medium flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>今日优先级与全矩阵日程联动</span>
          </div>
          <h1 className="text-xl font-bold text-[#2D2326] mt-1">
            专注当下，让每一份灵感从容落地
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            待办完成度：<span className="font-mono text-neutral-700 font-bold">{completedCount} / {tasks.length}</span> 
            <span aria-hidden="true" className="mx-1.5">·</span>
            {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}% 达成
          </p>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAddTask} className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="新增今日关键待办事项..."
            className="px-3 py-2 text-xs bg-white border border-[#F2DFE4] rounded-xl text-[#2D2326] placeholder-neutral-400 focus:outline-none focus:border-[#D9AAB6] w-60 sm:w-72 shadow-2xs"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
            className="px-2.5 py-2 text-xs bg-white border border-[#F2DFE4] rounded-xl text-[#2D2326] focus:outline-none shadow-2xs"
          >
            <option value="P1">P1 紧急高优</option>
            <option value="P2">P2 今日推进</option>
            <option value="P3">P3 备忘顺延</option>
          </select>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#2D2326] text-white hover:bg-[#45373B] rounded-xl transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>添加</span>
          </button>
        </form>
      </div>

      {/* 2. Grid: Left Tasks Hierarchy (P1, P2, P3) + Right Media Schedule Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: 极简流式待办列表（无卡片套娃） */}
        <div className="lg:col-span-7 space-y-6">
          {/* P1 Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-rose-200/80">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <span>P1 必须完成 · 核心推进</span>
                <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-mono font-bold">
                  {p1Tasks.length}
                </span>
              </span>
              <span className="text-[11px] text-neutral-400">优先处理，绝不拖延</span>
            </div>

            <div className="divide-y divide-rose-100/60">
              {p1Tasks.length > 0 ? (
                p1Tasks.map((task) => (
                  <div
                    key={task.id}
                    className="group py-2.5 flex items-center justify-between gap-3 transition-colors hover:bg-white/40 px-2 rounded-lg"
                  >
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="flex items-center gap-2.5 flex-1 text-left min-w-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-rose-400 shrink-0 group-hover:text-rose-600" />
                      )}
                      <span className={`text-xs ${task.completed ? 'line-through text-neutral-400' : 'text-[#2D2326] font-medium'}`}>
                        {task.title}
                      </span>
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      {task.dueDate && (
                        <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-mono">
                          {task.dueDate}
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-3 text-xs text-neutral-400 px-2">暂无 P1 关键推进待办</div>
              )}
            </div>
          </div>

          {/* P2 Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/80">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <span>P2 稳健推进 · 习惯与学习</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono font-bold">
                  {p2Tasks.length}
                </span>
              </span>
              <span className="text-[11px] text-neutral-400">节奏把控</span>
            </div>

            <div className="divide-y divide-amber-100/60">
              {p2Tasks.map((task) => (
                <div
                  key={task.id}
                  className="group py-2.5 flex items-center justify-between gap-3 transition-colors hover:bg-white/40 px-2 rounded-lg"
                >
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-center gap-2.5 flex-1 text-left min-w-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-amber-500 shrink-0 group-hover:text-amber-700" />
                    )}
                    <span className={`text-xs ${task.completed ? 'line-through text-neutral-400' : 'text-[#2D2326]'}`}>
                      {task.title}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* P3 Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200/80">
              <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <span>P3 备忘顺延 · 稍后待办</span>
                <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.2 rounded font-mono font-bold">
                  {p3Tasks.length}
                </span>
              </span>
              <span className="text-[11px] text-neutral-400">有余力时完成</span>
            </div>

            <div className="divide-y divide-neutral-100">
              {p3Tasks.map((task) => (
                <div
                  key={task.id}
                  className="group py-2.5 flex items-center justify-between gap-3 transition-colors hover:bg-white/40 px-2 rounded-lg"
                >
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-center gap-2.5 flex-1 text-left min-w-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                    <span className={`text-xs ${task.completed ? 'line-through text-neutral-400' : 'text-[#2D2326]'}`}>
                      {task.title}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: 全矩阵发布排期日历联动 (Cross-account Content Radar) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl border border-purple-200/80 bg-white/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-purple-100">
              <div>
                <h2 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-purple-600" />
                  <span>全矩阵预发布排期总览</span>
                </h2>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  自动聚合所有账号中已设定日期的内容
                </p>
              </div>

              <button
                onClick={onNavigateToMedia}
                className="text-[11px] text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
              >
                <span>进入工作台</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {scheduledContents.length > 0 ? (
                scheduledContents.map((item) => {
                  const acc = MEDIA_ACCOUNTS.find((a) => a.id === item.accountId);
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectAccount(item.accountId);
                        onNavigateToMedia();
                      }}
                      className="p-3 rounded-xl border border-purple-100/70 bg-purple-50/30 hover:bg-purple-50 hover:border-purple-200 cursor-pointer transition-all space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-purple-800 bg-white/90 px-2 py-0.5 rounded border border-purple-200/60">
                          {acc?.name}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-purple-900">
                          {item.targetDate}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-[#2D2326] line-clamp-1">
                        {item.finalDraftTitle || item.title}
                      </div>

                      {item.hook && (
                        <p className="text-[11px] text-neutral-500 line-clamp-1 italic">
                          "{item.hook}"
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                        <span>平台: {item.platforms.join(' · ')}</span>
                        <span className="text-purple-600 font-medium">跳转编辑 →</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs text-neutral-400">
                  暂无排期内容，可在自媒体工作台中设定排期时间
                </div>
              )}
            </div>
          </div>

          {/* Quick Quote / Sedona Affirmation Card */}
          <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 space-y-1.5">
            <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>今日心流释放微心法</span>
            </div>
            <p className="text-xs text-emerald-900/80 leading-relaxed font-sans">
              “不是消灭焦虑，而是向内看一眼，问问自己：‘在此刻，我能否允许这份情绪存在片刻？能否轻轻放下？’
              当你不再试图掌控所有结果，心流自会自然流淌。”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
