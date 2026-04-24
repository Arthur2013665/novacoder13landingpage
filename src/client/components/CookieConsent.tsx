import { useState, useEffect } from 'react';
import { X, Cookie, Shield, BarChart3, Settings } from 'lucide-react';

type CookiePreferences = {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
};

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: false,
    analytics: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1500);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    
    // Initialize analytics if accepted
    if (prefs.analytics) {
      // Add your analytics initialization here
      console.log('Analytics enabled');
    }
  };

  const acceptAll = () => {
    const allAccepted = { essential: true, functional: true, analytics: true };
    savePreferences(allAccepted);
  };

  const acceptSelected = () => {
    savePreferences(preferences);
  };

  const rejectAll = () => {
    savePreferences({ essential: true, functional: false, analytics: false });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-2xl animate-slide-up">
        <div className="card-premium rounded-3xl p-6 shadow-2xl border-2 border-white/10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nova-500 to-aurora-purple flex items-center justify-center">
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Cookie Preferences</h3>
                <p className="text-xs text-dark-500">We value your privacy</p>
              </div>
            </div>
            <button
              onClick={rejectAll}
              className="text-dark-600 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-dark-400 mb-5 leading-relaxed">
            We use cookies to enhance your experience, analyze site traffic, and personalize content. 
            Choose your preferences below or accept all to continue.
          </p>

          {/* Cookie Categories */}
          {showDetails && (
            <div className="space-y-3 mb-5 animate-fade-in">
              <CookieCategory
                icon={Shield}
                title="Essential Cookies"
                description="Required for the website to function properly. Cannot be disabled."
                checked={true}
                disabled={true}
                onChange={() => {}}
              />
              <CookieCategory
                icon={Settings}
                title="Functional Cookies"
                description="Enable enhanced functionality and personalization."
                checked={preferences.functional}
                onChange={(checked) => setPreferences({ ...preferences, functional: checked })}
              />
              <CookieCategory
                icon={BarChart3}
                title="Analytics Cookies"
                description="Help us understand how visitors interact with our website."
                checked={preferences.analytics}
                onChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="btn-ghost text-sm py-2.5 px-5 flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>{showDetails ? 'Hide' : 'Customize'}</span>
            </button>
            {showDetails && (
              <button
                onClick={acceptSelected}
                className="btn-ghost text-sm py-2.5 px-5"
              >
                Save Preferences
              </button>
            )}
            <button
              onClick={acceptAll}
              className="btn-nova text-sm py-2.5 px-6 flex-1"
            >
              Accept All Cookies
            </button>
          </div>

          {/* Privacy Policy Link */}
          <p className="text-xs text-dark-600 mt-4 text-center">
            Read our{' '}
            <a href="/privacy" className="text-nova-400 hover:text-nova-300 transition-colors">
              Privacy Policy
            </a>
            {' '}and{' '}
            <a href="/terms" className="text-nova-400 hover:text-nova-300 transition-colors">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function CookieCategory({
  icon: Icon,
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nova-500/20 to-aurora-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-nova-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={(e) => onChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className={`w-11 h-6 rounded-full peer transition-colors ${
              disabled ? 'bg-dark-700 cursor-not-allowed' : 'bg-dark-800 peer-checked:bg-nova-500'
            }`}>
              <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform ${
                checked ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
          </label>
        </div>
        <p className="text-xs text-dark-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
