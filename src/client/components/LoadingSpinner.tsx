interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

export default function LoadingSpinner({ fullScreen = false, message }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#020617',
        flexDirection: 'column',
        gap: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background orbs */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
          top: '20%',
          left: '30%'
        }} />
        <div style={{
          position: 'absolute',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '1s',
          bottom: '20%',
          right: '30%'
        }} />

        {/* Nova AI Logo Loader */}
        <div style={{
          position: 'relative',
          width: '80px',
          height: '80px',
          zIndex: 10
        }}>
          {/* Outer rotating ring */}
          <div style={{
            position: 'absolute',
            inset: 0,
            border: '3px solid transparent',
            borderTopColor: '#6366f1',
            borderRightColor: '#a855f7',
            borderRadius: '50%',
            animation: 'spin 1.5s linear infinite'
          }} />
          
          {/* Middle pulsing ring */}
          <div style={{
            position: 'absolute',
            inset: '8px',
            border: '2px solid transparent',
            borderTopColor: '#22d3ee',
            borderLeftColor: '#a855f7',
            borderRadius: '50%',
            animation: 'spin 2s linear infinite reverse'
          }} />

          {/* Inner glowing core */}
          <div style={{
            position: 'absolute',
            inset: '20px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7, #22d3ee)',
            borderRadius: '50%',
            animation: 'glowPulse 2s ease-in-out infinite',
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)'
          }} />

          {/* Sparkle effect */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '8px',
            height: '8px',
            background: '#fff',
            borderRadius: '50%',
            animation: 'twinkle 2s ease-in-out infinite',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
          }} />
        </div>

        {/* Loading text */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 10
        }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #818cf8, #a855f7, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            letterSpacing: '0.05em'
          }}>
            Nova AI
          </div>
          
          {/* Animated dots */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#6366f1',
              animation: 'loadingDot 1.4s ease-in-out infinite',
              animationDelay: '0s'
            }} />
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#a855f7',
              animation: 'loadingDot 1.4s ease-in-out infinite',
              animationDelay: '0.2s'
            }} />
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22d3ee',
              animation: 'loadingDot 1.4s ease-in-out infinite',
              animationDelay: '0.4s'
            }} />
          </div>

          {message && (
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '0.875rem',
              marginTop: '0.5rem',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}>
              {message}
            </p>
          )}
        </div>

        {/* Add keyframes */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes glowPulse {
            0%, 100% { 
              opacity: 1;
              transform: scale(1);
            }
            50% { 
              opacity: 0.8;
              transform: scale(1.1);
            }
          }
          @keyframes twinkle {
            0%, 100% { 
              opacity: 0.3;
              transform: scale(0.8);
            }
            50% { 
              opacity: 1;
              transform: scale(1.2);
            }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes loadingDot {
            0%, 80%, 100% { 
              transform: scale(0);
              opacity: 0.5;
            }
            40% { 
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  // Minimal inline loader for non-fullscreen
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: '#020617'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(99, 102, 241, 0.2)',
        borderTop: '3px solid rgb(99, 102, 241)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
    </div>
  );
}
