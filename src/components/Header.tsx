import { FC } from 'react';
import {
  BookOpen,
  Bot,
  Gauge,
  Rocket,
  Database,
  Sparkles,
} from 'lucide-react';
import { TabMode } from '../types';

interface HeaderProps {
  activeTab: TabMode;
  onSelectTab: (tab: TabMode) => void;
  completedStepCount: number;
  totalStepCount: number;
  onOpenDatabase: () => void;
  activeToolsCount: number;
}

export const Header: FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  completedStepCount,
  totalStepCount,
  onOpenDatabase,
  activeToolsCount,
}) => {
  const tabs = [
    {
      id: 'codelab' as TabMode,
      label: 'Codelab Curriculum',
      icon: BookOpen,
      badge: `${completedStepCount}/${totalStepCount} Done`,
      badgeColor: completedStepCount === totalStepCount ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'studio' as TabMode,
      label: 'Agent Studio & Sandbox',
      icon: Bot,
      badge: `${activeToolsCount} Tools`,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'eval' as TabMode,
      label: 'Benchmark & Evaluation',
      icon: Gauge,
      badge: '5 Test Suites',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'deploy' as TabMode,
      label: 'Deployment & Integration',
      icon: Rocket,
      badge: 'Widget & Cloud Run',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#050505] text-[#F5F5F5] border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & App Title */}
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-lg shadow-blue-600/30 shrink-0">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="uppercase tracking-[0.25em] text-xs font-bold text-white">
                  System_Architecture_Lab
                </span>
                <span className="px-2 py-0.5 border border-white/20 rounded-full text-[9px] uppercase tracking-wider text-white/70 font-mono">
                  v2.04_BETA
                </span>
              </div>
              <p className="text-[11px] text-white/50 tracking-wider uppercase font-mono mt-0.5">
                Customer AI Agent • Gemini 3.7 Flash Engine
              </p>
            </div>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center space-x-2.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-md shadow-white/5'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-blue-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-tight border ${
                      isActive ? 'bg-black/10 text-black border-black/20' : tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Database Inspector & Quick Stats */}
          <div className="flex items-center space-x-3">
            <button
              id="open-db-inspector-btn"
              onClick={onOpenDatabase}
              className="flex items-center space-x-2 px-4 py-2 border border-white/20 text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-wider transition-all"
              title="Inspect Orders, Inventory, and Escalated Tickets"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Live DB Inspector</span>
            </button>

            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 border border-blue-500/30 bg-blue-950/30 rounded-full text-[10px] uppercase tracking-widest text-blue-400 font-mono">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>Gemini 3.7 Flash</span>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2.5 space-x-2 border-t border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 text-white/70 border border-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
