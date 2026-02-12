import { X } from "lucide-react";

interface AttentionModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const AttentionModal = ({ open, onClose, onContinue }: AttentionModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fixed inset-0 bg-[hsl(var(--overlay))]" onClick={onClose} />
      <div className="relative z-50 w-full max-w-sm mx-4 mb-8 bg-card rounded-2xl p-6 shadow-xl animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-card-foreground">ATENÇÃO!</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="mb-6">
          <p className="font-semibold text-card-foreground mb-1">Consulte seus pontos!</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tenha descontos em fatura, milhas aéreas e muito outros benefícios. Clique abaixo par continuar!
          </p>
        </div>
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
        >
          continuar
        </button>
      </div>
    </div>
  );
};

export default AttentionModal;
