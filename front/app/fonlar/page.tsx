"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Fund } from "@/lib/types";
import { formatCurrency, formatLargeNumber, formatNumber, formatPercentage, cn } from "@/lib/utils";
import { DataTable } from "@/components/data-table/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataFetch } from "@/hooks/use-data-fetch";

const riskColors: Record<number, string> = {
  1: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  2: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  3: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  4: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  5: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  6: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  7: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const typeColors: Record<string, string> = {
  "Hisse Senedi": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Tahvil/Bono": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Karma: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  "Para Piyasasi": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  Altin: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  Degisken: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  Katilim: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
};

function ReturnCell({ value }: { value: number }) {
  return (
    <span className={cn("font-medium", value > 0 ? "text-green-600 dark:text-green-400" : value < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
      {formatPercentage(value)}
    </span>
  );
}

const columns: ColumnDef<Fund, unknown>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Tumunu sec"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Satir sec"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Kod <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono font-semibold">{row.getValue("code")}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Fon Adi <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="max-w-[250px] truncate block">{row.getValue("name")}</span>,
    filterFn: "includesString",
  },
  {
    accessorKey: "type",
    header: "Tip",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return <Badge className={cn("text-xs", typeColors[type] ?? "")} variant="outline">{type}</Badge>;
    },
    filterFn: "custom" as any,
  },
  {
    accessorKey: "riskLevel",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Risk <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const risk = row.getValue("riskLevel") as number;
      return <Badge className={cn("text-xs", riskColors[risk] ?? "")} variant="outline">{risk}/7</Badge>;
    },
    filterFn: "custom" as any,
  },
  {
    accessorKey: "dailyReturn",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Gunluk <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <ReturnCell value={row.getValue("dailyReturn")} />,
    filterFn: "custom" as any,
  },
  {
    accessorKey: "monthlyReturn",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Aylik <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <ReturnCell value={row.getValue("monthlyReturn")} />,
    filterFn: "custom" as any,
  },
  {
    accessorKey: "annualReturn",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Yillik <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <ReturnCell value={row.getValue("annualReturn")} />,
    filterFn: "custom" as any,
  },
  {
    accessorKey: "managementFee",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Yonetim Ucreti <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span>{(row.getValue("managementFee") as number).toFixed(2)}%</span>,
    filterFn: "custom" as any,
  },
  {
    accessorKey: "totalValue",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Toplam Deger <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span>{formatLargeNumber(row.getValue("totalValue"))}</span>,
    filterFn: "custom" as any,
  },
  {
    accessorKey: "investorCount",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Yatirimci <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span>{formatNumber(row.getValue("investorCount"))}</span>,
    filterFn: "custom" as any,
  },
];

const filterableColumns = [
  { id: "name", title: "Fon Adi", type: "string" as const },
  { id: "type", title: "Fon Tipi", type: "string" as const },
  { id: "riskLevel", title: "Risk", type: "number" as const },
  { id: "monthlyReturn", title: "Aylik Getiri", type: "number" as const },
  { id: "annualReturn", title: "Yillik Getiri", type: "number" as const },
  { id: "managementFee", title: "Yonetim Ucreti", type: "number" as const },
  { id: "totalValue", title: "Toplam Deger", type: "number" as const },
];

const exportColumns = [
  { key: "code", header: "Fon Kodu" },
  { key: "name", header: "Fon Adi" },
  { key: "type", header: "Fon Tipi" },
  { key: "riskLevel", header: "Risk Seviyesi" },
  { key: "dailyReturn", header: "Gunluk Getiri %" },
  { key: "monthlyReturn", header: "Aylik Getiri %" },
  { key: "annualReturn", header: "Yillik Getiri %" },
  { key: "managementFee", header: "Yonetim Ucreti %" },
  { key: "totalValue", header: "Toplam Deger (TL)" },
  { key: "investorCount", header: "Yatirimci Sayisi" },
];

export default function FonlarPage() {
  const { data, loading, error } = useDataFetch<Fund>("/api/funds");

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Fonlar</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Fonlar</h1>
        <div className="text-destructive">Hata: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Fonlar</h1>
        <p className="text-muted-foreground mt-1">
          Turkiye yatirim fonlarini filtreleyin, secin ve disa aktarin.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={data}
        filterableColumns={filterableColumns}
        searchKey="name"
        exportColumns={exportColumns}
        exportFileName="fonlar_export"
      />
    </div>
  );
}
