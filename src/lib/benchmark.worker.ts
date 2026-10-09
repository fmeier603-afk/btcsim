import { fastCheckKey, bytesToHex, privateKeyToWifCompressed } from './crypto';

interface WorkerStartConfig {
  targetAddress: string;
  batchSize?: number;
  reportIntervalMs?: number;
}

let isRunning = false;
let targetAddress = '18VmXvkF4cgLi35RtMiHHDpvMjUCyVpQ9x';
let batchSize = 100;
let reportIntervalMs = 120;

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'START') {
    const config: WorkerStartConfig = payload || {};
    targetAddress = config.targetAddress || targetAddress;
    batchSize = config.batchSize || 100;
    reportIntervalMs = config.reportIntervalMs || 120;
    isRunning = true;
    runLoop();
  } else if (type === 'STOP') {
    isRunning = false;
  } else if (type === 'UPDATE_TARGET') {
    targetAddress = payload.targetAddress;
  }
};

function runLoop() {
  if (!isRunning) return;

  const keyBuffer = new Uint8Array(32);
  let batchCount = 0;
  let lastReportTime = performance.now();
  let latestSample: {
    hex: string;
    wif: string;
    address: string;
  } | null = null;

  function step() {
    if (!isRunning) return;

    // Process a batch of keys
    for (let i = 0; i < batchSize; i++) {
      crypto.getRandomValues(keyBuffer);

      // secp256k1 valid range check: must be > 0 and < order N
      // (a random 32-byte number is overwhelmingly valid)
      try {
        const res = fastCheckKey(keyBuffer, targetAddress);
        batchCount++;

        // Keep last key as live sample
        if (i === batchSize - 1) {
          latestSample = {
            hex: bytesToHex(keyBuffer),
            wif: privateKeyToWifCompressed(keyBuffer),
            address: res.address,
          };
        }

        // If target matched (the cosmic miracle)
        if (res.matched) {
          self.postMessage({
            type: 'HIT_FOUND',
            payload: {
              hex: bytesToHex(keyBuffer),
              wif: privateKeyToWifCompressed(keyBuffer),
              address: res.address,
            },
          });
        }
      } catch {
        // In the rare event of out-of-range key, continue
      }
    }

    const now = performance.now();
    if (now - lastReportTime >= reportIntervalMs) {
      self.postMessage({
        type: 'PROGRESS',
        payload: {
          deltaKeys: batchCount,
          sample: latestSample,
        },
      });
      batchCount = 0;
      lastReportTime = now;
    }

    // Schedule next batch immediately without blocking worker event loop
    setTimeout(step, 0);
  }

  step();
}
