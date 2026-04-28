// Discovery / Home screen — sparse, editorial, library-feel.

const { useState: useStateHome, useEffect: useEffectHome, useRef: useRefHome } = React;

function HomeScreen({ onOpenManga, onNavigate }) {
  const [activeFilter, setActiveFilter] = useStateHome("All");
  const filters = ["All", "Manga", "Webtoon", "Updated", "Bookmarked"];

  const editorial = window.findManga(window.EDITORIAL_PICK.id);

  return (
    <div className="home-root">
      <window.SiteHeader active="library" onNavigate={onNavigate} />

      {/* Editorial hero — the "minimal but unexpected" moment */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              {window.EDITORIAL_PICK.byline}
            </div>
            <h1 className="hero-title">
              <span className="hero-title-it">{editorial.title},</span>
              <br />
              <span className="hero-title-light">read slowly.</span>
            </h1>
            <p className="hero-pull">
              <span className="pull-quote">“</span>
              {window.EDITORIAL_PICK.pull}
            </p>
            <div className="hero-meta">
              <span>{editorial.author}</span>
              <span className="meta-dot">·</span>
              <span>{editorial.chapters} chapters</span>
              <span className="meta-dot">·</span>
              <span>{editorial.year}</span>
            </div>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => onOpenManga(editorial.id)}>
                Begin reading
                <span className="btn-arrow">→</span>
              </button>
              <button className="btn-ghost">Add to library</button>
            </div>
          </div>
          <div className="hero-right">
            <Cover manga={editorial} size="hero" />
            <div className="hero-spine">
              <div className="spine-line" />
              <div className="spine-label">FOLIO · ISSUE 14 · SPRING 26</div>
              <div className="spine-line" />
            </div>
          </div>
        </div>
      </section>

      {/* Continue reading — horizontal */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="section-eyebrow">Where you left off</div>
            <h2 className="section-title">Continue reading</h2>
          </div>
          <a className="section-link">See history →</a>
        </div>
        <div className="continue-row">
          {window.CONTINUE_READING.map((entry) => {
            const m = window.findManga(entry.id);
            const pct = Math.round((entry.page / entry.ofPages) * 100);
            return (
              <button key={entry.id} className="continue-card" onClick={() => onOpenManga(entry.id)}>
                <Cover manga={m} size="sm" />
                <div className="continue-meta">
                  <div className="continue-title">{m.title}</div>
                  <div className="continue-sub">Ch. {entry.chapter} · page {entry.page} of {entry.ofPages}</div>
                  <div className="progress">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="continue-when">{entry.when}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filters">
          {filters.map((f) => (
            <button
              key={f}
              className={`filter ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
          <div className="filter-spacer" />
          <button className="sort-btn">
            Sorted by <em>recently updated</em> ↓
          </button>
        </div>
      </section>

      {/* Collections */}
      {window.COLLECTIONS.map((col, idx) => (
        <section key={col.id} className="section collection">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Collection №{(idx + 1).toString().padStart(2, "0")}</div>
              <h2 className="section-title">{col.title}</h2>
              <div className="section-sub">{col.subtitle}</div>
            </div>
            <a className="section-link">View all →</a>
          </div>
          <div className="grid">
            {col.ids.map((id) => {
              const m = window.findManga(id);
              return (
                <button key={id} className="grid-item" onClick={() => onOpenManga(id)}>
                  <Cover manga={m} size="md" />
                  <div className="grid-meta">
                    <div className="grid-title">{m.title}</div>
                    <div className="grid-sub">
                      {m.author} <span className="meta-dot">·</span> {m.tags[0]}
                    </div>
                    <div className="grid-row">
                      <span className="tag">{m.type}</span>
                      <span className="grid-rating">★ {m.rating}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {/* Footer */}
      <window.SiteFooter />
    </div>
  );
}

window.HomeScreen = HomeScreen;
