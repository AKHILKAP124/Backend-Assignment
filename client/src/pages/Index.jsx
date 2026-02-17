import { Link } from "react-router-dom";
import { CheckSquare, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <CheckSquare className="h-10 w-10 text-purple-500" />
          <span className="text-4xl font-bold text-foreground tracking-tight">
            Taskflow
          </span>
        </div>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          The simple, beautiful way to manage your tasks. Stay organized, stay
          productive.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-500 text-white font-semibold px-8 py-3 text-sm shadow-button hover:opacity-90 active:scale-[0.98] transition-all duration-150"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-purple-500 bg-white text-purple-500 font-medium px-8 py-3 text-sm shadow-card hover:shadow-card-hover transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
