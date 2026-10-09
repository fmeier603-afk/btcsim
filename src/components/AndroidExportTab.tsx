import { useState } from 'react';
import {
  Download,
  Smartphone,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Package,
  Sparkles,
  Share2,
  GitBranch,
  PlayCircle,
  FileCode,
} from 'lucide-react';
import { usePWAInstall } from '../lib/usePWAInstall';

const WORKFLOW_YML = `name: Build Android APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch: # Ermöglicht manuellen Start per Klick

jobs:
  build-apk:
    name: Build & Package Android APK
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout Repository
        uses: actions/checkout@v4

      - name: ☕ Setup Java JDK (Temurin 17)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: 🟢 Setup Node.js (v22)
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: 📦 NPM Dependencies installieren
        run: |
          npm install --legacy-peer-deps

      - name: ⚡ Vite Web App bauen (dist/)
        run: |
          npm run build

      - name: 🤖 Capacitor Android initialisieren & synchronisieren
        run: |
          if [ ! -d "android" ]; then
            echo "Erstelle Android Plattform Verzeichnis..."
            npx cap add android
          fi
          npx cap sync android

      - name: 🔑 Ausführungsrechte für gradlew setzen
        run: |
          chmod +x android/gradlew

      - name: 🔨 Android APK kompilieren (assembleDebug)
        run: |
          cd android
          ./gradlew assembleDebug --stacktrace

      - name: 📤 APK als GitHub Artifact hochladen (Download)
        uses: actions/upload-artifact@v4
        with:
          name: CosmicHash-Android-Debug-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk
          if-no-files-found: error
          retention-days: 30`;

const CAPACITOR_CONFIG = `import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cosmichash.benchmark',
  appName: 'Cosmic Hash',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;`;

export function AndroidExportTab() {
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cosmic Hash - Bitcoin Key Benchmark',
          text: 'Teste die Rechenleistung deines Android-Smartphones beim Bitcoin Brute-Force.',
          url: currentUrl,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(currentUrl);
      alert('Link in Zwischenablage kopiert!');
    }
  };

  const CAPACITOR_COMMANDS = `# 1. Capacitor dependencies installieren
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Capacitor Projekt initialisieren
npx cap init "Cosmic Hash" com.cosmichash.benchmark --web-dir dist

# 3. Web-Projekt kompilieren
npm run build

# 4. Android Plattform hinzufügen & in Android Studio öffnen
npx cap add android
npx cap open android`;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <Download className="w-4 h-4" />
          <span>ANDROID EXPORT & GITHUB ACTIONS CI/CD</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-100">
          Wie baue und exportiere ich die Android APK?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          Alle erforderlichen Dateien – einschließlich der{' '}
          <strong className="text-slate-200">.github/workflows/build-apk.yml</strong>{' '}
          und der <strong className="text-slate-200">capacitor.config.ts</strong>{' '}
          – sind bereits in diesem Projekt hinterlegt. GitHub Actions kann die
          APK vollautomatisch auf Knopfdruck kompilieren!
        </p>
      </div>

      {/* Primary Highlight: GitHub Actions Workflow */}
      <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-xl shadow-amber-500/5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-slate-100">
                  GitHub Actions: Automatische APK-Erstellung (Cloud Build)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  BEREITS IM REPO AKTIV
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Baut die APK auf GitHub-Servern ohne Android Studio oder Java auf deinem PC.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Steps to APK on GitHub */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
            <span className="font-mono text-amber-400 font-bold block mb-1">
              1. Code auf GitHub
            </span>
            Pushe dieses Repository auf dein GitHub-Konto.
          </div>
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
            <span className="font-mono text-amber-400 font-bold block mb-1">
              2. Reiter "Actions"
            </span>
            Klicke in deinem GitHub-Repo oben auf <strong>Actions</strong>.
          </div>
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
            <span className="font-mono text-amber-400 font-bold block mb-1">
              3. Run Workflow
            </span>
            Wähle <strong>Build Android APK</strong> und klicke auf <strong>Run workflow</strong>.
          </div>
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
            <span className="font-mono text-emerald-400 font-bold block mb-1">
              4. APK herunterladen
            </span>
            Unter <strong>Artifacts</strong> die fertige APK-Zip herunterladen und aufs Handy laden!
          </div>
        </div>

        {/* Workflow YML Code Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden mt-3">
          <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>.github/workflows/build-apk.yml (Fertig angelegt)</span>
            </span>
            <button
              onClick={() => copyText(WORKFLOW_YML, 99)}
              className="flex items-center gap-1 text-xs text-amber-400 hover:underline"
            >
              {copiedIndex === 99 ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Workflow kopieren</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-72">
            <pre>{WORKFLOW_YML}</pre>
          </div>
        </div>
      </div>

      {/* Capacitor Config Code Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-bold text-slate-200">
              capacitor.config.ts (Capacitor-Konfiguration)
            </span>
          </div>
          <button
            onClick={() => copyText(CAPACITOR_CONFIG, 98)}
            className="flex items-center gap-1 text-xs text-amber-400 hover:underline"
          >
            {copiedIndex === 98 ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Kopiert!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Kopieren</span>
              </>
            )}
          </button>
        </div>
        <div className="p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto bg-slate-950 border border-slate-800 rounded-xl">
          <pre>{CAPACITOR_CONFIG}</pre>
        </div>
      </div>

      {/* Alternative 1: Direct PWA Install on Android */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-slate-100">
                Alternative: Sofortige PWA-Installation auf Android
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                OHNE GITHUB · 0 MINUTEN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Installiert die App direkt aus dem mobilen Chrome auf dem Homescreen.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-200">
              {isInstalled
                ? 'App ist bereits auf diesem Gerät installiert!'
                : isInstallable
                ? 'Installation für dieses Gerät bereit!'
                : 'Im mobilen Browser aufrufen:'}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Öffne die Web-URL in Chrome auf Android &gt; Drei Punkte (⋮) &gt; App installieren.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isInstallable && (
              <button
                onClick={install}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Jetzt auf Android installieren</span>
              </button>
            )}

            <button
              onClick={shareApp}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Link teilen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alternative 2: Local Android Studio Build */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-bold text-slate-200">
            Lokaler Android Studio Build (Falls gewünscht)
          </span>
        </div>
        <div className="p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto bg-slate-950 border border-slate-800 rounded-xl">
          <pre>{CAPACITOR_COMMANDS}</pre>
        </div>
      </div>
    </div>
  );
}
