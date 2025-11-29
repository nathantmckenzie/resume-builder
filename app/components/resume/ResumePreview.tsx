"use client";

import { useEffect, useState } from "react";

import { useResumeStore } from "@/app/store/store";
import RenderLines from "@/app/components/resume/RenderLines";
import { paginateForm } from "@/app/components/resume/helper-functions";

const FULL_WIDTH = 850;
const FULL_HEIGHT = 1100;
const GAP = 24;

const PAGE_MARGIN_TOP = 50;
const PAGE_MARGIN_BOTTOM = 60;
const PAGE_USABLE_HEIGHT = FULL_HEIGHT - PAGE_MARGIN_TOP - PAGE_MARGIN_BOTTOM;

const PAGE_PADDING = 50;
const CONTENT_WIDTH = FULL_WIDTH - PAGE_PADDING * 2;

type RenderLine = {
  kind: "text";
  text: string;
  fontSize: number;
  fontWeight?: number | string;
  fontStyle?: string;
  lineHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  noBreak?: boolean;
};

export default function ResumeEditor({ hiddenPagesRef }) {
  const { resume } = useResumeStore();
  const [pagesData, setPagesData] = useState<RenderLine[][]>([]);
  const [scale, setScale] = useState<number>(1);

  // Dynamically compute preview scale
  useEffect(() => {
    function updateScale() {
      const leftWidth = window.innerWidth * 0.5; // 50% for left-hand component
      const availableWidth = Math.max(window.innerWidth - GAP - leftWidth, 300);
      setScale(Math.min(availableWidth / FULL_WIDTH, 1));
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Recompute pages every time resume store changes
  useEffect(() => {
    const pages = paginateForm(resume, CONTENT_WIDTH, PAGE_USABLE_HEIGHT);
    setPagesData(pages);
  }, [resume]);

  return (
    <div className="min-h-screen">
      {/* PREVIEW PAGES */}
      <div id="resume-preview" className="hidden md:flex flex-1 flex-col items-center">
        {pagesData.map((pageLines, i) => (
          <div
            key={i}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top",
              height: FULL_HEIGHT * scale,
              marginBottom: 50 * scale,
            }}
          >
            <PreviewPage lines={pageLines} />
          </div>
        ))}
      </div>

      {/* FULL-RES PAGES FOR PDF EXPORT */}
      <div
        ref={hiddenPagesRef}
        style={{ position: "absolute", top: 0, left: -99999 }}
        aria-hidden
      >
        {pagesData.map((pageLines, i) => (
          <div
            key={i}
            className="pdf-page-node"
            style={{
              width: FULL_WIDTH,
              height: FULL_HEIGHT,
            }}
          >
            <PreviewPage lines={pageLines} forceFullResolution />
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewPage({ lines }: { lines: RenderLine[] }) {
  return (
    <div
      style={{
        width: FULL_WIDTH,
        height: FULL_HEIGHT,
        overflow: "hidden",
        position: "relative",
        background: "#ffffff",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          paddingLeft: PAGE_PADDING,
          paddingRight: PAGE_PADDING,
          paddingTop: PAGE_MARGIN_TOP,
          paddingBottom: PAGE_MARGIN_BOTTOM,
          fontFamily: "sans-serif", // || resume?.settings?.fontFamily ||
          whiteSpace: "pre-wrap",
        }}
      >
        <RenderLines lines={lines} />
      </div>
    </div>
  );
}
