/**
 * Antigravity Particles & Cosmic Data Universe
 * Interactive Zero-Gravity Canvas Simulation
 */

(function () {
  const canvas = document.getElementById('antigravity-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 45 : 95;
  const maxDistance = 140;

  const mouse = {
    x: null,
    y: null,
    radius: 170
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Color palette for cosmic data nodes
  const colors = [
    'rgba(0, 242, 254, ',   // Neon Cyan
    'rgba(79, 172, 254, ',  // Electric Blue
    'rgba(157, 78, 221, ',  // Deep Neon Purple
    'rgba(0, 245, 212, ',   // Emerald Mint
    'rgba(247, 37, 133, '   // Rose Pink
  ];

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // initial spread
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.4 + 1.2;
      // Gentle float velocities (weightless)
      this.baseSpeedX = (Math.random() - 0.5) * 0.45;
      this.baseSpeedY = (Math.random() - 0.5) * 0.45;
      this.vx = this.baseSpeedX;
      this.vy = this.baseSpeedY;
      this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
      this.baseAlpha = Math.random() * 0.6 + 0.25;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
      // Oscillate alpha gently (twinkling cosmic node)
      this.pulsePhase += this.pulseSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.pulsePhase) * 0.2;
      if (this.alpha < 0.1) this.alpha = 0.1;

      // Antigravity drift
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges to simulate infinite zero gravity space
      if (this.x < -10) this.x = width + 10;
      else if (this.x > width + 10) this.x = -10;
      if (this.y < -10) this.y = height + 10;
      else if (this.y > height + 10) this.y = -10;

      // Mouse Antigravity Field (repulsion + orbital swirl)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Push away gently (zero-g repulsion)
          this.vx -= Math.cos(angle) * force * 0.6;
          this.vy -= Math.sin(angle) * force * 0.6;
        }
      }

      // Smooth dampening back to weightless drift
      this.vx += (this.baseSpeedX - this.vx) * 0.05;
      this.vy += (this.baseSpeedY - this.vy) * 0.05;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.colorPrefix + this.alpha + ')';
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.colorPrefix + '0.8)';
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  // Populate constellation
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Connect close particles with cosmic data filaments
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const lineAlpha = (1 - dist / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Connect to cursor if near
    if (mouse.x !== null && mouse.y !== null) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius * 0.8) {
          const lineAlpha = (1 - dist / (mouse.radius * 0.8)) * 0.35;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(157, 78, 221, ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update & draw each particle
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
