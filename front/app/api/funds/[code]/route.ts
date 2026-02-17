import { NextResponse } from "next/server";
import { mockFunds } from "@/data/mock-funds";

export async function GET(
  _req: Request,
  { params }: { params: { code: string } }
) {
  const fund = mockFunds.find(
    (f) => f.code.toUpperCase() === params.code.toUpperCase()
  );
  if (!fund) {
    return NextResponse.json({ error: "Fon bulunamadi" }, { status: 404 });
  }
  return NextResponse.json(fund);
}
