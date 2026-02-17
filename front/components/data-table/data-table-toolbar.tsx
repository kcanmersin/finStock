"use client";

import { Table } from "@tanstack/react-table";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnFilter } from "./data-table-column-filter";
import { ExportButton } from "@/components/export/export-button";

interface FilterableColumn {
  id: string;
  title: string;
  type: "string" | "number";
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: FilterableColumn[];
  searchKey?: string;
  exportColumns?: { key: string; header: string }[];
  exportFileName?: string;
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  searchKey,
  exportColumns,
  exportFileName,
}: DataTableToolbarProps<TData>) {
  const activeFilterCount = table.getState().columnFilters.length;
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;

  const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        {/* Global search */}
        {searchKey && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Ara..."
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn(searchKey)?.setFilterValue(e.target.value)
              }
              className="pl-9"
            />
          </div>
        )}

        {/* Column filters */}
        {filterableColumns.map((col) => {
          const column = table.getColumn(col.id);
          if (!column) return null;
          return (
            <DataTableColumnFilter
              key={col.id}
              column={column}
              title={col.title}
              type={col.type}
            />
          );
        })}

        {/* Active filter count + clear */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <SlidersHorizontal className="h-3 w-3" />
              {activeFilterCount} filtre aktif
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Temizle
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Selection count */}
        {selectedCount > 0 && (
          <Badge variant="outline">
            {selectedCount} / {totalCount} secildi
          </Badge>
        )}

        {/* Export */}
        {exportColumns && exportFileName && (
          <ExportButton
            data={selectedRows as Record<string, unknown>[]}
            columns={exportColumns}
            fileName={exportFileName}
            disabled={selectedCount === 0}
          />
        )}
      </div>
    </div>
  );
}
