import { useEffect, useRef } from 'react';

interface CosmicCanvasProps {
  exponent: number; // e.g. 18 to 80
  testedKeysCount: number;
}

export function CosmicCanvas({ exponent, testedKeysCount }: CosmicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = 200);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 360;
      height = canvas.height = 200;
    };
    window.addEventListener('resize', onResize);

    // Particle stars in 3D-projected space
    const particleCount = 120;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * width,
      radius: Math.random() * 1.6 + 0.4,
      hue: Math.random() > 0.8 ? 45 : 210, // amber or cyan
      speed: Math.random() * 0.4 + 0.1,
    }));

    let angle = 0;

    const render = () => {
      ctx.fillStyle = '#030712'; // deep slate void
      ctx.fillRect(0, 0, width, height);

      // Subtle cosmic glow in center
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        width * 0.6
      );
      grad.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
      grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.05)');
      grad.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      angle += 0.003;
      const fov = 200;

      // Draw particle starfield
      for (const p of particles) {
        p.z -= p.speed;
        if (p.z <= 1) p.z = width;

        const scale = fov / (fov + p.z);
        const rx = p.x * Math.cos(angle) - p.y * Math.sin(angle);
        const ry = p.x * Math.sin(angle) + p.y * Math.cos(angle);

        const sx = width / 2 + rx * scale;
        const sy = height / 2 + ry * scale;

        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          const alpha = Math.min(1, Math.max(0.1, 1 - p.z / width));
          ctx.beginPath();
          ctx.arc(sx, sy, p.radius * scale * 1.8, 0, Math.PI * 2);
          ctx.fillStyle =
            p.hue === 45
              ? `rgba(251, 191, 36, ${alpha})`
              : `rgba(147, 197, 253, ${alpha})`;
          ctx.fill();
        }
      }

      // Visual representation of the tested keys vs keyspace
      // If exponent is near 77 (Bitcoin keyspace), show single target needle in the vast cosmos
      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Outer bounding ellipse representing 2^256 boundary
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.42, height * 0.38, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Target point (the single Bitcoin address to find)
      const targetPulse = 1 + 0.3 * Math.sin(Date.now() / 250);
      ctx.beginPath();
      ctx.arc(35, -20, 3 * targetPulse, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444'; // target red
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label for target
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('ZIEL (1 Key)', 44, -17);

      // Current benchmarked search ray
      ctx.beginPath();
      ctx.arc(-40, 15, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#7dd3fc';
      ctx.fillText(
        `DEIN TEST: ${testedKeysCount.toLocaleString()}`,
        -32,
        28
      );

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
    };
  }, [exponent, testedKeysCount]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
      <canvas ref={canvasRef} className="w-full h-[200px] block" />
      <div className="absolute top-2 left-3 flex items-center gap-2 text-[11px] font-mono text-slate-400 pointer-events-none">
        <span className="text-amber-400 font-semibold">2²⁵⁶ ZUSTÄNDE</span>
        <span className="text-slate-600">·</span>
        <span>1.1579 × 10⁷⁷ PUNKTE</span>
      </div>
      <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-500 pointer-events-none">
        Simulation: 1 / 1.1579×10⁷⁷
      </div>
    </div>
  );
}
