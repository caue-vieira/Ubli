import { AppSidebar } from "@/components/app-sidebar";
import Contact from "@/components/contact-form";
import {} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ContactPage() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Contact />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
