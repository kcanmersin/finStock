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

function MobileRecommendationCard({
  rec,
  idx,
}: {
  rec: { name: string; action: string; score: number; reasoning: string };
  idx: number;
}) {
  return (
    <Card>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">#{idx + 1}</span>
            <span className="font-medium text-sm">{rec.name}</span>
          </div>
          <Badge
            className={cn("text-xs", actionColors[rec.action] ?? "")}
            variant="outline"
          >
            {rec.action}
          </Badge>
        </div>
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
          <span className="text-xs font-medium w-6 text-right">{rec.score}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {rec.reasoning}
        </p>
      </CardContent>
    </Card>
  );
}

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
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold md:text-3xl truncate">{analysis.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline">
                {analysis.type === "fund" ? "Fon Analizi" : "Hisse Analizi"}
              </Badge>
              <span className="text-xs text-muted-foreground md:text-sm">{date}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 md:text-sm">
              Dosya: {analysis.fileName}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-1 flex-1 sm:flex-none" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span>Excel</span>
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {(["AL", "TUT", "SAT", "IZLE"] as const).map((action) => (
          <Card key={action}>
            <CardContent className="flex flex-col items-center justify-center p-2 md:flex-row md:justify-between md:p-4">
              <Badge className={cn("text-xs md:text-sm md:px-3 md:py-1", actionColors[action])} variant="outline">
                {action}
              </Badge>
              <span className="text-lg font-bold mt-1 md:mt-0 md:text-2xl">
                {actionCounts[action] || 0}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <p className="text-sm text-muted-foreground md:text-base">{analysis.summary}</p>

      {/* Mobile: Recommendation cards */}
      <div className="space-y-2 md:hidden">
        {analysis.recommendations.map((rec, idx) => (
          <MobileRecommendationCard key={idx} rec={rec} idx={idx} />
        ))}
      </div>

      {/* Desktop: Recommendations table */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
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
