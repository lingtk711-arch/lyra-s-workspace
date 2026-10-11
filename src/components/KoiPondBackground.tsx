import React, { useEffect, useRef } from 'react';

export interface AmbientSettings {
  showKoi: boolean;
  showPetals: boolean;
  showCaustics: boolean;
  koiSpeed: number; // 0.5 to 2.0
}

interface KoiPondBackgroundProps {
  settings?: AmbientSettings;
  className?: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  angle: number;
  spinSpeed: number;
  vx: number;
  vy: number;
  color: string;
  shape: 'sakura' | 'petal';
  opacity: number;
}

interface LilyPad {
  x: number;
  y: number;
  radius: number;
  angle: number;
  driftSpeed: number;
  color: string;
  leafAngle: number;
}

interface SunGleam {
  x: number;
  y: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  phase: number;
  vx: number;
  vy: number;
}

interface Koi {
  x: number;
  y: number;
  length: number;
  width: number;
  angle: number;
  targetAngle: number;
  speed: number;
  baseSpeed: number;
  wigglePhase: number;
  wiggleFreq: number;
  colorScheme: 'kohaku' | 'sakura' | 'yamabuki' | 'asagi';
  scaleColor: string;
  spotColor: string;
  finColor: string;
}

export const KoiPondBackground: React.FC<KoiPondBackgroundProps> = ({
  settings = {
    showKoi: true,
    showPetals: true,
    showCaustics: true,
    koiSpeed: 1.0,
  },
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Ripples pool
    const ripples: Ripple[] = [];
    const addRipple = (x: number, y: number, maxRadius = 65, speed = 1.3) => {
      if (ripples.length > 25) ripples.shift();
      ripples.push({
        x,
        y,
        radius: 4,
        maxRadius,
        opacity: 0.9,
        speed,
      });
    };

    // Falling petals in pastel blush & peach
    const petalColors = [
      'rgba(251, 207, 232, 0.85)', // rose-200
      'rgba(253, 232, 238, 0.9)',  // soft blush
      'rgba(254, 205, 211, 0.85)', // rose-100
      'rgba(244, 167, 185, 0.8)',  // sakura pink
      'rgba(254, 240, 245, 0.92)', // pearl pink
    ];

    const petals: Petal[] = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 5 + Math.random() * 5.5,
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.02,
      vx: 0.25 + Math.random() * 0.35,
      vy: 0.18 + Math.random() * 0.25,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      shape: Math.random() > 0.4 ? 'sakura' : 'petal',
      opacity: 0.6 + Math.random() * 0.35,
    }));

    // Floating water lilies in pale green & mint
    const lilyPads: LilyPad[] = [
      { x: width * 0.12, y: height * 0.22, radius: 24, angle: 0.4, driftSpeed: 0.003, color: '#A7D9C4', leafAngle: 0.8 },
      { x: width * 0.16, y: height * 0.26, radius: 16, angle: 1.2, driftSpeed: 0.004, color: '#BFE7D7', leafAngle: 2.1 },
      { x: width * 0.88, y: height * 0.38, radius: 28, angle: -0.8, driftSpeed: 0.003, color: '#A3D6C1', leafAngle: 1.5 },
      { x: width * 0.84, y: height * 0.44, radius: 18, angle: 0.9, driftSpeed: 0.0035, color: '#C8EDE0', leafAngle: 0.2 },
      { x: width * 0.32, y: height * 0.85, radius: 22, angle: 2.1, driftSpeed: 0.0025, color: '#B2E2D0', leafAngle: 2.9 },
      { x: width * 0.72, y: height * 0.88, radius: 26, angle: -1.4, driftSpeed: 0.003, color: '#A7D9C4', leafAngle: 0.5 },
    ];

    // Sunlight gleams / golden water sparkles
    const gleams: SunGleam[] = Array.from({ length: 38 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.0 + Math.random() * 2.2,
      alpha: 0.25 + Math.random() * 0.5,
      pulseSpeed: 0.015 + Math.random() * 0.025,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));

    // Gentle Watercolor Koi Fish (Soft Pink, White, Gold, Pale Mint)
    const kois: Koi[] = [
      {
        x: width * 0.26,
        y: height * 0.38,
        length: 70,
        width: 17,
        angle: 0.85,
        targetAngle: 0.85,
        speed: 1.05,
        baseSpeed: 1.05,
        wigglePhase: 0,
        wiggleFreq: 0.08,
        colorScheme: 'kohaku',
        scaleColor: '#FFFDFE', // Pearlescent White
        spotColor: '#F4727D',  // Soft Coral Sakura Pink
        finColor: 'rgba(255, 240, 245, 0.75)',
      },
      {
        x: width * 0.68,
        y: height * 0.58,
        length: 76,
        width: 19,
        angle: 2.3,
        targetAngle: 2.3,
        speed: 0.95,
        baseSpeed: 0.95,
        wigglePhase: 1.6,
        wiggleFreq: 0.07,
        colorScheme: 'sakura',
        scaleColor: '#FDF2F4', // Rose Blush Pearl
        spotColor: '#E15272',  // Camellia Rose Pink
        finColor: 'rgba(253, 226, 235, 0.75)',
      },
      {
        x: width * 0.48,
        y: height * 0.78,
        length: 64,
        width: 16,
        angle: -1.1,
        targetAngle: -1.1,
        speed: 1.1,
        baseSpeed: 1.1,
        wigglePhase: 3.2,
        wiggleFreq: 0.09,
        colorScheme: 'yamabuki',
        scaleColor: '#FFFBF0', // Warm Cream
        spotColor: '#FBBF24',  // Morning Sun Warm Gold
        finColor: 'rgba(254, 243, 199, 0.75)',
      },
      {
        x: width * 0.82,
        y: height * 0.26,
        length: 60,
        width: 15,
        angle: 3.4,
        targetAngle: 3.4,
        speed: 1.15,
        baseSpeed: 1.15,
        wigglePhase: 2.4,
        wiggleFreq: 0.095,
        colorScheme: 'asagi',
        scaleColor: '#F6FCF9', // Pale Celadon White
        spotColor: '#6EE7B7',  // Soft Mint Jade
        finColor: 'rgba(209, 250, 229, 0.75)',
      },
    ];

    // Pointer ripple interaction
    let lastPointerTime = 0;
    const handlePointerMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastPointerTime > 110) {
        addRipple(e.clientX, e.clientY, 50, 1.2);
        lastPointerTime = now;

        // Koi gentle reaction
        kois.forEach((koi) => {
          const dx = koi.x - e.clientX;
          const dy = koi.y - e.clientY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 190 && dist > 20) {
            const awayAngle = Math.atan2(dy, dx);
            koi.targetAngle = awayAngle + (Math.random() - 0.5) * 0.4;
            koi.speed = koi.baseSpeed * 1.4;
          }
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      addRipple(e.clientX, e.clientY, 85, 1.8);
      kois.forEach((koi) => {
        const dx = koi.x - e.clientX;
        const dy = koi.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 260) {
          const awayAngle = Math.atan2(dy, dx);
          koi.targetAngle = awayAngle;
          koi.speed = koi.baseSpeed * 2.0;
        }
      });
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('click', handleClick);

    // Draw single Lily Pad
    const drawLilyPad = (pad: LilyPad, time: number) => {
      pad.angle += pad.driftSpeed;
      const swayX = Math.sin(time * 0.001 + pad.x) * 4;
      const swayY = Math.cos(time * 0.0012 + pad.y) * 4;

      ctx.save();
      ctx.translate(pad.x + swayX, pad.y + swayY);
      ctx.rotate(pad.angle);

      // Translucent shadow under leaf
      ctx.save();
      ctx.translate(3, 4);
      ctx.beginPath();
      ctx.arc(0, 0, pad.radius, 0.25, Math.PI * 2 - 0.25);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(195, 175, 180, 0.15)';
      ctx.fill();
      ctx.restore();

      // Leaf body (Pac-man cut-out for authentic water lily)
      ctx.beginPath();
      ctx.arc(0, 0, pad.radius, 0.22, Math.PI * 2 - 0.22);
      ctx.lineTo(0, 0);
      ctx.closePath();

      const leafGrad = ctx.createRadialGradient(-pad.radius * 0.2, -pad.radius * 0.2, 2, 0, 0, pad.radius);
      leafGrad.addColorStop(0, '#D4F3E6');
      leafGrad.addColorStop(0.6, pad.color);
      leafGrad.addColorStop(1, '#8ACBB2');

      ctx.fillStyle = leafGrad;
      ctx.fill();

      // Delicate veins
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 0.75;
      for (let i = 0; i < 5; i++) {
        const a = 0.5 + (i * (Math.PI * 1.6)) / 5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * (pad.radius * 0.85), Math.sin(a) * (pad.radius * 0.85));
        ctx.stroke();
      }

      // Rim glow
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    };

    // Draw single Koi
    const drawKoi = (koi: Koi) => {
      const speedMultiplier = settings.koiSpeed || 1.0;
      koi.speed += (koi.baseSpeed * speedMultiplier - koi.speed) * 0.04;
      koi.wigglePhase += koi.wiggleFreq * (koi.speed / koi.baseSpeed);

      let angleDiff = koi.targetAngle - koi.angle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      koi.angle += angleDiff * 0.035;

      koi.x += Math.cos(koi.angle) * koi.speed;
      koi.y += Math.sin(koi.angle) * koi.speed;

      if (Math.random() < 0.012) {
        koi.targetAngle += (Math.random() - 0.5) * 1.3;
      }

      const margin = 80;
      if (koi.x < margin) koi.targetAngle = 0 + (Math.random() - 0.5) * 0.5;
      else if (koi.x > width - margin) koi.targetAngle = Math.PI + (Math.random() - 0.5) * 0.5;
      if (koi.y < margin) koi.targetAngle = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
      else if (koi.y > height - margin) koi.targetAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5;

      if (Math.random() < 0.015) {
        addRipple(koi.x - Math.cos(koi.angle) * 28, koi.y - Math.sin(koi.angle) * 28, 22, 0.6);
      }

      ctx.save();
      ctx.translate(koi.x, koi.y);
      ctx.rotate(koi.angle);

      // 1. Soft Warm Diffused Underwater Shadow
      ctx.save();
      ctx.translate(6, 9);
      ctx.filter = 'blur(8px)';
      ctx.beginPath();
      ctx.ellipse(0, 0, koi.length * 0.44, koi.width * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(190, 160, 170, 0.18)';
      ctx.fill();
      ctx.restore();

      // 2. Silky Pectoral Side Fins
      const finFlutter = Math.sin(koi.wigglePhase * 1.2) * 0.14;
      ctx.save();
      ctx.fillStyle = koi.finColor;

      // Left fin
      ctx.beginPath();
      ctx.ellipse(koi.length * 0.1, -koi.width * 0.85, koi.width * 0.82, koi.width * 0.36, -0.6 + finFlutter, 0, Math.PI * 2);
      ctx.fill();

      // Right fin
      ctx.beginPath();
      ctx.ellipse(koi.length * 0.1, koi.width * 0.85, koi.width * 0.82, koi.width * 0.36, 0.6 - finFlutter, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Body Torso
      const bodyGrad = ctx.createLinearGradient(-koi.length * 0.5, 0, koi.length * 0.5, 0);
      bodyGrad.addColorStop(0, '#FFFFFF');
      bodyGrad.addColorStop(0.2, koi.scaleColor);
      bodyGrad.addColorStop(0.8, koi.scaleColor);
      bodyGrad.addColorStop(1, '#FFF5F7');

      // Head
      ctx.beginPath();
      ctx.ellipse(koi.length * 0.32, 0, koi.length * 0.22, koi.width * 0.78, 0, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Mid body
      ctx.beginPath();
      ctx.moveTo(koi.length * 0.32, -koi.width * 0.78);
      ctx.quadraticCurveTo(koi.length * 0.05, -koi.width * 0.9, -koi.length * 0.15, -koi.width * 0.5);
      ctx.lineTo(-koi.length * 0.15, koi.width * 0.5);
      ctx.quadraticCurveTo(koi.length * 0.05, koi.width * 0.9, koi.length * 0.32, koi.width * 0.78);
      ctx.closePath();
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Soft Spot Markings (Watercolor splotches)
      ctx.save();
      ctx.fillStyle = koi.spotColor;

      // Forehead spot
      ctx.beginPath();
      ctx.ellipse(koi.length * 0.3, -koi.width * 0.1, koi.length * 0.12, koi.width * 0.36, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Back spot
      ctx.beginPath();
      ctx.ellipse(koi.length * 0.02, koi.width * 0.05, koi.length * 0.18, koi.width * 0.52, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Flank spot
      ctx.beginPath();
      ctx.ellipse(-koi.length * 0.16, -koi.width * 0.12, koi.length * 0.1, koi.width * 0.3, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Tail spine joints
      const numJoints = 4;
      const jointDist = (koi.length * 0.4) / numJoints;
      let currX = -koi.length * 0.15;
      let currY = 0;
      let currAngle = 0;

      for (let i = 1; i <= numJoints; i++) {
        const segRatio = i / numJoints;
        const segWidth = koi.width * (0.5 - segRatio * 0.35);
        const jointBend = Math.sin(koi.wigglePhase - i * 0.55) * 0.22;
        currAngle += jointBend;

        const nextX = currX - Math.cos(currAngle) * jointDist;
        const nextY = currY - Math.sin(currAngle) * jointDist;

        ctx.beginPath();
        ctx.moveTo(currX, currY - segWidth);
        ctx.lineTo(nextX, nextY - segWidth * 0.8);
        ctx.lineTo(nextX, nextY + segWidth * 0.8);
        ctx.lineTo(currX, currY + segWidth);
        ctx.closePath();
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        currX = nextX;
        currY = nextY;
      }

      // Flowing Caudal Fin (Tail)
      const tailSwing = Math.sin(koi.wigglePhase - 2.5) * 0.45;
      ctx.save();
      ctx.translate(currX, currY);
      ctx.rotate(currAngle + tailSwing);

      ctx.fillStyle = koi.finColor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-koi.length * 0.22, -koi.width * 0.85, -koi.length * 0.42, -koi.width * 1.1, -koi.length * 0.48, -koi.width * 0.55);
      ctx.bezierCurveTo(-koi.length * 0.35, -koi.width * 0.1, -koi.length * 0.35, koi.width * 0.1, -koi.length * 0.48, koi.width * 0.55);
      ctx.bezierCurveTo(-koi.length * 0.42, koi.width * 1.1, -koi.length * 0.22, koi.width * 0.85, 0, 0);
      ctx.fill();

      // Delicate fin ray lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 0.65;
      for (let r = -2; r <= 2; r++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-koi.length * 0.38, r * (koi.width * 0.25));
        ctx.stroke();
      }
      ctx.restore();

      // Eyes
      ctx.fillStyle = '#4A373E';
      ctx.beginPath();
      ctx.arc(koi.length * 0.38, -koi.width * 0.42, 1.8, 0, Math.PI * 2);
      ctx.arc(koi.length * 0.38, koi.width * 0.42, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // White eye highlights
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(koi.length * 0.39, -koi.width * 0.44, 0.7, 0, Math.PI * 2);
      ctx.arc(koi.length * 0.39, koi.width * 0.4, 0.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Draw single Petal
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;

      ctx.beginPath();
      if (p.shape === 'sakura') {
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size * 0.9, p.size * 0.4, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.4, -p.size * 0.8, -p.size * 0.8, 0, -p.size);
      } else {
        ctx.ellipse(0, 0, p.size * 1.2, p.size * 0.6, 0, 0, Math.PI * 2);
      }
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();
    };

    // Main Canvas Render Loop
    const render = (time: number) => {
      // 1. Serene Watercolor Pond Gradient (Pale Pink & Pale Celadon Green)
      const pondGradient = ctx.createLinearGradient(0, 0, width, height);
      pondGradient.addColorStop(0, '#FCF6F7');   // Gentle morning peach-blush
      pondGradient.addColorStop(0.3, '#F5FAF8'); // Translucent pale mint dew
      pondGradient.addColorStop(0.7, '#EEF7F3'); // Soft celadon spring stream
      pondGradient.addColorStop(1, '#FCF4F6');   // Rosy water edge

      ctx.fillStyle = pondGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Sunlight Caustics & Water Ripple Patterns
      if (settings.showCaustics) {
        ctx.save();
        const causticTime = time * 0.0005;
        for (let i = 0; i < 4; i++) {
          const cx = width * (0.2 + i * 0.22) + Math.sin(causticTime + i) * 60;
          const cy = height * (0.25 + (i % 2) * 0.35) + Math.cos(causticTime * 0.8 + i) * 45;
          const cGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 240);
          cGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
          cGrad.addColorStop(0.4, 'rgba(230, 248, 240, 0.3)');
          cGrad.addColorStop(0.8, 'rgba(253, 235, 240, 0.15)');
          cGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = cGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, 240, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 3. Water Ripples (Physics Expansion)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.opacity *= 0.982;

        if (r.radius > r.maxRadius || r.opacity < 0.02) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        // Delicate soft pink & celadon edge rings
        ctx.strokeStyle = `rgba(244, 166, 185, ${r.opacity * 0.65})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (r.radius > 12) {
          ctx.strokeStyle = `rgba(167, 243, 208, ${r.opacity * 0.45})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.72, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 4. Floating Sun Gleams & Golden Dew
      ctx.save();
      gleams.forEach((d) => {
        d.phase += d.pulseSpeed;
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = width;
        if (d.x > width) d.x = 0;
        if (d.y < 0) d.y = height;
        if (d.y > height) d.y = 0;

        const currentAlpha = d.alpha * (0.6 + 0.4 * Math.sin(d.phase));
        ctx.fillStyle = `rgba(251, 191, 36, ${currentAlpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 5. Water Lily Pads (Floating Green Leaves)
      lilyPads.forEach((pad) => drawLilyPad(pad, time));

      // 6. Koi Fish Swimming Gracefully
      if (settings.showKoi) {
        kois.forEach((koi) => drawKoi(koi));
      }

      // 7. Drifting Sakura Petals
      if (settings.showPetals) {
        petals.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.angle += p.spinSpeed;

          if (p.x > width + 20) p.x = -20;
          if (p.y > height + 20) p.y = -20;

          drawPetal(p);
        });
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('click', handleClick);
    };
  }, [settings]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Light soft pastel vignette */}
      <div className="absolute inset-0 bg-radial-[at_center] from-transparent via-pink-100/10 to-emerald-100/25 pointer-events-none" />
    </div>
  );
};
