import { useState } from 'react';
import {
  Globe2,
  Atom,
  Clock,
  Zap,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Box,
} from 'lucide-react';
import {
  COSMIC_MILESTONES,
  KEYSPACE_2_256_DECIMAL,
  calculateTimeStats,
  formatLargeNumber,
} from '../lib/cosmicMath';
import { CosmicCanvas } from './CosmicCanvas';

interface CosmicScaleTabProps {
  currentSpeed: number;
  testedKeysCount: number;
}

export function CosmicScaleTab({
  currentSpeed,
  testedKeysCount,
}: CosmicScaleTabProps) {
  const [sliderExp, setSliderExp] = useState(77);
  const [selectedMilestone, setSelectedMilestone] = useState(
    COSMIC_MILESTONES[5] // Bitcoin keyspace
  );

  const speedToUse = currentSpeed > 0 ? currentSpeed : 4500;
  const timeStats = calculateTimeStats(speedToUse);

  // Find nearest milestone to current slider value
  const activeMilestone =
    COSMIC_MILESTONES.reduce((prev, curr) =>
      Math.abs(curr.exponent - sliderExp) < Math.abs(prev.exponent - sliderExp)
        ? curr
        : prev
    );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>DAS MATHEMATISCHE PARADOXON</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-100">
          Warum Bitcoin Brute-Force physikalisch unmöglich ist
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          Ein 256-Bit Schlüssel besitzt $2^{256}$ Zustände. Das sind{' '}
          <strong className="text-slate-200">115.792 Quinquagintillionen</strong>{' '}
          Möglichkeiten. Der Zahlenraum ist so gigantisch, dass er die Dimensionen
          des beobachtbaren physikalischen Universums sprengt.
        </p>

        {/* 2^256 Full Number Callout */}
        <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-500 font-mono mb-1">
            EXAKTE ANZAHL MÖGLICHER PRIVATE KEYS (2²⁵⁶):
          </div>
          <div className="font-mono text-xs sm:text-sm text-amber-300 font-semibold break-all select-all leading-tight">
            {KEYSPACE_2_256_DECIMAL}
          </div>
        </div>
      </div>

      {/* Cosmic Void Particle Canvas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-sky-400" />
            <span>KOSMISCHE DIMENSIONEN IM VERGLEICH</span>
          </span>
          <span className="font-mono text-slate-500">
            Logarithmische Skala (10¹⁸ – 10⁸⁰)
          </span>
        </div>
        <CosmicCanvas exponent={sliderExp} testedKeysCount={testedKeysCount} />
      </div>

      {/* Direct Comparison: Universe Volume vs Bitcoin Keyspace */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
              <Box className="w-3.5 h-3.5" />
              <span>UNIVERSUM IN KM³</span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-slate-100 mt-2">
              3.57 × 10⁷¹ km³
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-snug">
            Der Bitcoin-Zahlenraum ($1.16 \times 10^{77}$) ist{' '}
            <span className="text-amber-300 font-semibold font-mono">
              3.243.473-mal GRÖSSER
            </span>{' '}
            als das gesamte bekannte Universum in Kubikkilometern!
          </div>
        </div>

        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-amber-500/5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>BITCOIN SCHLÜSSEL (2²⁵⁶)</span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-amber-300 mt-2">
              1.16 × 10⁷⁷ Keys
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300 leading-snug">
            Eine unvorstellbare 78-stellige Zahl. Jeder gezielte Treffer
            entspricht dem blinden Finden eines ganz bestimmten markierten
            Wasserstoffatoms im gesamten Kosmos.
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <Atom className="w-3.5 h-3.5" />
              <span>ATOME IM KOSMOS</span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-slate-100 mt-2">
              ~ 10⁸⁰ Atome
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-snug">
            Alle Protonen und Neutronen in allen 2 Billionen Galaxien des
            beobachtbaren Universums. Das Raumvolumen beträgt ca. 3.57 × 10⁸⁰ m³.
          </div>
        </div>
      </div>

      {/* Interactive Logarithmic Slider */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-200">
            INTERAKTIVER GRÖSSENORDNUNGS-REGLER:
          </div>
          <div className="font-mono text-xs font-bold text-amber-400">
            10^{sliderExp} ({formatLargeNumber(Math.pow(10, Math.min(sliderExp, 20)))}{' '}
            {sliderExp > 20 && `bis 10^${sliderExp}`})
          </div>
        </div>

        <input
          type="range"
          min="10"
          max="82"
          step="1"
          value={sliderExp}
          onChange={(e) => setSliderExp(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />

        {/* Milestone Quick Jump Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {COSMIC_MILESTONES.map((ms) => (
            <button
              key={ms.id}
              onClick={() => {
                setSliderExp(Math.round(ms.exponent));
                setSelectedMilestone(ms);
              }}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                Math.round(ms.exponent) === sliderExp
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              10^{Math.round(ms.exponent)}: {ms.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Active Milestone Card */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-amber-400">
              {activeMilestone.name}
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              10^{activeMilestone.exponent.toFixed(1)}
            </span>
          </div>
          <div className="font-mono text-sm font-bold text-slate-200 mb-2">
            {activeMilestone.valueFormatted}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-2">
            {activeMilestone.descriptionDe}
          </p>
          <div className="text-xs text-sky-300 bg-sky-950/40 border border-sky-900/40 rounded-lg p-2.5 font-medium">
            💡 {activeMilestone.comparisonWithKeyspace}
          </div>
        </div>
      </div>

      {/* Dynamic Time Calculation based on user's benchmark speed */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
            <Clock className="w-4 h-4" />
            <span>ZEITRECHNUNG MIT DEINER HARDWARE-GESCHWINDIGKEIT</span>
          </div>
          <span className="text-[11px] font-mono text-amber-400">
            {speedToUse.toLocaleString('de-DE')} Keys/s
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Wie lange würde dein Gerät bei konstanter Volllast (ohne Überhitzung
          oder Stromausfall) benötigen, um nur <strong className="text-slate-200">50% des Zahlenraums ($2^{255}$)</strong> zu prüfen?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-500 font-mono uppercase">
              Erforderliche Jahre:
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-slate-100 mt-1 tabular-nums">
              {timeStats.formattedYears} Jahre
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              (Eine Zahl mit über 65 Nullen)
            </div>
          </div>

          <div className="bg-slate-950 border border-rose-900/50 rounded-xl p-3.5">
            <div className="text-[11px] text-rose-400 font-mono uppercase">
              Lebenszeiten des Universums:
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-rose-300 mt-1 tabular-nums">
              {timeStats.formattedLifetimes} ×
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              (Basierend auf 13,8 Milliarden Jahren seit dem Urknall)
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-200/90 leading-relaxed">
          <strong>Fazit:</strong> Selbst wenn jeder Mensch auf der Erde 1 Milliarde
          Smartphones besäße und diese seit dem Urknall ohne Unterbrechung
          rechnen würden, läge die Chance auf einen Treffer noch immer bei
          unter $0.00000000000000000000000000000000000000000001\%$.
        </div>
      </div>
    </div>
  );
}
