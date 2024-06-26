import BreadCrumb from "@/components/breadcrumb";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Program } from "@/types/program";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProgramClient } from '@/components/tables/programs/client';

const breadcrumbItems = [{ title: "Programs", link: "/dashboard/programs" }];

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");

  const programs: Program[] = await prisma.program.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      platform: true,
    },
    orderBy: [
      {
        name: "asc",
      },
    ],
  });

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <ProgramClient data={programs} />
      </div>
    </ScrollArea>
  );
}
