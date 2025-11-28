// Ensure serverless Node runtime
export const runtime = "nodejs";

// app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import type { Browser } from "puppeteer-core";

// 🔹 Use a hosted tarball for production
chromium.packed =
  "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

async function getBrowser(): Promise<Browser> {
  try {
    if (process.env.NODE_ENV === "development") {
      // Local dev: use full Puppeteer
      const fullPuppeteer = await import("puppeteer");
      console.log("[PDF] Launching local Puppeteer...");
      const browser = await fullPuppeteer.launch({ headless: true });
      console.log("[PDF] Local Puppeteer launched");
      return browser;
    } else {
      // Production (Vercel serverless)
      const executablePath = await chromium.executablePath();
      console.log("[PDF] Chromium executable path:", executablePath);

      const browser = await puppeteer.launch({
        args: chromium.args.concat(["--no-sandbox", "--disable-setuid-sandbox"]),
        executablePath,
        headless: chromium.headless,
      });

      console.log("[PDF] Serverless Puppeteer launched");
      return browser;
    }
  } catch (err) {
    console.error("[PDF] Failed to launch Puppeteer:", err);
    throw err;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { htmlContent } = await req.json();
    if (!htmlContent) {
      console.error("[PDF] Missing HTML content");
      return NextResponse.json({ error: "Missing HTML" }, { status: 400 });
    }

    const browser = await getBrowser();
    const page = await browser.newPage();

    console.log("[PDF] Setting page content...");
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    console.log("[PDF] Generating PDF...");
    const pdfBuffer = await page.pdf({
      format: "letter",
      printBackground: true,
    });

    await browser.close();
    console.log("[PDF] PDF generation completed, sending response...");

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (err) {
    console.error("[PDF] PDF generation failed:", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
