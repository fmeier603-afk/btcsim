import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Square,
  Cpu,
  Zap,
  Target,
  Key,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface KeySample {
  hex: string;
  wif: string;
  address: string;
}

interface BenchmarkTabProps {
  onSpeedUpdate: (speed: number) => void;
  testedKeysCount: number;
  setTestedKeysCount: React.Dispatch<React.SetStateAction<number>>;
}

const PRESET_TARGETS = [
  {
    label: 'C++ Skript Ziel',
    address: '18VmXvkF4cgLi35RtMiHHDpvMjUCyVpQ9x',
    note: 'Original Zieladresse aus dem vorgegebenen C++ Skript',
  },
  {
    label: 'Satoshi Genesis (50 BTC)',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    note: 'Erste Bitcoin-Adresse aller Zeiten (Block 0, 2009)',
  },
  {
    label: '1Feex Whale (79.957 BTC)',
    address: '1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF',
    note: 'Bekannte inaktive historische Riesen-Adresse',
  },
];

export function BenchmarkTab({
  onSpeedUpdate,
  testedKeysCount,
  setTestedKeysCount,
}: BenchmarkTabProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [threadCount, setThreadCount] = useState(() =>
    Math.min(4, typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4)
  );
  const [targetAddress, setTargetAddress] = useState(
    '18VmXvkF4cgLi35RtMiHHDpvMjUCyVpQ9x'
  );
  const [keysPerSec, setKeysPerSec] = useState(0);
  const [peakSpeed, setPeakSpeed] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [benchmarkMode, setBenchmarkMode] = useState<'free' | '10s' | '30s'>('free');
  const [remainingSprintTime, setRemainingSprintTime] = useState<number | null>(null);

  const [lastSample, setLastSample] = useState<KeySample>({
    hex: '4f3c7e9b2a1d8f5c6e0a3b2d1c9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e',
    wif: 'KytR6w8h5XG2... (Electrum WIF Format)',
    address: '18VmXvkF4cgLi35RtMiHHDpvMjUCyVpQ9x',
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [hitFound, setHitFound] = useState<KeySample | null>(null);

  const workersRef = useRef<Worker[]>([]);
  const batchCountsRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const speedIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sprintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Copy helper
  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Stop benchmark
  const stopBenchmark = useCallback(() => {
    setIsRunning(false);
    workersRef.current.forEach((w) => {
      try {
        w.postMessage({ type: 'STOP' });
        w.terminate();
      } catch {}
    });
    workersRef.current = [];

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (speedIntervalRef.current) clearInterval(speedIntervalRef.current);
    if (sprintTimeoutRef.current) clearTimeout(sprintTimeoutRef.current);
    setRemainingSprintTime(null);
  }, []);

  // Start benchmark
  const startBenchmark = useCallback(
    (durationSec: number = 0) => {
      stopBenchmark();

      setIsRunning(true);
      startTimeRef.current = performance.now();
      batchCountsRef.current = 0;
      setElapsedSeconds(0);

      if (durationSec > 0) {
        setRemainingSprintTime(durationSec);
      } else {
        setRemainingSprintTime(null);
      }

      // Create workers
      const newWorkers: Worker[] = [];
      for (let i = 0; i < threadCount; i++) {
        const worker = new Worker(
          new URL('../lib/benchmark.worker.ts', import.meta.url),
          { type: 'module' }
        );

        worker.onmessage = (e: MessageEvent) => {
          const { type, payload } = e.data;
          if (type === 'PROGRESS') {
            batchCountsRef.current += payload.deltaKeys;
            setTestedKeysCount((prev) => prev + payload.deltaKeys);
            if (payload.sample) {
              setLastSample(payload.sample);
            }
          } else if (type === 'HIT_FOUND') {
            setHitFound(payload);
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          }
        };

        worker.postMessage({
          type: 'START',
          payload: {
            targetAddress,
            batchSize: 50,
            reportIntervalMs: 120,
          },
        });

        newWorkers.push(worker);
      }
      workersRef.current = newWorkers;

      // Elapsed time clock
      timerIntervalRef.current = setInterval(() => {
        const now = performance.now();
        const secs = Math.floor((now - startTimeRef.current) / 1000);
        setElapsedSeconds(secs);

        if (durationSec > 0) {
          const left = Math.max(0, durationSec - secs);
          setRemainingSprintTime(left);
          if (left <= 0) {
            stopBenchmark();
          }
        }
      }, 500);

      // Speedometer update loop (every 500ms)
      let lastTotal = 0;
      let lastCheckTime = performance.now();
      speedIntervalRef.current = setInterval(() => {
        const now = performance.now();
        const deltaSeconds = (now - lastCheckTime) / 1000;
        const currentBatch = batchCountsRef.current;
        const deltaKeys = currentBatch - lastTotal;

        if (deltaSeconds > 0) {
          const currentSpeed = Math.round(deltaKeys / deltaSeconds);
          setKeysPerSec(currentSpeed);
          onSpeedUpdate(currentSpeed);
          setPeakSpeed((prev) => Math.max(prev, currentSpeed));
        }

        lastTotal = currentBatch;
        lastCheckTime = now;
      }, 600);
    },
    [threadCount, targetAddress, stopBenchmark, setTestedKeysCount, onSpeedUpdate]
  );

  useEffect(() => {
    return () => {
      stopBenchmark();
    };
  }, [stopBenchmark]);

  // Simulated Hit (for verifying C++ hit spammer functionality)
  const triggerSimulationHit = () => {
    const fakeHit: KeySample = {
      hex: '18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725',
      wif: 'KxZCJXo4P6W... (WIF Treffer)',
      address: targetAddress,
    };
    setHitFound(fakeHit);
    confetti({ particleCount: 200, spread: 90 });
  };

  // Speedometer Gauge Angle: from -120deg to 120deg (240deg sweep)
  const maxScaleSpeed = Math.max(10000, peakSpeed * 1.2);
  const gaugePercent = Math.min(1, keysPerSec / maxScaleSpeed);
  const gaugeAngle = -120 + gaugePercent * 240;

  // Benchmark Score calculation
  const benchmarkScore = Math.round((keysPerSec || 1200) * 1.45);

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Target Address Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Target className="w-4 h-4" />
            <span>ZIEL-ADRESSE FÜR BRUTE-FORCE</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            1 von 1.1579 × 10⁷⁷
          </span>
        </div>

        <input
          type="text"
          value={targetAddress}
          onChange={(e) => setTargetAddress(e.target.value.trim())}
          placeholder="Bitcoin Legacy 1... Adresse"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-xs sm:text-sm text-amber-200 focus:outline-none focus:border-amber-500 transition-colors"
        />

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          <span className="text-[11px] text-slate-500 mr-1">Vorgaben:</span>
          {PRESET_TARGETS.map((preset) => (
            <button
              key={preset.address}
              onClick={() => setTargetAddress(preset.address)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                targetAddress === preset.address
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Gauge & Speedometer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Speedometer */}
        <div className="md:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-3 left-4 flex items-center gap-2 text-xs text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">ECHTZEIT-DURCHSATZ</span>
          </div>

          {/* Semicircle Gauge Visual */}
          <div className="relative w-56 h-32 mt-4 flex items-end justify-center">
            {/* Background Arc */}
            <svg className="w-56 h-56 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
                strokeDasharray="167 251"
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#speedGrad)"
                strokeWidth="8"
                strokeDasharray={`${gaugePercent * 167} 251`}
                strokeDashoffset="0"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="60%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>

            {/* Needle Pivot & Readout */}
            <div className="absolute bottom-1 flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-mono font-extrabold text-slate-100 tabular-nums">
                {keysPerSec.toLocaleString('de-DE')}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                KEYS / SEKUNDE
              </span>
            </div>
          </div>

          {/* Sub Stats Row */}
          <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-mono">
                Spitzenwert
              </span>
              <span className="text-sm font-mono font-semibold text-slate-300 tabular-nums">
                {peakSpeed.toLocaleString('de-DE')} k/s
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-mono">
                Laufzeit
              </span>
              <span className="text-sm font-mono font-semibold text-slate-300 tabular-nums">
                {elapsedSeconds} s
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-mono">
                Geek Score
              </span>
              <span className="text-sm font-mono font-semibold text-amber-400 tabular-nums">
                {benchmarkScore}
              </span>
            </div>
          </div>
        </div>

        {/* Total Keys Counter & Progress Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>GEPRÜFTE SCHLÜSSEL</span>
            </span>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-100 tabular-nums break-all">
                {testedKeysCount.toLocaleString('de-DE')}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex justify-between">
              <span>Erfolgswahrscheinlichkeit:</span>
              <span className="font-mono text-rose-400">0.00000000%</span>
            </div>
            <div className="flex justify-between">
              <span>Fortschritt 2²⁵⁶:</span>
              <span className="font-mono text-slate-500">
                {testedKeysCount > 0
                  ? `< 10⁻⁷¹ %`
                  : '0%'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Selbst bei 100 Mio. Keys/s bleibt der Fortschrittsbalken im gesamten
              Universum unverändert bei 0%.
            </p>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Threads selector */}
          <div className="flex items-center gap-3">
            <Cpu className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <div className="text-xs font-medium text-slate-300">
                CPU-Threads: <span className="font-mono text-amber-400">{threadCount} Cores</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Web Worker Parallelausführung
              </div>
            </div>
            <div className="flex items-center gap-1 ml-auto sm:ml-2">
              {[1, 2, 4, 8].map((cores) => (
                <button
                  key={cores}
                  disabled={isRunning}
                  onClick={() => setThreadCount(cores)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition-colors ${
                    threadCount === cores
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-50'
                  }`}
                >
                  {cores}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <>
                <button
                  onClick={() => {
                    setBenchmarkMode('free');
                    startBenchmark(0);
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Dauertest Starten</span>
                </button>
                <button
                  onClick={() => {
                    setBenchmarkMode('10s');
                    startBenchmark(10);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-mono font-semibold active:scale-95 transition-all"
                  title="10 Sekunden Sprint-Benchmark"
                >
                  10s Sprint
                </button>
              </>
            ) : (
              <button
                onClick={stopBenchmark}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>
                  Stoppen{' '}
                  {remainingSprintTime !== null && `(${remainingSprintTime}s)`}
                </span>
              </button>
            )}

            <button
              onClick={() => {
                stopBenchmark();
                setTestedKeysCount(0);
                setPeakSpeed(0);
                setKeysPerSec(0);
                setElapsedSeconds(0);
              }}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:text-slate-200 text-slate-400 transition-colors"
              title="Zähler zurücksetzen"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Key Inspector (Matching C++ Output) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
            <Key className="w-4 h-4" />
            <span>LIVE-SCHLÜSSEL-INSPEKTOR (WIE IM C++ SKRIPT)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            secp256k1 + SHA256 + RIPEMD160
          </span>
        </div>

        {/* Private Key Hex */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Private Key (Hex 256-bit):</span>
            <button
              onClick={() => copyToClipboard(lastSample.hex, 'hex')}
              className="flex items-center gap-1 text-[10px] text-amber-400 hover:underline"
            >
              {copiedField === 'hex' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>Kopieren</span>
            </button>
          </div>
          <div className="font-mono text-xs text-slate-300 break-all select-all">
            {lastSample.hex}
          </div>
        </div>

        {/* Electrum WIF */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Electrum WIF Key (Base58 komprimiert):</span>
            <button
              onClick={() => copyToClipboard(lastSample.wif, 'wif')}
              className="flex items-center gap-1 text-[10px] text-amber-400 hover:underline"
            >
              {copiedField === 'wif' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>Kopieren</span>
            </button>
          </div>
          <div className="font-mono text-xs text-amber-300 break-all select-all">
            {lastSample.wif}
          </div>
        </div>

        {/* Derived Bitcoin Address */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Generierte Bitcoin Legacy Adresse (P2PKH):</span>
            <button
              onClick={() => copyToClipboard(lastSample.address, 'addr')}
              className="flex items-center gap-1 text-[10px] text-amber-400 hover:underline"
            >
              {copiedField === 'addr' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>Kopieren</span>
            </button>
          </div>
          <div className="font-mono text-xs text-emerald-400 break-all select-all">
            {lastSample.address}
          </div>
        </div>

        {/* Simulation Button for C++ Hit Spammer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500">
            C++ Hit-Spammer Funktion testen:
          </span>
          <button
            onClick={triggerSimulationHit}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Treffer-Alarm simulieren</span>
          </button>
        </div>
      </div>

      {/* Hit Modal / Banner if found */}
      {hitFound && (
        <div className="bg-rose-950/80 border-2 border-rose-500 rounded-2xl p-5 shadow-2xl animate-pulse">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm mb-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>!!! TREFFER GEFUNDEN (C++ HIT SPAMMER LOGIK) !!!</span>
          </div>
          <p className="text-xs text-rose-200 mb-3">
            Die generierte Adresse stimmt exakt mit der Zieladresse überein!
          </p>
          <div className="bg-black/60 rounded-xl p-3 font-mono text-xs text-slate-200 space-y-1.5">
            <div>
              <span className="text-slate-400">Adresse: </span>
              <span className="text-emerald-400">{hitFound.address}</span>
            </div>
            <div>
              <span className="text-slate-400">Private Key: </span>
              <span className="text-amber-300 break-all">{hitFound.hex}</span>
            </div>
            <div>
              <span className="text-slate-400">Electrum WIF: </span>
              <span className="text-sky-300 break-all">{hitFound.wif}</span>
            </div>
          </div>
          <button
            onClick={() => setHitFound(null)}
            className="mt-3 px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-500 transition-colors"
          >
            Schließen
          </button>
        </div>
      )}
    </div>
  );
}
