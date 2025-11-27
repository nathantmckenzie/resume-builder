import { RefObject } from "react";
import type { ResumeData } from "@/app/types/resume";

// Download multi-page PDF by rendering each page DOM node (hiddenPagesRef children)
export const downloadPDF = async (
  hiddenPagesRef: RefObject<HTMLDivElement>,
  FULL_WIDTH: number,
  FULL_HEIGHT: number
) => {
  const hiddenEl = hiddenPagesRef.current;
  if (!hiddenEl) {
    console.error("Hidden PDF pages not found");
    return;
  }

  const htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          ${document.querySelector("style#tailwind")?.innerHTML || ""}
          body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
          .pdf-page-node {
            page-break-after: always;
            width: ${FULL_WIDTH}px;
            height: ${FULL_HEIGHT}px;
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        ${hiddenEl.innerHTML}
      </body>
    </html>
  `;

  try {
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ htmlContent }),
    });

    if (!response.ok) throw new Error("PDF generation failed");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
  }
};

type RenderLine = {
  kind: "text";
  text: string;
  fontSize: number; // px
  fontWeight?: number | string;
  fontStyle?: string;
  lineHeight?: number; // px (exact line height)
  // extra flags to render block-level spacing
  marginTop?: number;
  marginBottom?: number;
  // whether this line is a non-breakable header block (we still represent as a single line)
  noBreak?: boolean;
};

export function paginateForm(
  form: ResumeData,
  CONTENT_WIDTH: number,
  PAGE_USABLE_HEIGHT: number
): RenderLine[][] {
  const measureCanvas = document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d")!;
  const fontFamily = "sans-serif";

  const lines: RenderLine[] = [];

  // --- helper functions ---
  function pushHeader(name: string) {
    const fontSize = 32;
    lines.push({
      kind: "text",
      text: name,
      fontSize,
      fontWeight: 700,
      lineHeight: Math.round(fontSize * 1.2),
      marginBottom: 6,
    });
  }

  function pushTitle(title: string) {
    const fontSize = 18;
    lines.push({
      kind: "text",
      text: title,
      fontSize,
      lineHeight: Math.round(fontSize * 1.3),
      marginBottom: 10,
    });
  }

  function pushSectionHeader(text: string) {
    const fontSize = 20;
    lines.push({
      kind: "text",
      text,
      fontSize,
      fontWeight: 600,
      lineHeight: Math.round(fontSize * 1.25),
      marginTop: 18,
      marginBottom: 8,
      noBreak: true,
    });
  }

  function pushUnbreakableLine(text: string, fontSize: number, marginBottom = 4) {
    lines.push({
      kind: "text",
      text,
      fontSize,
      lineHeight: Math.round(fontSize * 1.25),
      marginBottom,
      noBreak: true,
    });
  }

  function splitTextToLines(
    text: string,
    fontSize: number
  ): { text: string; fontSize: number }[] {
    const font = `${fontSize}px ${fontFamily}`;
    ctx.font = font;
    const words = text.split(/\s+/).filter(Boolean);
    const result: { text: string; fontSize: number }[] = [];
    if (words.length === 0) return result;

    let current = words[0];
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const attempt = current + " " + word;
      const w = ctx.measureText(attempt).width;

      if (w <= CONTENT_WIDTH) {
        current = attempt;
      } else {
        result.push({ text: current, fontSize });
        current = word;
      }
    }
    if (current) result.push({ text: current, fontSize });

    // Break very long words
    const finalLines: { text: string; fontSize: number }[] = [];
    result.forEach((ln) => {
      const width = ctx.measureText(ln.text).width;
      if (width <= CONTENT_WIDTH) {
        finalLines.push(ln);
      } else {
        let buf = "";
        for (const ch of ln.text) {
          const attempt = buf + ch;
          if (ctx.measureText(attempt).width <= CONTENT_WIDTH) {
            buf = attempt;
          } else {
            if (buf) finalLines.push({ text: buf, fontSize });
            buf = ch;
          }
        }
        if (buf) finalLines.push({ text: buf, fontSize });
      }
    });

    return finalLines;
  }

  // --- build lines ---
  pushHeader(form.name);
  pushTitle(form.title);

  // Experience
  if (form.experience?.length) {
    pushSectionHeader("Experience");
    form.experience.forEach((exp) => {
      pushUnbreakableLine(exp.role, 16, 2);
      pushUnbreakableLine(exp.company, 14, 2);
      pushUnbreakableLine(`${exp.startDate} - ${exp.endDate}`, 12, 4);
      splitTextToLines(exp.description, 14).forEach((l) =>
        lines.push({
          kind: "text",
          text: l.text,
          fontSize: 14,
          lineHeight: Math.round(14 * 1.4),
          marginBottom: 4,
        })
      );
    });
  }

  // Education
  if (form.education?.length) {
    pushSectionHeader("Education");
    form.education.forEach((edu) => {
      pushUnbreakableLine(edu.degree, 16, 2);
      pushUnbreakableLine(edu.school, 14, 2);
      pushUnbreakableLine(`${edu.startDate} - ${edu.endDate}`, 12, 4);
      splitTextToLines(edu.description, 14).forEach((l) =>
        lines.push({
          kind: "text",
          text: l.text,
          fontSize: 14,
          lineHeight: Math.round(14 * 1.4),
          marginBottom: 4,
        })
      );
    });
  }

  // Skills
  if (form.skills?.length) {
    pushSectionHeader("Skills");
    const fontSize = 12;
    ctx.font = `${fontSize}px ${fontFamily}`;
    let currentLine = "";
    form.skills.forEach((skill, idx) => {
      const tagText = skill;
      const tagWidth = ctx.measureText(tagText).width + 16;
      const currentWidth = currentLine ? ctx.measureText(currentLine).width + 8 : 0;
      if (currentWidth + tagWidth <= CONTENT_WIDTH) {
        currentLine = currentLine ? currentLine + " " + tagText : tagText;
      } else {
        if (currentLine) {
          lines.push({
            kind: "text",
            text: currentLine,
            fontSize,
            lineHeight: Math.round(fontSize * 1.4),
            marginBottom: 6,
          });
        }
        currentLine = tagText;
      }
      if (idx === form.skills.length - 1 && currentLine) {
        lines.push({
          kind: "text",
          text: currentLine,
          fontSize,
          lineHeight: Math.round(fontSize * 1.4),
          marginBottom: 6,
        });
      }
    });
  }

  // Languages
  if (form.languages?.length) {
    pushSectionHeader("Languages");
    form.languages.forEach((l) => {
      lines.push({
        kind: "text",
        text: `${l.language} — ${l.level}`,
        fontSize: 12,
        lineHeight: Math.round(12 * 1.4),
        marginBottom: 6,
      });
    });
  }

  // --- paginate ---
  const pages: RenderLine[][] = [];
  let currentPageLines: RenderLine[] = [];
  let usedHeight = 0;

  const pushPage = () => {
    pages.push(currentPageLines);
    currentPageLines = [];
    usedHeight = 0;
  };

  lines.forEach((ln) => {
    const mt = ln.marginTop ?? 0;
    const mb = ln.marginBottom ?? 0;
    const lh = ln.lineHeight ?? Math.round((ln.fontSize ?? 14) * 1.4);
    const total = mt + lh + mb;

    if (total > PAGE_USABLE_HEIGHT) {
      if (currentPageLines.length) pushPage();
      currentPageLines.push(ln);
      pushPage();
      return;
    }

    if (usedHeight + total > PAGE_USABLE_HEIGHT) {
      pushPage();
    }

    currentPageLines.push(ln);
    usedHeight += total;
  });

  if (currentPageLines.length) pushPage();

  return pages;
}
