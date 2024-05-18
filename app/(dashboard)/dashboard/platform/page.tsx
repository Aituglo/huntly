import BreadCrumb from "@/components/breadcrumb";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Platform } from "@/types/platform";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlatformClient } from '@/components/tables/platforms/client';

const breadcrumbItems = [{ title: "Platforms", link: "/dashboard/platforms" }];

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");

  const platforms: Platform[] = await prisma.platform.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    select: {
      id: true,
      name: true,
      slug: true,
      hunterUsername: true,
      type: true,
    },
  });

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <PlatformClient data={platforms} />
      </div>
    </ScrollArea>
  );
}
