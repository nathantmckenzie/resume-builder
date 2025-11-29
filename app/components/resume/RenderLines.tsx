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
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        };

        // Special rendering for skills
        //disabled for time being
        // if (isSkillsLine(ln)) {
        //   const tags = ln.text.split(/\s+/).filter(Boolean);
        //   return (
        //     <div key={idx} style={style}>
        //       <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        //         {tags.map((t, i) => (
        //           <div
        //             key={i}
        //             style={{
        //               padding: "4px 8px",
        //               background: "#e5e7eb",
        //               borderRadius: 6,
        //               display: "inline-block",
        //             }}
        //           >
        //             <span style={{ fontSize: ln.fontSize, color: "#374151" }}>{t}</span>
        //           </div>
        //         ))}
        //       </div>
        //     </div>
        //   );
        // }

        if (ln.kind === "photoHeaderGroup") {
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                marginBottom: ln.marginBottom ?? 20,
              }}
            >
              <img
                src={ln.photoSrc}
                style={{
                  width: ln.size,
                  height: ln.size,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 32, fontWeight: 700 }}>{ln.fullName}</span>
                <span style={{ fontSize: 18 }}>{ln.title}</span>
              </div>
            </div>
          );
        }

        return (
          <div key={idx} style={style}>
            {ln.boldRanges
              ? ln.text.split("").map((char, i) => {
                  const isBold = ln.boldRanges!.some((r) => i >= r.start && i < r.end);
                  return (
                    <span key={i} style={{ fontWeight: isBold ? 700 : undefined }}>
                      {char}
                    </span>
                  );
                })
              : ln.text.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < ln.text.split("\n").length - 1 && <br />}
                  </span>
                ))}
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
