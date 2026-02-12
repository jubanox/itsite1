import { Lock, MessageSquare, Sparkles } from "lucide-react";

const BottomNav = () => {
  const items = [
    { icon: Lock, label: "Chave de Segurança" },
    { icon: MessageSquare, label: "BIA" },
    { icon: Sparkles, label: "Pix" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border">
      <div className="flex justify-around items-center py-3">
        {items.map((item) => (
          <button key={item.label} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <item.icon size={22} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
