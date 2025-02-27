"use client";

import * as React from "react";
import { Column, Table } from "@tanstack/react-table";
import { MultiSelect } from "./multi-select";
import { Payment } from "./data-table";

export function ColumnFilter({
  children,
  column,
  options,
}: {
  children: React.ReactNode;
  column: Column<Payment>;
  table: Table<Payment>;
  options?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    avatar?: string;
    color?: string;
    reason?: string;
    id: number;
    name: string;
  }[];
}) {
  const [selectOptions, setSelectOptions] = React.useState(options);

  const handleFunction = () => {
    console.log("handleFunction");
  };

  return (
    <MultiSelect
      options={selectOptions || []}
      setSelectOptions={setSelectOptions}
      onValueChange={handleFunction}
      defaultValue={[]}
      variant="inverted"
      animation={2}
      maxCount={3}
      trigger={children}
      handlePinColumn={handleFunction}
      column={column}
      handleUnpinColumn={handleFunction}
      handleSorting={handleFunction}
      handleDateSelect={handleFunction}
      clearFilter={handleFunction}
      handleTagSelect={handleFunction}
      filters={null}
    />
  );
}
