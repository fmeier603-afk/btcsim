import { useState, useMemo } from 'react';
import {
  Binary,
  Key,
  Shield,
  Hash,
  Layers,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import {
  hexToBytes,
  bytesToHex,
  privateKeyToWifCompressed,
  privateKeyToLegacyAddress,
} from '../lib/crypto';

export function CryptoLabTab() {
  const [hexInput, setHexInput] = useState(
    'e9873d79c6d87dc0fb6a5778633389f4453213303da61f20bd67fc233aa33262'
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (val: string, keyName: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const generateRandomKey = () => {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    setHexInput(bytesToHex(randomBytes));
  };

  const derivation = useMemo(() => {
    try {
      const clean = hexInput.trim().replace(/^0x/, '');
      if (clean.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(clean)) {
        return { error: 'Der Private Key muss genau 64 Hex-Zeichen (32 Bytes) lang sein.' };
      }
      const privBytes = hexToBytes(clean);
      const wif = privateKeyToWifCompressed(privBytes);
      const legacy = privateKeyToLegacyAddress(privBytes);

      return {
        error: null,
        privHex: clean,
        wif,
        pubKeyHex: legacy.pubKeyHex,
        sha256Hex: legacy.sha256HashHex,
        ripemd160Hex: legacy.ripemd160Hex,
        payloadHex: legacy.payloadHex,
        address: legacy.address,
      };
    } catch (err: any) {
      return { error: err?.message || 'Ungültiger Schlüssel' };
    }
  }, [hexInput]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <Terminal className="w-4 h-4" />
          <span>KRYPTO-LABOR: DER C++ PIPELINE ABLAUF</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-100">
          Wie aus einem 256-Bit Zufall eine Bitcoin-Adresse entsteht
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          Das C++ Skript führt pro Durchlauf sechs kryptographische Operationen
          aus. Hier kannst du jeden einzelnen Schritt visuell und transparent
          nachvollziehen.
        </p>
      </div>

      {/* Input / Generator Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            PRIVATE KEY (256-BIT HEXADENZIMAL):
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setHexInput('0000000000000000000000000000000000000000000000000000000000000001')
              }
              className="text-[11px] font-mono px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
              title="Satoshi Test Key 1"
            >
              Key #1
            </button>
            <button
              onClick={generateRandomKey}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Zufall erzeugen</span>
            </button>
          </div>
        </div>

        <input
          type="text"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value.toLowerCase().trim())}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-xs sm:text-sm text-amber-300 focus:outline-none focus:border-amber-500 transition-colors"
          placeholder="64 Hex-Zeichen..."
        />

        {derivation.error && (
          <div className="text-xs text-rose-400 bg-rose-950/30 border border-rose-900/40 rounded-lg p-2.5">
            {derivation.error}
          </div>
        )}
      </div>

      {/* Step by step pipeline cards */}
      {!derivation.error && (
        <div className="space-y-3">
          {/* Step 1: Raw Entropy */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-sky-400 flex items-center gap-2">
                <Binary className="w-3.5 h-3.5" />
                <span>1. 256-Bit Entropie (Private Key)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                32 Bytes = 256 Bits
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-300 break-all select-all">
                {derivation.privHex}
              </span>
              <button
                onClick={() => copyText(derivation.privHex!, 'step1')}
                className="text-slate-400 hover:text-amber-400 p-1 shrink-0 ml-2"
              >
                {copiedKey === 'step1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Ein geheimer Skalar k auf dem endlichen Körper F_p der elliptischen Kurve.
            </p>
          </div>

          {/* Step 2: Electrum WIF */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-400 flex items-center gap-2">
                <Key className="w-3.5 h-3.5" />
                <span>2. Electrum WIF Key (Wallet Import Format)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Prefix 0x80 + 0x01 Flag + Checksum
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 flex items-center justify-between">
              <span className="font-mono text-xs text-amber-300 break-all select-all">
                {derivation.wif}
              </span>
              <button
                onClick={() => copyText(derivation.wif!, 'step2')}
                className="text-slate-400 hover:text-amber-400 p-1 shrink-0 ml-2"
              >
                {copiedKey === 'step2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Diesen WIF-Schlüssel kann man direkt in Electrum oder Sparrow Wallet importieren.
            </p>
          </div>

          {/* Step 3: ECDSA secp256k1 Public Key */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                <span>3. ECDSA secp256k1 Public Key (P = k · G)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                33 Bytes Komprimiert (0x02/0x03 + X)
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 flex items-center justify-between">
              <span className="font-mono text-xs text-emerald-300 break-all select-all">
                {derivation.pubKeyHex}
              </span>
              <button
                onClick={() => copyText(derivation.pubKeyHex!, 'step3')}
                className="text-slate-400 hover:text-amber-400 p-1 shrink-0 ml-2"
              >
                {copiedKey === 'step3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Punktmultiplikation auf der Kurve $y^2 = x^3 + 7 \pmod p$. Eine
              Einwegfunktion: $P$ aus $k$ ist trivial, aber $k$ aus $P$ ist der
              diskrete Logarithmus (unlösbar).
            </p>
          </div>

          {/* Step 4: SHA-256 + RIPEMD-160 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-purple-400 flex items-center gap-2">
                <Hash className="w-3.5 h-3.5" />
                <span>4. HASH160: RIPEMD-160( SHA-256( PubKey ) )</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                20 Bytes (160 Bits)
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 flex items-center justify-between">
              <span className="font-mono text-xs text-purple-300 break-all select-all">
                {derivation.ripemd160Hex}
              </span>
              <button
                onClick={() => copyText(derivation.ripemd160Hex!, 'step4')}
                className="text-slate-400 hover:text-amber-400 p-1 shrink-0 ml-2"
              >
                {copiedKey === 'step4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Kompression auf 160 Bit Fingerabdruck. Selbst wenn Quantencomputer
              secp256k1 angreifen würden, schützt HASH160 jede unbenutzte Adresse.
            </p>
          </div>

          {/* Step 5: Final Legacy Address */}
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-4 space-y-2 shadow-lg shadow-emerald-500/5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-300 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                <span>5. Finale Bitcoin Legacy Adresse (Base58Check)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Prefix 1...
              </span>
            </div>
            <div className="bg-slate-950 border border-emerald-500/30 rounded-lg p-3 flex items-center justify-between">
              <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400 break-all select-all">
                {derivation.address}
              </span>
              <button
                onClick={() => copyText(derivation.address!, 'step5')}
                className="text-slate-400 hover:text-amber-400 p-1 shrink-0 ml-2"
              >
                {copiedKey === 'step5' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Diese Adresse wird im C++ Skript in jedem Schleifendurchlauf mit der
              Zieladresse <code className="text-amber-300 font-mono">18VmXvkF4cgLi35RtMiHHDpvMjUCyVpQ9x</code> verglichen!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
