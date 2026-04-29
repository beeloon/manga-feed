// Shared striped-placeholder cover. Used everywhere a manga cover would go.
// We don't try to draw real art — we place a tinted, banded card with a
// monospaced label so it's obvious it's a stand-in.

function MFCover({ manga, size = "md", showMeta = true, style }) {
  const cssVars = {
    "--cv-bg": manga.cover,
    "--cv-fg": manga.accent,
    "--cv-accent": manga.accent,
    ...style,
  };
  return (
    <div className={`cv ${size}`} style={cssVars} aria-label={`${manga.title} cover placeholder`}>
      {manga.coverImg && (
        <img
          src={manga.coverImg}
          alt={manga.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "multiply",
            filter: "contrast(1.05)",
            zIndex: 1,
          }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      )}
      {showMeta && (
        <div className="cv-meta" style={{ position: "relative", zIndex: 2 }}>
          {manga.type} · {manga.year}
        </div>
      )}
      {!manga.coverImg && (
        <div>
          <div className="cv-stripe" />
          <div className="cv-title">{manga.title}</div>
        </div>
      )}
    </div>
  );
}

window.MFCover = MFCover;
