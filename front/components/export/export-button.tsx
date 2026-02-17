"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToExcel, exportToCsv } from "@/lib/export-utils";

interface ExportButtonProps {
  data: Record<string, unknown>[];
  columns: { key: string; header: string }[];
  fileName: string;
  disabled?: boolean;
}

export function ExportButton({
  data,
  columns,
  fileName,
  disabled = false,
}: ExportButtonProps) {
  const dateStr = new Date().toISOString().split("T")[0];
  const fullFileName = `${fileName}_${dateStr}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} className="h-8 gap-1">
          <Download className="h-3.5 w-3.5" />
          Disa Aktar
          {!disabled && data.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({data.length})
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportToExcel(data, columns, fullFileName)}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel Indir (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToCsv(data, columns, fullFileName)}>
          <FileText className="mr-2 h-4 w-4" />
          CSV Indir (.csv)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
