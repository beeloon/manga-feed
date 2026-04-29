// Cover component — solid warm-tone block with editorial title typography.
// Original visual treatment, no series imagery.

const { useMemo } = React;

function Cover({ manga, size = "md", showMeta = false, style = {} }) {
  const dims = {
    xs: { w: 80, h: 116, titleSize: 11, authorSize: 8 },
    sm: { w: 132, h: 196, titleSize: 14, authorSize: 9 },
    md: { w: 188, h: 278, titleSize: 19, authorSize: 11 },
    lg: { w: 260, h: 384, titleSize: 26, authorSize: 13 },
    xl: { w: 360, h: 528, titleSize: 36, authorSize: 15 },
    hero: { w: 420, h: 560, titleSize: 44, authorSize: 17 },
  }[size];

  // deterministic small offset to give variety in the title placement
  const offset = useMemo(() => {
    let h = 0;
    for (let i = 0; i < manga.id.length; i++) h = (h * 31 + manga.id.charCodeAt(i)) | 0;
    return Math.abs(h) % 4;
  }, [manga.id]);

  const placements = [
    { top: "10%", left: "10%", right: "10%", textAlign: "left" },
    { bottom: "12%", left: "10%", right: "10%", textAlign: "left" },
    { top: "14%", left: "10%", right: "10%", textAlign: "right" },
    { bottom: "12%", left: "10%", right: "10%", textAlign: "center" },
  ];
  const placement = placements[offset];

  return (
    <div
      style={{
        width: dims.w,
        height: dims.h,
        background: manga.cover,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)",
        ...style,
      }}
    >
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
            display: "block",
            zIndex: 1,
          }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      )}
      {/* Subtle grain texture using radial-gradient layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.04), transparent 60%), radial-gradient(circle at 80% 90%, rgba(0,0,0,0.18), transparent 70%)`,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      {!manga.coverImg && (
        <>
          {/* Hairline accent rule */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "10%",
              width: "20%",
              height: 1,
              background: manga.accent,
              opacity: 0.55,
              zIndex: 2,
            }}
          />
          {/* Title block */}
          <div
            style={{
              position: "absolute",
              ...placement,
              color: manga.accent,
              fontFamily: "'Newsreader', Georgia, serif",
              fontWeight: 500,
              fontSize: dims.titleSize,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              zIndex: 2,
            }}
          >
            <div style={{ textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontSize: Math.max(8, dims.authorSize - 2), letterSpacing: "0.18em", opacity: 0.7, marginBottom: 6, fontWeight: 400 }}>
              № {manga.chapters.toString().padStart(3, "0")}
            </div>
            <div style={{ fontStyle: "italic" }}>{manga.title}</div>
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: dims.authorSize,
                fontStyle: "normal",
                fontWeight: 400,
                opacity: 0.7,
                marginTop: 6,
                letterSpacing: "0.04em",
              }}
            >
              {manga.author}
            </div>
          </div>
        </>
      )}

      {showMeta && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: manga.accent,
            opacity: 0.5,
            letterSpacing: "0.1em",
            zIndex: 2,
          }}
        >
          {manga.year}
        </div>
      )}
    </div>
  );
}

window.Cover = Cover;
