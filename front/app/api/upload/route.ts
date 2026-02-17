import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[];

    // Parse recommendations from expected columns
    const recommendations = rawData.map((row: Record<string, unknown>) => ({
      name:
        (row["Isim"] as string) ||
        (row["isim"] as string) ||
        (row["Kod"] as string) ||
        (row["kod"] as string) ||
        (row["name"] as string) ||
        "",
      action:
        (row["Oneri"] as string) ||
        (row["oneri"] as string) ||
        (row["action"] as string) ||
        "IZLE",
      score: Number(
        row["Puan"] || row["puan"] || row["score"] || 50
      ),
      reasoning:
        (row["Gerekce"] as string) ||
        (row["gerekce"] as string) ||
        (row["reasoning"] as string) ||
        "",
    }));

    const analysis = await prisma.analysis.create({
      data: {
        title: title || file.name,
        type: type || "fund",
        summary: `${rawData.length} varlik analiz edildi.`,
        recommendations: JSON.stringify(recommendations),
        rawData: JSON.stringify(rawData),
        fileName: file.name,
      },
    });

    return NextResponse.json(
      {
        ...analysis,
        recommendations,
        rawData,
        createdAt: analysis.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Dosya yuklenemedi" },
      { status: 500 }
    );
  }
}
