import { Lock, MessageSquareMore, Diamond } from "lucide-react";

const BottomNav = () => {
  const items = [
    { icon: Lock, label: "Chave de\nSegurança" },
    { icon: MessageSquareMore, label: "BIA" },
    { icon: Diamond, label: "Pix" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#8C002A]">
      <div className="flex justify-around items-center py-3 px-2">
        {items.map((item, index) => (
          <button key={item.label} className="flex flex-col items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground transition-colors relative">
            {index > 0 && (
              <span className="absolute left-0 top-1 bottom-1 w-px bg-primary-foreground/20" />
            )}
            <item.icon size={22} />
            <span className="text-[10px] font-medium whitespace-pre-line text-center leading-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
