import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  ScatterChart, Scatter, ZAxis,
} from "recharts";

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ dark, setDark, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navLinks = [
  { label: "Dashboard", path: "/" },
  { label: "Menu Items", path: "/menu-items" },
  { label: "Analysis", path: "/analysis" },
  { label: "✨ AI Optimize", path: "/optimize" },
  { label: "📂 Bulk Upload", path: "/bulk-upload" },
];
  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">M</div>
          <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Menu Optimizer</span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map(({ label, path }) => (
            <button key={path} onClick={() => navigate(path)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === path ? "bg-emerald-500 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block font-medium">{user.name}</span>
          </div>
        )}
        <button onClick={() => setDark(d => !d)}
          className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          {dark ? "☀️" : "🌙"}
        </button>
        {onLogout && (
          <button onClick={onLogout}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors">
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}

const CAT_COLORS = {
  Star: "#10b981",
  Plowhorse: "#f97316",
  Puzzle: "#f59e0b",
  Dog: "#ef4444",
};

const CAT_BG = {
  Star: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Plowhorse: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Puzzle: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Dog: "bg-red-500/10 text-red-400 border-red-500/20",
};

// ─── Custom Tooltips ──────────────────────────────────────────────────────────
function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl">
      <p className="font-bold text-white text-sm mb-2">{d?.fullName}</p>
      <div className="space-y-1">
        <p className="text-xs text-slate-400">Monthly Profit: <span className="text-emerald-400 font-bold">₹{(d?.totalProfit || 0).toLocaleString("en-IN")}</span></p>
        <p className="text-xs text-slate-400">Profit/Dish: <span className="text-white font-semibold">₹{d?.unitProfit}</span></p>
        <p className="text-xs text-slate-400">Orders: <span className="text-white font-semibold">{d?.orders}</span></p>
        <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border mt-1 ${CAT_BG[d?.category]}`}>{d?.category}</span>
      </div>
    </div>
  );
}

function ScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl">
      <p className="font-bold text-white text-sm mb-2">{d?.name}</p>
      <p className="text-xs text-slate-400">Orders/month: <span className="text-white font-semibold">{d?.orders}</span></p>
      <p className="text-xs text-slate-400">Profit/dish: <span className="text-emerald-400 font-bold">₹{d?.unitProfit}</span></p>
      <p className="text-xs text-slate-400">Monthly revenue: <span className="text-white font-semibold">₹{d?.totalProfit?.toLocaleString("en-IN")}</span></p>
      <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border mt-1 ${CAT_BG[d?.category]}`}>{d?.category}</span>
    </div>
  );
}

// ─── Insight Card ─────────────────────────────────────────────────────────────
function InsightCard({ icon, title, value, sub, color }) {
  return (
    <div className={`relative overflow-hidden bg-slate-800/50 backdrop-blur rounded-2xl p-5 border border-slate-700/50`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${color}`}>{sub}</span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-slate-400 font-medium">{title}</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Analysis({ user, onLogout }) {
  const [dark, setDark] = useState(() => { try { return localStorage.getItem("mo-dark") === "true"; } catch { return false; } });
  const [dishes, setDishes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bar");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("mo-dark", dark); } catch {}
  }, [dark]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [a, s] = await Promise.all([API.get("/menu/analysis"), API.get("/menu/stats")]);
        setDishes(a.data.results || []);
        setStats(s.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // ── Data ──
  const activeDishes = dishes.filter(d => d.orders > 0);
  const zeroDishes = dishes.filter(d => d.orders === 0);

  const barData = [...dishes]
    .sort((a, b) => b.totalProfit - a.totalProfit)
    .map(d => ({
      name: d.name.length > 12 ? d.name.slice(0, 12) + "…" : d.name,
      fullName: d.name,
      totalProfit: d.totalProfit,
      unitProfit: d.unitProfit,
      orders: d.orders,
      category: d.category,
    }));

  const pieData = [
    { name: "Star ⭐", value: stats.stars || 0, color: CAT_COLORS.Star },
    { name: "Plowhorse 🐄", value: stats.plowhorses || 0, color: CAT_COLORS.Plowhorse },
    { name: "Puzzle 🧩", value: stats.puzzles || 0, color: CAT_COLORS.Puzzle },
    { name: "Dog 🐶", value: stats.dogs || 0, color: CAT_COLORS.Dog },
  ].filter(d => d.value > 0);

  const scatterData = activeDishes.map(d => ({
    name: d.name,
    orders: d.orders,
    unitProfit: d.unitProfit,
    totalProfit: d.totalProfit,
    category: d.category,
  }));

  // ── Revenue opportunity ──
  const lostRevenue = zeroDishes.reduce((acc, d) => acc + d.unitProfit * 50, 0);
  const topDish = [...dishes].sort((a, b) => b.totalProfit - a.totalProfit)[0];
  const dogLoss = dishes.filter(d => d.category === "Dog").reduce((acc, d) => acc + Math.abs(d.unitProfit) * (d.orders || 10), 0);

  const tabs = [
    { id: "bar", label: "📊 Profit by Dish" },
    { id: "pie", label: "🥧 Category Mix" },
    { id: "scatter", label: "🔵 Demand vs Profit" },
  ];

  const tickStyle = { fontSize: 11, fill: "#94a3b8" };

  return (
    <div className="min-h-screen bg-slate-950 transition-colors duration-300">
      <Navbar dark={dark} setDark={setDark} user={user} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Menu Performance</h1>
            <p className="text-sm text-slate-400 mt-1">Data-driven insights to grow your restaurant's profit</p>
          </div>
          <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            {dishes.length} dishes analyzed
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400 text-sm">Crunching your numbers...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Revenue Opportunity Banner */}
            {lostRevenue > 0 && (
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">💡</span>
                  <div>
                    <p className="font-bold text-amber-400 text-base mb-1">Revenue Opportunity Detected</p>
                    <p className="text-slate-300 text-sm">
                      You have <span className="text-white font-bold">{zeroDishes.length} dishes with zero orders</span>. 
                      If each gets just 50 orders/month, that's an estimated{" "}
                      <span className="text-emerald-400 font-bold">₹{lostRevenue.toLocaleString("en-IN")}/month</span> in additional profit.
                      Consider promoting or repricing these items.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <InsightCard
                icon="💰" title="Monthly Profit"
                value={`₹${(stats.totalProfit || 0).toLocaleString("en-IN")}`}
                sub="Total" color="bg-emerald-500/10 text-emerald-400"
              />
              <InsightCard
                icon="⭐" title="Star Dishes"
                value={stats.stars || 0}
                sub="Keep & promote" color="bg-emerald-500/10 text-emerald-400"
              />
              <InsightCard
                icon="🐶" title="Dog Dishes"
                value={stats.dogs || 0}
                sub="Needs action" color="bg-red-500/10 text-red-400"
              />
              <InsightCard
                icon="📈" title="Avg Margin"
                value={`${stats.margin || 0}%`}
                sub="Across menu" color="bg-blue-500/10 text-blue-400"
              />
            </div>

            {/* Top Performer Callout */}
            {topDish && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-5">
                  <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">🏆 Your Best Performer</p>
                  <p className="text-xl font-bold text-white mb-1">{topDish.name}</p>
                  <p className="text-sm text-slate-400 mb-3">Generating <span className="text-emerald-400 font-bold">₹{topDish.totalProfit?.toLocaleString("en-IN")}/month</span> in profit</p>
                  <p className="text-xs text-slate-500">💡 Feature this on your menu cover and social media to drive even more orders.</p>
                </div>
                <div className="bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20 rounded-2xl p-5">
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">⚠️ Immediate Action Required</p>
                  <p className="text-xl font-bold text-white mb-1">{stats.dogs || 0} Dog {stats.dogs === 1 ? "Item" : "Items"}</p>
                  <p className="text-sm text-slate-400 mb-3">Low profit + low demand = <span className="text-red-400 font-bold">dead weight on your menu</span></p>
                  <p className="text-xs text-slate-500">💡 Remove or rework these items this week to cut losses and simplify your kitchen operations.</p>
                </div>
              </div>
            )}

            {/* Charts */}
            <div className="bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden">
              {/* Tab Bar */}
              <div className="flex border-b border-slate-800 px-6 pt-5 gap-2">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* ── Bar Chart ── */}
                {activeTab === "bar" && (
                  <>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="font-bold text-white text-base">Monthly Profit by Dish</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Dishes with 0 orders show ₹0 — they need immediate attention</p>
                      </div>
                      <div className="flex gap-3">
                        {Object.entries(CAT_COLORS).map(([cat, color]) => (
                          <div key={cat} className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                            <span className="text-xs text-slate-400">{cat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={barData} margin={{ top: 5, right: 5, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+"k" : v}`} />
                        <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                        <Bar dataKey="totalProfit" radius={[6, 6, 0, 0]} maxBarSize={60}>
                          {barData.map((entry, i) => (
                            <Cell key={i} fill={CAT_COLORS[entry.category] || "#94a3b8"} fillOpacity={entry.totalProfit === 0 ? 0.3 : 1} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                )}

                {/* ── Pie Chart ── */}
                {activeTab === "pie" && (
                  <>
                    <div className="mb-6">
                      <h3 className="font-bold text-white text-base">Category Breakdown</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Ideal menu: 40% Stars, 30% Plowhorses, 20% Puzzles, 10% Dogs</p>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={75} outerRadius={130}
                            paddingAngle={3} dataKey="value"
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                            labelLine={false}>
                            {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                          <Tooltip formatter={(v) => [`${v} dishes`]} contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }} />
                          <Legend formatter={(value) => <span style={{ color: "#94a3b8", fontSize: "12px" }}>{value}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Benchmark comparison */}
                      <div className="w-full lg:w-64 space-y-3 shrink-0">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Mix vs Ideal</p>
                        {[
                          { cat: "Star", ideal: 40, actual: Math.round(((stats.stars || 0) / (stats.totalItems || 1)) * 100), color: CAT_COLORS.Star },
                          { cat: "Plowhorse", ideal: 30, actual: Math.round(((stats.plowhorses || 0) / (stats.totalItems || 1)) * 100), color: CAT_COLORS.Plowhorse },
                          { cat: "Puzzle", ideal: 20, actual: Math.round(((stats.puzzles || 0) / (stats.totalItems || 1)) * 100), color: CAT_COLORS.Puzzle },
                          { cat: "Dog", ideal: 10, actual: Math.round(((stats.dogs || 0) / (stats.totalItems || 1)) * 100), color: CAT_COLORS.Dog },
                        ].map(({ cat, ideal, actual, color }) => (
                          <div key={cat}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">{cat}</span>
                              <span style={{ color }} className="font-bold">{actual}% <span className="text-slate-600">/ {ideal}% ideal</span></span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${actual}%`, background: color }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── Scatter Chart ── */}
                {activeTab === "scatter" && (
                  <>
                    <div className="mb-6">
                      <h3 className="font-bold text-white text-base">Demand vs Profit Matrix</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Top-right = Stars (high demand + high profit) &nbsp;·&nbsp; Bottom-left = Dogs &nbsp;·&nbsp; Zero-order dishes excluded
                      </p>
                    </div>
                    {scatterData.length === 0 ? (
                      <div className="text-center py-20">
                        <p className="text-4xl mb-3">📊</p>
                        <p className="text-slate-400 font-medium">No dishes with orders yet</p>
                        <p className="text-slate-500 text-sm mt-1">Add monthly order counts to your dishes to see this chart</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={320}>
                        <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="orders" name="Monthly Orders" tick={tickStyle} axisLine={false} tickLine={false}
                            label={{ value: "Monthly Orders →", position: "insideBottom", offset: -15, fontSize: 11, fill: "#64748b" }} />
                          <YAxis dataKey="unitProfit" name="Profit/Dish" tick={tickStyle} axisLine={false} tickLine={false}
                            tickFormatter={v => `₹${v}`}
                            label={{ value: "Profit/Dish →", angle: -90, position: "insideLeft", offset: 10, fontSize: 11, fill: "#64748b" }} />
                          <ZAxis range={[80, 80]} />
                          <Tooltip content={<ScatterTooltip />} />
                          {Object.entries(CAT_COLORS).map(([cat, color]) => (
                            <Scatter key={cat} name={cat} data={scatterData.filter(d => d.category === cat)} fill={color} opacity={0.9} />
                          ))}
                          <Legend formatter={(value) => <span style={{ color: "#94a3b8", fontSize: "12px" }}>{value}</span>} />
                        </ScatterChart>
                      </ResponsiveContainer>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Full Breakdown Table */}
            <div className="bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-white">Full Dish Breakdown</h3>
                <span className="text-xs text-slate-500">{dishes.length} total items</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800/50">
                      {["Dish", "Category", "Price", "Cost", "Profit/dish", "Orders", "Monthly Profit", "Margin"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {[...dishes].sort((a, b) => b.totalProfit - a.totalProfit).map(d => (
                      <tr key={d._id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-4 py-3 font-semibold text-white group-hover:text-emerald-400 transition-colors">{d.name}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full border ${CAT_BG[d.category]}`}>
                            {d.emoji} {d.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300">₹{d.price}</td>
                        <td className="px-4 py-3 text-red-400">₹{d.cost}</td>
                        <td className="px-4 py-3 font-bold text-emerald-400">₹{d.unitProfit}</td>
                        <td className="px-4 py-3 text-slate-300">{d.orders === 0 ? <span className="text-red-400 font-semibold">⚠️ 0</span> : d.orders}</td>
                        <td className="px-4 py-3 font-bold text-white">
                          {d.totalProfit === 0 ? <span className="text-slate-500">—</span> : `₹${d.totalProfit.toLocaleString("en-IN")}`}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-bold ${d.margin >= 40 ? "text-emerald-400" : d.margin >= 20 ? "text-amber-400" : "text-red-400"}`}>
                            {d.margin}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}