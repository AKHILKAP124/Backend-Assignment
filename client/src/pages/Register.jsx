import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({name : "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    await axios.post("http://localhost:5000/api/users/register", {
      name: form.name,
      email: form.email,
      password: form.password,
    }).then((res) => {
      if (res.data.success) {
        toast.success("Registration successful! Please log in.");
        setLoading(false);
        navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed.");
        setError(res.data.message || "Registration failed.");
        setLoading(false);
      }
    }).catch((error) => {
      toast.error(error.response.data.message || "Registration failed.");
      setError(error.response.data.message);
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-8">
            <CheckSquare className="h-7 w-7 text-purple-500" />
            <span className="text-2xl font-bold text-foreground tracking-tight">
              Taskflow
            </span>
          </div>

          <h2 className="text-xl font-semibold text-black text-center mb-1">
            Create your account
          </h2>
          <p className="text-sm text-black/50 text-center mb-6">
            Start managing tasks like a pro
          </p>

          {error && (
            <div className="mb-4 rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                placeholder="your name"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="w-full rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-purple-500 text-white font-semibold py-3 text-sm shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-150 cursor-pointer"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-500 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
