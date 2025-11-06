import React from 'react';
import Spline from '@splinetool/react-spline';
import { Rocket, Share2 } from 'lucide-react';

export default function Hero3D() {
  return (
    <section className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/VyGeZv58yuk8j7Yy/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Gradient overlay for readability; don't block pointer events */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
        <div className="max-w-2xl text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live 3D • AR Ready
          </div>
          <h1 className="font-heading text-4xl font-semibold leading-tight md:text-6xl">
            Convert images into 3D or upload models to view in AR
          </h1>
          <p className="mt-4 text-sm text-white/80 md:text-base">
            A minimalist, futuristic space to turn ideas into interactive 3D. Upload GLB/USDZ, preview instantly, share with a link or QR.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#upload" className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90">
              <Rocket className="h-4 w-4" />
              Upload 3D Model
            </a>
            <a href="#image2three" className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
              <Share2 className="h-4 w-4" />
              Image → 3D (AI)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
