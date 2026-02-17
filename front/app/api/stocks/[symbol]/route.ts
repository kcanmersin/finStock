import { NextResponse } from "next/server";
import { mockStocks } from "@/data/mock-stocks";

export async function GET(
  _req: Request,
  { params }: { params: { symbol: string } }
) {
  const stock = mockStocks.find(
    (s) => s.symbol.toUpperCase() === params.symbol.toUpperCase()
  );
  if (!stock) {
    return NextResponse.json({ error: "Hisse bulunamadi" }, { status: 404 });
  }
  return NextResponse.json(stock);
}
