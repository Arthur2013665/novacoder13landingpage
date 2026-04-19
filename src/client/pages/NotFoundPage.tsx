import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nova-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-aurora-purple/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="font-display text-9xl md:text-[12rem] font-bold text-gradient animate-fade-in">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="glass rounded-3xl p-8 md:p-12 animate-fade-in-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-dark-300 text-lg mb-8">
            Oops! The page you're looking for seems to have wandered off into the digital void.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="btn-nova flex items-center gap-3 group"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/10 text-white hover:bg-white/5 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {/* Fun message */}
        <p className="mt-8 text-dark-500 text-sm animate-fade-in">
          Lost? Try using Nova AI to navigate better 😉
        </p>
      </div>
    </div>
  );
}
