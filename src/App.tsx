/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MediaWorkspace } from './components/MediaWorkspace';
import { ScheduleView } from './components/ScheduleView';
import { EnglishStudio } from './components/EnglishStudio';
import { DeveloperTools } from './components/DeveloperTools';
import { CommandPalette } from './components/CommandPalette';
import { SettingsModal } from './components/SettingsModal';
import { ActiveView, ContentItem, DailyTask, EnglishPhrase } from './types';
import { 
  INITIAL_CONTENT_ITEMS, 
  INITIAL_DAILY_TASKS, 
  INITIAL_ENGLISH_PHRASES 
} from './utils/mediaPresets';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('media');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('acc_sedona');

  // 1. Content Items State (4 Accounts, Stage Pipelines)
  const [contentItems, setContentItems] = useState<ContentItem[]>(() => {
    try {
      const saved = localStorage.getItem('kansodesk_content_items_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => ({
            ...item,
            tags: Array.isArray(item?.tags) ? item.tags : [],
            platforms: Array.isArray(item?.platforms) ? item.platforms : ['小红书']
          }));
        }
      }
      return INITIAL_CONTENT_ITEMS;
    } catch {
      return INITIAL_CONTENT_ITEMS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kansodesk_content_items_v2', JSON.stringify(contentItems));
    } catch {
      // ignore
    }
  }, [contentItems]);

  // 2. Daily Tasks & Schedule State (V3 with Date & 4 Quadrants)
  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    try {
      const saved = localStorage.getItem('kansodesk_daily_tasks_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t) => ({
            ...t,
            date: t.date || '2026-10-11',
            quadrant: t.quadrant || (t.priority === 'P1' ? 'q1_urgent_important' : t.priority === 'P2' ? 'q2_important_not_urgent' : 'q4_neither')
          }));
        }
      }
      return INITIAL_DAILY_TASKS;
    } catch {
      return INITIAL_DAILY_TASKS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kansodesk_daily_tasks_v3', JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  // 3. English Phrases State
  const [phrases, setPhrases] = useState<EnglishPhrase[]>(() => {
    try {
      const saved = localStorage.getItem('kansodesk_english_phrases_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((p) => ({
            ...p,
            usageNotes: Array.isArray(p?.usageNotes) ? p.usageNotes : (p?.notes ? [p.notes] : ['地道高频表达']),
            extendedScenarios: Array.isArray(p?.extendedScenarios) ? p.extendedScenarios : [],
            nativeAlternatives: Array.isArray(p?.nativeAlternatives) ? p.nativeAlternatives : []
          }));
        }
      }
      return INITIAL_ENGLISH_PHRASES;
    } catch {
      return INITIAL_ENGLISH_PHRASES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kansodesk_english_phrases_v2', JSON.stringify(phrases));
    } catch {
      // ignore
    }
  }, [phrases]);

  // Modals
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Global Keyboard Shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRestoreAll = (data: {
    contentItems: ContentItem[];
    tasks: DailyTask[];
    phrases: EnglishPhrase[];
  }) => {
    setContentItems(data.contentItems);
    setTasks(data.tasks);
    setPhrases(data.phrases);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FDF4F5] text-[#2D2326] selection:bg-[#F2CCD6] selection:text-[#2D2326]">
      {/* Top Bar adheres to 3-zone Top Bar Contract */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenCommandPalette={() => setIsCommandOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeView === 'media' && (
          <MediaWorkspace
            contentItems={contentItems}
            onUpdateItems={setContentItems}
            selectedAccountId={selectedAccountId}
            onSelectAccount={setSelectedAccountId}
          />
        )}

        {activeView === 'schedule' && (
          <ScheduleView
            tasks={tasks}
            onUpdateTasks={setTasks}
            contentItems={contentItems}
            onSelectAccount={setSelectedAccountId}
            onNavigateToMedia={() => setActiveView('media')}
          />
        )}

        {activeView === 'english' && (
          <EnglishStudio
            phrases={phrases}
            onUpdatePhrases={setPhrases}
          />
        )}

        {activeView === 'tools' && (
          <DeveloperTools />
        )}
      </main>

      {/* Modals */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        contentItems={contentItems}
        onSelectView={setActiveView}
        onSelectContentItem={(accId) => setSelectedAccountId(accId)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        contentItems={contentItems}
        tasks={tasks}
        phrases={phrases}
        onRestoreAll={handleRestoreAll}
      />
    </div>
  );
}
