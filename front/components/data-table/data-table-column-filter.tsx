"use client";

import { useState } from "react";
import { Column } from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  operatorLabels,
  numericOperators,
  stringOperators,
} from "@/lib/filters";
import { FilterOperator } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DataTableColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  type: "string" | "number";
}

export function DataTableColumnFilter<TData, TValue>({
  column,
  title,
  type,
}: DataTableColumnFilterProps<TData, TValue>) {
  const currentFilter = column.getFilterValue() as
    | { operator: FilterOperator; value: string | number }
    | undefined;

  const [operator, setOperator] = useState<FilterOperator>(
    currentFilter?.operator ?? (type === "number" ? "gt" : "contains")
  );
  const [value, setValue] = useState<string>(
    currentFilter?.value?.toString() ?? ""
  );
  const [open, setOpen] = useState(false);

  const operators = type === "number" ? numericOperators : stringOperators;
  const isActive = !!currentFilter;

  const handleApply = () => {
    const filterValue = type === "number" ? Number(value) : value;
    if (value === "") {
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue({ operator, value: filterValue });
    }
    setOpen(false);
  };

  const handleClear = () => {
    column.setFilterValue(undefined);
    setValue("");
    setOperator(type === "number" ? "gt" : "contains");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-8 gap-1", isActive && "border-primary text-primary")}
        >
          <Filter className="h-3.5 w-3.5" />
          {title}
          {isActive && (
            <span className="ml-1 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
              1
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="start">
        <div className="space-y-3">
          <p className="text-sm font-medium">{title} Filtrele</p>

          <Select
            value={operator}
            onValueChange={(val) => setOperator(val as FilterOperator)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {operators.map((op) => (
                <SelectItem key={op} value={op}>
                  {operatorLabels[op]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type={type === "number" ? "number" : "text"}
            placeholder="Deger girin..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            className="h-8"
          />

          <div className="flex gap-2">
            <Button size="sm" onClick={handleApply} className="flex-1 h-8">
              Uygula
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClear}
              className="flex-1 h-8"
            >
              Temizle
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
