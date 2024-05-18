import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlatformForm } from "@/components/forms/platform-form";

const breadcrumbItems = [{ title: "Platforms", link: "/dashboard/platforms/new" }];

export default async function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <PlatformForm
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
