import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  columns: { key: string; header: string }[],
  fileName: string
): void {
  const wsData = [
    columns.map((c) => c.header),
    ...data.map((row) => columns.map((c) => row[c.key] ?? "")),
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws["!cols"] = columns.map(() => ({ wch: 18 }));
  XLSX.utils.book_append_sheet(wb, ws, "Veri");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${fileName}.xlsx`);
}

export function exportToCsv<T extends Record<string, unknown>>(
  data: T[],
  columns: { key: string; header: string }[],
  fileName: string
): void {
  const wsData = [
    columns.map((c) => c.header),
    ...data.map((row) => columns.map((c) => row[c.key] ?? "")),
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Veri");

  const csvOutput = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${fileName}.csv`);
}
