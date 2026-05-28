import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// PageLoader
// - Uses the official DotLottie React player which supports both `.lottie` and `.json` files.
// - Falls back to an SVG (same name) or a simple spinner if needed.

export function PageLoader({ animationPath, className = '', size = 160, loop = true, autoplay = true, fullScreen = false }) {
  const defaultLottie = '/animations/d35e7bbc-1176-11ee-bf08-7b25604dc165 (1).lottie';

  const src = animationPath || defaultLottie;

  const containerClass = `${fullScreen ? 'fixed inset-0 bg-white/80 z-50' : ''} flex items-center justify-center ${className}`.trim();

  // SVG fallback
  if (src.endsWith('.svg')) {
    return (
      <div className={containerClass} aria-busy="true" role="status">
        <img src={src} alt="loader" style={{ width: size, height: size }} />
      </div>
    );
  }

  // Use DotLottieReact for .lottie or .json — it handles fetching and playback
  return (
    <div className={containerClass} aria-busy="true" role="status">
      <div style={{ width: size, height: size, minWidth: 48, minHeight: 48 }}>
        <DotLottieReact
          src={src}
          loop={loop}
          autoplay={autoplay}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>
    </div>
  );
}
