import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

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

export default function BulkUpload({ user, onLogout }) {
  const [dark, setDark] = useState(() => { try { return localStorage.getItem("mo-dark") === "true"; } catch { return false; } });
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (!f || !/\.(csv|md)$/i.test(f.name)) {
      setError("Please upload a valid .csv or .md file.");
      return;
    }
    setFile(f);
    setError("");
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select a CSV or markdown report first.");
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await API.post("/menu/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = `name,price,cost,orders\nButter Chicken,320,110,200\nPaneer Tikka,280,90,150\nDal Makhani,220,80,180\nVeg Burger,150,60,50\nChicken Biryani,350,130,220`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "menu_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 transition-colors duration-300">
      <Navbar dark={dark} setDark={setDark} user={user} onLogout={onLogout} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Bulk Upload</h1>
          <p className="text-sm text-slate-400 mt-1">Upload your menu using a CSV file or POS sales report</p>
        </div>

        {/* Template Download */}
        <div className="bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-700/50 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-white mb-1">📄 CSV Template</p>
              <p className="text-sm text-slate-400 mb-1">Use this CSV template, or upload a Dish TypeWise Sales report:</p>
              <code className="text-xs text-emerald-400 bg-slate-800 px-3 py-1.5 rounded-lg">
                name, price, cost, orders
              </code>
            </div>
            <button onClick={downloadTemplate}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0">
              ⬇️ Download Template
            </button>
          </div>

          {/* Example Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-800 rounded-lg">
                  {["name", "price", "cost", "orders"].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-slate-400 font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  ["Butter Chicken", "320", "110", "200"],
                  ["Paneer Tikka", "280", "90", "150"],
                  ["Dal Makhani", "220", "80", "180"],
                ].map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2 text-slate-300">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current.click()}
          className={`relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all
            ${dragging ? "border-emerald-500 bg-emerald-500/10" : "border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/30"}
            ${file ? "border-emerald-500 bg-emerald-500/5" : ""}`}
        >
          <input ref={fileRef} type="file" accept=".csv,.md,text/csv,text/markdown" className="hidden"
            onChange={(e) => handleFile(e.target.files[0])} />

          {file ? (
            <div>
              <p className="text-4xl mb-3">✅</p>
              <p className="font-bold text-white text-lg">{file.name}</p>
              <p className="text-slate-400 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB — ready to upload</p>
              <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="mt-3 text-xs text-red-400 hover:text-red-300">
                Remove file
              </button>
            </div>
          ) : (
            <div>
              <p className="text-4xl mb-3">📂</p>
              <p className="font-semibold text-white text-lg">Drop your CSV or report here</p>
              <p className="text-slate-400 text-sm mt-1">or click to browse files</p>
              <p className="text-slate-600 text-xs mt-3">CSV and markdown sales reports are supported</p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Upload Button */}
        {file && (
          <button onClick={handleUpload} disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-colors text-base flex items-center justify-center gap-2">
            {loading ? (
              <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</>
            ) : (
              <>🚀 Upload & Import Dishes</>
            )}
          </button>
        )}

        {/* Result */}
        {result && (
          <div className="bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-700/50 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="font-bold text-white text-lg">Upload Successful!</p>
                <p className="text-slate-400 text-sm">Your dishes have been imported</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-emerald-400">{result.inserted}</p>
                <p className="text-xs text-slate-400 mt-1">Dishes Imported</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-red-400">{result.skipped}</p>
                <p className="text-xs text-slate-400 mt-1">Rows Skipped</p>
              </div>
            </div>

            {result.failed?.length > 0 && (
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Skipped Rows</p>
                <div className="space-y-1">
                  {result.failed.map((f, i) => (
                    <p key={i} className="text-xs text-red-400">
                      ⚠️ {JSON.stringify(f.row)} — {f.reason}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => navigate("/")}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                View Dashboard →
              </button>
              <button onClick={() => setResult(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition-colors text-sm">
                Upload Another
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
