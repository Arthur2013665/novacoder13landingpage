import { useState } from 'react';
import { Rocket, Globe, Check, AlertCircle, ExternalLink, Zap, Server } from 'lucide-react';

type DeploymentStatus = 'idle' | 'deploying' | 'success' | 'error';

export function DeploymentPanel({ onClose }: { onClose?: () => void }) {
  const [status, setStatus] = useState<DeploymentStatus>('idle');
  const [deployUrl, setDeployUrl] = useState('');
  const [projectName, setProjectName] = useState('');

  const platforms = [
    { id: 'vercel', name: 'Vercel', icon: '▲', color: 'from-black to-gray-800' },
    { id: 'netlify', name: 'Netlify', icon: '◆', color: 'from-teal-500 to-cyan-500' },
    { id: 'github', name: 'GitHub Pages', icon: '⚡', color: 'from-purple-600 to-pink-600' },
  ];

  const [selectedPlatform, setSelectedPlatform] = useState('vercel');

  const deploy = async () => {
    if (!projectName.trim()) return;

    setStatus('deploying');
    
    try {
      // Simulate deployment
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const url = `https://${projectName.toLowerCase().replace(/\s+/g, '-')}.${selectedPlatform}.app`;
      setDeployUrl(url);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-dark-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl card-premium rounded-3xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-cyan to-aurora-teal flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Deploy Project</h2>
              <p className="text-xs text-dark-500">Ship your code to production</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-dark-900 hover:bg-dark-800 text-white text-sm transition-colors"
            >
              Close
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {status === 'idle' && (
            <>
              {/* Project Name */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-awesome-project"
                  className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/[0.08] text-white focus:outline-none focus:border-nova-500 transition-colors"
                />
              </div>

              {/* Platform Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3">
                  Deployment Platform
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-4 rounded-xl border transition-all ${
                        selectedPlatform === platform.id
                          ? 'border-nova-500 bg-nova-500/10'
                          : 'border-white/[0.08] bg-dark-900 hover:border-white/[0.15]'
                      }`}
                    >
                      <div className="text-2xl mb-2">{platform.icon}</div>
                      <div className="text-sm text-white font-medium">{platform.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deploy Button */}
              <button
                onClick={deploy}
                disabled={!projectName.trim()}
                className="w-full btn-nova py-4 flex items-center justify-center gap-3"
              >
                <Rocket className="w-5 h-5" />
                <span>Deploy Now</span>
              </button>
            </>
          )}

          {status === 'deploying' && (
            <div className="py-12 text-center animate-fade-in">
              <div className="w-16 h-16 border-4 border-nova-500/30 border-t-nova-500 rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Deploying...</h3>
              <p className="text-dark-500 text-sm">
                Building and deploying your project to {platforms.find(p => p.id === selectedPlatform)?.name}
              </p>
              <div className="mt-6 space-y-2">
                <DeployStep label="Building project" completed />
                <DeployStep label="Optimizing assets" completed />
                <DeployStep label="Deploying to CDN" active />
                <DeployStep label="Configuring domain" />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="py-12 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Deployment Successful! 🎉</h3>
              <p className="text-dark-500 text-sm mb-6">
                Your project is now live and accessible worldwide
              </p>
              <div className="p-4 rounded-xl bg-dark-900 border border-white/[0.08] mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-nova-400" />
                    <span className="text-white font-mono text-sm">{deployUrl}</span>
                  </div>
                  <a
                    href={deployUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-dark-400" />
                  </a>
                </div>
              </div>
              <button
                onClick={() => setStatus('idle')}
                className="btn-ghost py-3 px-6"
              >
                Deploy Another Project
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="py-12 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Deployment Failed</h3>
              <p className="text-dark-500 text-sm mb-6">
                Something went wrong during deployment. Please try again.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="btn-nova py-3 px-6"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DeployStep({ label, completed = false, active = false }: { label: string; completed?: boolean; active?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-left">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
        completed ? 'bg-green-500/20' : active ? 'bg-nova-500/20' : 'bg-dark-800'
      }`}>
        {completed ? (
          <Check className="w-3 h-3 text-green-400" />
        ) : active ? (
          <div className="w-2 h-2 bg-nova-500 rounded-full animate-pulse" />
        ) : (
          <div className="w-2 h-2 bg-dark-600 rounded-full" />
        )}
      </div>
      <span className={`text-sm ${completed || active ? 'text-white' : 'text-dark-600'}`}>
        {label}
      </span>
    </div>
  );
}
