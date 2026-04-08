import { CheckCircle } from "lucide-react";
import itauLogo from "@/assets/itau-logo.png";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const Sucesso = () => {
  useVisitorTracking("sucesso");
  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col items-center" style={{ background: 'linear-gradient(135deg, #FE5200 0%, #CC4200 100%)' }}>
      <div className="pt-16 pb-10 flex flex-col items-center">
        <img src={itauLogo} alt="Itaú" className="h-12" />
      </div>

      <div className="mx-5 bg-white rounded-2xl p-8 flex flex-col items-center w-[calc(100%-40px)]">
        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-5">
          <CheckCircle className="text-[#FE5200]" size={36} />
        </div>
        <h1 className="text-foreground font-bold text-xl mb-2">Resgate confirmado!</h1>
        <p className="text-muted-foreground text-sm text-center mb-6">
          O valor será creditado em sua conta em até 24 horas.
        </p>
        <div className="w-full border border-border rounded-xl p-4 flex flex-col items-center mb-5">
          <p className="text-muted-foreground text-xs mb-1">Valor do resgate</p>
          <p className="text-[#FE5200] font-bold text-2xl">R$ 2.508,50</p>
        </div>
        <p className="text-muted-foreground text-xs text-center">
          Você receberá uma confirmação por SMS.
        </p>
      </div>
    </div>
  );
};

export default Sucesso;
