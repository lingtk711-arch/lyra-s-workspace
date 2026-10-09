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
      {/* 1. Header Overview Banner */}
      <div className="p-6 rounded-2xl border border-[#F2DFE4] bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#8C5D68] font-medium flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>今日优先级与全矩阵日程联动</span>
          </div>
          <h1 className="text-xl font-bold text-[#2D2326] mt-1">
            专注当下，让每一份灵感从容落地
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            待办完成度：{completedCount} / {tasks.length} 
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
            className="px-3 py-2 text-xs bg-[#FDF4F5] border border-[#F2DFE4] rounded-lg text-[#2D2326] placeholder-neutral-400 focus:outline-none focus:border-[#D9AAB6] w-60 sm:w-72"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
            className="px-2.5 py-2 text-xs bg-[#FDF4F5] border border-[#F2DFE4] rounded-lg text-[#2D2326] focus:outline-none"
          >
            <option value="P1">P1 紧急高优</option>
            <option value="P2">P2 今日推进</option>
            <option value="P3">P3 备忘顺延</option>
          </select>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#2D2326] text-white hover:bg-[#45373B] rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>添加</span>
          </button>
        </form>
      </div>

      {/* 2. Grid: Left Tasks Hierarchy (P1, P2, P3) + Right Media Schedule Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Eisenhower-style Priority Lists */}
        <div className="lg:col-span-7 space-y-4">
          {/* P1 Section */}
          <div className="p-5 rounded-2xl border border-rose-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>P1 必须完成 · 核心关键推进 ({p1Tasks.length})</span>
              </span>
              <span className="text-[11px] text-neutral-400">优先处理，绝不拖延</span>
            </div>

            <div className="space-y-1.5">
              {p1Tasks.length > 0 ? (
                p1Tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`group p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      task.completed
                        ? 'border-neutral-100 bg-neutral-50/60 text-neutral-400'
                        : 'border-[#F8E3E8] bg-[#FFF8FA] hover:border-[#E8CAD2]'
                    }`}
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
                <div className="py-4 text-center text-xs text-neutral-400">太棒了，暂无 P1 紧急高优任务</div>
              )}
            </div>
          </div>

          {/* P2 Section */}
          <div className="p-5 rounded-2xl border border-amber-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>P2 稳健推进 · 习惯与学习 ({p2Tasks.length})</span>
              </span>
              <span className="text-[11px] text-neutral-400">节奏把控</span>
            </div>

            <div className="space-y-1.5">
              {p2Tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    task.completed
                      ? 'border-neutral-100 bg-neutral-50/60 text-neutral-400'
                      : 'border-[#FAF0E6] bg-white hover:border-[#F2DFD0]'
                  }`}
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
          <div className="p-5 rounded-2xl border border-[#F2DFE4] bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                <span>P3 备忘顺延 · 稍后待办 ({p3Tasks.length})</span>
              </span>
              <span className="text-[11px] text-neutral-400">有余力时完成</span>
            </div>

            <div className="space-y-1.5">
              {p3Tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    task.completed
                      ? 'border-neutral-100 bg-neutral-50/60 text-neutral-400'
                      : 'border-[#F5E2E7] bg-white hover:border-[#E8D1D7]'
                  }`}
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
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl border border-purple-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-purple-600" />
                  <span>全矩阵预发布排期总览</span>
                </h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">
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

            <div className="space-y-2.5">
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
                      className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/40 hover:bg-purple-50 hover:border-purple-200 cursor-pointer transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-purple-800 bg-white px-2 py-0.5 rounded border border-purple-200">
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
                        <span>发布平台: {item.platforms.join(' · ')}</span>
                        <span className="text-purple-600 font-medium">点击跳转编辑 →</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-neutral-400">
                  暂无预发布排期，可在自媒体工作台中为内容设定排期时间
                </div>
              )}
            </div>
          </div>

          {/* Quick Quote / Sedona Affirmation Card */}
          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>今日心流释放微心法</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed font-sans">
              “不是消灭焦虑，而是向内看一眼，问问自己：‘在此刻，我能否允许这份情绪存在片刻？能否轻轻放下？’
              当你不再试图掌控所有结果，心流自会自然流淌。”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
