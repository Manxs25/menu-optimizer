import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

const CAT_COLORS = {
  Star: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800", badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
  Plowhorse: { bg: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800", badge: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  Puzzle: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800", badge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  Dog: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800", badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
};

const PRIORITY_CONFIG = {
  high: { label: "🔥 High Priority", cls: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" },
  medium: { label: "⚠️ Medium", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" },
  good: { label: "✅ Good", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" },
};

// ─── Shared Navbar (same in Dashboard + Optimize) ────────────────────────────
export function Navbar({ dark, setDark, user, onLogout }) {
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
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${location.pathname === path
                  ? "bg-emerald-500 text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
            >
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
        <button
          onClick={() => setDark((d) => !d)}
          className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          {dark ? "☀️" : "🌙"}
        </button>
        {onLogout && (
          <button
            onClick={onLogout}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}

// ─── Restaurant Profile Header ────────────────────────────────────────────────
function RestaurantHeader({ stats, user }) {
  const [isOpen, setIsOpen] = useState(true);
  const dogsCount = stats.dogs || 0;
  const healthScore = stats.health || 0;
  const restaurantName = user?.name || "Your Restaurant";
  const accountEmail = user?.email || "Restaurant account";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-slate-700/50 shadow-xl">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      </div>

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Restaurant Logo / Avatar */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-3xl sm:text-4xl shadow-lg">
              🍽️
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{restaurantName}</h1>
              <div className="flex items-center gap-1 bg-amber-400/20 border border-amber-400/30 rounded-full px-2 py-0.5">
                <span className="text-amber-400 text-xs">⭐</span>
                <span className="text-amber-300 text-xs font-bold">4.2</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mb-3">
              <span className="flex items-center gap-1">
                <span>📍</span> Account workspace
              </span>
              <span className="text-slate-600">•</span>
              <span>{accountEmail}</span>
              <span className="text-slate-600">•</span>
              <span>Private menu data</span>
            </div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsOpen((o) => !o)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isOpen
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                    : "bg-red-500/20 border border-red-500/40 text-red-400"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                {isOpen ? "Open Now" : "Closed"}
              </button>
              <span className="flex items-center gap-1 bg-slate-700/60 border border-slate-600/40 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                🍴 {stats.totalItems || 0} Menu Items
              </span>
              <span className="flex items-center gap-1 bg-slate-700/60 border border-slate-600/40 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                📊 Menu Health: <span className={`ml-1 font-bold ${healthScore >= 70 ? "text-emerald-400" : healthScore >= 40 ? "text-amber-400" : "text-red-400"}`}>{healthScore}%</span>
              </span>
              {dogsCount > 0 && (
                <span className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-xs font-medium">
                  ⚠️ {dogsCount} item{dogsCount > 1 ? "s" : ""} need attention
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats Column */}
          <div className="hidden lg:flex flex-col gap-2 flex-shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center min-w-[120px]">
              <p className="text-xs text-slate-400 mb-0.5">Monthly Revenue</p>
              <p className="text-xl font-bold text-white">₹{((stats.totalProfit || 0) * 3).toLocaleString("en-IN")}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-center min-w-[120px]">
              <p className="text-xs text-emerald-400 mb-0.5">Net Profit</p>
              <p className="text-xl font-bold text-emerald-300">₹{(stats.totalProfit || 0).toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPISection({ stats }) {
  const cards = [
    { label: "Total Monthly Profit", value: `₹${(stats.totalProfit || 0).toLocaleString("en-IN")}`, sub: "+12% vs last month", subColor: "text-emerald-500", icon: "💰" },
    { label: "Avg Profit per Dish", value: `₹${stats.avgProfit || 0}`, sub: "Across all items", subColor: "text-slate-400", icon: "🍽️" },
    { label: "Menu Health", value: `${stats.health || 0}%`, sub: stats.health >= 70 ? "Good shape" : "Needs attention", subColor: stats.health >= 70 ? "text-emerald-500" : "text-red-400", icon: "📊" },
    { label: "Items Needing Attention", value: stats.dogs || 0, sub: "Remove or rework", subColor: "text-red-400", icon: "🚨" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{c.label}</span>
            <span className="text-xl">{c.icon}</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{c.value}</p>
          <p className={`text-xs font-medium ${c.subColor}`}>{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

function InsightsSummary({ stats }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Menu Insights</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: "Stars", count: stats.stars || 0, emoji: "⭐", color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Puzzles", count: stats.puzzles || 0, emoji: "🧩", color: "text-amber-600 dark:text-amber-400" },
          { label: "Plowhorses", count: stats.plowhorses || 0, emoji: "🐄", color: "text-orange-600 dark:text-orange-400" },
          { label: "Dogs", count: stats.dogs || 0, emoji: "🐶", color: "text-red-600 dark:text-red-400" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 bg-red-50 dark:bg-red-950/40 rounded-xl px-4 py-2.5 text-sm text-red-700 dark:text-red-300 font-medium">🔥 {stats.dogs || 0} items reducing your profit</div>
        <div className="flex-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl px-4 py-2.5 text-sm text-emerald-700 dark:text-emerald-300 font-medium">📈 {stats.stars || 0} items performing well</div>
      </div>
    </div>
  );
}

function PriorityBanner({ dishes }) {
  const dogs = dishes.filter((d) => d.category === "Dog");
  if (dogs.length === 0) return null;
  return (
    <div className="rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 p-5 text-white shadow-lg">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🔥</span>
        <div>
          <p className="font-bold text-lg mb-1">Fix These First</p>
          <p className="text-red-100 text-sm mb-2">These items are hurting your profitability and should be prioritized immediately.</p>
          <div className="flex flex-wrap gap-2">
            {dogs.map((d) => <span key={d._id} className="bg-white/20 backdrop-blur rounded-lg px-3 py-1 text-sm font-semibold">{d.name}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIMicrocopy({ dishes }) {
  const navigate = useNavigate();
  const star = dishes.find((d) => d.category === "Star");
  const dog = dishes.find((d) => d.category === "Dog");
  return (
    <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">AI</div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">AI Recommendations</span>
        </div>
        <button onClick={() => navigate("/optimize")} className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-3 py-1 rounded-lg hover:bg-emerald-500/10 transition-colors">Full Report →</button>
      </div>
      <div className="space-y-2">
        {star && <p className="text-slate-300 text-sm">💡 We recommend <span className="text-white font-semibold">{star.name}</span> for your weekend promotion — strong margins and high demand make it ideal.</p>}
        {dog && <p className="text-slate-300 text-sm">⚠️ <span className="text-white font-semibold">{dog.name}</span> is underperforming and actively reducing profit. Review or remove it this week.</p>}
        {!star && !dog && <p className="text-slate-400 text-sm">Add dishes to get AI-powered recommendations.</p>}
      </div>
    </div>
  );
}

function DishModal({ dish, onClose, onDelete, onUpdate }) {
  const [mode, setMode] = useState("view");
  const [form, setForm] = useState({ name: dish.name, price: dish.price, cost: dish.cost, orders: dish.orders });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!dish) return null;
  const colors = CAT_COLORS[dish.category] || CAT_COLORS.Dog;
  const priority = PRIORITY_CONFIG[dish.priority] || PRIORITY_CONFIG.medium;

  const handleUpdate = async () => {
    if (!form.name || !form.price || !form.cost) return setError("Name, price and cost are required.");
    if (Number(form.cost) >= Number(form.price)) return setError("Cost must be less than price.");
    setLoading(true); setError("");
    try {
      await API.put(`/menu/${dish._id}`, { name: form.name, price: Number(form.price), cost: Number(form.cost), orders: Number(form.orders) || 0 });
      onUpdate(); onClose();
    } catch (err) { setError(err.response?.data?.error || "Failed to update dish."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
        <div className={`rounded-t-3xl p-6 ${colors.bg} border-b ${colors.border}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{dish.emoji}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>{dish.category}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{dish.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white/60 dark:bg-slate-800/60 rounded-xl p-1 gap-1">
                {["view", "edit"].map((m) => (
                  <button key={m} onClick={() => { setMode(m); setError(""); }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${mode === m ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>
                    {m === "view" ? "👁 View" : "✏️ Edit"}
                  </button>
                ))}
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/60 dark:bg-slate-800/60 flex items-center justify-center text-slate-500 hover:text-slate-700 text-lg">×</button>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {mode === "view" && (
            <>
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Profit Breakdown</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[{ label: "Price", value: `₹${dish.price}`, color: "text-slate-700 dark:text-slate-200" }, { label: "Cost", value: `₹${dish.cost}`, color: "text-red-500" }, { label: "Profit", value: `₹${dish.unitProfit}`, color: "text-emerald-500" }].map((item) => (
                    <div key={item.label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                      <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                      <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3"><p className="text-xs text-slate-500 mb-1">Monthly Orders</p><p className="text-xl font-bold text-slate-900 dark:text-white">{dish.orders}</p></div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3"><p className="text-xs text-slate-500 mb-1">Profit Margin</p><p className="text-xl font-bold text-slate-900 dark:text-white">{dish.margin}%</p></div>
              </div>
              <div className={`rounded-xl p-4 ${colors.bg} border ${colors.border}`}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500">Why this category?</p>
                <p className={`text-sm font-medium ${colors.text}`}>{dish.why}</p>
              </div>
              <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500">Recommendation</p>
                <p className="text-sm text-white font-medium">{dish.suggestion}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${priority.cls}`}>{priority.label}</span>
                <button onClick={() => onDelete(dish._id)} className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors">🗑️ Delete Dish</button>
              </div>
            </>
          )}
          {mode === "edit" && (
            <>
              {error && <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">⚠️ {error}</div>}
              <div className="space-y-4">
                {[{ key: "name", label: "Dish Name", type: "text", placeholder: "e.g. Butter Chicken" }, { key: "price", label: "Selling Price (₹)", type: "number", placeholder: "e.g. 320" }, { key: "cost", label: "Cost Price (₹)", type: "number", placeholder: "e.g. 110" }, { key: "orders", label: "Monthly Orders", type: "number", placeholder: "e.g. 200" }].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
                  </div>
                ))}
              </div>
              {form.price && form.cost && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Profit preview</span>
                  <span className={`text-sm font-bold ${Number(form.price) - Number(form.cost) > 0 ? "text-emerald-500" : "text-red-500"}`}>
                    ₹{Number(form.price) - Number(form.cost)} ({form.price > 0 ? Math.round(((form.price - form.cost) / form.price) * 100) : 0}% margin)
                  </span>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => { setMode("view"); setError(""); }} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl py-3 text-sm transition-colors">Cancel</button>
                <button onClick={handleUpdate} disabled={loading} className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition-colors">{loading ? "Saving..." : "Save Changes"}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AddDishModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", price: "", cost: "", orders: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.cost) return setError("Name, price and cost are required.");
    if (Number(form.cost) >= Number(form.price)) return setError("Cost must be less than price.");
    setLoading(true); setError("");
    try {
      await API.post("/menu/add", { name: form.name, price: Number(form.price), cost: Number(form.cost), orders: Number(form.orders) || 0 });
      onAdd(); onClose();
    } catch (err) { setError(err.response?.data?.error || "Failed to add dish."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Dish</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-lg">×</button>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">⚠️ {error}</div>}
          {[{ key: "name", label: "Dish Name", placeholder: "e.g. Butter Chicken", type: "text" }, { key: "price", label: "Selling Price (₹)", placeholder: "e.g. 320", type: "number" }, { key: "cost", label: "Cost Price (₹)", placeholder: "e.g. 110", type: "number" }, { key: "orders", label: "Monthly Orders", placeholder: "e.g. 200", type: "number" }].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
            </div>
          ))}
          {form.price && form.cost && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Profit preview</span>
              <span className={`text-sm font-bold ${Number(form.price) - Number(form.cost) > 0 ? "text-emerald-500" : "text-red-500"}`}>
                ₹{Number(form.price) - Number(form.cost)} ({form.price > 0 ? Math.round(((form.price - form.cost) / form.price) * 100) : 0}% margin)
              </span>
            </div>
          )}
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition-colors mt-2">{loading ? "Adding..." : "Add Dish"}</button>
        </div>
      </div>
    </div>
  );
}

function DishCard({ dish, onClick }) {
  const colors = CAT_COLORS[dish.category] || CAT_COLORS.Dog;
  const priority = PRIORITY_CONFIG[dish.priority] || PRIORITY_CONFIG.medium;
  return (
    <div onClick={() => onClick(dish)} className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border ${colors.border} shadow-sm hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 group`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{dish.emoji}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>{dish.category}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{dish.name}</h3>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${priority.cls}`}>{priority.label}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[{ label: "Price", value: `₹${dish.price}` }, { label: "Cost", value: `₹${dish.cost}` }, { label: "Orders", value: dish.orders }].map((s) => (
          <div key={s.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500 dark:text-slate-400">Profit per dish</span>
        <span className={`text-sm font-bold ${colors.text}`}>₹{dish.unitProfit} ({dish.margin}%)</span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">{dish.why}</p>
      <div className={`rounded-lg px-3 py-2 text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>💡 {dish.suggestion}</div>
    </div>
  );
}

function FilterBar({ filter, setFilter, sort, setSort }) {
  const filters = ["All", "Star", "Puzzle", "Plowhorse", "Dog"];
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-slate-500 dark:text-slate-400">Sort by</span>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none">
          <option value="orders">Orders</option>
          <option value="unitProfit">Profit</option>
          <option value="margin">Margin</option>
        </select>
      </div>
    </div>
  );
}

export default function Dashboard({ user, onLogout }) {
  const [dark, setDark] = useState(() => { try { return localStorage.getItem("mo-dark") === "true"; } catch { return false; } });
  const [dishes, setDishes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("orders");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("mo-dark", dark); } catch {}
  }, [dark]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analysisRes, statsRes] = await Promise.all([API.get("/menu/analysis"), API.get("/menu/stats")]);
      setDishes(analysisRes.data.results || []);
      setStats(statsRes.data);
    } catch (err) { console.error("Fetch error:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    try { await API.delete(`/menu/${id}`); setSelectedDish(null); fetchData(); }
    catch (err) { console.error("Delete error:", err); }
  };

  const filteredDishes = dishes.filter((d) => filter === "All" || d.category === filter).sort((a, b) => (b[sort] || 0) - (a[sort] || 0));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar dark={dark} setDark={setDark} user={user} onLogout={onLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Loading your menu data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Restaurant Profile Header — NEW */}
            <RestaurantHeader stats={stats} user={user} />

            <KPISection stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InsightsSummary stats={stats} />
              <AIMicrocopy dishes={dishes} />
            </div>
            <PriorityBanner dishes={dishes} />
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  All Dishes <span className="ml-2 text-sm font-normal text-slate-400">({filteredDishes.length} items)</span>
                </h2>
                <button onClick={() => setShowAddModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2">+ Add Dish</button>
              </div>
              <FilterBar filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} />
              {filteredDishes.length === 0 ? (
                <div className="text-center py-20 text-slate-400 dark:text-slate-600">
                  <p className="text-4xl mb-3">🍽️</p>
                  <p className="font-medium">No dishes yet</p>
                  <p className="text-sm mt-1">Click "Add Dish" to get started</p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredDishes.map((dish) => <DishCard key={dish._id} dish={dish} onClick={setSelectedDish} />)}
                </div>
              )}
            </div>
          </>
        )}
      </main>
      {selectedDish && <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} onDelete={handleDelete} onUpdate={() => { setSelectedDish(null); fetchData(); }} />}
      {showAddModal && <AddDishModal onClose={() => setShowAddModal(false)} onAdd={() => fetchData()} />}
    </div>
  );
}
