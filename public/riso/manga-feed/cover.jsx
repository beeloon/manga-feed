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
      {showMeta && (
        <div className="cv-meta">
          {manga.type} · {manga.year}
        </div>
      )}
      <div>
        <div className="cv-stripe" />
        <div className="cv-title">{manga.title}</div>
      </div>
    </div>
  );
}

window.MFCover = MFCover;
