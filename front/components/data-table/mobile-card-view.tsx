"use client";

import * as React from "react";
import { Table as TanstackTable, flexRender } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { hapticSelection } from "@/lib/capacitor";

interface MobileCardViewProps<TData> {
  table: TanstackTable<TData>;
  /** Column IDs to show as the card title (primary info) */
  primaryColumns: string[];
  /** Column IDs to show as key metrics */
  metricColumns: string[];
  /** Column IDs to show as badges/secondary info */
  badgeColumns?: string[];
}

export function MobileCardView<TData>({
  table,
  primaryColumns,
  metricColumns,
  badgeColumns = [],
}: MobileCardViewProps<TData>) {
  const rows = table.getRowModel().rows;

  if (!rows.length) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
        Sonuc bulunamadi.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {rows.map((row) => {
        const visibleCells = row.getVisibleCells();

        const primaryCells = visibleCells.filter((c) =>
          primaryColumns.includes(c.column.id)
        );
        const metricCells = visibleCells.filter((c) =>
          metricColumns.includes(c.column.id)
        );
        const badgeCells = visibleCells.filter((c) =>
          badgeColumns.includes(c.column.id)
        );

        return (
          <Card
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="data-[state=selected]:border-primary transition-all duration-200 active:scale-[0.98] active:bg-accent/50"
          >
            <CardContent className="p-3">
              {/* Header row: checkbox + primary info */}
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => {
                    row.toggleSelected(!!value);
                    hapticSelection();
                  }}
                  aria-label="Satir sec"
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {primaryCells.map((cell) => (
                        <div key={cell.id} className="truncate">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Badges */}
                    <div className="flex items-center gap-1 shrink-0">
                      {badgeCells.map((cell) => (
                        <div key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metrics grid */}
                  <div className="mt-2 grid grid-cols-3 gap-x-3 gap-y-1.5">
                    {metricCells.map((cell) => {
                      const header = cell.column.columnDef.header;
                      let headerText = "";
                      if (typeof header === "string") {
                        headerText = header;
                      } else if (typeof header === "function") {
                        // Try to extract text from button-based headers
                        const colId = cell.column.id;
                        headerText = colId;
                      }
                      return (
                        <div key={cell.id} className="min-w-0">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
                            {headerText}
                          </p>
                          <div className="text-xs font-medium truncate">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
