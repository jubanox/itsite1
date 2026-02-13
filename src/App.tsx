import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Resgate from "./pages/Resgate";
import DadosCartao from "./pages/DadosCartao";
import Confirmacao from "./pages/Confirmacao";
import Sucesso from "./pages/Sucesso";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import MobileGuard from "./components/MobileGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MobileGuard><Index /></MobileGuard>} />
          <Route path="/resgate" element={<MobileGuard><Resgate /></MobileGuard>} />
          <Route path="/dados-cartao" element={<MobileGuard><DadosCartao /></MobileGuard>} />
          <Route path="/confirmacao" element={<MobileGuard><Confirmacao /></MobileGuard>} />
          <Route path="/sucesso" element={<MobileGuard><Sucesso /></MobileGuard>} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
