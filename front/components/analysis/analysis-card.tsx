"use client";

import Link from "next/link";
import { FileBarChart, Trash2, ExternalLink, PieChart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Analysis } from "@/lib/types";

interface AnalysisCardProps {
  analysis: Analysis;
  onDelete: (id: string) => void;
}

const actionColors: Record<string, string> = {
  AL: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  TUT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  SAT: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  IZLE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

export function AnalysisCard({ analysis, onDelete }: AnalysisCardProps) {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {analysis.type === "fund" ? (
              <PieChart className="h-5 w-5 text-primary" />
            ) : (
              <TrendingUp className="h-5 w-5 text-primary" />
            )}
            <div>
              <CardTitle className="text-base">{analysis.title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{date}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {analysis.type === "fund" ? "Fon" : "Hisse"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{analysis.summary}</p>

        {/* Action counts */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(actionCounts).map(([action, count]) => (
            <Badge
              key={action}
              className={`text-xs ${actionColors[action] ?? ""}`}
              variant="outline"
            >
              {action}: {count}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Link href={`/analizler/${analysis.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1">
              <ExternalLink className="h-3.5 w-3.5" />
              Detay
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive gap-1"
            onClick={() => onDelete(analysis.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
