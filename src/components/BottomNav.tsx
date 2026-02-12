import { Lock, MessageSquareMore } from "lucide-react";

const PixIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="currentColor">
    <path d="M380.2 295.6l-67.5-67.5c-5.5-5.5-14.4-5.5-19.8 0l-0.1 0.1c-5.5 5.5-14.4 5.5-19.8 0L205.5 160.7c-5.5-5.5-14.4-5.5-19.8 0l-74.5 74.5c-5.5 5.5-5.5 14.4 0 19.8l67.5 67.5c5.5 5.5 14.4 5.5 19.8 0l67.5-67.5c5.5-5.5 14.4-5.5 19.8 0l67.5 67.5c5.5 5.5 14.4 5.5 19.8 0l74.5-74.5c5.5-5.5 5.5-14.4 0-19.8L380.2 295.6z"/>
    <path d="M392.1 131.9L326.6 66.4c-10.9-10.9-28.7-10.9-39.6 0L256 97.4l-31-31c-10.9-10.9-28.7-10.9-39.6 0L119.9 131.9c-10.9 10.9-10.9 28.7 0 39.6l65.5 65.5 9.9-9.9c5.5-5.5 14.4-5.5 19.8 0l67.5 67.5c2.7 2.7 6.3 4.1 9.9 4.1s7.2-1.4 9.9-4.1l9.9-9.9 65.5-65.5C403 160.5 403 142.8 392.1 131.9z"/>
    <path d="M392.1 340.5l-65.5-65.5-9.9 9.9c-5.5 5.5-14.4 5.5-19.8 0l-67.5-67.5c-5.5-5.5-14.4-5.5-19.8 0l-9.9 9.9-65.5 65.5c-10.9 10.9-10.9 28.7 0 39.6l65.5 65.5c10.9 10.9 28.7 10.9 39.6 0L256 414.6l31 31c10.9 10.9 28.7 10.9 39.6 0l65.5-65.5C403 369.2 403 351.4 392.1 340.5z"/>
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
