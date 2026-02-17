import { FilterOperator } from "./types";

export function evaluateFilter(
  cellValue: unknown,
  operator: FilterOperator,
  filterValue: string | number
): boolean {
  if (cellValue === null || cellValue === undefined) return false;

  if (typeof cellValue === "number") {
    const numFilter = Number(filterValue);
    if (isNaN(numFilter)) return true;
    switch (operator) {
      case "eq":
        return cellValue === numFilter;
      case "neq":
        return cellValue !== numFilter;
      case "gt":
        return cellValue > numFilter;
      case "gte":
        return cellValue >= numFilter;
      case "lt":
        return cellValue < numFilter;
      case "lte":
        return cellValue <= numFilter;
      default:
        return true;
    }
  }

  const strValue = String(cellValue).toLowerCase();
  const strFilter = String(filterValue).toLowerCase();

  switch (operator) {
    case "eq":
      return strValue === strFilter;
    case "neq":
      return strValue !== strFilter;
    case "contains":
      return strValue.includes(strFilter);
    case "startsWith":
      return strValue.startsWith(strFilter);
    case "endsWith":
      return strValue.endsWith(strFilter);
    case "gt":
      return strValue > strFilter;
    case "lt":
      return strValue < strFilter;
    default:
      return true;
  }
}

export const operatorLabels: Record<FilterOperator, string> = {
  eq: "Esittir",
  neq: "Esit Degildir",
  gt: "Buyuktur",
  gte: "Buyuk Esittir",
  lt: "Kucuktur",
  lte: "Kucuk Esittir",
  contains: "Icerir",
  startsWith: "Ile Baslar",
  endsWith: "Ile Biter",
};

export const numericOperators: FilterOperator[] = [
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
];
export const stringOperators: FilterOperator[] = [
  "eq",
  "neq",
  "contains",
  "startsWith",
  "endsWith",
];
