"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Report } from "@/types/report";

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "title",
    header: "TITLE",
  },
  {
    accessorKey: "program.name",
    header: "PROGRAM",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];