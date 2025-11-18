"use client";

import { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ResumePreview from "./ResumePreview";

export default function ResumePDFExporter() {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!resumeRef.current) return;

    // Wait for images to load
    await new Promise((resolve) => setTimeout(resolve, 100));

    const canvas = await html2canvas(resumeRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
    const imgWidth = canvasWidth * ratio;
    const imgHeight = canvasHeight * ratio;

    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    pdf.save("resume.pdf");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button onClick={handleDownload} className="px-6 py-2 rounded transition">
        Download PDF
      </button>
      <div ref={resumeRef} className="w-[800px]">
        <ResumePreview />
      </div>
    </div>
  );
}
