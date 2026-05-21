import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import MenuItems from "./pages/MenuItems";
import Optimize from "./pages/Optimize";
import Analysis from "./pages/Analysis";
// Add import
import BulkUpload from "./pages/BulkUpload";


function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setChecking(false);
  }, []);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (checking) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage onLogin={handleLogin} />} />
        <Route path="/" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/auth" replace />} />
        <Route path="/menu-items" element={user ? <MenuItems user={user} onLogout={handleLogout} /> : <Navigate to="/auth" replace />} />
        <Route path="/optimize" element={user ? <Optimize user={user} onLogout={handleLogout} /> : <Navigate to="/auth" replace />} />
        <Route path="/analysis" element={user ? <Analysis user={user} onLogout={handleLogout} /> : <Navigate to="/auth" replace />} />
        <Route path="/bulk-upload" element={user ? <BulkUpload user={user} onLogout={handleLogout} /> : <Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;