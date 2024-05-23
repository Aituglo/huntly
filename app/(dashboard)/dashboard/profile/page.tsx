import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileForm } from "@/components/forms/profile-form";

const breadcrumbItems = [{ title: "Profile", link: "/dashboard/profile" }];

export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <ProfileForm
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
