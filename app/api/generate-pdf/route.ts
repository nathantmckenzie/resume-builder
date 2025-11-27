// app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import type { Browser } from "puppeteer-core";

export const runtime = "nodejs"; // required for Puppeteer in Vercel

// Helper to get the correct Puppeteer browser
async function getBrowser(): Promise<Browser> {
  if (process.env.NODE_ENV === "development") {
    // Local dev: use full puppeteer with bundled Chromium
    const fullPuppeteer = await import("puppeteer");
    return await fullPuppeteer.launch({ headless: true });
  } else {
    // Production (Vercel serverless): use serverless Chromium
    return await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { htmlContent } = await req.json();
    if (!htmlContent) {
      return NextResponse.json({ error: "Missing HTML" }, { status: 400 });
    }

    const browser = await getBrowser();
    const page = await browser.newPage();

    // Set HTML content
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "letter",
      printBackground: true,
      // margin: { top: 40, bottom: 40, left: 40, right: 40 },
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
