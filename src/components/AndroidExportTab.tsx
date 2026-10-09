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
  QrCode,
  Share2,
} from 'lucide-react';
import { usePWAInstall } from '../lib/usePWAInstall';

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
          <span>ANDROID EXPORT & INSTALLATIONS-ANLEITUNG</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-100">
          Wie exportiere ich diese App auf mein Android-Gerät?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          Es gibt drei einfache Wege: von der sofortigen 1-Klick-Installation
          direkt auf dem Smartphone bis zur echten <strong>.apk</strong>-Datei
          mit Android Studio oder PWABuilder.
        </p>
      </div>

      {/* Option 1: Direct PWA Install on Android */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-lg shadow-amber-500/5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-slate-100">
                  Weg 1: Direkt auf Android installieren (Sofort)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  0 MINUTEN · KEIN PC NÖTIG
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Installiert die App als vollwertige Standalone-App mit Icon auf dem Startbildschirm.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Install Button or status */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-200">
              {isInstalled
                ? 'App ist bereits auf diesem Gerät installiert!'
                : isInstallable
                ? 'Installation für dieses Gerät bereit!'
                : 'Im mobilen Browser öffnen:'}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Läuft nativ im Vollbild ohne störende Chrome-Adressleiste.
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
              <span>Link teilen / Handy öffnen</span>
            </button>
          </div>
        </div>

        {/* Steps for Chrome on Android */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-slate-300">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
            <span className="font-mono text-amber-400 font-bold block mb-1">
              Schritt 1
            </span>
            Öffne diese URL im <strong>Google Chrome Browser</strong> auf deinem
            Android-Smartphone.
          </div>
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
            <span className="font-mono text-amber-400 font-bold block mb-1">
              Schritt 2
            </span>
            Tippe oben rechts auf das <strong>Drei-Punkte-Menü (⋮)</strong> in Chrome.
          </div>
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
            <span className="font-mono text-amber-400 font-bold block mb-1">
              Schritt 3
            </span>
            Wähle <strong>„App installieren“</strong> oder „Zum Startbildschirm hinzufügen“.
          </div>
        </div>
      </div>

      {/* Option 2: Capacitor to Native APK */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-slate-100">
                Weg 2: Als echte Android .APK kompilieren (Capacitor)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold">
                NATIVE .APK / .AAB DATEI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Erzeugt ein vollständiges Android Studio Projekt zum Bauen einer installierbaren APK.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>Terminal-Befehle im Projektordner:</span>
            </span>
            <button
              onClick={() => copyText(CAPACITOR_COMMANDS, 1)}
              className="flex items-center gap-1 text-xs text-amber-400 hover:underline"
            >
              {copiedIndex === 1 ? (
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
          <div className="p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
            <pre>{CAPACITOR_COMMANDS}</pre>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-400 space-y-1.5 leading-relaxed">
          <div className="font-semibold text-slate-200">
            APK in Android Studio exportieren:
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-300">
            <li>Sobald Android Studio sich öffnet, lasse das Gradle-Projekt synchronisieren.</li>
            <li>
              Klicke im Menü auf <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>.
            </li>
            <li>
              Nach dem Build klickst du auf <strong>„locate“</strong> und erhältst deine fertige{' '}
              <code className="text-amber-300 font-mono">app-debug.apk</code>, die du direkt per USB oder WhatsApp/Telegram auf jedem Android-Handy installieren kannst!
            </li>
          </ol>
        </div>
      </div>

      {/* Option 3: PWABuilder (Online Tool to APK) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-bold text-slate-100">
              Weg 3: Mit PWABuilder online ohne Android Studio
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Offizielles Microsoft-Tool für Google Play Store APK/AAB Generierung.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-300 space-y-2">
          <p>
            1. Gehe auf{' '}
            <a
              href="https://www.pwabuilder.com"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 underline font-mono"
            >
              pwabuilder.com
            </a>
            .
          </p>
          <p>
            2. Trage die geteilte URL deiner Web-App ein und klicke auf <strong>Start</strong>.
          </p>
          <p>
            3. Klicke auf <strong>„Package for Android“</strong>. PWABuilder generiert
            automatisch eine fertige signierte APK sowie die Dateien für den
            Google Play Store!
          </p>
        </div>
      </div>
    </div>
  );
}
