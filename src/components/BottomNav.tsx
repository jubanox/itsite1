import { Lock, MessageSquareMore } from "lucide-react";

const PixIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    {/* Top diamond */}
    <rect x="9.5" y="2" width="5" height="5" rx="0.5" transform="rotate(45 12 4.5)" />
    {/* Bottom diamond */}
    <rect x="9.5" y="17" width="5" height="5" rx="0.5" transform="rotate(45 12 19.5)" />
    {/* Left diamond */}
    <rect x="2" y="9.5" width="5" height="5" rx="0.5" transform="rotate(45 4.5 12)" />
    {/* Right diamond */}
    <rect x="17" y="9.5" width="5" height="5" rx="0.5" transform="rotate(45 19.5 12)" />
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
