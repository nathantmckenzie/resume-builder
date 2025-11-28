export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET() {
  console.log("Node runtime working!");
  return NextResponse.json({ ok: true });
}
