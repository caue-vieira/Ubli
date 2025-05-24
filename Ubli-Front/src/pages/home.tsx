import { AppSidebar } from "@/components/app-sidebar";
import {} from "@/components/ui/breadcrumb";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import GoMap from "../components/maps/GoMap";

export default function Home() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <GoMap />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
