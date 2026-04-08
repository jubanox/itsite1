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
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X size={20} />
        </button>
        <div className="mb-6 text-center">
          <p className="text-card-foreground text-base leading-relaxed">
            Olá, cliente! Confira os pontos acumulados no seu CPF disponível para resgate. Estão bem próximos de expirar. Aproveite a Livelo ao máximo, sabia que na Livelo seus pontos viram dinheiro?
          </p>
        </div>
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
        >
          Consultar
        </button>
      </div>
    </div>
  );
};

export default AttentionModal;
