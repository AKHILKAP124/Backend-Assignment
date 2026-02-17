import { useNavigate } from "react-router-dom";
import { CheckSquare, LogOut, Shield } from "lucide-react";
import AdminDashboard from "../components/AdminDashboard";
import { useEffect, useState } from "react";
import axios from "axios";
import UserDashboard from "../components/UserDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const getMe = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await axios
        .get("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setUser(res.data);
          setTimeout(() => setLoading(false), 500); // Add slight delay for better UX
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    getMe();
  }, []);


  const handleLogout = async () => {
    localStorage.removeItem("token");
    await navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Welcome, {user?.name || "User"}
            </span>
            {user?.role === "admin" && (
              <span className="ml-2 flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                <Shield className="h-3 w-3" /> Admin
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {user?.role === "admin" ? <AdminDashboard /> : <UserDashboard user={user} />}
      </main>
    </div>
  );
};

export default Dashboard;
