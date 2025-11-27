export default function RenderLines({ lines }: { lines: RenderLine[] }) {
  return (
    <>
      {lines.map((ln, idx) => {
        const style: React.CSSProperties = {
          fontSize: ln.fontSize,
          fontWeight: ln.fontWeight,
          fontStyle: ln.fontStyle,
          lineHeight: `${ln.lineHeight}px`,
          marginTop: ln.marginTop ?? 0,
          marginBottom: ln.marginBottom ?? 0,
          whiteSpace: "normal",
          wordBreak: "break-word",
        };

        // special rendering for skills lines (we rendered tags joined by space) -> render as tag spans
        if (isSkillsLine(ln)) {
          const tags = ln.text.split(/\s+/).filter(Boolean);
          return (
            <div key={idx} style={style}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {tags.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "4px 8px",
                      background: "#e5e7eb",
                      borderRadius: 6,
                      display: "inline-block",
                    }}
                  >
                    <span style={{ fontSize: ln.fontSize, color: "#374151" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div key={idx} style={style}>
            {ln.text}
          </div>
        );
      })}
    </>
  );
}

function isSkillsLine(ln: RenderLine) {
  return (
    ln.fontSize === 12 &&
    ln.text &&
    ln.text.split(" ").length >= 1 &&
    ln.text.indexOf(" ") >= 0 &&
    ln.marginBottom === 6
  );
}
