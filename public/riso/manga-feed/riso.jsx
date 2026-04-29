// ─────────────────────────────────────────────────────────────
// RISO/READ — full direction (Home → Series → Reader)
// Risograph zine. Two-color overprint (pink + blue) on uncoated stock.
// Halftone dots, registration crosses, rotated stickers, photocopy noise,
// stamps, fold lines, staple holes. Hand-cut feel; misregistered on purpose.
// Novel: "B-side" pull-quote stickers; staple-bound TOC; registration marks
// at every corner; reader presents as a folded zine spread w/ centerfold.
// ─────────────────────────────────────────────────────────────

const RZ2_STYLE = `
.rz2 {
  --rz-paper: #f3ead9;
  --rz-paper-2: #ebe1c9;
  --rz-pink: #ff3d8b;
  --rz-blue: #1c2dcb;
  --rz-yellow: #f6d544;
  --rz-ink: #15140f;
  --rz-mute: rgba(21,20,15,0.55);
  --rz-rule: #15140f;
  --rz-display: 'Space Grotesk', system-ui, sans-serif;
  --rz-mono: 'JetBrains Mono', ui-monospace, monospace;
  --rz-serif: 'Lora', Georgia, serif;
  background: var(--rz-paper);
  background-image:
    /* halftone dot field */
    radial-gradient(rgba(21,20,15,0.10) 1px, transparent 1.4px),
    radial-gradient(rgba(21,20,15,0.04) 1px, transparent 1.4px),
    /* paper grain */
    repeating-linear-gradient(102deg, rgba(21,20,15,0.018) 0 1px, transparent 1px 4px);
  background-size: 5px 5px, 11px 11px, auto;
  background-position: 0 0, 2px 2px, 0 0;
  color: var(--rz-ink);
  font: 13px/1.45 var(--rz-mono);
  width: 100%; min-height: 100%;
  position: relative;
}
.rz2[data-dark="true"] {
  --rz-paper: #14110d;
  --rz-paper-2: #1c1814;
  --rz-ink: #f3ead9;
  --rz-rule: #f3ead9;
  --rz-mute: rgba(243,234,217,0.55);
  background-image:
    radial-gradient(rgba(243,234,217,0.10) 1px, transparent 1.4px),
    radial-gradient(rgba(243,234,217,0.04) 1px, transparent 1.4px);
}

/* Registration crosses — small + at corners */
.rz2-reg {
  position: absolute; width: 14px; height: 14px;
  pointer-events: none; opacity: 0.85;
  background:
    linear-gradient(var(--rz-pink), var(--rz-pink)) center/100% 1px no-repeat,
    linear-gradient(var(--rz-blue), var(--rz-blue)) center/1px 100% no-repeat;
  mix-blend-mode: multiply;
}
.rz2-reg::after {
  content:""; position:absolute; inset: 3px; border: 1px solid var(--rz-ink);
  border-radius: 50%;
}

/* Staple */
.rz2-staple {
  position: absolute; width: 14px; height: 4px;
  background: #888; box-shadow: 0 1px 0 rgba(0,0,0,0.4);
  transform: rotate(-2deg);
}

/* Top — masthead */
.rz2-top {
  display: grid; grid-template-columns: auto 1fr auto;
  gap: 16px; padding: 28px 30px 0;
}
.rz2-logo {
  background: var(--rz-pink); color: var(--rz-paper);
  padding: 16px 22px 14px;
  font: 800 36px/0.85 var(--rz-display);
  letter-spacing: -0.045em;
  mix-blend-mode: multiply;
  transform: rotate(-1.2deg);
  box-shadow: 3px 3px 0 var(--rz-ink);
  position: relative;
}
.rz2-logo .slash { color: var(--rz-yellow); mix-blend-mode: multiply; }
.rz2-logo small {
  display: block; font: 600 9px/1 var(--rz-mono);
  margin-top: 6px; letter-spacing: 0.18em; opacity: 0.95;
}
.rz2-nav {
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  background: var(--rz-blue); color: var(--rz-paper);
  padding: 0 22px; min-height: 56px;
  font: 700 14px/1 var(--rz-display); letter-spacing: 0.02em;
  box-shadow: 3px 3px 0 var(--rz-ink);
  align-self: start; margin-top: 8px;
}
.rz2-nav a { cursor: pointer; padding: 6px 4px; }
.rz2-nav a.act {
  background: var(--rz-paper); color: var(--rz-blue);
  padding: 6px 10px; box-shadow: inset 0 0 0 2px var(--rz-ink);
}
.rz2-issue {
  background: var(--rz-ink); color: var(--rz-paper);
  padding: 14px 18px;
  font: 700 11px/1.3 var(--rz-mono); letter-spacing: 0.14em;
  text-align: right; min-width: 130px; align-self: start; margin-top: 8px;
  box-shadow: 3px 3px 0 var(--rz-pink);
}
.rz2-issue .stamp {
  display: inline-block; transform: rotate(-6deg); margin-top: 6px;
  border: 1.5px solid var(--rz-paper); padding: 3px 6px;
  font-size: 10px; letter-spacing: 0.18em;
}

/* Subnav strip — issue meta */
.rz2-strip {
  margin: 14px 30px 0;
  border-top: 2px dashed var(--rz-ink);
  border-bottom: 2px dashed var(--rz-ink);
  padding: 8px 0;
  display: flex; gap: 26px; flex-wrap: wrap;
  font: 700 10.5px/1 var(--rz-mono); letter-spacing: 0.16em;
  color: var(--rz-ink); text-transform: uppercase;
}
.rz2-strip span:nth-child(odd) { color: var(--rz-pink); mix-blend-mode: multiply; }
.rz2-strip span:nth-child(even) { color: var(--rz-blue); mix-blend-mode: multiply; }

/* Hero */
.rz2-hero {
  display: grid; grid-template-columns: 1.55fr 1fr;
  gap: 18px; padding: 22px 30px 0;
}
.rz2-hero-l {
  background: var(--rz-paper); border: 4px solid var(--rz-ink);
  padding: 28px 28px 22px; position: relative; overflow: hidden;
  box-shadow: 6px 6px 0 var(--rz-blue);
}
.rz2-hero-l::before {
  content: ""; position: absolute; right: -60px; bottom: -60px;
  width: 280px; height: 280px; border-radius: 50%;
  background: var(--rz-pink); mix-blend-mode: multiply; opacity: 0.55;
}
.rz2-hero-l::after {
  content: ""; position: absolute; left: -30px; top: 60px;
  width: 120px; height: 120px; border-radius: 50%;
  background: var(--rz-yellow); mix-blend-mode: multiply; opacity: 0.6;
  z-index: 0;
}
.rz2-hero-eb {
  font: 700 11px/1 var(--rz-mono); letter-spacing: 0.18em;
  color: var(--rz-blue); margin-bottom: 16px;
  display: flex; align-items: center; gap: 10px;
  position: relative; z-index: 1;
}
.rz2-hero-eb .dot { width: 10px; height: 10px; background: var(--rz-pink); border-radius: 50%; mix-blend-mode: multiply; }
.rz2-hero-t {
  font: 800 96px/0.85 var(--rz-display);
  letter-spacing: -0.045em; margin: 0 0 14px;
  position: relative; z-index: 1;
}
.rz2-hero-t .pink {
  color: var(--rz-pink); mix-blend-mode: multiply;
  display: inline-block; transform: translate(-2px,2px);
}
.rz2-hero-t .stroke { -webkit-text-stroke: 2px var(--rz-ink); color: transparent; }
.rz2-hero-meta {
  font: 700 12px/1.5 var(--rz-mono); margin-bottom: 12px;
  position: relative; z-index: 1;
  display: flex; gap: 14px; flex-wrap: wrap;
}
.rz2-hero-meta b { color: var(--rz-pink); mix-blend-mode: multiply; font-weight: 800; letter-spacing: 0.04em; }
.rz2-hero-syn {
  font: 400 16px/1.5 var(--rz-serif);
  position: relative; z-index: 1; max-width: 30em;
  text-wrap: pretty; margin-bottom: 18px;
}
.rz2-hero-syn::first-letter {
  font: 800 56px/0.9 var(--rz-display); float: left;
  padding: 4px 8px 0 0; color: var(--rz-blue); mix-blend-mode: multiply;
}
.rz2-hero-actions { display: flex; gap: 10px; position: relative; z-index: 1; }

.rz2-btn {
  font: 700 12px/1 var(--rz-mono); letter-spacing: 0.16em;
  text-transform: uppercase; padding: 14px 18px; cursor: pointer;
  border: 3px solid var(--rz-ink); background: var(--rz-ink); color: var(--rz-paper);
  box-shadow: 3px 3px 0 var(--rz-pink);
}
.rz2-btn.pink { background: var(--rz-pink); border-color: var(--rz-ink); box-shadow: 3px 3px 0 var(--rz-blue); }
.rz2-btn.outline { background: var(--rz-paper); color: var(--rz-ink); box-shadow: 3px 3px 0 var(--rz-ink); }

.rz2-hero-r { display: flex; flex-direction: column; gap: 14px; }
.rz2-pull {
  background: var(--rz-pink); color: var(--rz-paper);
  border: 4px solid var(--rz-ink);
  padding: 22px 24px; mix-blend-mode: multiply;
  font: 700 26px/1.05 var(--rz-display); letter-spacing: -0.015em;
  transform: rotate(1.4deg);
  box-shadow: 5px 5px 0 var(--rz-blue);
}
.rz2-pull small {
  display: block; font: 600 10px/1.4 var(--rz-mono);
  letter-spacing: 0.14em; margin-top: 14px; opacity: 0.85;
}
.rz2-bside {
  background: var(--rz-blue); color: var(--rz-paper);
  border: 4px solid var(--rz-ink);
  padding: 16px; flex: 1;
  display: grid; grid-template-columns: 90px 1fr; gap: 14px;
  box-shadow: 5px 5px 0 var(--rz-pink);
  transform: rotate(-0.6deg);
  position: relative;
}
.rz2-bside .label {
  position: absolute; top: -12px; right: 14px;
  background: var(--rz-yellow); color: var(--rz-ink);
  padding: 4px 8px; mix-blend-mode: multiply;
  font: 800 10px/1 var(--rz-mono); letter-spacing: 0.16em;
  border: 2px solid var(--rz-ink); transform: rotate(2deg);
}
.rz2-bside-t { font: 800 22px/1 var(--rz-display); letter-spacing: -0.02em; margin-bottom: 6px; }
.rz2-bside-a { font: 600 11px/1.4 var(--rz-mono); opacity: 0.9; margin-bottom: 10px; }
.rz2-bside-tags { display: flex; gap: 6px; flex-wrap: wrap; font: 700 10px/1 var(--rz-mono); letter-spacing: 0.1em; }
.rz2-bside-tags span { background: var(--rz-paper); color: var(--rz-blue); padding: 4px 7px; }

/* Section heading — numbered */
.rz2-shead {
  display: flex; gap: 14px; margin: 28px 30px 14px; align-items: center;
}
.rz2-shead-no {
  font: 800 60px/1 var(--rz-display);
  color: var(--rz-pink); mix-blend-mode: multiply;
  letter-spacing: -0.05em;
  text-shadow: 4px 4px 0 var(--rz-blue);
}
.rz2-shead-t { font: 800 32px/1 var(--rz-display); letter-spacing: -0.025em; flex: 1; }
.rz2-shead-t small { display: block; font: 400 12px/1.4 var(--rz-serif); font-style: italic; color: var(--rz-mute); margin-top: 6px; letter-spacing: 0; }
.rz2-shead-link {
  font: 700 11px/1 var(--rz-mono); letter-spacing: 0.16em;
  padding: 10px 14px; background: var(--rz-ink); color: var(--rz-paper);
  cursor: pointer; box-shadow: 3px 3px 0 var(--rz-pink);
}

/* Chart — hand-typeset feel */
.rz2-chart {
  margin: 0 30px;
  background: var(--rz-paper); border: 4px solid var(--rz-ink);
  box-shadow: 6px 6px 0 var(--rz-pink);
}
.rz2-chart-row {
  display: grid; grid-template-columns: 80px 1.6fr 130px 90px 1fr 90px;
  padding: 16px 18px; gap: 18px; align-items: center;
  border-bottom: 2px solid var(--rz-ink); cursor: pointer;
  width: 100%;
}
.rz2-chart-row:last-child { border-bottom: 0; }
.rz2-chart-row:nth-child(odd) { background: rgba(255,61,139,0.10); }
.rz2-chart-row:hover { background: var(--rz-yellow); mix-blend-mode: multiply; }
.rz2-chart-rk {
  font: 800 44px/1 var(--rz-display);
  color: var(--rz-blue); letter-spacing: -0.05em;
  position: relative;
}
.rz2-chart-rk small {
  position: absolute; bottom: 2px; right: 12px;
  font: 700 9px/1 var(--rz-mono); color: var(--rz-pink); mix-blend-mode: multiply;
  letter-spacing: 0.1em;
}
.rz2-chart-t { font: 800 22px/1.05 var(--rz-display); letter-spacing: -0.015em; }
.rz2-chart-a { font: 600 11px/1.3 var(--rz-mono); color: var(--rz-mute); margin-top: 4px; }
.rz2-chart-tag { font: 700 11px/1.3 var(--rz-mono); }
.rz2-chart-tag .pill { background: var(--rz-pink); color: var(--rz-paper); padding: 3px 7px; mix-blend-mode: multiply; }
.rz2-chart-num { font: 700 13px/1 var(--rz-mono); text-align: right; }
.rz2-chart-bar {
  height: 10px; background: var(--rz-paper-2); border: 1.5px solid var(--rz-ink);
  position: relative; overflow: hidden;
}
.rz2-chart-bar::after {
  content: ""; position: absolute; inset: 0; right: var(--gap, 30%);
  background: var(--rz-blue); mix-blend-mode: multiply;
}

/* Drops — three columns */
.rz2-updates { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 0 30px; }
.rz2-up {
  border: 4px solid var(--rz-ink); background: var(--rz-paper);
  padding: 16px; cursor: pointer; position: relative;
  box-shadow: 5px 5px 0 var(--rz-blue);
}
.rz2-up:nth-child(2) { box-shadow: 5px 5px 0 var(--rz-pink); transform: rotate(-0.4deg); }
.rz2-up:nth-child(3) { box-shadow: 5px 5px 0 var(--rz-yellow); transform: rotate(0.5deg); }
.rz2-up-head { display: flex; justify-content: space-between; margin-bottom: 8px; }
.rz2-up-no { font: 700 10px/1 var(--rz-mono); letter-spacing: 0.14em; color: var(--rz-mute); }
.rz2-up-genre { background: var(--rz-blue); color: var(--rz-paper); padding: 3px 7px; mix-blend-mode: multiply; font: 700 10px/1; letter-spacing: 0.12em; }
.rz2-up-t { font: 800 24px/1.05 var(--rz-display); letter-spacing: -0.02em; }
.rz2-up-a { font: 600 11px/1.3 var(--rz-mono); color: var(--rz-mute); margin: 4px 0 12px; }
.rz2-up-chs { list-style: none; padding: 0; margin: 0; border-top: 2px dashed var(--rz-ink); }
.rz2-up-chs li {
  padding: 8px 0; border-bottom: 2px dashed var(--rz-ink);
  display: grid; grid-template-columns: 50px 1fr auto; gap: 8px;
  font: 600 12.5px/1.3 var(--rz-mono);
}
.rz2-up-chs li:last-child { border-bottom: 0; }
.rz2-up-chs .ch { color: var(--rz-pink); mix-blend-mode: multiply; font-weight: 800; }
.rz2-up-chs .when { color: var(--rz-mute); font-style: italic; }
.rz2-up-stamp {
  position: absolute; top: -10px; right: -10px;
  width: 50px; height: 50px; border-radius: 50%;
  background: var(--rz-yellow); border: 3px solid var(--rz-ink);
  font: 800 9px/1.05 var(--rz-mono); letter-spacing: 0.08em;
  display: flex; align-items: center; justify-content: center; text-align: center;
  transform: rotate(8deg); mix-blend-mode: multiply;
}

/* Recent crate */
.rz2-recents { display: grid; grid-template-columns: repeat(7, 1fr); gap: 14px; padding: 0 30px; }
.rz2-rec { cursor: pointer; }
.rz2-rec-frame {
  border: 3px solid var(--rz-ink); padding: 6px;
  background: var(--rz-paper); margin-bottom: 6px;
  box-shadow: 3px 3px 0 var(--rz-pink);
  position: relative;
}
.rz2-rec:nth-child(2n) .rz2-rec-frame { box-shadow: 3px 3px 0 var(--rz-blue); }
.rz2-rec:nth-child(3n) .rz2-rec-frame { box-shadow: 3px 3px 0 var(--rz-yellow); transform: rotate(-0.6deg); }
.rz2-rec-cap { font: 800 13px/1.1 var(--rz-display); letter-spacing: -0.01em; text-transform: uppercase; }
.rz2-rec-a { font: 600 10.5px/1.3 var(--rz-mono); color: var(--rz-mute); }

/* Footer */
.rz2-foot {
  margin: 28px 30px 30px; background: var(--rz-ink); color: var(--rz-paper);
  padding: 18px 22px;
  font: 700 11px/1.4 var(--rz-mono); letter-spacing: 0.14em;
  display: flex; justify-content: space-between; align-items: center;
  position: relative;
}
.rz2-foot::before {
  content: "PRINTED ▮ PINK + BLUE ▮ NO STAPLES ▮ PRINTED ▮ PINK + BLUE ▮ NO STAPLES ▮ ";
  position: absolute; left: 0; right: 0; top: -22px;
  white-space: nowrap; overflow: hidden;
  font: 700 11px/1 var(--rz-mono); letter-spacing: 0.16em;
  color: var(--rz-pink); mix-blend-mode: multiply;
}

/* ── SERIES PAGE ──────────────────────────────────────────── */
.rz2-back {
  margin: 24px 30px 0;
  display: inline-block;
  font: 700 11px/1 var(--rz-mono); letter-spacing: 0.16em;
  padding: 8px 12px; background: var(--rz-ink); color: var(--rz-paper);
  cursor: pointer; box-shadow: 3px 3px 0 var(--rz-pink);
}

.rz2-series {
  display: grid; grid-template-columns: 1fr 1.2fr; gap: 22px;
  padding: 18px 30px 0;
}
.rz2-series-cover {
  position: relative;
  background: var(--rz-paper); border: 4px solid var(--rz-ink);
  padding: 22px; box-shadow: 8px 8px 0 var(--rz-blue);
  transform: rotate(-1deg);
}
.rz2-series-cover::before {
  content: ""; position: absolute; inset: -22px -22px auto auto;
  width: 100px; height: 100px; border-radius: 50%;
  background: var(--rz-yellow); mix-blend-mode: multiply;
  border: 3px solid var(--rz-ink); transform: rotate(8deg);
}
.rz2-series-cover-inner {
  position: relative; aspect-ratio: 2/3;
  border: 3px solid var(--rz-ink);
}
.rz2-series-stickers {
  display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap;
  position: relative;
}
.rz2-stk {
  font: 800 10px/1 var(--rz-mono); letter-spacing: 0.14em;
  padding: 6px 9px; border: 2px solid var(--rz-ink);
  background: var(--rz-paper);
}
.rz2-stk.pk { background: var(--rz-pink); color: var(--rz-paper); mix-blend-mode: multiply; transform: rotate(-2deg); }
.rz2-stk.bl { background: var(--rz-blue); color: var(--rz-paper); mix-blend-mode: multiply; transform: rotate(1.5deg); }
.rz2-stk.yl { background: var(--rz-yellow); mix-blend-mode: multiply; transform: rotate(-1deg); }

.rz2-series-r { padding: 10px 0; }
.rz2-series-eb {
  font: 700 11px/1 var(--rz-mono); letter-spacing: 0.18em;
  color: var(--rz-blue); margin-bottom: 14px;
  display: flex; align-items: center; gap: 10px;
}
.rz2-series-eb::after {
  content: ""; flex: 1; height: 2px;
  background: repeating-linear-gradient(90deg, var(--rz-ink) 0 6px, transparent 6px 12px);
}
.rz2-series-t {
  font: 800 90px/0.82 var(--rz-display);
  letter-spacing: -0.045em; margin: 0 0 14px;
}
.rz2-series-t .pink { color: var(--rz-pink); mix-blend-mode: multiply; }
.rz2-series-t .stroke { -webkit-text-stroke: 2px var(--rz-ink); color: transparent; }
.rz2-series-by { font: 600 14px/1 var(--rz-mono); letter-spacing: 0.04em; margin-bottom: 22px; }
.rz2-series-by .yr { color: var(--rz-pink); mix-blend-mode: multiply; }

.rz2-stats {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 0; border: 4px solid var(--rz-ink); margin-bottom: 22px;
  background: var(--rz-paper);
}
.rz2-stat { padding: 14px 16px; border-right: 2px solid var(--rz-ink); }
.rz2-stat:last-child { border-right: 0; }
.rz2-stat:nth-child(odd) { background: rgba(28,45,203,0.08); }
.rz2-stat-l {
  font: 700 9px/1 var(--rz-mono); letter-spacing: 0.18em;
  color: var(--rz-blue); margin-bottom: 8px; mix-blend-mode: multiply;
}
.rz2-stat-v { font: 800 26px/1 var(--rz-display); letter-spacing: -0.02em; }
.rz2-stat-v small { font: 600 11px/1 var(--rz-mono); letter-spacing: 0.06em; color: var(--rz-mute); margin-left: 4px; }

.rz2-syn {
  font: 400 16px/1.55 var(--rz-serif);
  text-wrap: pretty; max-width: 36em; margin-bottom: 22px;
  position: relative; padding-left: 24px;
}
.rz2-syn::before {
  content: ""; position: absolute; left: 0; top: 6px; bottom: 6px;
  width: 6px; background: var(--rz-pink); mix-blend-mode: multiply;
}

.rz2-series-actions { display: flex; gap: 10px; margin-bottom: 14px; }

/* TOC — staple-bound chapter list */
.rz2-toc {
  margin: 30px 30px 0;
  background: var(--rz-paper); border: 4px solid var(--rz-ink);
  box-shadow: 6px 6px 0 var(--rz-blue);
  position: relative; padding: 8px 0;
}
.rz2-toc-head {
  display: grid; grid-template-columns: 70px 1fr 110px 110px 130px;
  gap: 16px; padding: 12px 22px;
  border-bottom: 3px solid var(--rz-ink);
  font: 700 10px/1 var(--rz-mono); letter-spacing: 0.18em;
  color: var(--rz-blue); mix-blend-mode: multiply;
}
.rz2-toc-row {
  display: grid; grid-template-columns: 70px 1fr 110px 110px 130px;
  gap: 16px; padding: 12px 22px; align-items: center;
  border-bottom: 1.5px dashed var(--rz-ink); cursor: pointer;
  font: 600 13px/1.3 var(--rz-mono);
  width: 100%; text-align: left;
}
.rz2-toc-row:last-child { border-bottom: 0; }
.rz2-toc-row:nth-child(odd) { background: rgba(28,45,203,0.06); }
.rz2-toc-row:hover { background: var(--rz-yellow); mix-blend-mode: multiply; }
.rz2-toc-num { font: 800 18px/1 var(--rz-display); color: var(--rz-pink); mix-blend-mode: multiply; letter-spacing: -0.02em; }
.rz2-toc-t { font: 700 15px/1.2 var(--rz-display); letter-spacing: -0.01em; color: var(--rz-ink); }
.rz2-toc-pages { color: var(--rz-mute); font-style: italic; }
.rz2-toc-when { color: var(--rz-mute); font-style: italic; }
.rz2-toc-status { font: 700 10px/1 var(--rz-mono); letter-spacing: 0.14em; }
.rz2-toc-status.new { color: var(--rz-pink); mix-blend-mode: multiply; }
.rz2-toc-status.read { color: var(--rz-mute); }
.rz2-toc-status .dot { display: inline-block; width: 8px; height: 8px; background: currentColor; margin-right: 6px; vertical-align: middle; border-radius: 50%; }

/* Liner notes — novel content slot */
.rz2-liner {
  margin: 22px 30px 0;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.rz2-liner-card {
  background: var(--rz-paper); border: 4px solid var(--rz-ink);
  padding: 18px; box-shadow: 5px 5px 0 var(--rz-pink);
  position: relative;
}
.rz2-liner-card:nth-child(2) { box-shadow: 5px 5px 0 var(--rz-blue); }
.rz2-liner-eb {
  font: 700 10px/1 var(--rz-mono); letter-spacing: 0.18em;
  color: var(--rz-blue); margin-bottom: 12px; mix-blend-mode: multiply;
}
.rz2-liner-t { font: 800 22px/1.1 var(--rz-display); letter-spacing: -0.015em; margin-bottom: 8px; }
.rz2-liner-body { font: 400 13.5px/1.55 var(--rz-serif); text-wrap: pretty; }
.rz2-liner-body em { color: var(--rz-pink); mix-blend-mode: multiply; font-weight: 600; font-style: normal; }

/* ── READER ───────────────────────────────────────────────── */
.rz2-reader { background: var(--rz-paper); min-height: 100%; padding-bottom: 30px; }
.rz2-reader-bar {
  display: grid; grid-template-columns: auto 1fr auto;
  gap: 18px; padding: 18px 30px;
  background: var(--rz-ink); color: var(--rz-paper);
  font: 700 11px/1 var(--rz-mono); letter-spacing: 0.14em;
  align-items: center;
}
.rz2-reader-bar a { cursor: pointer; }
.rz2-reader-bar .center {
  text-align: center; text-transform: uppercase;
  font: 800 18px/1 var(--rz-display); letter-spacing: -0.01em;
}
.rz2-reader-bar .center small {
  display: block; font: 600 10px/1.5 var(--rz-mono);
  letter-spacing: 0.16em; color: var(--rz-pink);
  mix-blend-mode: multiply; margin-top: 4px;
}

/* Folded zine — centerfold spread */
.rz2-spread {
  margin: 26px 30px 0;
  position: relative;
  display: grid; grid-template-columns: 1fr 1fr; gap: 0;
  background: var(--rz-paper);
  border: 4px solid var(--rz-ink);
  box-shadow: 8px 8px 0 var(--rz-blue);
}
.rz2-spread::after {
  content: ""; position: absolute; left: 50%; top: 0; bottom: 0;
  width: 3px; transform: translateX(-50%);
  background: repeating-linear-gradient(180deg, var(--rz-ink) 0 6px, transparent 6px 12px);
  pointer-events: none;
}
.rz2-page {
  position: relative; aspect-ratio: 2/3;
  background: var(--rz-paper-2);
  background-image:
    /* halftone */
    radial-gradient(rgba(255,61,139,0.18) 2px, transparent 2.4px),
    radial-gradient(rgba(28,45,203,0.18) 2px, transparent 2.4px),
    repeating-linear-gradient(180deg, rgba(21,20,15,0.04) 0 1px, transparent 1px 8px);
  background-size: 9px 9px, 14px 14px, auto;
  background-position: 0 0, 5px 5px, 0 0;
  padding: 22px;
  display: flex; flex-direction: column; justify-content: space-between;
  font: 600 11px/1.4 var(--rz-mono); color: var(--rz-mute);
  border-right: 2px solid var(--rz-ink);
}
.rz2-page:last-child { border-right: 0; }
.rz2-page-num {
  align-self: center; font: 700 11px/1 var(--rz-mono);
  letter-spacing: 0.18em; color: var(--rz-ink);
  background: var(--rz-paper); padding: 4px 10px; border: 2px solid var(--rz-ink);
}
.rz2-page-shape {
  flex: 1; margin: 16px 4px;
  background: var(--rz-pink); mix-blend-mode: multiply; opacity: 0.65;
  border: 3px solid var(--rz-ink);
  display: flex; align-items: center; justify-content: center;
  font: 700 12px/1.3 var(--rz-mono); color: var(--rz-paper); letter-spacing: 0.18em;
  text-align: center;
}
.rz2-page:nth-child(odd) .rz2-page-shape { background: var(--rz-blue); transform: rotate(-1deg); }
.rz2-page-cap {
  font: 600 10.5px/1.4 var(--rz-mono); letter-spacing: 0.06em;
  color: var(--rz-ink); padding: 4px 0; border-top: 2px dashed var(--rz-ink); margin-top: 8px;
  font-style: italic;
}

/* Reader controls — strip with thumbs */
.rz2-thumbs {
  margin: 22px 30px 0;
  background: var(--rz-paper); border: 4px solid var(--rz-ink);
  padding: 14px; display: flex; gap: 10px; align-items: center;
  overflow-x: auto;
  box-shadow: 5px 5px 0 var(--rz-pink);
}
.rz2-thumbs-l {
  font: 700 11px/1.2 var(--rz-mono); letter-spacing: 0.14em;
  text-transform: uppercase; padding-right: 12px; border-right: 2px solid var(--rz-ink);
  min-width: 90px;
}
.rz2-thumb {
  width: 50px; height: 70px;
  background: var(--rz-paper-2);
  background-image: radial-gradient(rgba(28,45,203,0.18) 1.5px, transparent 1.8px);
  background-size: 6px 6px;
  border: 2px solid var(--rz-ink); flex: 0 0 auto;
  position: relative; cursor: pointer;
  font: 700 9px/1 var(--rz-mono); color: var(--rz-mute);
  display: flex; align-items: end; justify-content: center; padding-bottom: 4px;
}
.rz2-thumb.curr {
  background-image: radial-gradient(rgba(255,61,139,0.4) 1.5px, transparent 1.8px);
  outline: 3px solid var(--rz-pink); outline-offset: 2px;
}

/* Reader liner notes */
.rz2-r-liner {
  margin: 22px 30px 0;
  background: var(--rz-blue); color: var(--rz-paper);
  border: 4px solid var(--rz-ink);
  padding: 18px 22px;
  display: grid; grid-template-columns: 200px 1fr; gap: 22px;
  box-shadow: 5px 5px 0 var(--rz-pink); mix-blend-mode: multiply;
}
.rz2-r-liner-eb {
  font: 700 10px/1.3 var(--rz-mono); letter-spacing: 0.18em;
}
.rz2-r-liner-eb b {
  display: block; font: 800 22px/1.05 var(--rz-display);
  letter-spacing: -0.01em; margin-top: 8px; text-transform: none;
}
.rz2-r-liner-body { font: 400 13.5px/1.55 var(--rz-serif); }
.rz2-r-liner-body em { color: var(--rz-yellow); mix-blend-mode: multiply; font-style: normal; font-weight: 700; }
`;

// ──────────────────────────────────────────────────────
// HOME
// ──────────────────────────────────────────────────────
function Rz2Home({ onOpenManga, onNavigate }) {
  const ed = window.findManga("vagabond");
  const bSide = window.findManga("berserk");
  const ranked = ["vagabond","berserk","onepiece","monster","kingdom","gachiakuta"];
  const trends = ["▲2","▲4","—","▼1","▲1","NEW"];
  const reads = [82.4, 71.0, 68.5, 54.2, 48.9, 31.7];
  const updates = [
    { id:"vagabond", chs:[
      {n:"47",t:"Harbor at dusk",w:"today"},
      {n:"46",t:"What the gulls saw",w:"4d"},
      {n:"45",t:"A letter, returned",w:"11d"},
    ]},
    { id:"gachiakuta", chs:[
      {n:"08",t:"The 4:42 passenger",w:"5h"},
      {n:"07",t:"Conductor's notes",w:"1w"},
      {n:"06",t:"South of nine",w:"2w"},
    ]},
    { id:"kingdom", chs:[
      {n:"41",t:"First bloom",w:"today"},
      {n:"40",t:"Forge silent",w:"1w"},
      {n:"39",t:"Soil, salted",w:"2w"},
    ]},
  ];
  const recents = ["fma","vinland","slamdunk","grandblue","gokuragukai","ghost-fixers","monster"];

  return (
    <div className="rz2">
      {/* registration crosses at corners */}
      <div className="rz2-reg" style={{top:8,left:8}}></div>
      <div className="rz2-reg" style={{top:8,right:8}}></div>
      <div className="rz2-reg" style={{bottom:8,left:8}}></div>
      <div className="rz2-reg" style={{bottom:8,right:8}}></div>

      <div className="rz2-top">
        <div className="rz2-logo">
          RISO<span className="slash">/</span><br/>READ
          <small>ISSUE №24 · SPR 26</small>
        </div>
        <nav className="rz2-nav">
          <a className="act" onClick={() => onNavigate("rz","home")}>/ FRONT</a>
          <a>/ STACKS</a>
          <a>/ CHART</a>
          <a>/ SCANS</a>
          <a>/ ZINE</a>
          <a>/ DROPS</a>
          <a>/ TRADE</a>
        </nav>
        <div className="rz2-issue">
          04 · 27 · 26<br/>
          ED. A · WK 17
          <div className="stamp">RUN OF ∞</div>
        </div>
      </div>

      <div className="rz2-strip">
        <span>▮ TWO-COLOR</span>
        <span>▮ PINK + BLUE</span>
        <span>▮ NO STAPLES</span>
        <span>▮ MISREGISTERED ON PURPOSE</span>
        <span>▮ FOLD HERE →</span>
        <span>▮ HAND-CUT</span>
      </div>

      <section className="rz2-hero">
        <div className="rz2-hero-l">
          <div className="rz2-hero-eb"><span className="dot"></span>SPOTLIGHT №24 · A-SIDE · WK 17</div>
          <h1 className="rz2-hero-t">
            THE <span className="stroke">GLASS</span>-<br/>
            <span className="pink">BLOWER</span>!!
          </h1>
          <div className="rz2-hero-meta">
            <span><b>BY</b> {ed.author.toUpperCase()}</span>
            <span><b>·</b> {ed.chapters} CH</span>
            <span><b>·</b> DRAMA</span>
            <span><b>·</b> ★ {ed.rating}</span>
          </div>
          <p className="rz2-hero-syn">{ed.synopsis}</p>
          <div className="rz2-hero-actions">
            <button className="rz2-btn pink" onClick={() => onOpenManga("rz", ed.id)}>▸ READ CH.01</button>
            <button className="rz2-btn outline" onClick={() => onNavigate("rz","series",ed.id)}>VIEW STACK</button>
          </div>
        </div>
        <div className="rz2-hero-r">
          <div className="rz2-pull">
            "She was<br/>shaping<br/>more than<br/>glass."
            <small>— ED.'S PULL · P.14 · CH.06</small>
          </div>
          <div className="rz2-bside" onClick={() => onNavigate("rz","series",bSide.id)}>
            <div className="label">B-SIDE</div>
            <MFCover manga={bSide} size="md" style={{width:'100%'}} />
            <div>
              <div className="rz2-bside-t">{bSide.title.toUpperCase()}</div>
              <div className="rz2-bside-a">a quiet thriller in the 4:30 light</div>
              <div className="rz2-bside-tags">
                <span>SLOW</span><span>URBAN</span><span>EERIE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="rz2-shead">
        <div className="rz2-shead-no">01.</div>
        <div className="rz2-shead-t">
          THE CHART // MOST READ
          <small>weekly tally — top six, hand-counted by the editorial collective</small>
        </div>
        <div className="rz2-shead-link">SEE ALL →</div>
      </div>
      <div className="rz2-chart">
        {ranked.map((id, i) => {
          const m = window.findManga(id);
          const max = reads[0];
          const gap = (1 - reads[i] / max) * 100;
          return (
            <button key={id} className="rz2-chart-row btn-reset" onClick={() => onNavigate("rz","series",id)}>
              <div className="rz2-chart-rk">{(i+1).toString().padStart(2,'0')}<small>{trends[i]}</small></div>
              <div>
                <div className="rz2-chart-t">{m.title.toUpperCase()}</div>
                <div className="rz2-chart-a">BY {m.author.toUpperCase()} · {m.year}</div>
              </div>
              <div className="rz2-chart-tag"><span className="pill">{m.tags[0].toUpperCase()}</span></div>
              <div className="rz2-chart-num">{m.chapters} CH</div>
              <div className="rz2-chart-bar" style={{ "--gap": gap + "%" }}></div>
              <div className="rz2-chart-num">{reads[i]}K</div>
            </button>
          );
        })}
      </div>

      <div className="rz2-shead">
        <div className="rz2-shead-no">02.</div>
        <div className="rz2-shead-t">
          DROPPED THIS WEEK
          <small>fresh chapters off the press — read while still wet</small>
        </div>
        <div className="rz2-shead-link">ALL DROPS →</div>
      </div>
      <div className="rz2-updates">
        {updates.map((u, i) => {
          const m = window.findManga(u.id);
          return (
            <button key={u.id} className="rz2-up btn-reset" onClick={() => onNavigate("rz","series",u.id)}>
              <div className="rz2-up-stamp">FRESH<br/>OFF<br/>PRESS</div>
              <div className="rz2-up-head">
                <span className="rz2-up-no">№ {(i+1).toString().padStart(2,'0')}</span>
                <span className="rz2-up-genre">{m.tags[0].toUpperCase()}</span>
              </div>
              <div className="rz2-up-t">{m.title.toUpperCase()}</div>
              <div className="rz2-up-a">BY {m.author.toUpperCase()}</div>
              <ul className="rz2-up-chs">
                {u.chs.map(c => (
                  <li key={c.n}>
                    <span className="ch">CH.{c.n}</span>
                    <span>{c.t}</span>
                    <span className="when">{c.w}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="rz2-shead">
        <div className="rz2-shead-no">03.</div>
        <div className="rz2-shead-t">
          FRESH PRINTS // THE CRATE
          <small>pulled from the back-room shelves this week</small>
        </div>
        <div className="rz2-shead-link">CRATE →</div>
      </div>
      <div className="rz2-recents">
        {recents.map(id => {
          const m = window.findManga(id);
          return (
            <button key={id} className="rz2-rec btn-reset" onClick={() => onNavigate("rz","series",id)}>
              <div className="rz2-rec-frame"><MFCover manga={m} size="md" style={{width:'100%'}} /></div>
              <div className="rz2-rec-cap">{m.title.toUpperCase()}</div>
              <div className="rz2-rec-a">{m.author}</div>
            </button>
          );
        })}
      </div>

      <div className="rz2-foot">
        <span>RISO/READ · PRINTED IN PINK + BLUE</span>
        <span>EDITION OF ∞ · SPR 26</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// SERIES
// ──────────────────────────────────────────────────────
function Rz2Series({ id, onOpenManga, onNavigate }) {
  const m = window.findManga(id);
  const titleParts = m.title.split(' ');
  const last = titleParts.pop();
  const first = titleParts.join(' ');

  // Synthesize a chapter list from m.chapters
  const chapTitles = [
    "Harbor at dusk", "What the gulls saw", "A letter, returned",
    "The ferry, late", "First snow, soft", "Brittle paper",
    "An old recipe", "Hand on the rail", "Names, half-erased",
    "The kettle whistles", "Tide pools", "Salt on the wood",
  ];

  const TOTAL_SHOWN = 10;
  const chapters = Array.from({ length: TOTAL_SHOWN }, (_, i) => {
    const num = m.chapters - i;
    const title = chapTitles[i % chapTitles.length];
    const status = i === 0 ? 'new' : i < 3 ? 'unread' : 'read';
    const when = i === 0 ? 'TODAY' : i === 1 ? '4D' : i === 2 ? '11D' : `${(i+1)*1.4|0}W`;
    const pages = m.pages + (i % 4) - 2;
    return { num, title, status, when, pages };
  });

  return (
    <div className="rz2">
      <div className="rz2-reg" style={{top:8,left:8}}></div>
      <div className="rz2-reg" style={{top:8,right:8}}></div>
      <div className="rz2-reg" style={{bottom:8,left:8}}></div>
      <div className="rz2-reg" style={{bottom:8,right:8}}></div>

      <div className="rz2-top">
        <div className="rz2-logo">
          RISO<span className="slash">/</span><br/>READ
          <small>ISSUE №24 · SPR 26</small>
        </div>
        <nav className="rz2-nav">
          <a onClick={() => onNavigate("rz","home")}>/ FRONT</a>
          <a className="act">/ STACK</a>
          <a>/ CHART</a>
          <a>/ SCANS</a>
          <a>/ ZINE</a>
        </nav>
        <div className="rz2-issue">
          MONO-<br/>GRAPH
          <div className="stamp">№ {String(MANGA_CATALOG.findIndex(x=>x.id===id)+1).padStart(2,'0')}</div>
        </div>
      </div>

      <a className="rz2-back" onClick={() => onNavigate("rz","home")}>← BACK TO FRONT</a>

      <section className="rz2-series">
        <div className="rz2-series-cover">
          <div className="rz2-series-cover-inner">
            <MFCover manga={m} size="full" />
          </div>
          <div className="rz2-series-stickers">
            <span className="rz2-stk pk">{m.tags[0].toUpperCase()}</span>
            {m.tags[1] && <span className="rz2-stk bl">{m.tags[1].toUpperCase()}</span>}
            <span className="rz2-stk yl">★ {m.rating}</span>
            <span className="rz2-stk">{m.type.toUpperCase()}</span>
          </div>
        </div>
        <div className="rz2-series-r">
          <div className="rz2-series-eb">MONOGRAPH · A-SIDE · STACK FILE</div>
          <h1 className="rz2-series-t">
            <span className="stroke">{first.toUpperCase()}</span>{first ? ' ' : ''}
            <span className="pink">{last.toUpperCase()}</span>
          </h1>
          <div className="rz2-series-by">BY {m.author.toUpperCase()} · <span className="yr">{m.year}</span> · {m.direction}</div>

          <div className="rz2-stats">
            <div className="rz2-stat">
              <div className="rz2-stat-l">CHAPTERS</div>
              <div className="rz2-stat-v">{m.chapters}<small>iss.</small></div>
            </div>
            <div className="rz2-stat">
              <div className="rz2-stat-l">AVG PAGES</div>
              <div className="rz2-stat-v">{m.pages}<small>pp</small></div>
            </div>
            <div className="rz2-stat">
              <div className="rz2-stat-l">RATING</div>
              <div className="rz2-stat-v">{m.rating}<small>/5</small></div>
            </div>
            <div className="rz2-stat">
              <div className="rz2-stat-l">FORMAT</div>
              <div className="rz2-stat-v" style={{fontSize:18}}>{m.type.toUpperCase()}</div>
            </div>
          </div>

          <p className="rz2-syn">{m.synopsis}</p>

          <div className="rz2-series-actions">
            <button className="rz2-btn pink" onClick={() => onOpenManga("rz", id)}>▸ READ CH. {m.chapters}</button>
            <button className="rz2-btn outline">+ STACK IT</button>
            <button className="rz2-btn outline">⤢ TRADE</button>
          </div>
        </div>
      </section>

      <div className="rz2-shead">
        <div className="rz2-shead-no">01.</div>
        <div className="rz2-shead-t">
          THE INDEX // EVERY ISSUE
          <small>staple-bound chronological — newest at the top, fold here</small>
        </div>
        <div className="rz2-shead-link">SORT ▾</div>
      </div>
      <div className="rz2-toc">
        <div className="rz2-toc-head">
          <span>№</span>
          <span>TITLE</span>
          <span>PAGES</span>
          <span>DROPPED</span>
          <span>STATUS</span>
        </div>
        {chapters.map((c, i) => (
          <button key={c.num} className="rz2-toc-row btn-reset" onClick={() => onOpenManga("rz", id)}>
            <span className="rz2-toc-num">{c.num.toString().padStart(2,'0')}</span>
            <span className="rz2-toc-t">{c.title}</span>
            <span className="rz2-toc-pages">{c.pages} pp</span>
            <span className="rz2-toc-when">{c.when}</span>
            <span className={`rz2-toc-status ${c.status}`}>
              <span className="dot"></span>
              {c.status === 'new' ? 'JUST OUT' : c.status === 'unread' ? 'UNREAD' : 'READ'}
            </span>
          </button>
        ))}
      </div>

      <div className="rz2-shead">
        <div className="rz2-shead-no">02.</div>
        <div className="rz2-shead-t">
          LINER NOTES
          <small>marginalia from the editorial collective + the letterer</small>
        </div>
      </div>
      <div className="rz2-liner">
        <div className="rz2-liner-card">
          <div className="rz2-liner-eb">▮ TRANSLATOR · CH.06, P.14</div>
          <div className="rz2-liner-t">"Shaping more than glass"</div>
          <div className="rz2-liner-body">
            The original phrase, <em>kioku wo fuku</em>, literally means <em>"to blow memory"</em> — a verb usually reserved for glass. We chose the looser English to keep the
            apprentice-master charge readable, and let the pull-quote on the
            spread page carry the weight.
          </div>
        </div>
        <div className="rz2-liner-card">
          <div className="rz2-liner-eb">▮ LETTERER · ALL CH.</div>
          <div className="rz2-liner-t">Hand-set type, no kerning</div>
          <div className="rz2-liner-body">
            All chapter titles are set in <em>Riso/Read House</em>, a hand-cut display we use only on Issue covers. The body remains <em>Lora Italic</em> for the synopsis voice, and <em>JetBrains Mono</em> for everything that wants to look stamped.
          </div>
        </div>
      </div>

      <div className="rz2-foot">
        <span>RISO/READ · STACK FILE №{String(MANGA_CATALOG.findIndex(x=>x.id===id)+1).padStart(2,'0')}</span>
        <span>FOLDED · STAPLED · PASSED HAND TO HAND</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// READER — folded zine spread
// ──────────────────────────────────────────────────────
function Rz2Reader({ id, onBack, onNavigate }) {
  const m = window.findManga(id);
  const { useState } = React;
  const [spreadIdx, setSpreadIdx] = useState(4); // pages 9-10
  const totalPages = m.pages;
  const totalSpreads = Math.ceil(totalPages / 2);
  const left = spreadIdx * 2 + 1;
  const right = left + 1;

  const captions = [
    "exterior. dawn. the harbor wakes.",
    "interior. the captain's hands, in light.",
  ];

  return (
    <div className="rz2 rz2-reader">
      <div className="rz2-reg" style={{top:8,left:8}}></div>
      <div className="rz2-reg" style={{top:8,right:8}}></div>

      <div className="rz2-reader-bar">
        <a onClick={() => onNavigate("rz","series",id)}>← STACK</a>
        <div className="center">
          {m.title.toUpperCase()} · CH.{m.chapters}
          <small>{captions[0].toUpperCase()} ▮ FOLD HERE</small>
        </div>
        <span>P. {left}–{right} / {totalPages}</span>
      </div>

      <div className="rz2-spread">
        <div className="rz2-page" style={{ overflow: "hidden" }}>
          {m.panels && m.panels[(left - 1) % (m.panels.length || 1)] && (
            <img
              src={m.panels[(left - 1) % (m.panels.length || 1)]}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                mixBlendMode: "multiply",
                opacity: 0.85,
                zIndex: 0,
              }}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          )}
          <div className="rz2-page-num" style={{ position: "relative", zIndex: 1 }}>— {String(left).padStart(2,'0')} —</div>
          {!m.panels?.length && (
            <div className="rz2-page-shape" style={{ position: "relative", zIndex: 1 }}>[ PAGE {left} ARTWORK ]<br/>{captions[0].toUpperCase()}</div>
          )}
          <div className="rz2-page-cap" style={{ position: "relative", zIndex: 1 }}>{captions[0]} — riso pink, single layer</div>
        </div>
        <div className="rz2-page" style={{ overflow: "hidden" }}>
          {m.panels && m.panels[(right - 1) % (m.panels.length || 1)] && (
            <img
              src={m.panels[(right - 1) % (m.panels.length || 1)]}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                mixBlendMode: "multiply",
                opacity: 0.85,
                zIndex: 0,
              }}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          )}
          <div className="rz2-page-num" style={{ position: "relative", zIndex: 1 }}>— {String(right).padStart(2,'0')} —</div>
          {!m.panels?.length && (
            <div className="rz2-page-shape" style={{ position: "relative", zIndex: 1 }}>[ PAGE {right} ARTWORK ]<br/>{captions[1].toUpperCase()}</div>
          )}
          <div className="rz2-page-cap" style={{ position: "relative", zIndex: 1 }}>{captions[1]} — riso blue, second pass</div>
        </div>
      </div>

      <div className="rz2-thumbs">
        <div className="rz2-thumbs-l">SPREAD<br/>{spreadIdx+1}/{totalSpreads}</div>
        {Array.from({ length: Math.min(totalSpreads, 14) }).map((_, i) => (
          <div
            key={i}
            className={`rz2-thumb${i === spreadIdx ? ' curr' : ''}`}
            onClick={() => setSpreadIdx(i)}
          >
            {i*2+1}
          </div>
        ))}
        <button className="rz2-btn outline" style={{marginLeft:'auto'}} onClick={() => setSpreadIdx(Math.min(totalSpreads-1, spreadIdx+1))}>NEXT ▸</button>
      </div>

      <div className="rz2-r-liner">
        <div className="rz2-r-liner-eb">
          ▮ EDITOR'S MARGINS
          <b>p. {left}, panel 3</b>
        </div>
        <div className="rz2-r-liner-body">
          The captain's reply, <em>"shōganai na"</em>, has no clean English. We let it land as <em>"well — what's done is done,"</em> with the dash bearing the weight of his exhaling. The pink overprint on this spread is intentional misregistration — about 1.5mm off — to mimic the early Issue 02 print run.
        </div>
      </div>

      <div className="rz2-foot" style={{marginTop:30}}>
        <span>READER · {m.title.toUpperCase()}</span>
        <span>CH. {m.chapters} · P. {left}–{right}</span>
      </div>
    </div>
  );
}

window.RZ2_STYLE = RZ2_STYLE;
window.Rz2Home = Rz2Home;
window.Rz2Series = Rz2Series;
window.Rz2Reader = Rz2Reader;
