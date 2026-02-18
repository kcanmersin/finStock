import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const analyses = await prisma.analysis.findMany({
      orderBy: { createdAt: "desc" },
    });

    const parsed = analyses.map((a) => ({
      ...a,
      recommendations: JSON.parse(a.recommendations),
      rawData: JSON.parse(a.rawData),
      createdAt: a.createdAt.toISOString(),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      { error: "Analizler yuklenemedi" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const analysis = await prisma.analysis.create({
      data: {
        title: body.title,
        type: body.type,
        summary: body.summary || "",
        recommendations: JSON.stringify(body.recommendations || []),
        rawData: JSON.stringify(body.rawData || []),
        fileName: body.fileName || "",
      },
    });

    return NextResponse.json(
      {
        ...analysis,
        recommendations: body.recommendations || [],
        rawData: body.rawData || [],
        createdAt: analysis.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Analiz kaydedilemedi" },
      { status: 500 }
    );
  }
}
