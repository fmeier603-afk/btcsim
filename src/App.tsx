/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Zap,
  Globe2,
  Server,
  Terminal,
  Code2,
  Cpu,
  Info,
  Download,
} from 'lucide-react';
import { AndroidFrame } from './components/AndroidFrame';
import { BenchmarkTab } from './components/BenchmarkTab';
import { CosmicScaleTab } from './components/CosmicScaleTab';
import { ScenariosTab } from './components/ScenariosTab';
import { CryptoLabTab } from './components/CryptoLabTab';
import { CppSourceTab } from './components/CppSourceTab';
import { AndroidExportTab } from './components/AndroidExportTab';

type TabType = 'benchmark' | 'cosmic' | 'scenarios' | 'cryptolab' | 'cpp' | 'export';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('benchmark');
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [testedKeysCount, setTestedKeysCount] = useState<number>(0);

  const TABS = [
    {
      id: 'benchmark' as TabType,
      label: 'Benchmark',
      labelEn: 'Benchmark',
      icon: Zap,
    },
    {
      id: 'cosmic' as TabType,
      label: 'Kosmos-Maßstab',
      labelEn: 'Cosmic Scale',
      icon: Globe2,
    },
    {
      id: 'scenarios' as TabType,
      label: 'Szenarien',
      labelEn: 'Scenarios',
      icon: Server,
    },
    {
      id: 'cryptolab' as TabType,
      label: 'Krypto-Labor',
      labelEn: 'Crypto Lab',
      icon: Terminal,
    },
    {
      id: 'cpp' as TabType,
      label: 'C++ Code',
      labelEn: 'C++ Source',
      icon: Code2,
    },
    {
      id: 'export' as TabType,
      label: 'Android Export (APK)',
      labelEn: 'Export APK',
      icon: Download,
    },
  ];

  return (
    <AndroidFrame activeTab={activeTab}>
      {/* App Header */}
      <header className="bg-slate-950 px-4 sm:px-6 py-3.5 border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
            ₿
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-1.5 leading-none">
              <span>Cosmic Hash</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                v2.5
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Bitcoin Brute-Force & Universum Benchmark
            </p>
          </div>
        </div>

        {/* Live Hashrate indicator */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="block text-[10px] font-mono uppercase text-slate-500">
              Rate
            </span>
            <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
              {currentSpeed > 0 ? `${currentSpeed.toLocaleString()} k/s` : 'Bereit'}
            </span>
          </div>
        </div>
      </header>

      {/* Top Tab Bar (Desktop / Tablet Navigation) */}
      <nav className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Tab Content Body */}
      <main className="flex-1 pb-16 sm:pb-6">
        {activeTab === 'benchmark' && (
          <BenchmarkTab
            onSpeedUpdate={setCurrentSpeed}
            testedKeysCount={testedKeysCount}
            setTestedKeysCount={setTestedKeysCount}
          />
        )}
        {activeTab === 'cosmic' && (
          <CosmicScaleTab
            currentSpeed={currentSpeed}
            testedKeysCount={testedKeysCount}
          />
        )}
        {activeTab === 'scenarios' && (
          <ScenariosTab currentSpeed={currentSpeed} />
        )}
        {activeTab === 'cryptolab' && <CryptoLabTab />}
        {activeTab === 'cpp' && <CppSourceTab />}
        {activeTab === 'export' && <AndroidExportTab />}
      </main>

      {/* Mobile Android Bottom Tab Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-6 py-1.5 px-0.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                isActive ? 'text-amber-400' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-medium tracking-tight truncate max-w-[56px]">
                {tab.label.split('-')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </AndroidFrame>
  );
}
