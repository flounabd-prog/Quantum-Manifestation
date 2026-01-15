
import React, { useEffect, useRef } from 'react';

interface QuantumFocusVisualizerProps {
  progress: number;
}

export const QuantumFocusVisualizer: React.FC<QuantumFocusVisualizerProps> = ({ progress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: { angle: number; distance: number; speed: number; size: number; phase: number }[] = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 300 + 50,
        speed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2 + 0.5,
        phase: Math.random() * Math.PI * 2
      });
    }

    const draw = (time: number) => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const normalizedProgress = progress / 100;
      const chaos = 1 - normalizedProgress;

      // Draw background glow
      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 2);
      bgGradient.addColorStop(0, `rgba(139, 92, 246, ${0.1 + normalizedProgress * 0.1})`);
      bgGradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Probability Waves
      ctx.lineWidth = 1 + normalizedProgress * 2;
      for (let i = 0; i < 3; i++) {
        const radius = (width * 0.15) + (i * 40 * chaos);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(167, 139, 250, ${0.1 + (i * 0.05) + (chaos * 0.2)})`;
        ctx.setLineDash([20 * chaos + 5, 10 * chaos + 2]);
        ctx.stroke();
      }

      // Quantum Particles
      particles.forEach((p, i) => {
        // Move particles towards center as progress increases
        const targetDist = p.distance * chaos + (20 * normalizedProgress);
        const currentAngle = p.angle + (p.speed * time * 0.05 * (1 + chaos * 2));
        
        // Jitter based on chaos
        const jitterX = (Math.sin(time * 0.01 + p.phase) * 10 * chaos);
        const jitterY = (Math.cos(time * 0.01 + p.phase) * 10 * chaos);

        const x = centerX + Math.cos(currentAngle) * targetDist + jitterX;
        const y = centerY + Math.sin(currentAngle) * targetDist + jitterY;

        ctx.beginPath();
        ctx.arc(x, y, p.size * (1 + chaos), 0, Math.PI * 2);
        
        // Color shifts from scattered blue to focused white/violet
        const r = Math.floor(139 + chaos * 50);
        const g = Math.floor(92 + normalizedProgress * 100);
        const b = 246;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + normalizedProgress * 0.5})`;
        ctx.shadowBlur = 5 * chaos + 2;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
        ctx.fill();

        // Connect nearby particles if progress is low (showing entanglement)
        if (chaos > 0.4) {
          for (let j = i + 1; j < particles.length; j += 20) {
            const p2 = particles[j];
            const x2 = centerX + Math.cos(p2.angle + p2.speed * time * 0.05) * (p2.distance * chaos);
            const y2 = centerY + Math.sin(p2.angle + p2.speed * time * 0.05) * (p2.distance * chaos);
            const d = Math.hypot(x - x2, y - y2);
            if (d < 100 * chaos) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x2, y2);
              ctx.strokeStyle = `rgba(139, 92, 246, ${0.05 * chaos})`;
              ctx.stroke();
            }
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    window.addEventListener('resize', resize);
    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [progress]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};
