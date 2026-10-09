import { useState } from 'react';
import { Code2, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

const CPP_CODE = `#include <iostream>
#include <vector>
#include <string>
#include <thread>
#include <atomic>
#include <chrono>
#include <iomanip>
#include <cstring>
#include <sstream>

// OpenSSL Header
#include <openssl/obj_mac.h>
#include <openssl/ec.h>
#include <openssl/sha.h>
#include <openssl/ripemd.h>
#include <openssl/rand.h>

constexpr int BATCH_SIZE = 1000;
constexpr int NUM_THREADS = 4;

// Ziel-Adresse definieren
const std::string TARGET_ADDRESS = "18VmXvkF4cgLi35RtMiHHDpvMjUCyVpQ9x";

// Base58 Alphabet
static const char* BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

std::string base58_encode(const std::vector<uint8_t>& input) {
    size_t zero_bytes = 0;
    while (zero_bytes < input.size() && input[zero_bytes] == 0) {
        zero_bytes++;
    }

    size_t size = (input.size() - zero_bytes) * 138 / 100 + 1;
    std::vector<uint8_t> buf(size, 0);

    for (size_t i = zero_bytes; i < input.size(); i++) {
        int carry = input[i];
        for (int j = static_cast<int>(size) - 1; j >= 0; j--) {
            carry += 256 * buf[j];
            buf[j] = carry % 58;
            carry /= 58;
        }
    }

    size_t i = 0;
    while (i < size && buf[i] == 0) {
        i++;
    }

    std::string output;
    output.reserve(zero_bytes + (size - i));
    for (size_t j = 0; j < zero_bytes; j++) {
        output.push_back('1');
    }
    for (; i < size; i++) {
        output.push_back(BASE58_ALPHABET[buf[i]]);
    }

    return output;
}

// Hilfsfunktion: Bytes in Hex-String konvertieren
std::string bytes_to_hex(const uint8_t* data, size_t len) {
    std::stringstream ss;
    for (size_t i = 0; i < len; ++i) {
        ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(data[i]);
    }
    return ss.str();
}

// NEU: WIF-Konverter für Electrum (Komprimiertes Format)
std::string private_key_to_wif_compressed(const uint8_t* priv_bytes) {
    std::vector<uint8_t> payload;
    payload.reserve(34);
    payload.push_back(0x80); // Mainnet Prefix
    payload.insert(payload.end(), priv_bytes, priv_bytes + 32);
    payload.push_back(0x01); // Compressed Flag

    uint8_t check1[SHA256_DIGEST_LENGTH];
    uint8_t check2[SHA256_DIGEST_LENGTH];
    SHA256(payload.data(), payload.size(), check1);
    SHA256(check1, SHA256_DIGEST_LENGTH, check2);

    std::vector<uint8_t> final_bytes = payload;
    final_bytes.insert(final_bytes.end(), check2, check2 + 4);

    return base58_encode(final_bytes);
}

std::string private_key_to_legacy(const uint8_t* priv_key) {
    EC_KEY* key = EC_KEY_new_by_curve_name(NID_secp256k1);
    BIGNUM* bn = BN_bin2bn(priv_key, 32, nullptr);
    EC_KEY_set_private_key(key, bn);

    const EC_GROUP* group = EC_KEY_get0_group(key);
    EC_POINT* pub_key = EC_POINT_new(group);
    EC_POINT_mul(group, pub_key, bn, nullptr, nullptr, nullptr);
    EC_KEY_set_public_key(key, pub_key);

    EC_KEY_set_conv_form(key, POINT_CONVERSION_COMPRESSED);
    uint8_t pub_bytes[33];
    uint8_t* p = pub_bytes;
    int pub_len = i2o_ECPublicKey(key, &p);

    uint8_t sha256_res[SHA256_DIGEST_LENGTH];
    SHA256(pub_bytes, pub_len, sha256_res);

    uint8_t ripemd_res[RIPEMD160_DIGEST_LENGTH];
    RIPEMD160(sha256_res, SHA256_DIGEST_LENGTH, ripemd_res);

    uint8_t payload[21];
    payload[0] = 0x00;
    std::memcpy(payload + 1, ripemd_res, RIPEMD160_DIGEST_LENGTH);

    uint8_t check1[SHA256_DIGEST_LENGTH];
    uint8_t check2[SHA256_DIGEST_LENGTH];
    SHA256(payload, 21, check1);
    SHA256(check1, SHA256_DIGEST_LENGTH, check2);

    std::vector<uint8_t> final_bytes(25);
    std::memcpy(final_bytes.data(), payload, 21);
    std::memcpy(final_bytes.data() + 21, check2, 4);

    EC_POINT_free(pub_key);
    BN_free(bn);
    EC_KEY_free(key);

    return base58_encode(final_bytes);
}

std::atomic<uint64_t> total_attempts{0};

// Eigenständiger Thread, der bei einem Treffer ununterbrochen alle 1s spammt
void start_hit_spammer(std::string hex_key, std::string wif_key, std::string address) {
    std::thread([hex_key, wif_key, address]() {
        while (true) {
            std::cout << "\\n==================================================\\n"
                      << "!!! TREFFER GEFUNDEN !!!\\n"
                      << "Ziel-Adresse:      " << address << "\\n"
                      << "Private Key (Hex): " << hex_key << "\\n"
                      << "Electrum WIF Key:  " << wif_key << "\\n"
                      << "==================================================\\n" << std::endl;
            std::this_thread::sleep_for(std::chrono::seconds(1));
        }
    }).detach();
}

void worker_thread() {
    uint8_t priv_key[32];

    while (true) {
        for (int i = 0; i < BATCH_SIZE; i++) {
            RAND_bytes(priv_key, 32);
            std::string address = private_key_to_legacy(priv_key);

            if (address == TARGET_ADDRESS) {
                std::string hex_key = bytes_to_hex(priv_key, 32);
                std::string wif_key = private_key_to_wif_compressed(priv_key);
                start_hit_spammer(hex_key, wif_key, address);
            }
        }
        total_attempts.fetch_add(BATCH_SIZE, std::memory_order_relaxed);
    }
}`;

export function CppSourceTab() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CPP_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <Terminal className="w-4 h-4" />
          <span>ORIGINAL C++ QUELLCODE</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-100">
          Das zugrundeliegende OpenSSL & C++ Skript
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          Dieses C++ Programm demonstriert die Funktionsweise: Parallele
          Threads generieren Schlüssel, wandeln sie in komprimiertes Electrum
          WIF und Legacy Adressen um und messen die Durchsatzrate (Keys/s).
        </p>
      </div>

      {/* Code Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Code2 className="w-4 h-4 text-sky-400" />
            <span>btc_bruteforce_benchmark.cpp</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-amber-400 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Kopiert!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Code kopieren</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 overflow-x-auto max-h-[500px] bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed">
          <pre>{CPP_CODE}</pre>
        </div>
      </div>

      {/* Comparison with Android App */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-200">
          Architektur-Vergleich: C++ OpenSSL vs. Android Web Worker
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 space-y-1">
            <span className="font-semibold text-sky-400 block font-mono">
              C++ Skript (Native OpenSSL)
            </span>
            <p>
              Nutzung von <code>std::thread</code>, atomaren Zählern und C-Bindings
              zu OpenSSL (<code>EC_KEY</code>, <code>RAND_bytes</code>).
              Kompiliert mit <code>g++ -O3 -lssl -lcrypto</code>.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 space-y-1">
            <span className="font-semibold text-amber-400 block font-mono">
              Android Benchmark App (Web Workers)
            </span>
            <p>
              Echte Multi-Core-Auslastung via Web Worker, <code>crypto.getRandomValues</code>{' '}
              und hochoptimiertem noble-curves secp256k1 mit nativer UI,
              Live-Messung und visueller Kosmos-Simulation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
