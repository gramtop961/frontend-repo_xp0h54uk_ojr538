import React, { useEffect } from 'react';

export default function ARViewer({ src, poster }) {
  useEffect(() => {
    // Ensure <model-viewer> is available
    const hasElement = !!customElements.get('model-viewer');
    if (!hasElement) {
      const scriptId = 'model-viewer-script';
      if (!document.getElementById(scriptId)) {
        const s = document.createElement('script');
        s.type = 'module';
        s.id = scriptId;
        s.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
        document.head.appendChild(s);
      }
    }
  }, []);

  if (!src) return null;

  return (
    <section className="mx-auto mt-10 w-full max-w-5xl px-6">
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <model-viewer
          src={src}
          poster={poster}
          ar
          ar-modes="scene-viewer quick-look webxr"
          camera-controls
          shadow-intensity="1"
          exposure="1.2"
          auto-rotate
          style={{ width: '100%', height: '520px', borderRadius: '1rem', overflow: 'hidden' }}
        >
          <div className="absolute right-4 top-4 z-10 rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-black">AR Ready</div>
        </model-viewer>
      </div>
    </section>
  );
}
