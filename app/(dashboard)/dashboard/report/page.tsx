import BreadCrumb from "@/components/breadcrumb";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Report } from "@/types/report";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReportClient } from '@/components/tables/reports/client';

const breadcrumbItems = [{ title: "Reports", link: "/dashboard/reports" }];

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");

  const reports: Report[] = await prisma.report.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      platform: true, 
      program: true,      
    },
    orderBy: [
      {
        updatedDate: "desc",
      },
    ],
  });

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <ReportClient data={reports} />
      </div>
    </ScrollArea>
  );
}
