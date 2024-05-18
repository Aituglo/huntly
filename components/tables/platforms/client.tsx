"use client";
import { Button } from "@/components/ui/button";
import { BasicDataTable } from "@/components/ui/basic-data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Platform } from "@/types/platform";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";

interface PlatformsProps {
  data: Platform[];
}

export const PlatformClient: React.FC<PlatformsProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Bug Bounty Platforms`}
          description="Manage your platforms"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/platform/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <BasicDataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};