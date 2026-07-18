/* ============================================================
   Tensoramax — neural-network.js
   Reusable animated neural-network canvas (hero + footer)
   Layered topology · flowing activations · mouse interaction
   ============================================================ */
(function (global) {
  "use strict";

  const reduced = global.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function debounce(fn, ms) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, arguments), ms);
    };
  }

  class NeuralNetwork {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.opts = Object.assign(
        {
          theme: "light",          // 'light' | 'dark'
          layers: [3, 5, 7, 5, 3],
          interactive: true,
          maxPulses: 70,
          spawnRate: 0.10,
          amp: 7,                  // organic drift amplitude
        },
        opts
      );
      this.theme = this.opts.theme;
      this.dpr = Math.min(global.devicePixelRatio || 1, 2);
      this.reduce = reduced;
      this.nodes = [];
      this.edges = [];
      this.pulses = [];
      this.mouse = { x: -9999, y: -9999, active: false };
      this.t = 0;
      this.running = false;
      this._raf = null;

      this._onResize = debounce(() => this.resize(), 140);
      global.addEventListener("resize", this._onResize);

      if (this.opts.interactive) {
        global.addEventListener("mousemove", (e) => this._move(e), { passive: true });
        global.addEventListener("mouseout", () => (this.mouse.active = false));
        canvas.addEventListener("click", (e) => this._click(e));
      }

      this.resize();
    }

    _themeColors() {
      if (this.theme === "dark") {
        return {
          edge: "rgba(224,122,78,0.10)",
          edgeHi: "rgba(234,139,94,0.55)",
          node: "rgba(224,122,78,0.55)",
          nodeCore: "#F7E2D3",
          pulse: "#EA8B5E",
          glow: "rgba(224,122,78,0.30)",
        };
      }
      return {
        edge: "rgba(28,25,22,0.055)",
        edgeHi: "rgba(194,90,44,0.5)",
        node: "rgba(28,25,22,0.45)",
        nodeCore: "#C25A2C",
        pulse: "#E07A4E",
        glow: "rgba(224,122,78,0.30)",
      };
    }

    _move(e) {
      const r = this.canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      // Only mark active when the cursor is within the canvas bounds
      if (x >= 0 && x <= r.width && y >= 0 && y <= r.height) {
        this.mouse.x = x;
        this.mouse.y = y;
        this.mouse.active = true;
      } else {
        this.mouse.active = false;
      }
    }

    _click(e) {
      const r = this.canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      // Burst pulses from the nearest first-layer node
      let near = null, dmin = Infinity;
      this.nodes.forEach((n) => {
        if (n.layer !== 0) return;
        const d = (n.x - x) ** 2 + (n.y - y) ** 2;
        if (d < dmin) { dmin = d; near = n; }
      });
      if (!near) return;
      this.edges
        .filter((ed) => ed.a === near)
        .slice(0, 4)
        .forEach((ed) => this.pulses.push({ edge: ed, p: 0 }));
      this._cap();
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.w = Math.max(1, rect.width);
      this.h = Math.max(1, rect.height);
      this.canvas.width = Math.round(this.w * this.dpr);
      this.canvas.height = Math.round(this.h * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.layout();
      if (this.reduce || !this.running) this.draw();
    }

    layout() {
      const layers = this.opts.layers;
      const padX = Math.max(36, this.w * 0.07);
      const stepX = layers.length > 1 ? (this.w - padX * 2) / (layers.length - 1) : 0;
      this.nodes = [];
      layers.forEach((count, li) => {
        const x = layers.length > 1 ? padX + stepX * li : this.w / 2;
        const padY = this.h * 0.16;
        const usable = this.h - padY * 2;
        const stepY = count > 1 ? usable / (count - 1) : 0;
        for (let i = 0; i < count; i++) {
          const y = count > 1 ? padY + stepY * i : this.h / 2;
          this.nodes.push({
            ox: x, oy: y, x, y,
            layer: li, idx: i,
            phase: Math.random() * Math.PI * 2,
            r: (2.2 + Math.random() * 1.6) * (this.opts.nodeScale || 1),
            glow: 0,
          });
        }
      });
      this.edges = [];
      for (let li = 0; li < layers.length - 1; li++) {
        const from = this.nodes.filter((n) => n.layer === li);
        const to = this.nodes.filter((n) => n.layer === li + 1);
        from.forEach((a) =>
          to.forEach((b) => this.edges.push({ a, b, w: 0.15 + Math.random() * 0.6 }))
        );
      }
      this.pulses = [];
    }

    _cap() {
      if (this.pulses.length > this.opts.maxPulses)
        this.pulses.splice(0, this.pulses.length - this.opts.maxPulses);
    }

    start() {
      if (this.reduce || this.running) { this.draw(); return; }
      this.running = true;
      this._last = performance.now();
      const loop = (now) => {
        if (!this.running) return;
        const dt = Math.min(40, now - this._last) / 16.6667;
        this._last = now;
        this.step(dt);
        this.draw();
        this._raf = global.requestAnimationFrame(loop);
      };
      this._raf = global.requestAnimationFrame(loop);
    }

    stop() {
      this.running = false;
      if (this._raf) cancelAnimationFrame(this._raf);
    }

    step(dt) {
      this.t += dt * 0.016;
      const amp = this.opts.amp;

      // Organic drift + mouse influence
      this.nodes.forEach((n) => {
        n.x = n.ox + Math.sin(this.t + n.phase) * amp;
        n.y = n.oy + Math.cos(this.t * 0.8 + n.phase * 1.3) * amp;
        if (this.mouse.active) {
          const dx = this.mouse.x - n.x;
          const dy = this.mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 26000) {
            const f = (1 - d2 / 26000) * 10;
            n.x += dx * 0.012 * f;
            n.y += dy * 0.012 * f;
          }
        }
        n.glow *= 0.92;
      });

      // Spawn new activations from the input layer
      if (Math.random() < this.opts.spawnRate * dt) {
        const first = this.edges.filter((e) => e.a.layer === 0);
        if (first.length) {
          this.pulses.push({ edge: first[(Math.random() * first.length) | 0], p: 0 });
          this._cap();
        }
      }

      // Advance pulses
      const next = [];
      this.pulses.forEach((pl) => {
        pl.p += 0.018 * dt * (0.7 + pl.edge.w);
        if (pl.p >= 1) {
          pl.edge.b.glow = 1;
          // Propagate to the next layer
          const outs = this.edges.filter((e) => e.a === pl.edge.b);
          if (outs.length && Math.random() < 0.8) {
            next.push({ edge: outs[(Math.random() * outs.length) | 0], p: 0 });
          }
        } else {
          next.push(pl);
        }
      });
      this.pulses = next;
      this._cap();
    }

    draw() {
      const ctx = this.ctx;
      const c = this._themeColors();
      const s = this.opts.nodeScale || 1;
      ctx.clearRect(0, 0, this.w, this.h);

      // Edges
      ctx.lineWidth = 1;
      this.edges.forEach((ed) => {
        ctx.beginPath();
        ctx.moveTo(ed.a.x, ed.a.y);
        ctx.lineTo(ed.b.x, ed.b.y);
        ctx.strokeStyle = ed.w > 0.5 ? c.edge.replace(/0\.\d+\)/, "0.085)") : c.edge;
        ctx.stroke();
      });

      // Mouse tether lines
      if (this.mouse.active) {
        this.nodes.forEach((n) => {
          const dx = this.mouse.x - n.x;
          const dy = this.mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < 180) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(this.mouse.x, this.mouse.y);
            ctx.strokeStyle = `rgba(224,122,78,${(1 - d / 180) * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
        // cursor halo
        const g = ctx.createRadialGradient(this.mouse.x, this.mouse.y, 0, this.mouse.x, this.mouse.y, 70);
        g.addColorStop(0, c.glow);
        g.addColorStop(1, "rgba(224,122,78,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.mouse.x, this.mouse.y, 70, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pulses + bright edge trails
      this.pulses.forEach((pl) => {
        const x = pl.edge.a.x + (pl.edge.b.x - pl.edge.a.x) * pl.p;
        const y = pl.edge.a.y + (pl.edge.b.y - pl.edge.a.y) * pl.p;
        // trail
        ctx.beginPath();
        ctx.moveTo(pl.edge.a.x, pl.edge.a.y);
        ctx.lineTo(pl.edge.b.x, pl.edge.b.y);
        ctx.strokeStyle = c.edgeHi;
        ctx.globalAlpha = 0.25 * (1 - Math.abs(pl.p - 0.5) * 1.4);
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
        // head
        ctx.beginPath();
        ctx.arc(x, y, 2.6 * s, 0, Math.PI * 2);
        ctx.fillStyle = c.pulse;
        ctx.shadowColor = c.pulse;
        ctx.shadowBlur = 10 * s;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Nodes
      this.nodes.forEach((n) => {
        const rad = n.r + n.glow * 3;
        if (n.glow > 0.05) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, rad + 8 * s, 0, Math.PI * 2);
          ctx.fillStyle = c.glow;
          ctx.globalAlpha = n.glow;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = n.glow > 0.3 ? c.nodeCore : c.node;
        ctx.fill();
      });
    }
  }

  global.NeuralNetwork = NeuralNetwork;
})(window);
