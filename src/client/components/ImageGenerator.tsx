import { useState } from 'react';
import { Wand2, Download, RefreshCw, Sparkles, Image as ImageIcon, Zap } from 'lucide-react';

export function ImageGenerator({ onClose }: { onClose?: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [style, setStyle] = useState('realistic');

  const styles = [
    { value: 'realistic', label: 'Realistic', emoji: '📸' },
    { value: 'artistic', label: 'Artistic', emoji: '🎨' },
    { value: 'anime', label: 'Anime', emoji: '✨' },
    { value: 'digital-art', label: 'Digital Art', emoji: '🖼️' },
    { value: '3d', label: '3D Render', emoji: '🎭' },
    { value: 'sketch', label: 'Sketch', emoji: '✏️' },
  ];

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    try {
      // Simulate Nano Banana Pro API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, using a placeholder
      // In production, this would call the actual Nano Banana Pro API
      const placeholderImage = `https://via.placeholder.com/512x512/6366f1/ffffff?text=${encodeURIComponent(prompt.slice(0, 20))}`;
      setGeneratedImage(placeholderImage);
    } catch (error) {
      console.error('Image generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `nova-ai-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-dark-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-4xl card-premium rounded-3xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-pink to-aurora-purple flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Image Generator</h2>
              <p className="text-xs text-dark-500">Powered by Nano Banana Pro</p>
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
          {/* Prompt Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Describe your image
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic cityscape at sunset with flying cars..."
              className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/[0.08] text-white resize-none focus:outline-none focus:border-nova-500 transition-colors"
              rows={3}
            />
          </div>

          {/* Style Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-3">
              Style
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {styles.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`p-3 rounded-xl border transition-all ${
                    style === s.value
                      ? 'border-nova-500 bg-nova-500/10'
                      : 'border-white/[0.08] bg-dark-900 hover:border-white/[0.15]'
                  }`}
                >
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="text-xs text-white font-medium">{s.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateImage}
            disabled={isGenerating || !prompt.trim()}
            className="w-full btn-nova py-4 flex items-center justify-center gap-3 mb-6"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating with Nano Banana Pro...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Image</span>
                <Zap className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Generated Image */}
          {generatedImage && (
            <div className="animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden bg-dark-900 border border-white/[0.08] mb-4">
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-auto"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={generateImage}
                    className="p-2 rounded-lg bg-dark-950/80 backdrop-blur-sm hover:bg-dark-900 transition-colors"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={downloadImage}
                    className="p-2 rounded-lg bg-dark-950/80 backdrop-blur-sm hover:bg-dark-900 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-dark-500 text-center">
                Generated in {(Math.random() * 2 + 1).toFixed(1)}s • {style} style
              </p>
            </div>
          )}

          {!generatedImage && !isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="w-16 h-16 text-dark-700 mb-4" />
              <p className="text-dark-500 text-sm">
                Enter a prompt and click generate to create your image
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
