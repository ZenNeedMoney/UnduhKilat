import React, { useEffect, useRef } from 'react';
import { Gauge, ArrowDown } from 'lucide-react';
import { formatSpeed } from '../utils/formatters';

interface SpeedGraphWidgetProps {
  speedHistory: number[];
  currentSpeed: number;
}

export const SpeedGraphWidget: React.FC<SpeedGraphWidgetProps> = ({
  speedHistory,
  currentSpeed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    if (speedHistory.length < 2) return;

    const maxSpeed = Math.max(...speedHistory, 1024 * 1024); // at least 1 MB/s max

    // Grid lines
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw area gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

    ctx.beginPath();
    const step = width / (speedHistory.length - 1);

    speedHistory.forEach((speed, i) => {
      const x = i * step;
      const normalized = Math.min(1, speed / maxSpeed);
      const y = height - normalized * (height - 6) - 3;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    speedHistory.forEach((speed, i) => {
      const x = i * step;
      const normalized = Math.min(1, speed / maxSpeed);
      const y = height - normalized * (height - 6) - 3;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [speedHistory]);

  return (
    <div className="px-4 lg:px-6 py-2.5 bg-neutral-100/70 dark:bg-neutral-900/40 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <ArrowDown className="w-4 h-4 text-blue-500 animate-bounce" />
        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          Throughput Kecepatan Real-time:
        </span>
        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums">
          {formatSpeed(currentSpeed)}
        </span>
      </div>

      <div className="w-48 sm:w-64 h-8">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};
