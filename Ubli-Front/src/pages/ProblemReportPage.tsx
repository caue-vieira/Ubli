import { AppSidebar } from "@/components/app-sidebar";
import ProblemReportPage from "@/components/form-report-problem.tsx";
import {} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function PoliticaDePrivacidade() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <ProblemReportPage />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
