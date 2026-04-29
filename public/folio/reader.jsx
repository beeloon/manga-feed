// Reader screen — single page, double page, vertical scroll modes.
// Auto-hide chrome OR persistent slim chrome (user-toggleable).

const { useState: useStateReader, useEffect: useEffectReader, useRef: useRefReader, useCallback: useCallbackReader } = React;

function ReaderPage({ pageNum, totalPages, accent, baseColor, mode, side, panelImg }) {
  // Real chapter pages now drive the reader. When an image is present, show only
  // the image (no decorative page-number/"of N" overlay). Without an image we
  // fall back to the original placeholder treatment.
  const tone = baseColor;
  const aspect = mode === "vertical" ? "1/1.4" : "1/1.5";
  if (panelImg) {
    return (
      <div
        className="reader-page reader-page--real"
        style={{
          background: "#1a1a1a",
          aspectRatio: mode === "vertical" ? "auto" : aspect,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={panelImg}
          alt=""
          loading="lazy"
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "100%",
            width: mode === "vertical" ? "100%" : "auto",
            height: mode === "vertical" ? "auto" : "100%",
            objectFit: "contain",
          }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>
    );
  }
  return (
    <div
      className="reader-page"
      style={{
        background: tone,
        aspectRatio: aspect,
        position: "relative",
      }}
    >
      <div
        className="reader-page-inner"
        style={{
          color: accent,
          opacity: 0.6,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="reader-page-num">
          {pageNum.toString().padStart(2, "0")}
        </div>
        <div className="reader-page-of">
          of {totalPages}
        </div>
      </div>
      {side && (
        <div className="reader-page-side">{side}</div>
      )}
      <div className="reader-frame-hint" style={{ borderColor: accent }} />
    </div>
  );
}

function Reader({ mangaId, onBack, layout, chromeMode }) {
  const manga = window.findManga(mangaId);
  const [chapter, setChapter] = useStateReader(1);
  const [page, setPage] = useStateReader(1);
  const [chromeVisible, setChromeVisible] = useStateReader(true);
  const [showChapters, setShowChapters] = useStateReader(false);
  const [showNotes, setShowNotes] = useStateReader(false);
  const [zoom, setZoom] = useStateReader(100);
  const [bookmarkedPages, setBookmarkedPages] = useStateReader(new Set([3, 7]));
  // In-reader layout override. Initialized from the tweaks panel prop, but the
  // user can switch single/double/vertical from the reader chrome itself.
  const [layoutMode, setLayoutMode] = useStateReader(layout || "double");
  useEffectReader(() => { setLayoutMode(layout || "double"); }, [layout]);
  const total = manga.pages;
  const verticalRef = useRefReader(null);

  // Auto-hide on idle in "auto" chrome mode
  useEffectReader(() => {
    if (chromeMode !== "auto") {
      setChromeVisible(true);
      return;
    }
    let t;
    const reveal = () => {
      setChromeVisible(true);
      clearTimeout(t);
      t = setTimeout(() => setChromeVisible(false), 2400);
    };
    reveal();
    window.addEventListener("mousemove", reveal);
    window.addEventListener("keydown", reveal);
    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", reveal);
      window.removeEventListener("keydown", reveal);
    };
  }, [chromeMode]);

  // Keyboard nav
  useEffectReader(() => {
    const onKey = (e) => {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "Escape") onBack();
      if (e.key === "b") toggleBookmark();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const nextPage = () => {
    if (layoutMode === "double") {
      setPage((p) => Math.min(total, p + 2));
    } else {
      setPage((p) => Math.min(total, p + 1));
    }
  };
  const prevPage = () => {
    if (layoutMode === "double") {
      setPage((p) => Math.max(1, p - 2));
    } else {
      setPage((p) => Math.max(1, p - 1));
    }
  };
  const toggleBookmark = () => {
    setBookmarkedPages((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  };

  const isVertical = layoutMode === "vertical";
  const isDouble = layoutMode === "double";

  // For vertical, track scroll for the progress
  const [verticalProgress, setVerticalProgress] = useStateReader(0);
  useEffectReader(() => {
    if (!isVertical) return;
    const el = verticalRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrolled = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
      setVerticalProgress(scrolled);
      // estimate page
      const estPage = Math.min(total, Math.max(1, Math.round(scrolled * total)));
      setPage(estPage);
    };
    el.addEventListener("scroll", onScroll);
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [isVertical, total]);

  const progressPct = isVertical ? verticalProgress * 100 : (page / total) * 100;

  return (
    <div className="reader-root">
      {/* Top chrome */}
      <div className={`reader-top ${chromeVisible ? "visible" : ""}`}>
        <div className="reader-top-left">
          <button className="reader-icon-btn" onClick={onBack} title="Back to library">
            <span style={{ fontSize: 18 }}>←</span>
          </button>
          <div className="reader-top-title">
            <div className="reader-top-name">{manga.title}</div>
            <div className="reader-top-meta">
              <span>Ch. {chapter}</span>
              <span className="meta-dot">·</span>
              <span>{manga.author}</span>
              <span className="meta-dot">·</span>
              <span className="reader-direction">{manga.direction === "RTL" ? "right → left" : "top ↓ bottom"}</span>
            </div>
          </div>
        </div>
        <div className="reader-top-right">
          <div className="reader-layout-switch" style={{ display: "flex", gap: 4, marginRight: 8, padding: 2, borderRadius: 6, background: "rgba(0,0,0,0.06)" }}>
            {[
              { v: "single",   label: "Single" },
              { v: "double",   label: "Double" },
              { v: "vertical", label: "Scroll" },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => setLayoutMode(opt.v)}
                title={`${opt.label} layout`}
                style={{
                  border: "none",
                  background: layoutMode === opt.v ? "var(--accent)" : "transparent",
                  color: layoutMode === opt.v ? "#fff" : "inherit",
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: 11,
                  letterSpacing: "0.04em",
                  fontFamily: "var(--font-mono)",
                  cursor: "pointer",
                }}
              >{opt.label}</button>
            ))}
          </div>
          <button className="reader-icon-btn" onClick={() => setShowChapters((v) => !v)} title="Chapters">
            ☰
          </button>
          <button
            className={`reader-icon-btn ${bookmarkedPages.has(page) ? "active" : ""}`}
            onClick={toggleBookmark}
            title="Bookmark this page"
          >
            ❏
          </button>
          <button className="reader-icon-btn" onClick={() => setShowNotes((v) => !v)} title="Notes">
            ✎
          </button>
          <div className="reader-zoom">
            <button onClick={() => setZoom((z) => Math.max(60, z - 10))}>−</button>
            <span>{zoom}%</span>
            <button onClick={() => setZoom((z) => Math.min(160, z + 10))}>+</button>
          </div>
        </div>
      </div>

      {/* Pages canvas */}
      {isVertical ? (
        <div className="reader-vertical" ref={verticalRef}>
          <div className="reader-vertical-inner" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            <div className="reader-chapter-divider">
              <span>Chapter {chapter}</span>
            </div>
            {Array.from({ length: total }, (_, i) => (
              <ReaderPage
                key={i}
                pageNum={i + 1}
                totalPages={total}
                accent={manga.accent}
                baseColor={manga.cover}
                mode="vertical"
                panelImg={manga.panels[i % (manga.panels.length || 1)]}
              />
            ))}
            <div className="reader-chapter-end">
              <div className="end-rule" />
              <div className="end-label">End of chapter {chapter}</div>
              <button className="btn-primary" onClick={() => setChapter((c) => c + 1)}>
                Next chapter →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="reader-paged">
          <button className="reader-edge reader-edge-left" onClick={manga.direction === "RTL" ? nextPage : prevPage} aria-label="Previous">
            <span>‹</span>
          </button>
          <div className="reader-stage" style={{ transform: `scale(${zoom / 100})` }}>
            {isDouble ? (
              <div className="reader-spread">
                {/* For RTL manga, page on right is the "first" page of the spread */}
                {manga.direction === "RTL" ? (
                  <>
                    <ReaderPage pageNum={Math.min(total, page + 1)} totalPages={total} accent={manga.accent} baseColor={manga.cover} side="L" panelImg={manga.panels[(Math.min(total, page + 1) - 1) % (manga.panels.length || 1)]} />
                    <ReaderPage pageNum={page} totalPages={total} accent={manga.accent} baseColor={manga.cover} side="R" panelImg={manga.panels[(page - 1) % (manga.panels.length || 1)]} />
                  </>
                ) : (
                  <>
                    <ReaderPage pageNum={page} totalPages={total} accent={manga.accent} baseColor={manga.cover} side="L" panelImg={manga.panels[(page - 1) % (manga.panels.length || 1)]} />
                    <ReaderPage pageNum={Math.min(total, page + 1)} totalPages={total} accent={manga.accent} baseColor={manga.cover} side="R" panelImg={manga.panels[(Math.min(total, page + 1) - 1) % (manga.panels.length || 1)]} />
                  </>
                )}
              </div>
            ) : (
              <ReaderPage pageNum={page} totalPages={total} accent={manga.accent} baseColor={manga.cover} panelImg={manga.panels[(page - 1) % (manga.panels.length || 1)]} />
            )}
          </div>
          <button className="reader-edge reader-edge-right" onClick={manga.direction === "RTL" ? prevPage : nextPage} aria-label="Next">
            <span>›</span>
          </button>
        </div>
      )}

      {/* Bottom chrome */}
      <div className={`reader-bottom ${chromeVisible ? "visible" : ""}`}>
        <div className="reader-bottom-inner">
          <div className="reader-bottom-left">
            <span className="page-counter">
              <span className="page-current">{page.toString().padStart(2, "0")}</span>
              <span className="page-sep">/</span>
              <span className="page-total">{total.toString().padStart(2, "0")}</span>
            </span>
          </div>
          <div className="reader-progress-track" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            setPage(Math.max(1, Math.min(total, Math.round(pct * total))));
          }}>
            <div className="reader-progress-fill" style={{ width: `${progressPct}%` }} />
            {/* bookmark ticks */}
            {[...bookmarkedPages].map((p) => (
              <div
                key={p}
                className="reader-progress-bookmark"
                style={{ left: `${(p / total) * 100}%` }}
                title={`Bookmark · page ${p}`}
              />
            ))}
          </div>
          <div className="reader-bottom-right">
            <button className="reader-text-btn" onClick={() => setChapter((c) => Math.max(1, c - 1))}>
              ← Prev ch.
            </button>
            <button className="reader-text-btn" onClick={() => setChapter((c) => c + 1)}>
              Next ch. →
            </button>
          </div>
        </div>
      </div>

      {/* Chapter drawer */}
      {showChapters && (
        <>
          <div className="reader-scrim" onClick={() => setShowChapters(false)} />
          <aside className="reader-drawer">
            <div className="drawer-head">
              <div>
                <div className="drawer-eyebrow">CONTENTS</div>
                <div className="drawer-title">{manga.title}</div>
              </div>
              <button className="reader-icon-btn" onClick={() => setShowChapters(false)}>×</button>
            </div>
            <div className="drawer-list">
              {Array.from({ length: 12 }, (_, i) => {
                const ch = manga.chapters - i;
                if (ch < 1) return null;
                const isCurrent = ch === chapter;
                return (
                  <button
                    key={ch}
                    className={`drawer-item ${isCurrent ? "current" : ""}`}
                    onClick={() => { setChapter(ch); setPage(1); setShowChapters(false); }}
                  >
                    <span className="drawer-num">{ch.toString().padStart(3, "0")}</span>
                    <span className="drawer-name">Chapter {ch}</span>
                    <span className="drawer-when">{i === 0 ? "today" : `${i * 4}d ago`}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        </>
      )}

      {/* Notes panel */}
      {showNotes && (
        <>
          <div className="reader-scrim" onClick={() => setShowNotes(false)} />
          <aside className="reader-drawer reader-drawer-right">
            <div className="drawer-head">
              <div>
                <div className="drawer-eyebrow">NOTES · PAGE {page.toString().padStart(2, "0")}</div>
                <div className="drawer-title">Margin</div>
              </div>
              <button className="reader-icon-btn" onClick={() => setShowNotes(false)}>×</button>
            </div>
            <div className="notes-body">
              <div className="note-item">
                <div className="note-meta">page 03 · 2 days ago</div>
                <div className="note-text">The way the harbor is described in the opening — “smaller than expected” — recurs in chapter 12.</div>
              </div>
              <div className="note-item">
                <div className="note-meta">page 07 · last week</div>
                <div className="note-text">She does not look at him. She looks at the rope.</div>
              </div>
              <textarea
                className="note-input"
                placeholder={`Add a note for page ${page.toString().padStart(2, "0")}…`}
              />
              <button className="btn-ghost note-save">Save note</button>
            </div>
          </aside>
        </>
      )}

      {/* Edge progress (the "minimal but unexpected" reader detail) */}
      <div className="reader-edge-progress" aria-hidden="true">
        <div className="reader-edge-progress-fill" style={{ height: `${progressPct}%` }} />
      </div>
    </div>
  );
}

window.Reader = Reader;
