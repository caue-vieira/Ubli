import { AppSidebar } from "@/components/app-sidebar";
import PoliticaPrivacidade from "@/components/politica-privacidade";
import {} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function PoliticaDePrivacidade() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <PoliticaPrivacidade />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
