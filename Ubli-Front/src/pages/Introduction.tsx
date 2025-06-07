import { AppSidebar } from "@/components/app-sidebar";
import Introduction from "@/components/introducitonInfo";
import {} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function IntroctionPage() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Introduction />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
