import * as React from "react";

import {
    SidebarMenu,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Defina os caminhos para suas imagens
const LOGO_EXPANDIDO = "src/images/logo-completo.png";
const LOGO_COLAPSADO = "src/images/logo-icon.png";

export function TeamSwitcher({
    teams,
}: {
    teams: {
        name: string;
        logo: string;
        plan: string;
    }[];
}) {
    const [activeTeam] = React.useState(teams[0]);
    const { state } = useSidebar(); // Usamos o hook para obter o estado atual

    if (!activeTeam) {
        return null;
    }

    // Determinamos qual logo usar com base no estado da sidebar
    const currentLogo = state === "expanded" ? LOGO_EXPANDIDO : LOGO_COLAPSADO;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div
                    className={cn(
                        "flex items-center space-x-2 border-b border-b-gray-200",
                        state === "collapsed" && "justify-center"
                    )}
                >
                    <div className=" text-sidebar-primary-foreground flex aspect-square items-center h-20 justify-center rounded-lg p-1">
                        {" "}
                        {/* A imagem agora usa 'currentLogo' e pode ter classes diferentes */}
                        <a href="http://localhost:5173/">
                            <img
                                className={cn(
                                    "transition-all duration-200", // Adiciona uma transição suave
                                    state === "expanded"
                                        ? "max-w-30"
                                        : "max-w-15" // Ajusta o tamanho
                                )}
                                src={currentLogo} // Usa a variável com o logo correto
                                alt={activeTeam.name}
                            />
                        </a>
                    </div>
                    {/* renderizado condicionalmente */}
                    {state === "expanded" && (
                        <div className="grid flex-1 text-left text-sm leading-tight" />
                    )}
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
