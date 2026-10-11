import React, { useEffect, useRef, useState } from 'react';

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

interface DustParticle {
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
  colorScheme: 'kohaku' | 'yamabuki' | 'sanke' | 'benigoi';
  scaleColor: string;
  spotColor: string;
  finColor: string;
  tailHistory: Array<{ x: number; y: number }>;
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
    const addRipple = (x: number, y: number, maxRadius = 60, speed = 1.2) => {
      if (ripples.length > 25) ripples.shift();
      ripples.push({
        x,
        y,
        radius: 4,
        maxRadius,
        opacity: 0.55,
        speed,
      });
    };

    // Petals pool
    const petalColors = [
      'rgba(255, 209, 220, 0.75)',
      'rgba(255, 182, 193, 0.7)',
      'rgba(255, 230, 235, 0.8)',
      'rgba(248, 195, 205, 0.65)',
    ];
    const petals: Petal[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 5 + Math.random() * 6,
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.02,
      vx: 0.2 + Math.random() * 0.35,
      vy: 0.15 + Math.random() * 0.25,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      shape: Math.random() > 0.4 ? 'sakura' : 'petal',
      opacity: 0.5 + Math.random() * 0.4,
    }));

    // Golden dust particles (floating sunbeams)
    const dust: DustParticle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.8 + Math.random() * 1.8,
      alpha: 0.2 + Math.random() * 0.5,
      pulseSpeed: 0.015 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));

    // Koi fish creation
    const kois: Koi[] = [
      {
        x: width * 0.25,
        y: height * 0.35,
        length: 68,
        width: 17,
        angle: 0.8,
        targetAngle: 0.8,
        speed: 1.1,
        baseSpeed: 1.1,
        wigglePhase: 0,
        wiggleFreq: 0.08,
        colorScheme: 'kohaku',
        scaleColor: '#FFFDF5',
        spotColor: '#FF5A36',
        finColor: 'rgba(255, 245, 235, 0.55)',
        tailHistory: [],
      },
      {
        x: width * 0.65,
        y: height * 0.6,
        length: 74,
        width: 19,
        angle: 2.2,
        targetAngle: 2.2,
        speed: 0.95,
        baseSpeed: 0.95,
        wigglePhase: 1.5,
        wiggleFreq: 0.07,
        colorScheme: 'yamabuki',
        scaleColor: '#F5B838',
        spotColor: '#E68A00',
        finColor: 'rgba(255, 215, 120, 0.55)',
        tailHistory: [],
      },
      {
        x: width * 0.8,
        y: height * 0.25,
        length: 56,
        width: 14,
        angle: 3.5,
        targetAngle: 3.5,
        speed: 1.3,
        baseSpeed: 1.3,
        wigglePhase: 2.8,
        wiggleFreq: 0.1,
        colorScheme: 'benigoi',
        scaleColor: '#FF4500',
        spotColor: '#E02D00',
        finColor: 'rgba(255, 120, 80, 0.5)',
        tailHistory: [],
      },
      {
        x: width * 0.45,
        y: height * 0.8,
        length: 62,
        width: 15,
        angle: -1.2,
        targetAngle: -1.2,
        speed: 1.0,
        baseSpeed: 1.0,
        wigglePhase: 3.9,
        wiggleFreq: 0.08,
        colorScheme: 'sanke',
        scaleColor: '#FAF8F0',
        spotColor: '#E64A19',
        finColor: 'rgba(255, 250, 240, 0.55)',
        tailHistory: [],
      },
      {
        x: width * 0.15,
        y: height * 0.7,
        length: 78,
        width: 20,
        angle: -0.4,
        targetAngle: -0.4,
        speed: 0.85,
        baseSpeed: 0.85,
        wigglePhase: 5.1,
        wiggleFreq: 0.065,
        colorScheme: 'yamabuki',
        scaleColor: '#F2A900',
        spotColor: '#C97A00',
        finColor: 'rgba(255, 200, 90, 0.6)',
        tailHistory: [],
      },
    ];

    // Pointer ripple interaction
    let lastPointerTime = 0;
    const handlePointerMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastPointerTime > 120) {
        addRipple(e.clientX, e.clientY, 45, 1.1);
        lastPointerTime = now;

        // Koi gentle reaction to cursor
        kois.forEach((koi) => {
          const dx = koi.x - e.clientX;
          const dy = koi.y - e.clientY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 20) {
            // Softly turn away or curve
            const awayAngle = Math.atan2(dy, dx);
            koi.targetAngle = awayAngle + (Math.random() - 0.5) * 0.4;
            koi.speed = koi.baseSpeed * 1.5;
          }
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      addRipple(e.clientX, e.clientY, 90, 1.8);
      kois.forEach((koi) => {
        const dx = koi.x - e.clientX;
        const dy = koi.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 260) {
          const awayAngle = Math.atan2(dy, dx);
          koi.targetAngle = awayAngle;
          koi.speed = koi.baseSpeed * 2.2;
        }
      });
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('click', handleClick);

    // Draw single Koi
    const drawKoi = (koi: Koi, time: number) => {
      const speedMultiplier = settings.koiSpeed || 1.0;
      koi.speed += (koi.baseSpeed * speedMultiplier - koi.speed) * 0.04;
      koi.wigglePhase += koi.wiggleFreq * (koi.speed / koi.baseSpeed);

      // Angle easing
      let angleDiff = koi.targetAngle - koi.angle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      koi.angle += angleDiff * 0.035;

      // Move
      koi.x += Math.cos(koi.angle) * koi.speed;
      koi.y += Math.sin(koi.angle) * koi.speed;

      // Random turn & wander
      if (Math.random() < 0.012) {
        koi.targetAngle += (Math.random() - 0.5) * 1.3;
      }

      // Edge bounce / soft wrapping
      const margin = 100;
      if (koi.x < margin) koi.targetAngle = 0 + (Math.random() - 0.5) * 0.5;
      else if (koi.x > width - margin) koi.targetAngle = Math.PI + (Math.random() - 0.5) * 0.5;
      if (koi.y < margin) koi.targetAngle = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
      else if (koi.y > height - margin) koi.targetAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5;

      // Occasional small ripple behind fish
      if (Math.random() < 0.015) {
        addRipple(koi.x - Math.cos(koi.angle) * 30, koi.y - Math.sin(koi.angle) * 30, 25, 0.7);
      }

      // Tail spine physics (4 joints)
      const numJoints = 5;
      const jointDist = koi.length / numJoints;
      const wiggleAmp = Math.sin(koi.wigglePhase) * 0.28;

      ctx.save();
      ctx.translate(koi.x, koi.y);
      ctx.rotate(koi.angle);

      // 1. Soft underwater drop-shadow for 3D pond depth
      ctx.save();
      ctx.translate(8, 14);
      ctx.filter = 'blur(10px)';
      ctx.beginPath();
      ctx.ellipse(0, 0, koi.length * 0.45, koi.width * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(4, 15, 14, 0.4)';
      ctx.fill();
      ctx.restore();

      // 2. Pectoral Fins (side fins fluttering)
      const finFlutter = Math.sin(koi.wigglePhase * 1.2) * 0.15;
      ctx.save();
      ctx.fillStyle = koi.finColor;

      // Left fin
      ctx.beginPath();
      ctx.ellipse(koi.length * 0.1, -koi.width * 0.85, koi.width * 0.8, koi.width * 0.35, -0.6 + finFlutter, 0, Math.PI * 2);
      ctx.fill();

      // Right fin
      ctx.beginPath();
      ctx.ellipse(koi.length * 0.1, koi.width * 0.85, koi.width * 0.8, koi.width * 0.35, 0.6 - finFlutter, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Koi Body Contour & Spine
      const bodyGrad = ctx.createLinearGradient(-koi.length * 0.5, 0, koi.length * 0.5, 0);
      bodyGrad.addColorStop(0, '#FFFFFF');
      bodyGrad.addColorStop(0.2, koi.scaleColor);
      bodyGrad.addColorStop(0.7, koi.scaleColor);
      bodyGrad.addColorStop(1, '#FFF5EA');

      ctx.beginPath();
      // Head
      ctx.ellipse(koi.length * 0.32, 0, koi.length * 0.22, koi.width * 0.8, 0, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Mid body & Torso
      ctx.beginPath();
      ctx.ellipse(0, 0, koi.length * 0.4, koi.width, 0, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Distinctive Koi Pattern Spots (Vermilion & Gold patches)
      ctx.save();
      ctx.fillStyle = koi.spotColor;

      // Head / Shoulder patch
      ctx.beginPath();
      ctx.ellipse(koi.length * 0.18, -koi.width * 0.15, koi.length * 0.16, koi.width * 0.6, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Back spot
      ctx.beginPath();
      ctx.ellipse(-koi.length * 0.1, koi.width * 0.2, koi.length * 0.18, koi.width * 0.55, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Sanke black accent spots if applicable
      if (koi.colorScheme === 'sanke') {
        ctx.fillStyle = '#1C1917';
        ctx.beginPath();
        ctx.ellipse(-koi.length * 0.05, -koi.width * 0.4, 4, 3, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(-koi.length * 0.25, 2, 5, 3.5, -0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Spine Dorsal Fin Line (delicate golden shimmer)
      ctx.beginPath();
      ctx.moveTo(-koi.length * 0.25, 0);
      ctx.lineTo(koi.length * 0.15, 0);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.stroke();

      // 4. Multi-joint Flexible Tail & Caudal Fin
      const tailSegments: Array<{ x: number; y: number }> = [];
      let currentX = -koi.length * 0.35;
      let currentY = 0;
      let segAngle = 0;

      for (let i = 0; i < 4; i++) {
        segAngle += Math.sin(koi.wigglePhase - i * 0.7) * 0.22;
        currentX -= Math.cos(segAngle) * (jointDist * 0.7);
        currentY += Math.sin(segAngle) * (jointDist * 0.7);
        tailSegments.push({ x: currentX, y: currentY });

        // Tail taper
        const segWidth = koi.width * (0.7 - i * 0.14);
        ctx.beginPath();
        ctx.ellipse(currentX, currentY, segWidth * 1.1, segWidth, segAngle, 0, Math.PI * 2);
        ctx.fillStyle = bodyGrad;
        ctx.fill();
      }

      // Fan-shaped Translucent Caudal Fin (Tail)
      const lastSeg = tailSegments[tailSegments.length - 1];
      ctx.save();
      ctx.translate(lastSeg.x, lastSeg.y);
      ctx.rotate(segAngle);

      const finSpread = Math.sin(koi.wigglePhase - 2.8) * 0.1;
      ctx.fillStyle = koi.finColor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-koi.length * 0.3, -koi.width * 1.1, -koi.length * 0.55, -koi.width * 0.7 + finSpread * 10);
      ctx.quadraticCurveTo(-koi.length * 0.42, 0, -koi.length * 0.55, koi.width * 0.7 - finSpread * 10);
      ctx.quadraticCurveTo(-koi.length * 0.3, koi.width * 1.1, 0, 0);
      ctx.fill();

      // Fin rays delicate texture
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-koi.length * 0.5, -koi.width * 0.35);
      ctx.moveTo(0, 0);
      ctx.lineTo(-koi.length * 0.52, 0);
      ctx.moveTo(0, 0);
      ctx.lineTo(-koi.length * 0.5, koi.width * 0.35);
      ctx.stroke();

      ctx.restore(); // restore tail
      ctx.restore(); // restore koi transform
    };

    // Draw single Sakura Petal
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      if (p.shape === 'sakura') {
        // Heart-notched sakura petal
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size * 0.9, p.size * 0.4, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.4, -p.size * 0.8, -p.size * 0.8, 0, -p.size);
      } else {
        // Oval petal
        ctx.ellipse(0, 0, p.size * 1.2, p.size * 0.6, 0, 0, Math.PI * 2);
      }
      ctx.fill();

      // Soft white sheen on petal edge
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      ctx.restore();
    };

    // Animation Loop
    let lastTime = performance.now();
    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // 1. Clear & Background Gradient (Deep Pond Jade to Crystal Teal)
      const pondGradient = ctx.createRadialGradient(
        width * 0.45,
        height * 0.35,
        width * 0.05,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      // Matching the uploaded image: deep emerald celadon, sunlit jade, and tranquil shadows
      pondGradient.addColorStop(0, '#194944'); // Sunlit pool core
      pondGradient.addColorStop(0.35, '#123A36'); // Luminous jade water
      pondGradient.addColorStop(0.7, '#0C2623'); // Deep calm teal
      pondGradient.addColorStop(1, '#071A18'); // Abyssal edge

      ctx.fillStyle = pondGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Caustics & Sunbeam shimmer (soft golden caustics)
      if (settings.showCaustics) {
        ctx.save();
        // Golden caustic light patterns
        const causticTime = time * 0.0006;
        for (let i = 0; i < 4; i++) {
          const cx = width * (0.2 + i * 0.22) + Math.sin(causticTime + i) * 60;
          const cy = height * (0.25 + (i % 2) * 0.35) + Math.cos(causticTime * 0.8 + i) * 45;
          const cGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 220);
          cGrad.addColorStop(0, 'rgba(245, 210, 130, 0.09)');
          cGrad.addColorStop(0.5, 'rgba(120, 205, 185, 0.05)');
          cGrad.addColorStop(1, 'rgba(10, 35, 30, 0)');

          ctx.fillStyle = cGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, 220, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 3. Water Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.opacity *= 0.982;

        if (r.radius > r.maxRadius || r.opacity < 0.02) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = `rgba(215, 245, 240, ${r.opacity * 0.6})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Faint outer reflection ring
        if (r.radius > 15) {
          ctx.strokeStyle = `rgba(245, 220, 160, ${r.opacity * 0.25})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.75, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 4. Golden Dust / Water Caustic Sparkles
      ctx.save();
      dust.forEach((d) => {
        d.phase += d.pulseSpeed;
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = width;
        if (d.x > width) d.x = 0;
        if (d.y < 0) d.y = height;
        if (d.y > height) d.y = 0;

        const currentAlpha = d.alpha * (0.6 + 0.4 * Math.sin(d.phase));
        ctx.fillStyle = `rgba(247, 215, 138, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 5. Koi Fish Swimming
      if (settings.showKoi) {
        kois.forEach((koi) => drawKoi(koi, time));
      }

      // 6. Floating Sakura Petals
      if (settings.showPetals) {
        petals.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.angle += p.spinSpeed;

          // Soft drift across current
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
      {/* Delicate vignette to frame the pond gracefully */}
      <div className="absolute inset-0 bg-radial-[at_center] from-transparent via-teal-950/20 to-teal-950/65 pointer-events-none" />
    </div>
  );
};
