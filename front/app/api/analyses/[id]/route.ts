import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const analysis = await prisma.analysis.findUnique({
      where: { id: params.id },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "Analiz bulunamadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...analysis,
      recommendations: JSON.parse(analysis.recommendations),
      rawData: JSON.parse(analysis.rawData),
      createdAt: analysis.createdAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Analiz yuklenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.analysis.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Analiz silinemedi" },
      { status: 500 }
    );
  }
}
