import BreadCrumb from "@/components/breadcrumb";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlatformForm } from "@/components/forms/platform-form";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

const breadcrumbItems = [{ title: "Platforms", link: "/dashboard/platforms" }];

export default async function page({ params }: { params: { platformId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");

  const platform = await prisma.platform.findUnique({
    where: {
      id: params.platformId,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      email: true,
      type: true,
    },
  });

  if (platform) {
    platform.platform = platform.slug;
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <PlatformForm
          initialData={platform}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
