import { HelpCircle } from "lucide-react";
import pixIcon from "@/assets/pix-icon.png";

const BottomNav = () => {
  const items = [
    { icon: <img src={pixIcon} alt="Área Pix" className="w-6 h-6" />, label: "Área Pix" },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>, label: "iToken" },
    { icon: <HelpCircle size={24} />, label: "Ajuda" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-4 pt-2" style={{ background: 'linear-gradient(135deg, #E55800 0%, #993200 100%)' }}>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <button
            key={item.label}
            className="flex flex-col items-start justify-between rounded-xl p-4 aspect-[4/3] transition-colors"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <span className="text-primary-foreground/90">{item.icon}</span>
            <span className="text-sm font-medium text-primary-foreground text-left">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
