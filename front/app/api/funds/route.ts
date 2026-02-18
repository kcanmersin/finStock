import { NextResponse } from "next/server";
import { mockFunds } from "@/data/mock-funds";

export async function GET() {
  // Sonra Flask backend'e proxy olacak:
  // const res = await fetch('http://flask-api/api/funds');
  // const data = await res.json();
  // return NextResponse.json(data);
  return NextResponse.json(mockFunds);
}
