import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

const CAT_COLORS = {
  Star:      { badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200", dot: "bg-emerald-500" },
  Plowhorse: { badge: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",   dot: "bg-orange-500" },
  Puzzle:    { badge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",       dot: "bg-amber-500" },
  Dog:       { badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",               dot: "bg-red-500" },
};

const PRIORITY_CONFIG = {
  high:   { label: "🔥 High",   cls: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" },
  medium: { label: "⚠️ Medium", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" },
  good:   { label: "✅ Good",   cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" },
};

// ─── Shared Navbar (matches Dashboard + Analysis) ─────────────────────────────
function Navbar({ dark, setDark, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navLinks = [
    { label: "Dashboard",    path: "/" },
    { label: "Menu Items",   path: "/menu-items" },
    { label: "Analysis",     path: "/analysis" },
    { label: "✨ AI Optimize", path: "/optimize" },
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
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === path
                  ? "bg-emerald-500 text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}>
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

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ dish, onClose, onSave }) {
  const [form, setForm] = useState({ name: dish.name, price: dish.price, cost: dish.cost, orders: dish.orders });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.name || !form.price || !form.cost) return setError("Name, price and cost are required.");
    if (Number(form.cost) >= Number(form.price)) return setError("Cost must be less than price.");
    setLoading(true); setError("");
    try {
      await API.put(`/menu/${dish._id}`, { name: form.name, price: Number(form.price), cost: Number(form.cost), orders: Number(form.orders) || 0 });
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update.");
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${dish.name}"?`)) return;
    try { await API.delete(`/menu/${dish._id}`); onSave(); onClose(); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Dish</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-lg">×</button>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">⚠️ {error}</div>}
          {[
            { key: "name",   label: "Dish Name",        type: "text",   placeholder: "e.g. Butter Chicken" },
            { key: "price",  label: "Selling Price (₹)", type: "number", placeholder: "e.g. 320" },
            { key: "cost",   label: "Cost Price (₹)",   type: "number", placeholder: "e.g. 110" },
            { key: "orders", label: "Monthly Orders",   type: "number", placeholder: "e.g. 200" },
          ].map((f) => (
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
          <div className="flex gap-3 pt-2">
            <button onClick={handleDelete} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-800 transition-colors">🗑️ Delete</button>
            <button onClick={onClose} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl py-2.5 text-sm transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={loading} className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors">{loading ? "Saving..." : "Save"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Modal ────────────────────────────────────────────────────────────────
function AddModal({ onClose, onAdd }) {
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
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add dish.");
    } finally { setLoading(false); }
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
          {[
            { key: "name",   label: "Dish Name",        type: "text",   placeholder: "e.g. Butter Chicken" },
            { key: "price",  label: "Selling Price (₹)", type: "number", placeholder: "e.g. 320" },
            { key: "cost",   label: "Cost Price (₹)",   type: "number", placeholder: "e.g. 110" },
            { key: "orders", label: "Monthly Orders",   type: "number", placeholder: "e.g. 200" },
          ].map((f) => (
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

// ─── Main Menu Items Page ─────────────────────────────────────────────────────
export default function MenuItems({ user, onLogout }) {
  const [dark, setDark] = useState(() => { try { return localStorage.getItem("mo-dark") === "true"; } catch { return false; } });
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [editDish, setEditDish] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("mo-dark", dark); } catch {}
  }, [dark]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/menu/analysis");
      setDishes(res.data.results || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = dishes
    .filter((d) => filter === "All" || d.category === filter)
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });

  const SortIcon = ({ col }) => (
    <span className="ml-1 text-slate-400">{sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar dark={dark} setDark={setDark} user={user} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Menu Items</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{filtered.length} of {dishes.length} dishes</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 w-fit">
            + Add Dish
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input type="text" placeholder="Search dishes..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
            {["All", "Star", "Puzzle", "Plowhorse", "Dog"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Loading dishes...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-600">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="font-medium">No dishes found</p>
            <p className="text-sm mt-1">{search ? "Try a different search term" : "Click \"Add Dish\" to get started"}</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    {[
                      { key: "name",       label: "Dish Name" },
                      { key: "category",   label: "Category" },
                      { key: "price",      label: "Price" },
                      { key: "cost",       label: "Cost" },
                      { key: "unitProfit", label: "Profit" },
                      { key: "margin",     label: "Margin" },
                      { key: "orders",     label: "Orders" },
                      { key: "priority",   label: "Priority" },
                    ].map((col) => (
                      <th key={col.key} onClick={() => handleSort(col.key)}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 select-none whitespace-nowrap">
                        {col.label}<SortIcon col={col.key} />
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filtered.map((dish) => {
                    const colors = CAT_COLORS[dish.category] || CAT_COLORS.Dog;
                    const priority = PRIORITY_CONFIG[dish.priority] || PRIORITY_CONFIG.medium;
                    return (
                      <tr key={dish._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{dish.emoji}</span>
                            <span className="font-semibold text-slate-900 dark:text-white text-sm">{dish.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${colors.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
                            {dish.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-700 dark:text-slate-300 font-medium">₹{dish.price}</td>
                        <td className="px-4 py-3.5 text-sm text-red-500 font-medium">₹{dish.cost}</td>
                        <td className="px-4 py-3.5 text-sm text-emerald-500 font-bold">₹{dish.unitProfit}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${dish.margin >= 50 ? "bg-emerald-500" : dish.margin >= 30 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.min(dish.margin, 100)}%` }}></div>
                            </div>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{dish.margin}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-700 dark:text-slate-300 font-medium">{dish.orders}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${priority.cls}`}>{priority.label}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button onClick={() => setEditDish(dish)}
                            className="text-xs font-semibold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors opacity-0 group-hover:opacity-100">
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">Showing {filtered.length} of {dishes.length} dishes</p>
              <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>Total Profit: <span className="text-emerald-500 font-bold">₹{filtered.reduce((s, d) => s + d.unitProfit * d.orders, 0).toLocaleString("en-IN")}</span></span>
                <span>Avg Margin: <span className="font-bold text-slate-700 dark:text-slate-300">{filtered.length ? Math.round(filtered.reduce((s, d) => s + d.margin, 0) / filtered.length) : 0}%</span></span>
              </div>
            </div>
          </div>
        )}
      </main>

      {editDish && <EditModal dish={editDish} onClose={() => setEditDish(null)} onSave={fetchData} />}
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={fetchData} />}
    </div>
  );
}