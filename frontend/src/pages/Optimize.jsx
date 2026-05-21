import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Sparkles, Loader2, TrendingUp, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import API from '../services/api';

const CATEGORY_CONFIG = {
  Star:       { icon: '⭐', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  Plowhorse:  { icon: '🐄', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  Puzzle:     { icon: '🧩', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  Dog:        { icon: '🐶', color: 'bg-red-100 text-red-800 border-red-200' },
};

const PRIORITY_CONFIG = {
  high:   { icon: <AlertTriangle size={14} />,  color: 'text-red-500' },
  medium: { icon: <HelpCircle size={14} />,     color: 'text-amber-500' },
  low:    { icon: <CheckCircle size={14} />,    color: 'text-emerald-500' },
};

const Optimize = ({ user, onLogout }) => {
  const [loading, setLoading]                 = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError]                     = useState('');
  const [ran, setRan]                         = useState(false);

  const handleOptimize = async () => {
    setLoading(true);
    setError('');
    setRecommendations([]);
    try {
      const res = await API.post('/menu/optimize');
      setRecommendations(res.data.recommendations);
      setRan(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Optimization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles size={28} />
            <h1 className="text-2xl font-bold">AI Menu Optimizer</h1>
          </div>
          <p className="text-emerald-100 mb-6">
            Powered by Google Gemini — get actionable recommendations for every dish based on profit and demand.
          </p>
          <button
            onClick={handleOptimize}
            disabled={loading}
            className="bg-white text-emerald-600 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-50 transition flex items-center space-x-2 disabled:opacity-60"
          >
            {loading
              ? <><Loader2 size={18} className="animate-spin" /><span>Analyzing your menu...</span></>
              : <><Sparkles size={18} /><span>Optimize My Menu</span></>
            }
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* Results */}
        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-700">
              {recommendations.length} Recommendations
            </h2>
            {recommendations.map((rec, i) => {
              const cat      = CATEGORY_CONFIG[rec.category] || CATEGORY_CONFIG.Dog;
              const priority = PRIORITY_CONFIG[rec.priority] || PRIORITY_CONFIG.low;
              return (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <h3 className="font-semibold text-slate-800">{rec.name}</h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cat.color}`}>
                          {rec.category}
                        </span>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-1 text-xs font-medium ${priority.color}`}>
                      {priority.icon}
                      <span className="capitalize">{rec.priority} priority</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">Recommended Action</p>
                      <p className="font-semibold text-slate-800 text-sm">{rec.action}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">Reason</p>
                      <p className="text-slate-700 text-sm">{rec.reason}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">Expected Impact</p>
                      <p className="font-semibold text-emerald-700 text-sm flex items-center space-x-1">
                        <TrendingUp size={14} />
                        <span>{rec.impact}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {ran && recommendations.length === 0 && !error && (
          <div className="text-center text-slate-500 py-12">
            No recommendations returned. Try adding more dishes first.
          </div>
        )}

        {/* Initial state */}
        {!ran && !loading && (
          <div className="text-center text-slate-400 py-16">
            <Sparkles size={48} className="mx-auto mb-4 text-slate-300" />
            <p>Click "Optimize My Menu" to get AI-powered recommendations</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Optimize;