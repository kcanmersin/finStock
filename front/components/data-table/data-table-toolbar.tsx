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
    <div className="space-y-3">
      {/* Search + Export row */}
      <div className="flex items-center gap-2">
        {searchKey && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Ara..."
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn(searchKey)?.setFilterValue(e.target.value)
              }
              className="pl-9 h-9"
            />
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0">
          {selectedCount > 0 && (
            <Badge variant="outline" className="hidden sm:flex">
              {selectedCount} / {totalCount} secildi
            </Badge>
          )}
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

      {/* Filter chips - horizontal scroll on mobile */}
      {filterableColumns.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
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

          {activeFilterCount > 0 && (
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge variant="secondary" className="gap-1 text-xs">
                <SlidersHorizontal className="h-3 w-3" />
                {activeFilterCount}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Mobile selection count */}
      {selectedCount > 0 && (
        <div className="sm:hidden">
          <Badge variant="outline" className="text-xs">
            {selectedCount} / {totalCount} secildi
          </Badge>
        </div>
      )}
    </div>
  );
}
