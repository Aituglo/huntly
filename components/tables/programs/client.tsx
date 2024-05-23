"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Program } from "@/types/program";
import { columns } from "./columns";

interface ProgramsProps {
  data: Program[];
}

export const ProgramClient: React.FC<ProgramsProps> = ({ data }) => {
  const { toast } = useToast();

  const handleReload = () => {
    fetch("/api/program/reload").then((res) => {
      if (res.ok) {
        toast({
          variant: "default",
          title: "Programs reloaded",
        });
      } else {
        toast({
          variant: "default",
          title: "Error reloading programs",
        });
      }
    })
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Programs`}
          description="Manage your programs"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => handleReload()}
        >
          Reload
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} filterBy="type" />
    </>
  );
};