// app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    const { htmlContent } = await req.json();
    if (!htmlContent)
      return NextResponse.json({ error: "Missing HTML" }, { status: 400 });

    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "letter",
      printBackground: true,
      // margin: { top: 40, bottom: 40, left: 40, right: 40 },
    });

    await browser.close();

    return new Response(pdfBuffer, {
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
