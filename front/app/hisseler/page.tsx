"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Stock } from "@/lib/types";
import { formatCurrency, formatLargeNumber, formatNumber, formatPercentage, cn } from "@/lib/utils";
import { DataTable } from "@/components/data-table/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataFetch } from "@/hooks/use-data-fetch";

const sectorColors: Record<string, string> = {
  Ulastirma: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  Savunma: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
  Bankacilik: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  "Demir Celik": "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200",
  Perakende: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  Cam: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  Enerji: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  Otomotiv: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Teknoloji: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  Madencilik: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Holding: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  Kimya: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  Insaat: "bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200",
  Gida: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
  Telekom: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Beyaz_Esya: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  GYO: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
  Gubre: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

function ReturnCell({ value }: { value: number }) {
  return (
    <span className={cn("font-medium", value > 0 ? "text-green-600 dark:text-green-400" : value < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
      {formatPercentage(value)}
    </span>
  );
}

const columns: ColumnDef<Stock, unknown>[] = [
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
    accessorKey: "symbol",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Kod <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono font-bold">{row.getValue("symbol")}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Sirket <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="max-w-[200px] truncate block">{row.getValue("name")}</span>,
    filterFn: "includesString",
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Fiyat <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.getValue("price"))}</span>,
    filterFn: "custom" as any,
  },
  {
    accessorKey: "dailyChange",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Gunluk % <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <ReturnCell value={row.getValue("dailyChange")} />,
    filterFn: "custom" as any,
  },
  {
    accessorKey: "volume",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Hacim <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span>{formatLargeNumber(row.getValue("volume"))}</span>,
    filterFn: "custom" as any,
  },
  {
    accessorKey: "marketCap",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Piyasa Deg. <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span>{formatLargeNumber(row.getValue("marketCap"))}</span>,
    filterFn: "custom" as any,
  },
  {
    accessorKey: "peRatio",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        F/K <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span>{(row.getValue("peRatio") as number).toFixed(1)}</span>,
    filterFn: "custom" as any,
  },
  {
    accessorKey: "pbRatio",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        PD/DD <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span>{(row.getValue("pbRatio") as number).toFixed(2)}</span>,
    filterFn: "custom" as any,
  },
  {
    accessorKey: "weeklyReturn",
    header: "Haftalik",
    cell: ({ row }) => <ReturnCell value={row.getValue("weeklyReturn")} />,
    filterFn: "custom" as any,
  },
  {
    accessorKey: "monthlyReturn",
    header: "Aylik",
    cell: ({ row }) => <ReturnCell value={row.getValue("monthlyReturn")} />,
    filterFn: "custom" as any,
  },
  {
    accessorKey: "annualReturn",
    header: "Yillik",
    cell: ({ row }) => <ReturnCell value={row.getValue("annualReturn")} />,
    filterFn: "custom" as any,
  },
  {
    accessorKey: "sector",
    header: "Sektor",
    cell: ({ row }) => {
      const sector = row.getValue("sector") as string;
      return <Badge className={cn("text-xs", sectorColors[sector] ?? "")} variant="outline">{sector}</Badge>;
    },
    filterFn: "custom" as any,
  },
];

const filterableColumns = [
  { id: "name", title: "Sirket Adi", type: "string" as const },
  { id: "sector", title: "Sektor", type: "string" as const },
  { id: "price", title: "Fiyat", type: "number" as const },
  { id: "dailyChange", title: "Gunluk %", type: "number" as const },
  { id: "peRatio", title: "F/K Orani", type: "number" as const },
  { id: "pbRatio", title: "PD/DD", type: "number" as const },
  { id: "monthlyReturn", title: "Aylik Getiri", type: "number" as const },
  { id: "annualReturn", title: "Yillik Getiri", type: "number" as const },
  { id: "marketCap", title: "Piyasa Degeri", type: "number" as const },
];

const exportColumns = [
  { key: "symbol", header: "Hisse Kodu" },
  { key: "name", header: "Sirket Adi" },
  { key: "price", header: "Fiyat (TL)" },
  { key: "dailyChange", header: "Gunluk Degisim %" },
  { key: "volume", header: "Hacim" },
  { key: "marketCap", header: "Piyasa Degeri" },
  { key: "peRatio", header: "F/K Orani" },
  { key: "pbRatio", header: "PD/DD Orani" },
  { key: "weeklyReturn", header: "Haftalik Getiri %" },
  { key: "monthlyReturn", header: "Aylik Getiri %" },
  { key: "annualReturn", header: "Yillik Getiri %" },
  { key: "sector", header: "Sektor" },
];

export default function HisselerPage() {
  const { data, loading, error } = useDataFetch<Stock>("/api/stocks");

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Hisseler</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Hisseler</h1>
        <div className="text-destructive">Hata: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Hisseler</h1>
        <p className="text-muted-foreground mt-1">
          BIST hisse senetlerini filtreleyin, secin ve disa aktarin.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={data}
        filterableColumns={filterableColumns}
        searchKey="name"
        exportColumns={exportColumns}
        exportFileName="hisseler_export"
      />
    </div>
  );
}
