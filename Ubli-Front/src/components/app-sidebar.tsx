import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Breno",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Ubli",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Ubli",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Ubli",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Lugares",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Acessiveis",
          url: "#",
        },
        {
          title: "Parcialmente acessivel",
          url: "#",
        },
        {
          title: "Sem acessibilidade",
          url: "#",
        },
      ],
    },
    {
      title: "Ajuda",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Reportar Problema",
          url: "http://localhost:5173/reportar-problema",
        },
        {
          title: "Contato",
          url: "http://localhost:5173/contato",
        },
        {
          title: "Política de privacidade",
          url: "http://localhost:5173/politica-de-privacidade",
        },
      ],
    },
    {
      title: "Documentação",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Introdução",
          url: "#",
        },
        {
          title: "Tutoriais",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
