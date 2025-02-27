"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { columns } from "./columns";

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "active",
    notes: "This is a note",
    date: "2022-01-01",
    employee: {
      name: "John Doe",
      avatar: "https://github.com/DanielaSimoes-WeAreMeta.png",
      id: 1,
    },
    is_active: false,
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "inactive",
    notes: "This is a note",
    date: "2022-01-01",
    employee: {
      name: "John Doe",
      avatar: "https://github.com/ranirosa.png",
      id: 1,
    },
    is_active: true,
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "inactive",
    notes: "This is a note",
    date: "2022-01-01",
    employee: {
      name: "John Doe",
      avatar: "https://github.com/jaomateus.png",
      id: 1,
    },
    is_active: true,
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "active",
    notes: "This is a note",
    date: "2022-01-01",
    employee: {
      name: "John Doe",
      avatar: "https://github.com/jaomateus.png",
      id: 1,
    },
    is_active: false,
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "inactive",
    notes: "This is a note",
    date: "2022-01-01",
    employee: {
      name: "John Doe",
      avatar: "https://github.com/ranirosa.png",
      id: 1,
    },
    is_active: true,
  },
];

export type Payment = {
  id: string;
  amount: number;
  status: "active" | "inactive";
  notes: string;
  date: string;
  employee: {
    name: string;
    avatar: string;
    id: number;
  };
  is_active: boolean;
};

export default function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div
        className="rounded-md border"
        style={{
          borderRadius: "0.5rem 0.5rem 0 0",
        }}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end px-6 py-3 border-l border-r border-b rounded-b-md">
        <p className="text-gray-700 text-sm">
          Showing {table.getRowModel().rows.length} of X
        </p>
      </div>
    </div>
  );
}
