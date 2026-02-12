import { Lock, MessageSquareMore } from "lucide-react";

const PixIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L17 7L12 12L7 7L12 2Z" />
    <path d="M12 12L17 17L12 22L7 17L12 12Z" />
  </svg>
);

const BottomNav = () => {
  const items = [
    { icon: Lock, label: "Chave de\nSegurança" },
    { icon: MessageSquareMore, label: "BIA" },
    { icon: null, label: "Pix", customIcon: PixIcon },
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
            {item.customIcon ? <item.customIcon size={22} /> : item.icon && <item.icon size={22} />}
            <span className="text-[10px] font-medium whitespace-pre-line text-center leading-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
