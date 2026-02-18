import { NextResponse } from "next/server";
import { mockStocks } from "@/data/mock-stocks";

export async function GET() {
  // Sonra Flask backend'e proxy olacak:
  // const res = await fetch('http://flask-api/api/stocks');
  // const data = await res.json();
  // return NextResponse.json(data);
  return NextResponse.json(mockStocks);
}
