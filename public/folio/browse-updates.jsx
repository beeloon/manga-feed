// Browse and Updates pages — sparse, editorial, library-feel.

const { useState: useStateBrowse } = React;

function BrowseScreen({ onOpenManga, onNavigate }) {
  const [genre, setGenre] = useStateBrowse("All");
  const [type, setType] = useStateBrowse("All");
  const [sort, setSort] = useStateBrowse("Recently updated");

  const allGenres = ["All", "Slice of life", "Drama", "Mystery", "Romance", "Sci-fi", "Fantasy", "Horror", "Adventure", "Historical"];
  const allTypes = ["All", "Manga", "Webtoon"];

  const filtered = window.MANGA_CATALOG.filter((m) => {
    if (genre !== "All" && !m.tags.includes(genre)) return false;
    if (type !== "All" && m.type !== type) return false;
    return true;
  });

  // featured first three for editorial strip
  const featured = window.MANGA_CATALOG.slice(0, 3);

  return (
    <div className="home-root">
      <SiteHeader active="browse" onNavigate={onNavigate} />

      {/* Editorial header */}
      <section className="page-head">
        <div className="page-head-left">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            The full library · {window.MANGA_CATALOG.length} titles
          </div>
          <h1 className="page-title">
            <span className="hero-title-it">Browse</span>{" "}
            <span className="hero-title-light">the shelves.</span>
          </h1>
          <p className="page-sub">
            Filter by genre, type, or what was updated this week. Everything is shelved by hand.
          </p>
        </div>
        <div className="page-head-right">
          <div className="stat">
            <div className="stat-num">{window.MANGA_CATALOG.filter(m => m.type === "Manga").length}</div>
            <div className="stat-label">manga</div>
          </div>
          <div className="stat-rule" />
          <div className="stat">
            <div className="stat-num">{window.MANGA_CATALOG.filter(m => m.type === "Webtoon").length}</div>
            <div className="stat-label">webtoons</div>
          </div>
          <div className="stat-rule" />
          <div className="stat">
            <div className="stat-num">{window.MANGA_CATALOG.reduce((s, m) => s + m.chapters, 0)}</div>
            <div className="stat-label">chapters total</div>
          </div>
        </div>
      </section>

      {/* Featured editorial strip — the "unexpected" moment for browse */}
      <section className="featured-strip">
        {featured.map((m, i) => (
          <button key={m.id} className="featured-card" onClick={() => onOpenManga(m.id)}>
            <div className="featured-num">№ {(i + 1).toString().padStart(2, "0")}</div>
            <Cover manga={m} size="md" />
            <div className="featured-meta">
              <div className="featured-title">{m.title}</div>
              <div className="featured-author">{m.author}</div>
              <div className="featured-syn">{m.synopsis}</div>
              <div className="featured-tags">
                {m.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </button>
        ))}
      </section>

      {/* Filters */}
      <section className="browse-filters">
        <div className="filter-group">
          <div className="filter-label">Genre</div>
          <div className="filter-chips">
            {allGenres.map(g => (
              <button key={g} className={`filter ${genre === g ? "active" : ""}`} onClick={() => setGenre(g)}>{g}</button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-label">Type</div>
          <div className="filter-chips">
            {allTypes.map(t => (
              <button key={t} className={`filter ${type === t ? "active" : ""}`} onClick={() => setType(t)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-label">Sort</div>
          <div className="filter-chips">
            {["Recently updated", "Alphabetical", "Highest rated", "Most chapters"].map(s => (
              <button key={s} className={`filter ${sort === s ? "active" : ""}`} onClick={() => setSort(s)}>{s}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Results count */}
      <div className="result-count">
        <span className="result-count-num">{filtered.length}</span> titles
        {genre !== "All" && <span> in <em>{genre}</em></span>}
        {type !== "All" && <span> · {type.toLowerCase()}</span>}
      </div>

      {/* Grid */}
      <section className="section browse-grid-section">
        <div className="grid">
          {filtered.map((m) => (
            <button key={m.id} className="grid-item" onClick={() => onOpenManga(m.id)}>
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
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-rule" />
            <div className="empty-label">No titles match these filters.</div>
            <button className="btn-ghost" onClick={() => { setGenre("All"); setType("All"); }}>Clear filters</button>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}

function UpdatesScreen({ onOpenManga, onNavigate }) {
  // Build mock update timeline
  const updates = [
    { day: "Today", entries: [
      { id: "vagabond", chapter: 312, time: "06:14", note: "New chapter" },
      { id: "gachiakuta", chapter: 124, time: "04:02", note: "New chapter" },
    ]},
    { day: "Yesterday", entries: [
      { id: "berserk", chapter: 364, time: "22:48", note: "New chapter" },
      { id: "kingdom", chapter: 798, time: "14:33", note: "Final chapter of arc" },
      { id: "ghost-fixers", chapter: 12, time: "09:11", note: "New chapter" },
    ]},
    { day: "April 25", entries: [
      { id: "onepiece", chapter: 1100, time: "20:02", note: "New chapter" },
      { id: "vinland", chapter: 207, time: "11:40", note: "Bonus interlude" },
    ]},
    { day: "April 24", entries: [
      { id: "gokuragukai", chapter: 28, time: "18:55", note: "New chapter" },
      { id: "grandblue", chapter: 88, time: "12:00", note: "Volume 5 begins" },
      { id: "fma", chapter: 108, time: "08:15", note: "Reissue chapter" },
    ]},
    { day: "April 23", entries: [
      { id: "slamdunk", chapter: 276, time: "17:30", note: "Anniversary edition" },
      { id: "monster", chapter: 162, time: "02:11", note: "Restoration chapter · long" },
    ]},
  ];

  return (
    <div className="home-root">
      <SiteHeader active="updates" onNavigate={onNavigate} />

      {/* Header */}
      <section className="page-head">
        <div className="page-head-left">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Last seven days
          </div>
          <h1 className="page-title">
            <span className="hero-title-it">What's new,</span>{" "}
            <span className="hero-title-light">in order.</span>
          </h1>
          <p className="page-sub">
            A quiet log of every chapter that landed since you were last here.
          </p>
        </div>
        <div className="page-head-right">
          <div className="stat">
            <div className="stat-num">{updates.reduce((s, d) => s + d.entries.length, 0)}</div>
            <div className="stat-label">new chapters</div>
          </div>
          <div className="stat-rule" />
          <div className="stat">
            <div className="stat-num">{new Set(updates.flatMap(d => d.entries.map(e => e.id))).size}</div>
            <div className="stat-label">titles updated</div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline">
        {updates.map((day, di) => (
          <div key={day.day} className="timeline-day">
            <div className="timeline-day-head">
              <div className="timeline-rail">
                <div className="timeline-dot" />
                <div className="timeline-line" />
              </div>
              <div>
                <div className="timeline-day-label">{day.day}</div>
                <div className="timeline-day-count">{day.entries.length} chapter{day.entries.length === 1 ? "" : "s"}</div>
              </div>
            </div>
            <div className="timeline-entries">
              {day.entries.map((entry) => {
                const m = window.findManga(entry.id);
                return (
                  <button key={entry.id + entry.chapter} className="timeline-entry" onClick={() => onOpenManga(entry.id)}>
                    <div className="timeline-time">{entry.time}</div>
                    <div className="timeline-cover">
                      <Cover manga={m} size="xs" />
                    </div>
                    <div className="timeline-meta">
                      <div className="timeline-title">{m.title}</div>
                      <div className="timeline-sub">
                        Chapter {entry.chapter} <span className="meta-dot">·</span> {entry.note}
                      </div>
                      <div className="timeline-tags">
                        {m.tags.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                    </div>
                    <div className="timeline-action">
                      <span className="timeline-cta">Read →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="timeline-end">
          <div className="end-rule" />
          <div className="end-label">End of recent updates</div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

// Shared header / footer so all pages match
function SiteHeader({ active, onNavigate }) {
  const links = [
    { id: "library", label: "Library" },
    { id: "browse", label: "Browse" },
    { id: "updates", label: "Updates" },
    { id: "notes", label: "Notes" },
  ];
  return (
    <header className="home-nav">
      <div className="home-nav-inner">
        <button className="home-brand" onClick={() => onNavigate("library")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <span className="brand-mark">◐</span>
          <span className="brand-name">Folio</span>
          <span className="brand-sub">a reading library</span>
        </button>
        <nav className="home-nav-links">
          {links.map(l => (
            <a key={l.id} className={`home-nav-link ${active === l.id ? "active" : ""}`} onClick={() => onNavigate(l.id)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="home-nav-right">
          <div className="search-pill">
            <span className="search-icon">⌕</span>
            <input placeholder="Search the library" />
            <span className="search-kbd">⌘K</span>
          </div>
          <div className="avatar">RI</div>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="home-footer">
      <div className="footer-rule" />
      <div className="footer-grid">
        <div className="footer-brand">
          <span className="brand-mark">◐</span>
          <span className="brand-name">Folio</span>
        </div>
        <div className="footer-cols">
          <div>
            <div className="footer-h">Read</div>
            <a>Library</a><a>Updates</a><a>Bookmarks</a>
          </div>
          <div>
            <div className="footer-h">Settings</div>
            <a>Reader</a><a>Theme</a><a>Shortcuts</a>
          </div>
          <div>
            <div className="footer-h">About</div>
            <a>The project</a><a>Contributors</a><a>Changelog</a>
          </div>
        </div>
        <div className="footer-meta">
          <div>FOLIO</div>
          <div className="footer-meta-sub">A library for reading, made for evenings.</div>
          <div className="footer-issue">№ 0.14 · 04.2026</div>
        </div>
      </div>
    </footer>
  );
}

window.BrowseScreen = BrowseScreen;
window.UpdatesScreen = UpdatesScreen;
window.SiteHeader = SiteHeader;
window.SiteFooter = SiteFooter;
