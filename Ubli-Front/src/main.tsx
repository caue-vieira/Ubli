import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <SidebarProvider>
            <App />
        </SidebarProvider>
    </StrictMode>
);
