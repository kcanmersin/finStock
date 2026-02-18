"use client";

import { useState, useEffect } from "react";
import { FileBarChart, Plus } from "lucide-react";
import { Analysis } from "@/lib/types";
import { AnalysisCard } from "@/components/analysis/analysis-card";
import { UploadDialog } from "@/components/analysis/upload-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AnalizlerPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalyses = async () => {
    try {
      const res = await fetch("/api/analyses");
      if (!res.ok) throw new Error("Yuklenemedi");
      const data = await res.json();
      setAnalyses(data);
    } catch {
      toast.error("Analizler yuklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu analizi silmek istediginize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silinemedi");
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Analiz silindi");
    } catch {
      toast.error("Analiz silinemedi");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold md:text-3xl">Analizler</h1>
          <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
            Yapay zeka ile yapilmis yatirim analizleriniz.
          </p>
        </div>
        <UploadDialog />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : analyses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
          <FileBarChart className="h-12 w-12 text-muted-foreground/50 mb-3 md:h-16 md:w-16 md:mb-4" />
          <h2 className="text-lg font-semibold mb-2 md:text-xl">Henuz analiz yok</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            Fonlar veya Hisseler sayfasindan verileri export edin, AI ile analiz
            ettirin ve sonucu buraya yukleyin.
          </p>
          <UploadDialog
            trigger={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Ilk Analizinizi Yukleyin
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {analyses.map((analysis) => (
            <AnalysisCard
              key={analysis.id}
              analysis={analysis}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
