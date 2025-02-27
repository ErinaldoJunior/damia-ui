"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Payment } from "./data-table";
import { ColumnFilter } from "./column-filter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    meta: { type: "select" },
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column, table }) => {
      return (
        <ColumnFilter
          column={column}
          table={table}
          options={[
            {
              id: 1,
              name: "Active",
              value: "active",
              label: "Active",
            },
            {
              id: 2,
              name: "Inactive",
              value: "inactive",
              label: "Inactive",
            },
            {
              id: 3,
              name: "Processing",
              value: "Processing",
              label: "Processing",
            },
          ]}
        >
          <Button className="p-0 text-body-large gap-2.5" variant="ghost">
            <span>Status</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </ColumnFilter>
      );
    },
    meta: { type: "select" },

    cell: ({ row }) => (
      <div className="capitalize text-gray-700">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "employee",
    header: ({ column, table }) => {
      return (
        <ColumnFilter
          column={column}
          table={table}
          options={[
            {
              id: 1,
              name: "John Doe",
              value: "John Doe",
              label: "John Doe",
              avatar: "https://github.com/jaomateus.png",
            },
            {
              id: 2,
              name: "Diwanshu Midha",
              value: "Diwanshu Midha",
              label: "Diwanshu Midha",
              avatar: "https://github.com/ranirosa.png",
            },
            {
              id: 3,
              name: "Brett",
              value: "Brett",
              label: "Brett",
              avatar: "https://github.com/DanielaSimoes-WeAreMeta.png",
            },
          ]}
        >
          <Button className="p-0 text-body-large gap-2.5" variant="ghost">
            <span>Employee</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </ColumnFilter>
      );
    },
    meta: { type: "select" },

    cell: ({ row }) => {
      const fullData = row.original.employee;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              className="object-cover"
              src={fullData.avatar}
              alt={fullData.name}
              key={fullData.id}
            />

            <AvatarFallback>EP</AvatarFallback>
          </Avatar>

          <p className="text-body-small text-gray-700">{fullData.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    meta: { type: "date" },
    header: ({ column, table }) => {
      return (
        <ColumnFilter column={column} table={table}>
          <Button className="p-0 text-body-large gap-2.5" variant="ghost">
            <span>Date</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </ColumnFilter>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-gray-700">{row.getValue("date")}</div>
    ),
  },
  {
    accessorKey: "is_active",
    meta: { type: "boolean" },
    header: ({ column, table }) => {
      return (
        <ColumnFilter column={column} table={table}>
          <Button className="p-0 text-body-large gap-2.5" variant="ghost">
            <span>Active</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </ColumnFilter>
      );
    },
    cell: ({ row }) =>
      row.getValue("is_active") ? (
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" />
        </div>
      ),
  },
  {
    accessorKey: "notes",
    meta: { type: "string" },
    header: ({ column, table }) => {
      return (
        <ColumnFilter column={column} table={table}>
          <Button className="p-0 text-body-large gap-2.5" variant="ghost">
            <span>Notes</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </ColumnFilter>
      );
    },
    cell: ({ row }) => (
      <div className="text-gray-700">{row.getValue("notes")}</div>
    ),
  },
  {
    accessorKey: "amount",
    meta: { type: "number" },
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right text-gray-700">{formatted}</div>;
    },
  },
  {
    id: "actions",
    meta: { type: "actions" },
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
