import { Lock, MessageSquareMore } from "lucide-react";
import pixIcon from "@/assets/pix-icon.png";

const BottomNav = () => {
  const items = [
    { icon: Lock, label: "Chave de\nSegurança", isPix: false },
    { icon: MessageSquareMore, label: "BIA", isPix: false },
    { icon: null, label: "Pix", isPix: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto" style={{ background: 'linear-gradient(135deg, #A30032 0%, #7a0025 100%)' }}>
      <div className="flex items-stretch">
        {items.map((item, index) => (
          <button
            key={item.label}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            style={index > 0 ? { borderLeft: '1px solid rgba(255,255,255,0.15)' } : {}}
          >
            {item.isPix ? <img src={pixIcon} alt="Pix" className="w-[22px] h-[22px]" /> : item.icon && <item.icon size={22} />}
            <span className="text-[10px] font-medium whitespace-pre-line text-center leading-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
