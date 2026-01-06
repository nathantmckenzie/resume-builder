import { RefObject } from "react";
import type { ResumeData } from "@/app/types/resume";
import { useResumeStore } from "@/app/store/store";

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

  const { resume } = useResumeStore.getState();

  // Convert the uploaded photo file to base64 if it exists
  let photoBase64 = "";
  if (resume.personal.photo?.file) {
    const file = resume.personal.photo.file;
    photoBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Replace blob URLs in hiddenEl with the base64 image
  const tempEl = hiddenEl.cloneNode(true) as HTMLElement;
  const imgEl = tempEl.querySelector("img");
  if (imgEl && photoBase64) {
    imgEl.setAttribute("src", photoBase64);
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
        ${tempEl.innerHTML}
      </body>
    </html>
  `;

  try {
    const response = await fetch(
      "https://resume-pdf-server-production.up.railway.app/generate-pdf",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent }),
      }
    );

    if (!response.ok) throw new Error("PDF generation failed");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

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

  // --- Helper functions ---
  function pushLine(text: string, fontSize: number, opts: Partial<RenderLine> = {}) {
    splitTextToLines(text, fontSize).forEach((l) => {
      lines.push({
        kind: "text",
        text: l.text,
        fontSize,
        lineHeight: Math.round(fontSize * 1.4),
        marginTop: opts.marginTop ?? 0,
        marginBottom: opts.marginBottom ?? 4,
        fontWeight: opts.fontWeight,
        fontStyle: opts.fontStyle,
        noBreak: opts.noBreak,
      });
    });
  }

  function pushHeader(name: string) {
    pushLine(name, 32, { fontWeight: 700, marginBottom: 6 });
  }

  function pushTitle(title: string) {
    pushLine(title, 18, { marginBottom: 10 });
  }

  function pushSectionHeader(text: string) {
    pushLine(text, 20, {
      fontWeight: 600,
      marginTop: 18,
      marginBottom: 8,
      noBreak: true,
    });
  }

  function pushUnbreakableLine(
    text: string,
    fontSize: number,
    marginBottom = 4,
    fontWeight?: number
  ) {
    pushLine(text, fontSize, { marginBottom, noBreak: true, fontWeight });
  }

  // --- Split text into lines while preserving newlines ---
  function splitTextToLines(
    text: string,
    fontSize: number
  ): { text: string; fontSize: number }[] {
    const font = `${fontSize}px sans-serif`;
    ctx.font = font;
    const result: { text: string; fontSize: number }[] = [];

    // Split by newline first
    const paragraphs = text.split(/\n/);

    for (const para of paragraphs) {
      const words = para.split(/\s+/).filter(Boolean);
      if (words.length === 0) {
        // Preserve an empty line (for explicit newlines)
        result.push({ text: "", fontSize });
        continue;
      }

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
    }

    return result;
  }

  // If photo exists, group photo + name + title into a single line block
  if (form.personal.photo?.previewUrl) {
    lines.push({
      kind: "photoHeaderGroup",
      photoSrc: form.personal.photo.previewUrl,
      fullName: form.personal.fullName,
      title: form.personal.title,
      lineHeight: 90,
      size: 90,
      marginBottom: 20,
      noBreak: true,
    });
  } else {
    pushHeader(form.personal.fullName);
    pushTitle(form.personal.title);
  }

  const contactItems = [
    form.personal.email,
    form.personal.phone,
    form.personal.location,
  ].filter(Boolean);

  if (contactItems.length) {
    pushUnbreakableLine(contactItems.join(" | "), 14, 2); // or any separator
  }

  // Experience
  if (form.experience?.length) {
    pushSectionHeader("Experience");
    form.experience.forEach((exp) => {
      pushUnbreakableLine(exp.role, 16, 2, 700);
      pushUnbreakableLine(exp.company, 14, 2);
      pushUnbreakableLine(
        exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate,
        12,
        4
      );
      pushLine(exp.description, 14);
    });
  }

  // Education
  if (form.education?.length) {
    pushSectionHeader("Education");
    form.education.forEach((edu) => {
      pushUnbreakableLine(edu.degree, 16, 2, 700);
      pushUnbreakableLine(edu.school, 14, 2);
      pushUnbreakableLine(
        edu.endDate ? `${edu.startDate} - ${edu.endDate}` : edu.startDate,
        12,
        4
      );
      pushLine(edu.description, 14);
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
    const fontSize = 12;

    form.languages?.forEach((l) => {
      if (!l.language && !l.level) return;

      const text = l.level ? `${l.language} — ${l.level}` : l.language;
      const boldRanges = l.language ? [{ start: 0, end: l.language.length }] : [];

      lines.push({
        kind: "text",
        text,
        fontSize,
        lineHeight: Math.round(fontSize * 1.4),
        marginBottom: 6,
        boldRanges,
      });
    });
  }

  // --- Paginate ---
  const pages: RenderLine[][] = [];
  let currentPageLines: RenderLine[] = [];
  let usedHeight = 0;

  const pushPage = () => {
    if (currentPageLines.length) pages.push(currentPageLines);
    currentPageLines = [];
    usedHeight = 0;
  };

  lines.forEach((ln) => {
    const mt = ln.marginTop ?? 0;
    const mb = ln.marginBottom ?? 0;
    const lh = ln.lineHeight ?? Math.round((ln.fontSize ?? 14) * 1.4);
    const hasContent = Boolean(ln?.text?.trim()) || ln.kind === "photoHeaderGroup";
    const total = hasContent ? mt + lh + mb : 0;

    //check if a single line is taller than a page
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
