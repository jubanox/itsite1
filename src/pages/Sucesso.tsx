import { CheckCircle } from "lucide-react";
import bradescoLogoRed from "@/assets/bradesco-logo-red.png";

const Sucesso = () => {
  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col items-center" style={{ background: 'linear-gradient(135deg, #D7004D 0%, #A30032 100%)' }}>
      {/* Logo */}
      <div className="pt-16 pb-10 flex flex-col items-center">
        <img src={bradescoLogoRed} alt="Bradesco" className="h-10" />
      </div>

      {/* Card */}
      <div className="mx-5 bg-white rounded-2xl p-8 flex flex-col items-center w-[calc(100%-40px)]">
        <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-5">
          <CheckCircle className="text-[#D7004D]" size={36} />
        </div>
        <h1 className="text-foreground font-bold text-xl mb-2">Resgate confirmado!</h1>
        <p className="text-muted-foreground text-sm text-center mb-6">
          O valor será creditado em sua conta em até 24 horas.
        </p>
        <div className="w-full border border-border rounded-xl p-4 flex flex-col items-center mb-5">
          <p className="text-muted-foreground text-xs mb-1">Valor do resgate</p>
          <p className="text-[#D7004D] font-bold text-2xl">R$ 2.508,50</p>
        </div>
        <p className="text-muted-foreground text-xs text-center">
          Você receberá uma confirmação por SMS.
        </p>
      </div>
    </div>
  );
};

export default Sucesso;
