/* ============================================================
   Tensoramax — benchmark.js
   Leaderboard · filters/sort · model detail · handwriting lab
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const W = { accuracy: .16, reasoning: .14, coding: .12, instruction: .1, halluc: .1, calibration: .08, visual: .08, handwriting: .07, codeToTalk: .05, safety: .1 };
  const METRIC_KEYS = ["latency", "accuracy", "reasoning", "coding", "instruction", "halluc", "calibration", "visual", "handwriting", "codeToTalk", "safety"];
  const FALLBACK_MODELS = [
    { name: "Fallback Alpha", provider: "Tensoramax", version: "1.0", latency: 600, accuracy: 89, reasoning: 88, coding: 85, instruction: 87, halluc: 84, calibration: 82, visual: 0, handwriting: 0, codeToTalk: 0, safety: 92 },
    { name: "Fallback Beta", provider: "Tensoramax", version: "1.0", latency: 480, accuracy: 83, reasoning: 82, coding: 80, instruction: 81, halluc: 79, calibration: 78, visual: 0, handwriting: 0, codeToTalk: 0, safety: 88 },
    { name: "Fallback Gamma", provider: "Tensoramax", version: "1.0", latency: 720, accuracy: 76, reasoning: 74, coding: 72, instruction: 73, halluc: 70, calibration: 68, visual: 0, handwriting: 0, codeToTalk: 0, safety: 84 },
  ];
  let MODELS = processModels(FALLBACK_MODELS, "fallback");

  function toNumber(v) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const n = parseFloat(v.replace(/%/g, "").trim());
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  }

  function processModels(models, source = "runtime") {
    if (!Array.isArray(models)) return [];
    return models.map((raw) => {
      const m = { ...raw };
      m.name = typeof m.name === "string" && m.name.trim() ? m.name.trim() : "Unknown Model";
      m.provider = typeof m.provider === "string" && m.provider.trim() ? m.provider.trim() : "Unknown";
      m.version = typeof m.version === "string" ? m.version : "";
      METRIC_KEYS.forEach((k) => { m[k] = toNumber(m[k]); });
      m.overall = +(
        m.accuracy * W.accuracy + m.reasoning * W.reasoning + m.coding * W.coding +
        m.instruction * W.instruction + m.halluc * W.halluc + m.calibration * W.calibration +
        m.visual * W.visual + m.handwriting * W.handwriting + m.codeToTalk * W.codeToTalk +
        m.safety * W.safety
      ).toFixed(1);
      m.status = m.overall >= 85 ? "pass" : m.overall >= 70 ? "review" : "fail";
      if (!m.source) m.source = source;
      return m;
    });
  }

  async function loadModels() {
    const urls = ["/assets/models.json", "./assets/models.json"];
    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        const rows = Array.isArray(payload) ? payload : (Array.isArray(payload?.models) ? payload.models : null);
        if (!rows || !rows.length) throw new Error("models payload is empty");
        MODELS = processModels(rows, "assets/models.json");
        return;
      } catch (err) {
        console.warn(`[benchmark] Failed to load ${url}:`, err);
      }
    }
    MODELS = processModels(FALLBACK_MODELS, "fallback");
  }

  const STATUS_LABEL = { pass: "Pass", review: "Review", fail: "Fail" };
  const METRIC_LABELS = {
    accuracy: "Accuracy", reasoning: "Reasoning", coding: "Coding",
    instruction: "Instruction Following", halluc: "Hallucination Resist.",
    calibration: "Confidence Calibration", visual: "Visual Understanding",
    handwriting: "Handwriting Recognition", codeToTalk: "Code-to-Talk Ratio",
    safety: "Safety", latency: "Latency",
  };
  const LOWER_BETTER = new Set(["latency"]);

  const state = { search: "", provider: "all", status: "all", sort: { key: "overall", dir: "best" } };

  document.addEventListener("DOMContentLoaded", async () => {
    await loadModels();
    if ($("#leaderboard")) initLeaderboard();
    if ($("#hw-canvas")) initHandwriting();
  });

  /* ============================================================
     LEADERBOARD
     ============================================================ */
  function initLeaderboard() {
    const board = $("#leaderboard");
    const rowsWrap = $("#lb-rows");
    const countEl = $("#lb-count");

    // Build rows once
    const rowEls = MODELS.map((m, i) => ({ model: m, row: null, detail: null }));
    rowEls.forEach((entry) => {
      const row = document.createElement("div");
      row.className = "lb-row";
      row.setAttribute("role", "button");
      row.setAttribute("tabindex", "0");
      row.setAttribute("aria-expanded", "false");
      row.innerHTML = `
        <div class="lb-rank"></div>
        <div class="lb-name"><span class="n">${entry.model.name}</span><span class="p">${entry.model.provider} · v${entry.model.version}</span></div>
        ${metricCell("accuracy")}${metricCell("reasoning")}${metricCell("coding")}${metricCell("safety")}${latencyCell()}${overallCell()}
        <span class="status ${entry.model.status}">${STATUS_LABEL[entry.model.status]}</span>
        <span class="lb-expand" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></span>`;
      setMetricBars(row, entry.model);

      const detail = document.createElement("div");
      detail.className = "lb-detail";
      detail.innerHTML = `<div class="detail-inner">${buildDetail(entry.model)}</div>`;

      const toggle = () => {
        const open = row.classList.toggle("expanded");
        row.setAttribute("aria-expanded", String(open));
        if (open) {
          animateRings(detail);
          drawHistoryChart(detail, entry.model);
        }
      };
      row.addEventListener("click", toggle);
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });

      // wire expandable evaluation logs (generated after main.js runs)
      $$(".log-head", detail).forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const item = btn.closest(".log-item");
          const open = item.classList.toggle("open");
          btn.setAttribute("aria-expanded", String(open));
        });
      });

      entry.row = row;
      entry.detail = detail;
    });

    function metricCell(k) { return `<div class="lb-metric" data-k="${k}"></div>`; }
    function latencyCell() { return `<div class="lb-metric" data-k="latency"></div>`; }
    function overallCell() { return `<div class="lb-metric" data-k="overall" style="font-weight:700;color:var(--ink)"></div>`; }

    function setMetricBars(row, m) {
      ["accuracy", "reasoning", "coding", "safety"].forEach((k) => {
        const cell = row.querySelector(`[data-k="${k}"]`);
        cell.innerHTML = `${m[k].toFixed(0)}<div class="score-bar"><i style="width:${m[k]}%"></i></div>`;
      });
      const lat = row.querySelector('[data-k="latency"]');
      const latScore = Math.max(10, Math.round(100 - (m.latency - 200) / 10));
      lat.innerHTML = `${m.latency}<span style="font-size:.66rem;color:var(--muted)">ms</span><div class="score-bar"><i style="width:${latScore}%;background:var(--sage)"></i></div>`;
      const ov = row.querySelector('[data-k="overall"]');
      ov.innerHTML = `${m.overall.toFixed(1)}<div class="score-bar"><i style="width:${m.overall}%;background:var(--orange)"></i></div>`;
    }

    // interleave each row with its detail panel
    rowEls.forEach((e) => { rowsWrap.appendChild(e.row); rowsWrap.appendChild(e.detail); });

    // Filters
    const search = $("#lb-search");
    const provSel = $("#lb-provider");
    const statusSel = $("#lb-status");
    const sortSel = $("#lb-sort");
    const chips = $$(".chip-row .chip");

    if (search) search.addEventListener("input", (e) => { state.search = e.target.value.toLowerCase(); render(); });
    if (provSel) provSel.addEventListener("change", (e) => { state.provider = e.target.value; render(); });
    if (statusSel) statusSel.addEventListener("change", (e) => { state.status = e.target.value; render(); });
    if (sortSel) sortSel.addEventListener("change", (e) => {
      const [key, dir] = e.target.value.split(":");
      state.sort = { key, dir };
      render();
    });
    chips.forEach((chip) => chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.dataset.filter;
      if (f.startsWith("status:")) { state.status = f.split(":")[1]; state.provider = "all"; }
      else { state.provider = f; state.status = "all"; }
      if (provSel) provSel.value = state.provider;
      if (statusSel) statusSel.value = state.status;
      render();
    }));

    // Column header sorting
    $$(".lb-head .sortable").forEach((h) => {
      h.addEventListener("click", () => {
        const key = h.dataset.sort;
        let dir = "best";
        if (state.sort.key === key) dir = state.sort.dir === "best" ? "worst" : "best";
        state.sort = { key, dir };
        $$(".lb-head .sortable").forEach((x) => x.classList.remove("asc", "desc"));
        h.classList.add(dir === "best" ? "desc" : "asc");
        render();
      });
    });

    render();

    function matches(m) {
      if (state.provider !== "all" && m.provider !== state.provider) return false;
      if (state.status !== "all" && m.status !== state.status) return false;
      if (state.search) {
        const hay = (m.name + m.provider + m.version).toLowerCase();
        if (!hay.includes(state.search)) return false;
      }
      return true;
    }

    function render() {
      const visible = rowEls.filter((e) => matches(e.model));
      // sort
      const { key, dir } = state.sort;
      visible.sort((a, b) => {
        const av = LOWER_BETTER.has(key) ? -a.model[key] : a.model[key];
        const bv = LOWER_BETTER.has(key) ? -b.model[key] : b.model[key];
        return dir === "best" ? bv - av : av - bv;
      });
      // reorder + rank + visibility
      let rank = 1;
      visible.forEach((e) => {
        rowsWrap.appendChild(e.row);
        rowsWrap.appendChild(e.detail);
        e.row.style.display = "";
        e.row.querySelector(".lb-rank").textContent = rank;
        e.row.querySelector(".lb-rank").classList.toggle("top", rank <= 3);
        rank++;
      });
      rowEls.forEach((e) => { if (!matches(e.model)) e.row.style.display = "none"; });
      if (countEl) countEl.textContent = `${visible.length} model${visible.length === 1 ? "" : "s"}`;
      if (!visible.length) {
        if (!$("#lb-empty")) {
          const empty = document.createElement("div");
          empty.id = "lb-empty";
          empty.className = "empty-state";
          empty.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><p>No models match your filters.</p>`;
          rowsWrap.appendChild(empty);
        }
      } else {
        const empty = $("#lb-empty");
        if (empty) empty.remove();
      }
    }
  }

  /* ---------- Model detail panel ---------- */
  function buildDetail(m) {
    const ringKeys = ["accuracy", "reasoning", "coding", "instruction", "visual", "handwriting", "safety", "calibration"];
    const rings = ringKeys.map((k) => ringCard(k, m[k])).join("");
    const sorted = ["accuracy", "reasoning", "coding", "instruction", "halluc", "calibration", "visual", "handwriting", "codeToTalk", "safety"]
      .map((k) => ({ k, v: m[k] })).sort((a, b) => b.v - a.v);
    const strengths = sorted.slice(0, 3).map((s) => `<li><strong>${METRIC_LABELS[s.k]}</strong> — ${strengthPhrase(s.k, s.v)}</li>`).join("");
    const weaknesses = sorted.slice(-3).reverse().map((s) => `<li><strong>${METRIC_LABELS[s.k]}</strong> — ${weakPhrase(s.k, s.v)}</li>`).join("");
    const chips = Object.entries({ halluc: m.halluc, codeToTalk: m.codeToTalk })
      .map(([k, v]) => `<span class="tag" style="margin:0">${METRIC_LABELS[k]}: ${v.toFixed(1)}</span>`).join("");

    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:start" class="detail-top">
        <div>
          <span class="eyebrow">Evaluation Report</span>
          <h3 style="margin:10px 0 6px">${m.name}</h3>
          <p class="muted mono" style="font-size:.82rem">${m.provider} · v${m.version} · ${m.latency}ms median latency</p>
          <div class="flex gap-1 mt-2" style="flex-wrap:wrap">${chips}</div>
          <div class="chart-card" style="margin-top:22px">
            <div class="ct">Historical benchmark trajectory</div>
            <div class="cs">Overall score across evaluation runs</div>
            <canvas class="history-chart" width="600" height="220"></canvas>
          </div>
        </div>
        <div style="display:grid;place-items:center">
          ${bigRing(m.overall, m.status)}
          <p class="muted mono" style="font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;margin-top:14px">Overall composite score</p>
        </div>
      </div>
      <div class="ring-grid">${rings}</div>
      <div class="sw-grid">
        <div class="sw-card strong"><h4><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>Observed strengths</h4><ul>${strengths}</ul></div>
        <div class="sw-card weak"><h4><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/><path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z"/></svg>Improvement areas</h4><ul>${weaknesses}</ul></div>
      </div>
      <div class="chart-card" style="margin-top:8px">
        <div class="ct">Evaluation timeline</div>
        <div class="cs">Phases of the Tensoramax evaluation suite</div>
        ${buildTimeline(m)}
      </div>
      <h4 class="mono" style="font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted-2);margin:24px 0 4px">Raw evaluation logs</h4>
      ${buildLogs(m)}`;
  }

  function strengthPhrase(k, v) {
    if (v >= 90) return "exceptional, top-tier reliability across the suite.";
    if (v >= 85) return "consistently strong with minimal failure modes.";
    return "solid performance, above the cohort median.";
  }
  function weakPhrase(k, v) {
    if (v < 72) return "notable gaps; flagged for re-evaluation.";
    if (v < 80) return "moderate variance under adversarial prompts.";
    return "room to tighten consistency at the frontier.";
  }

  /* ---------- SVG score rings ---------- */
  const R = 42, C = 2 * Math.PI * R;
  function ringClass(v) { return v >= 85 ? "ok" : v >= 70 ? "warn" : "bad"; }

  function ringCard(key, value) {
    return `<div class="ring-card">
      <div class="score-ring">${ringSVG(value)}</div>
      <div class="label">${METRIC_LABELS[key]}</div>
    </div>`;
  }
  function ringSVG(value) {
    return `<svg viewBox="0 0 100 100">
      <circle class="ring-track" cx="50" cy="50" r="${R}" fill="none" stroke-width="7"/>
      <circle class="ring-fill ${ringClass(value)}" cx="50" cy="50" r="${R}" fill="none" stroke-width="7"
        stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" data-target="${(C * (1 - value / 100)).toFixed(1)}"/>
    </svg><span class="val">${value.toFixed(0)}</span>`;
  }
  function bigRing(value, status) {
    return `<div class="score-ring" style="width:160px;height:160px">
      <svg viewBox="0 0 100 100">
        <circle class="ring-track" cx="50" cy="50" r="${R}" fill="none" stroke-width="6"/>
        <circle class="ring-fill ${status === "pass" ? "ok" : status === "review" ? "warn" : "bad"}" cx="50" cy="50" r="${R}" fill="none" stroke-width="6"
          stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" data-target="${(C * (1 - value / 100)).toFixed(1)}"/>
      </svg>
      <span class="val" style="font-size:2.6rem">${value.toFixed(1)}</span>
    </div>`;
  }
  function animateRings(scope) {
    const fills = $$(".ring-fill", scope);
    fills.forEach((f, i) => {
      const target = f.getAttribute("data-target");
      if (reduce) { f.style.strokeDashoffset = target; return; }
      setTimeout(() => { f.style.strokeDashoffset = target; }, 60 + i * 70);
    });
  }

  /* ---------- Canvas history chart ---------- */
  function drawHistoryChart(scope, m) {
    const canvas = $(".history-chart", scope);
    if (!canvas) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = 220 * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width, h = 220, pad = { l: 36, r: 16, t: 16, b: 28 };

    // deterministic pseudo-history around overall
    const runs = 6;
    const seed = m.name.charCodeAt(0);
    const pts = [];
    let v = Math.max(40, m.overall - 9);
    for (let i = 0; i < runs; i++) {
      v += (m.overall - v) * 0.45 + (((seed * (i + 3)) % 7) - 3) * 0.9;
      pts.push(+v.toFixed(1));
    }
    pts[runs - 1] = m.overall;

    const min = 40, max = 100;
    const x = (i) => pad.l + (i / (runs - 1)) * (w - pad.l - pad.r);
    const y = (val) => pad.t + (1 - (val - min) / (max - min)) * (h - pad.t - pad.b);
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    const grid = dark ? "rgba(170,155,128,0.14)" : "rgba(28,25,22,0.06)";
    const axis = dark ? "rgba(162,148,125,0.75)" : "rgba(117,107,94,0.7)";
    const ptFill = dark ? "#1E1814" : "#FBF7EF";

    // gridlines
    ctx.strokeStyle = grid;
    ctx.fillStyle = axis;
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.lineWidth = 1;
    for (let g = 40; g <= 100; g += 20) {
      ctx.beginPath(); ctx.moveTo(pad.l, y(g)); ctx.lineTo(w - pad.r, y(g)); ctx.stroke();
      ctx.fillText(g, 6, y(g) + 3);
    }

    // area
    const grad = ctx.createLinearGradient(0, pad.t, 0, h - pad.b);
    grad.addColorStop(0, "rgba(224,122,78,0.28)");
    grad.addColorStop(1, "rgba(224,122,78,0)");
    ctx.beginPath();
    ctx.moveTo(x(0), h - pad.b);
    pts.forEach((p, i) => ctx.lineTo(x(i), y(p)));
    ctx.lineTo(x(runs - 1), h - pad.b);
    ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    // line
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(x(i), y(p)) : ctx.moveTo(x(i), y(p))));
    ctx.strokeStyle = "#C25A2C"; ctx.lineWidth = 2.4; ctx.lineJoin = "round"; ctx.stroke();

    // points
    pts.forEach((p, i) => {
      ctx.beginPath(); ctx.arc(x(i), y(p), 3.5, 0, Math.PI * 2);
      ctx.fillStyle = ptFill; ctx.fill();
      ctx.strokeStyle = "#C25A2C"; ctx.lineWidth = 2; ctx.stroke();
    });
    // run labels
    ctx.fillStyle = axis;
    pts.forEach((_, i) => ctx.fillText("R" + (i + 1), x(i) - 7, h - pad.b + 16));
  }

  /* ---------- Timeline + logs ---------- */
  function buildTimeline(m) {
    const phases = [
      { t: "Suite A", d: "Core knowledge & reasoning probes" },
      { t: "Suite B", d: "Adversarial & safety stress tests" },
      { t: "Suite C", d: "Multimodal & handwriting recognition" },
      { t: "Synthesis", d: "Calibration audit & composite scoring" },
    ];
    return `<div class="timeline" style="margin-top:8px">${phases.map((p, i) => `
      <div class="phase ${i < 3 ? "done" : ""}">
        <div class="when">${p.t} · ${["Complete", "Complete", "Complete", m.status === "pass" ? "Complete" : "In review"][i]}</div>
        <h3 style="font-size:1.1rem">${p.d}</h3>
      </div>`).join("")}</div>`;
  }
  function buildLogs(m) {
    const logs = [
      { id: "run_4f9a", tag: m.status === "pass" ? "PASSED" : "FLAGGED", body: `composite=${m.overall} n=12,480 probes\nsafety_refusals=${(100 - m.safety).toFixed(1)}% calibrated\nhalluc_rate=${(100 - m.halluc).toFixed(1)}% on factual set\nverdict: ${STATUS_LABEL[m.status].toUpperCase()}` },
      { id: "run_3c21", tag: "PROBES", body: `reasoning_pass=${m.reasoning}%\ncoding_pass=${m.coding}% (HumanEval-style)\ninstruction_followed=${m.instruction}%\nmedian_latency=${m.latency}ms  p95=${Math.round(m.latency * 1.7)}ms` },
      { id: "run_1a07", tag: "MULTIMODAL", body: `visual_grounding=${m.visual}%\nhandwriting_top1=${m.handwriting}%\ncode_to_talk=${m.codeToTalk}%\nconf_ece=${(100 - m.calibration).toFixed(1)}` },
    ];
    return logs.map((l) => `
      <div class="log-item">
        <button class="log-head" aria-expanded="false">
          <span class="when mono">${l.id}</span>
          <span class="tag2">${l.tag}</span>
        </button>
        <div class="log-body"><div class="inner">${l.body}</div></div>
      </div>`).join("");
  }

  /* ============================================================
     HANDWRITING RECOGNITION LAB
     ============================================================ */
  const DIGITS = [
    "11111 10001 10001 10001 11111",
    "00100 01100 00100 00100 01110",
    "11110 00001 01110 10000 11111",
    "11110 00001 01110 00001 11110",
    "10001 10001 11111 00001 00001",
    "11111 10000 11110 00001 11110",
    "11111 10000 11110 10001 11110",
    "11111 00001 00010 00100 01000",
    "11110 10001 01110 10001 11110",
    "11110 10001 01110 00001 11110",
  ];
  const TEMPLATES = DIGITS.map((s) => s.split(/\s/).join("").split("").map(Number));

  function initHandwriting() {
    const canvas = $("#hw-canvas");
    const ctx = canvas.getContext("2d");
    const wrap = $(".hw-canvas-area");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let W = 0, H = 0;

    const state2 = { strokes: [], redo: [], mode: "draw", size: 14, color: "#1C1916", bg: null, drawing: false, cur: null, challenge: null, streak: 0, best: 0, attempts: 0, correct: 0, scored: false };

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      repaint();
    }
    window.addEventListener("resize", resize);
    setTimeout(resize, 60);

    const inkColor = () => (state2.mode === "erase" ? "#FFFCF6" : state2.color);

    function repaint() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (state2.bg) { try { ctx.drawImage(state2.bg, 0, 0, W, H); } catch (e) {} }
      state2.strokes.forEach((st) => drawStroke(st));
    }
    function drawStroke(st) {
      ctx.strokeStyle = st.color; ctx.lineWidth = st.size;
      ctx.beginPath();
      const p = st.points;
      if (p.length < 2) { ctx.arc(p[0].x, p[0].y, st.size / 2, 0, Math.PI * 2); ctx.fillStyle = st.color; ctx.fill(); return; }
      ctx.moveTo(p[0].x, p[0].y);
      for (let i = 1; i < p.length - 1; i++) {
        const mx = (p[i].x + p[i + 1].x) / 2, my = (p[i].y + p[i + 1].y) / 2;
        ctx.quadraticCurveTo(p[i].x, p[i].y, mx, my);
      }
      ctx.lineTo(p[p.length - 1].x, p[p.length - 1].y);
      ctx.stroke();
    }

    function pos(e) {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function start(e) {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      state2.drawing = true; state2.redo = [];
      state2.cur = { color: inkColor(), size: state2.size, points: [pos(e)] };
      state2.strokes.push(state2.cur);
      repaint();
    }
    function move(e) {
      if (!state2.drawing) return;
      e.preventDefault();
      const p = pos(e); const last = state2.cur.points[state2.cur.points.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) > 1.4) { state2.cur.points.push(p); repaint(); }
    }
    function end(e) {
      if (!state2.drawing) return;
      state2.drawing = false; state2.cur = null;
      schedulePredict();
    }
    canvas.addEventListener("pointerdown", start);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    canvas.addEventListener("pointerleave", end);

    // Tools
    const setMode = (mode) => {
      state2.mode = mode;
      $$("[data-tool]").forEach((b) => {
        const on = b.dataset.tool === mode;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", String(on));
      });
    };
    $$("[data-tool]").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.tool)));

    const sizeInput = $("#hw-size");
    if (sizeInput) sizeInput.addEventListener("input", (e) => { state2.size = +e.target.value; $("#hw-size-val").textContent = e.target.value + "px"; });

    $("#hw-undo")?.addEventListener("click", () => {
      if (state2.strokes.length) { state2.redo.push(state2.strokes.pop()); repaint(); resetPredict(); }
    });
    $("#hw-redo")?.addEventListener("click", () => {
      if (state2.redo.length) { state2.strokes.push(state2.redo.pop()); repaint(); schedulePredict(); }
    });
    $("#hw-clear")?.addEventListener("click", clearAll);
    $("#hw-grid")?.addEventListener("click", () => { wrap.classList.toggle("grid"); $("#hw-grid").classList.toggle("active"); });

    // Export PNG
    $("#hw-export")?.addEventListener("click", () => {
      const a = document.createElement("a");
      a.download = "tensoramax-handwriting.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    });
    // Import image
    const fileInput = $("#hw-file");
    $("#hw-import")?.addEventListener("click", () => fileInput.click());
    fileInput?.addEventListener("change", (e) => {
      const f = e.target.files[0]; if (!f) return;
      const img = new Image();
      img.onload = () => { state2.bg = img; repaint(); schedulePredict(); };
      img.src = URL.createObjectURL(f);
    });
    // Random challenge
    $("#hw-random")?.addEventListener("click", () => newChallenge());
    let neuroCells = [];
    function buildNeuro() {
      const mapEl = $("#neuro-map");
      if (!mapEl) return;
      mapEl.innerHTML = "";
      neuroCells = [];
      for (let i = 0; i < 100; i++) {
        const c = document.createElement("div");
        c.className = "neuro-cell";
        mapEl.appendChild(c);
        neuroCells.push(c);
      }
    }
    // Render the 10×10 activation map (what the model "sees") — pure visual.
    function renderNeuroMap(map) {
      if (!neuroCells.length) return;
      for (let i = 0; i < 100; i++) {
        const d = map ? map[i] : 0;
        const cell = neuroCells[i];
        if (d > 0.05) {
          cell.style.background = "rgba(232,139,94," + Math.min(1, d).toFixed(2) + ")";
          cell.style.boxShadow = d > 0.55 ? "0 0 7px rgba(232,139,94,.6)" : "none";
        } else {
          cell.style.background = "rgba(224,122,78,0)";
          cell.style.boxShadow = "none";
        }
      }
    }
    function clearAll() {
      state2.strokes = []; state2.redo = []; state2.bg = null; state2.scored = false;
      repaint(); resetPredict();
    }
    function loadBest() { try { state2.best = parseInt(localStorage.getItem("hw-best") || "0", 10) || 0; } catch (e) {} }
    function saveBest() { try { localStorage.setItem("hw-best", String(state2.best)); } catch (e) {} }
    function renderStats(flash) {
      const s = $("#hw-streak"); if (s) s.textContent = state2.streak;
      const b = $("#hw-best"); if (b) b.textContent = state2.best;
      const a = $("#hw-acc");
      if (a) a.textContent = state2.attempts ? Math.round((state2.correct / state2.attempts) * 100) + "%" : "—";
      const card = s ? s.closest(".gb-stat") : null;
      if (card) {
        card.classList.toggle("fire", state2.streak > 0);
        if (flash === "good") { card.classList.add("pop"); setTimeout(() => card.classList.remove("pop"), 450); }
      }
    }
    // Decide a challenge attempt once the model is confident enough.
    function judge(digit, conf) {
      const matchEl = $("#hw-match");
      if (state2.challenge === null || state2.scored || conf < 50) return;
      state2.scored = true;
      state2.attempts++;
      const ok = digit === state2.challenge;
      if (ok) {
        state2.correct++; state2.streak++;
        if (state2.streak > state2.best) { state2.best = state2.streak; saveBest(); }
        if (matchEl) { matchEl.textContent = "✓ Nailed it!"; matchEl.style.color = "var(--ok)"; }
        confetti(); buzz(80);
        renderStats("good");
      } else {
        state2.streak = 0;
        if (matchEl) { matchEl.textContent = "✗ Read as " + digit; matchEl.style.color = "var(--bad)"; }
        buzz([20, 40, 20]);
        renderStats();
      }
    }
    function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
    function confetti() {
      const cv = $("#confetti"); if (!cv) return;
      const r = cv.getBoundingClientRect();
      cv.width = r.width * dpr; cv.height = r.height * dpr;
      const c = cv.getContext("2d");
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const W = r.width, H = r.height;
      const colors = ["#E07A4E", "#EA8B5E", "#C25A2C", "#7C8B70", "#4E8A5A", "#CC7A1E"];
      const parts = [];
      for (let i = 0; i < 90; i++) {
        parts.push({
          x: W / 2 + (Math.random() - 0.5) * 80, y: H * 0.45,
          vx: (Math.random() - 0.5) * 10, vy: Math.random() * -12 - 3,
          g: 0.34 + Math.random() * 0.18, size: 4 + Math.random() * 6,
          color: colors[i % colors.length], rot: Math.random() * 6.28,
          vr: (Math.random() - 0.5) * 0.4, life: 1
        });
      }
      const reduce2 = matchMedia("(prefers-reduced-motion: reduce)").matches;
      let frame = 0;
      (function step() {
        c.clearRect(0, 0, W, H);
        parts.forEach((p) => {
          p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.013;
          c.save(); c.translate(p.x, p.y); c.rotate(p.rot);
          c.globalAlpha = Math.max(0, p.life); c.fillStyle = p.color;
          c.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          c.restore();
        });
        frame++;
        if (frame < 95) requestAnimationFrame(step); else c.clearRect(0, 0, W, H);
      })();
      if (reduce2) c.clearRect(0, 0, W, H);
    }
    function newChallenge() {
      let d = Math.floor(Math.random() * 10);
      if (d === state2.challenge) d = (d + 1) % 10; // avoid repeats
      state2.challenge = d;
      state2.scored = false;
      $("#hw-challenge").textContent = d;
      renderChallengePreview(d);
      clearAll();
      renderStats();
    }
    function renderChallengePreview(d) {
      const pv = $("#challenge-preview");
      if (!pv) return;
      const sz = 5, cell = 10;
      pv.width = sz * cell; pv.height = sz * cell;
      const pctx = pv.getContext("2d");
      pctx.clearRect(0, 0, pv.width, pv.height);
      const tpl = TEMPLATES[d];
      pctx.fillStyle = "#E88B5E";
      for (let y = 0; y < sz; y++) for (let x = 0; x < sz; x++)
        if (tpl[y * sz + x]) pctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
    }

    // Predict
    let predictTimer = null;
    function schedulePredict() { clearTimeout(predictTimer); predictTimer = setTimeout(predict, 420); }

    // Scan the canvas once for dark ink; return bounding box or null.
    function lastInk() {
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const cw = canvas.width, ch = canvas.height;
      let minX = cw, minY = ch, maxX = 0, maxY = 0, count = 0;
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
        const i = (y * cw + x) * 4;
        const lum = 0.299 * img[i] + 0.587 * img[i + 1] + 0.114 * img[i + 2];
        if (img[i + 3] > 60 && lum < 165) {
          count++;
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
      if (count < 80) return null;
      return { img, cw, minX, minY, maxX, maxY };
    }
    // Build a normalized NxN density grid from ink bounding box.
    function gridFor(info, N) {
      const { img, cw, minX, minY, maxX, maxY } = info;
      const bw = Math.max(1, maxX - minX), bh = Math.max(1, maxY - minY);
      const g = new Array(N * N).fill(0);
      for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
        const i = (y * cw + x) * 4;
        const lum = 0.299 * img[i] + 0.587 * img[i + 1] + 0.114 * img[i + 2];
        if (img[i + 3] > 60 && lum < 165) {
          const gx = Math.min(N - 1, Math.floor(((x - minX) / bw) * N));
          const gy = Math.min(N - 1, Math.floor(((y - minY) / bh) * N));
          g[gy * N + gx]++;
        }
      }
      const mx = Math.max(...g);
      if (mx > 0) for (let i = 0; i < g.length; i++) g[i] /= mx;
      return g;
    }
    function classify(grid) {
      if (!grid) return null;
      const temp = 7.5;
      const sims = TEMPLATES.map((tpl, digit) => {
        let dot = 0, na = 0, nb = 0;
        for (let i = 0; i < grid.length; i++) { dot += grid[i] * tpl[i]; na += grid[i] * grid[i]; nb += tpl[i] * tpl[i]; }
        return { digit, sim: dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9) };
      });
      const exps = sims.map((s) => Math.exp(s.sim * temp));
      const sum = exps.reduce((a, b) => a + b, 0);
      const probs = sims.map((s, i) => ({ digit: i, p: exps[i] / sum })).sort((a, b) => b.p - a.p);
      return probs;
    }

    function predict() {
      const t0 = performance.now();
      const info = lastInk();
      const grid5 = info ? gridFor(info, 5) : null;
      const map = info ? gridFor(info, 10) : null;
      const probs = classify(grid5);
      const ms = (performance.now() - t0).toFixed(1);
      const resEl = $("#hw-result");
      const confWrap = $("#hw-confidence");
      const latEl = $("#hw-latency");
      const distEl = $("#hw-dist");

      latEl.innerHTML = `${ms}<span class="u"> ms</span>`;
      renderNeuroMap(map);

      if (!probs) {
        resEl.textContent = "—";
        resEl.classList.add("placeholder");
        resEl.classList.remove("live");
        confWrap.style.width = "0%";
        $("#hw-conf-val").textContent = "0%";
        distEl.innerHTML = `<p class="muted mono" style="font-size:.78rem;padding:10px 0">Draw a digit to see class distribution.</p>`;
        return;
      }
      const top = probs[0];
      resEl.textContent = top.digit;
      resEl.classList.remove("placeholder");
      resEl.classList.add("live");
      const conf = Math.round(top.p * 100);
      confWrap.style.width = conf + "%";
      $("#hw-conf-val").textContent = conf + "%";
      distEl.innerHTML = probs
        .map((p) => `<div class="dist-row ${p === top ? "top" : ""}">
            <span class="d">${p.digit}</span>
            <span class="dist-track"><i data-w="${Math.round(p.p * 100)}"></i></span>
            <span class="pct">${Math.round(p.p * 100)}%</span>
          </div>`).join("");
      requestAnimationFrame(() => $$("#hw-dist .dist-track > i").forEach((b) => (b.style.width = b.dataset.w + "%")));
      judge(top.digit, conf);
    }
    function resetPredict() {
      const resEl = $("#hw-result");
      if (resEl) { resEl.textContent = "—"; resEl.classList.add("placeholder"); resEl.classList.remove("live"); }
      const confWrap = $("#hw-confidence");
      if (confWrap) confWrap.style.width = "0%";
      const cv = $("#hw-conf-val"); if (cv) cv.textContent = "0%";
      renderNeuroMap(null);
      const matchEl = $("#hw-match"); if (matchEl) matchEl.textContent = "";
    }

    buildNeuro();
    loadBest();
    renderStats();
    $("#hw-predict")?.addEventListener("click", predict);
    newChallenge();
  }
})();
