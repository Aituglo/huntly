"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Report } from "@/types/report";
import { columns } from "./columns";

interface ReportsProps {
  data: Report[];
}

export const ReportClient: React.FC<ReportsProps> = ({ data }) => {
  const { toast } = useToast();

  const handleReload = () => {
    fetch("/api/report/reload").then((res) => {
      if (res.ok) {
        toast({
          variant: "default",
          title: "Reports reloaded",
        });
      } else {
        toast({
          variant: "default",
          title: "Error reloading reports",
        });
      }
    })
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Reports`}
          description="Manage your reports"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => handleReload()}
        >
          Reload
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="title" columns={columns} data={data} />
    </>
  );
};