"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Program } from "@/types/program";

export const columns: ColumnDef<Program>[] = [
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "type",
    header: "TYPE",
  },
  {
    accessorKey: "platform.name",
    header: "PLATFORM",
  },
  {
    accessorKey: "bountyMax",
    header: "BOUNTY MAX",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];