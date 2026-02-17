"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { Analysis } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exportToExcel } from "@/lib/export-utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const actionColors: Record<string, string> = {
  AL: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  TUT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  SAT: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  IZLE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/analyses/${params.id}`);
        if (!res.ok) throw new Error("Bulunamadi");
        const data = await res.json();
        setAnalysis(data);
      } catch {
        toast.error("Analiz yuklenemedi");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  const handleExport = () => {
    if (!analysis) return;
    const data = analysis.recommendations.map((r) => ({
      name: r.name,
      action: r.action,
      score: r.score,
      reasoning: r.reasoning,
    }));
    exportToExcel(
      data as unknown as Record<string, unknown>[],
      [
        { key: "name", header: "Isim" },
        { key: "action", header: "Oneri" },
        { key: "score", header: "Puan" },
        { key: "reasoning", header: "Gerekce" },
      ],
      `analiz_${analysis.title.replace(/\s+/g, "_")}`
    );
  };

  const handleDelete = async () => {
    if (!analysis) return;
    if (!confirm("Bu analizi silmek istediginize emin misiniz?")) return;
    try {
      await fetch(`/api/analyses/${analysis.id}`, { method: "DELETE" });
      toast.success("Analiz silindi");
      router.push("/analizler");
    } catch {
      toast.error("Silinemedi");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold">Analiz bulunamadi</h2>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/analizler")}>
          Geri Don
        </Button>
      </div>
    );
  }

  const actionCounts = analysis.recommendations.reduce(
    (acc, rec) => {
      acc[rec.action] = (acc[rec.action] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const date = new Date(analysis.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 gap-1"
            onClick={() => router.push("/analizler")}
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Button>
          <h1 className="text-3xl font-bold">{analysis.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline">
              {analysis.type === "fund" ? "Fon Analizi" : "Hisse Analizi"}
            </Badge>
            <span className="text-sm text-muted-foreground">{date}</span>
            <span className="text-sm text-muted-foreground">
              Dosya: {analysis.fileName}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Excel Indir
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["AL", "TUT", "SAT", "IZLE"] as const).map((action) => (
          <Card key={action}>
            <CardContent className="flex items-center justify-between p-4">
              <Badge className={cn("text-sm px-3 py-1", actionColors[action])} variant="outline">
                {action}
              </Badge>
              <span className="text-2xl font-bold">
                {actionCounts[action] || 0}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <p className="text-muted-foreground">{analysis.summary}</p>

      {/* Recommendations table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Isim</TableHead>
              <TableHead className="w-[80px]">Oneri</TableHead>
              <TableHead className="w-[80px]">Puan</TableHead>
              <TableHead>Gerekce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analysis.recommendations.map((rec, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                <TableCell className="font-medium">{rec.name}</TableCell>
                <TableCell>
                  <Badge
                    className={cn("text-xs", actionColors[rec.action] ?? "")}
                    variant="outline"
                  >
                    {rec.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          rec.score >= 70
                            ? "bg-green-500"
                            : rec.score >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        )}
                        style={{ width: `${rec.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{rec.score}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] text-sm text-muted-foreground">
                  {rec.reasoning}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
