import { useState } from 'react';
import {
  Server,
  Zap,
  Cpu,
  Flame,
  Sun,
  ShieldCheck,
  Calculator,
  ChevronRight,
} from 'lucide-react';
import {
  HARDWARE_SCENARIOS,
  HardwareScenario,
  formatLargeNumber,
  toSuperscript,
} from '../lib/cosmicMath';

interface ScenariosTabProps {
  currentSpeed: number;
}

export function ScenariosTab({ currentSpeed }: ScenariosTabProps) {
  const [selectedScenario, setSelectedScenario] = useState<HardwareScenario>(
    HARDWARE_SCENARIOS[0]
  );

  const customSpeed = currentSpeed > 0 ? currentSpeed : 4500;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <Server className="w-4 h-4" />
          <span>KOMPUTATIONELLE GRENZEN & SUPERCOMPUTER</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-100">
          Was wäre, wenn die mächtigsten Rechner der Welt angreifen?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          Oft fragen Laien: <em>„Könnte nicht ein Geheimdienst mit Supercomputern
          oder ein gigantisches Botnetz Bitcoin hacken?“</em> Hier ist der
          mathematische Beweis, warum selbst galaktische Zivilisationen scheitern.
        </p>
      </div>

      {/* Scenario List */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-300">
          WÄHLE EIN RECHEN-SZENARIO:
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {HARDWARE_SCENARIOS.map((sc) => {
            const isUserDevice = sc.id === 'current_device';
            const displaySpeed = isUserDevice ? customSpeed : sc.keysPerSec;
            const isSelected = selectedScenario.id === sc.id;

            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 shrink-0 mt-0.5">
                    {sc.id === 'dyson_sphere' ? (
                      <Sun className="w-4 h-4 text-amber-400" />
                    ) : sc.id === 'global_btc_mining' ? (
                      <Flame className="w-4 h-4 text-orange-400" />
                    ) : sc.id === 'frontier_supercomputer' ? (
                      <Server className="w-4 h-4 text-sky-400" />
                    ) : (
                      <Cpu className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <span>{sc.titleDe}</span>
                      {isUserDevice && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          LIVE AKTIV
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {sc.deviceType}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/60">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-100 block">
                      {formatLargeNumber(displaySpeed)} Keys/s
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatLargeNumber(sc.universeLifetimes)} × Weltalter
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isSelected ? 'text-amber-400 translate-x-1' : ''
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Scenario Deep Dive Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-amber-400 flex items-center gap-1.5">
            <Calculator className="w-4 h-4" />
            <span>ANALYSE: {selectedScenario.titleDe.toUpperCase()}</span>
          </span>
          <span className="font-mono text-slate-400">
            Hardware-Profil
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {selectedScenario.descriptionDe}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">
              Rechenleistung
            </span>
            <span className="text-base font-mono font-bold text-slate-200 mt-1 block">
              {formatLargeNumber(
                selectedScenario.id === 'current_device'
                  ? customSpeed
                  : selectedScenario.keysPerSec
              )}{' '}
              k/s
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">
              Dauer für 50% Keyspace
            </span>
            <span className="text-base font-mono font-bold text-amber-300 mt-1 block">
              {formatLargeNumber(selectedScenario.timeToExhaust50PercentYears)} Jahre
            </span>
          </div>

          <div className="bg-slate-950 border border-rose-950/60 rounded-xl p-3 text-center">
            <span className="text-[10px] text-rose-400 uppercase font-mono block">
              Universums-Zeitalter
            </span>
            <span className="text-base font-mono font-bold text-rose-400 mt-1 block">
              {formatLargeNumber(selectedScenario.universeLifetimes)} ×
            </span>
          </div>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-slate-400 leading-relaxed">
          Selbst mit einer futuristischen <strong>Dyson-Sphäre</strong>, die die
          gesamte Energieabgabe unserer Sonne (380 Quadrillionen Watt) bündelt,
          bräuchte der Rechner noch immer{' '}
          <strong className="text-slate-200 font-mono">1.33 × 10²¹ Weltalter</strong>
          (eine Trilliarde Mal die Zeit seit dem Urknall), um 50% der Schlüssel
          zu durchsuchen!
        </div>
      </div>

      {/* Thermodynamic Landauer Limit Card */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-3 shadow-lg shadow-amber-500/5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>DAS THERMODYNAMISCHE LANDAUER-PRINZIP (PHYSIK)</span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-slate-100">
          Warum die Gesetze der Thermodynamik Brute-Force verbieten
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          1961 bewies der Physiker <strong>Rolf Landauer</strong> bei IBM ein
          fundamentales Naturgesetz: Das Löschen oder Ändern eines einzelnen Bits
          Information erfordert in jedem physikalischen System mindestens die
          thermische Energie:
        </p>

        {/* Formula */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center font-mono text-sm sm:text-base text-amber-300 font-bold">
          E_min = k_B · T · ln(2)
        </div>

        <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
          <p>
            Bei Raumtemperatur (300 Kelvin / 27°C) sind das mindestens{' '}
            <strong className="text-slate-200">2.87 × 10⁻²¹ Joule</strong> pro
            Bit-Operation.
          </p>
          <p>
            Um einfach nur einen 256-Bit-Zähler von 0 bis $2^{256}$
            hochzuzählen, benötigt man rein physikalisch mehr als{' '}
            <strong className="text-amber-300 font-mono">10⁵⁸ Joule Energie</strong>.
          </p>
          <p className="bg-rose-950/30 border border-rose-900/40 rounded-lg p-2.5 text-rose-200">
            Die gesamte Masse-Energie unserer Sonne beträgt nur etwa{' '}
            <strong>1.8 × 10⁴⁷ Joule</strong>. Man müsste{' '}
            <strong>hundert Milliarden Sonnen</strong> vollständig in reine
            Energie umwandeln, nur um den Strom für die Zählung bereitzustellen.
          </p>
        </div>
      </div>
    </div>
  );
}
