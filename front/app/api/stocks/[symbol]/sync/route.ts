import { NextResponse } from "next/server";
import { mockStocks } from "@/data/mock-stocks";

export async function POST(
  _req: Request,
  { params }: { params: { symbol: string } }
) {
  const stock = mockStocks.find(
    (s) => s.symbol.toUpperCase() === params.symbol.toUpperCase()
  );
  if (!stock) {
    return NextResponse.json({ error: "Hisse bulunamadi" }, { status: 404 });
  }

  // TODO: Gercek veri cekme mantigi buraya gelecek
  // Simdilik syncedAt ekleyip mevcut veriyi donduruyoruz
  return NextResponse.json({
    ...stock,
    syncedAt: new Date().toISOString(),
  });
}
