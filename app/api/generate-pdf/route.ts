// app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import type { Browser } from "puppeteer-core";

export const runtime = "nodejs"; // required for Puppeteer in Vercel

export async function getBrowser(): Promise<Browser> {
  try {
    if (process.env.NODE_ENV === "development") {
      // Local dev: use full Puppeteer with bundled Chromium
      const fullPuppeteer = await import("puppeteer");
      console.log("Launching local Puppeteer...");
      const browser = await fullPuppeteer.launch({ headless: true });
      console.log("Local Puppeteer launched successfully");
      return browser;
    } else {
      // Production (Vercel serverless): use serverless Chromium
      const executablePath = await chromium.executablePath();
      console.log("Chromium executable path:", executablePath);

      const browser = await puppeteer.launch({
        args: chromium.args.concat(["--no-sandbox", "--disable-setuid-sandbox"]),
        executablePath,
        headless: chromium.headless,
      });

      console.log("Serverless Puppeteer launched successfully");
      return browser;
    }
  } catch (err) {
    console.error("Failed to launch Puppeteer:", err);
    throw err; // propagate error so API route can return 500
  }
}

export async function POST(req: NextRequest) {
  try {
    const { htmlContent } = await req.json();
    if (!htmlContent) {
      return NextResponse.json({ error: "Missing HTML" }, { status: 400 });
    }

    console.log("Node ENV:", process.env.NODE_ENV);
    console.log("Chromium path:", await chromium.executablePath());

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
