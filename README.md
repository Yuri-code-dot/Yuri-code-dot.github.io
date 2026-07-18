# Tensoramax — AI Safety & Research Laboratory

The official website for **Tensoramax**, a fictional independent AI research laboratory
dedicated to AI safety, benchmarking, model evaluation, responsible AI, human–AI
interaction, transparency, and open research.

This is a production-quality, **single-codebase static site** built with plain
**HTML5, CSS3, and vanilla JavaScript (ES6+)** — no frameworks, no build step, no
dependencies. It deploys directly to **GitHub Pages**.

> ⚠️ *Tensoramax and all model names, providers, and benchmark scores shown are
> fictional and illustrative. They exist to demonstrate front-end engineering and
> interaction design.*

---

## ✨ Highlights

- **Editorial, laboratory-grade design** — warm cream surfaces, soft orange accents,
  black serif display type (Fraunces), generous whitespace, natural shadows, rounded
  corners.
- **Interactive neural-network canvas** on the hero and an animated network in the
  footer, with mouse interaction and flowing activations.
- **Full benchmark dashboard** — search, provider/status filters, sorting,
  expandable model cards with **animated SVG score rings**, **canvas history charts**,
  timelines, strengths/weaknesses, and expandable evaluation logs.
- **Live handwriting recognition lab** — brush/eraser, undo/redo, grid, import/export
  PNG, random challenges, a real in-browser digit classifier with a confidence
  distribution, latency timer, and comparison table.
- **Motion & micro-interactions** — Intersection-Observer reveals, animated counters,
  parallax, floating particles, smooth scrolling, scroll-progress bar, hover lifts.
- **Accessible & responsible** — semantic HTML, keyboard navigation, focus states,
  skip link, ARIA, and full `prefers-reduced-motion` support.

---

## 📁 Project structure

```
/
├── index.html            # Home — hero, neural canvas, all sections, footer
├── benchmark.html        # Benchmark dashboard + handwriting lab
├── research.html         # Research program & domains
├── papers.html           # Publications
├── documentation.html    # Methodology, scoring, CLI, reproducibility
├── about.html            # Mission, values, story, contributors
├── faq.html              # Frequently asked questions
├── legal.html            # Terms, privacy, license, disclaimers
├── css/
│   ├── style.css         # Design system & shared components
│   ├── animations.css    # Keyframes, reveals, micro-interactions
│   └── benchmark.css     # Dashboard, leaderboard, handwriting lab
├── js/
│   ├── main.js           # Nav, reveals, counters, clock, footer net
│   ├── neural-network.js # Reusable animated neural-network canvas
│   └── benchmark.js      # Leaderboard engine + handwriting recognizer
├── assets/
│   ├── images/           # Reserved for raster imagery
│   └── icons/            # Reserved for standalone icon files
└── README.md
```

The project uses **inline SVG** for all icons and illustrations and **HTML Canvas**
for the neural network, charts, and drawing surface, so `assets/images` and
`assets/icons` are reserved for any future raster/icon additions.

---

## 🚀 Running locally

It's static — just open `index.html` in a browser, or serve the folder for correct
relative paths:

```bash
# Python
python3 -m http.server 8000

# or Node (no install needed with npx)
npx serve .
```

Then visit `http://localhost:8000`.

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main`
   and `/ (root)`, then save.
4. Your site will be live at `https://<your-username>.github.io/<repo>/`.

No build configuration is required — every file is served as-is.

---

## 🧠 How the handwriting recognizer works

The interactive demo is a genuine (if lightweight) in-browser classifier:

1. The drawing is rasterized from the canvas.
2. Ink pixels are found and their bounding box extracted (translation/scale invariant).
3. Ink density is downsampled into a **5×5 feature grid**.
4. The grid is compared against hand-authored **5×5 digit templates** using cosine
   similarity, then a softmax produces a per-class **confidence distribution**.
5. Inference latency is measured with `performance.now()`.

Because recognition runs on the rasterized canvas, both drawn strokes *and* imported
images can be classified.

---

## ♿ Accessibility & performance

- Semantic landmarks (`header`, `nav`, `main`, `footer`, `section`, `article`).
- Skip-to-content link, visible focus rings, keyboard-operable controls and accordions.
- `prefers-reduced-motion` disables animations and canvas loops where appropriate.
- Canvas animations pause when off-screen via `IntersectionObserver`.
- System fonts are preconnected; only three Google Font families are loaded.

---

## 📝 License

- **Code:** MIT
- **Text & datasets (illustrative):** CC-BY 4.0

© Tensoramax Research — released for the public good.
