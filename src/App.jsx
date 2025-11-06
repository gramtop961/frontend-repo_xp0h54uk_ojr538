import React, { useCallback, useEffect, useState } from 'react';
import Hero3D from './components/Hero3D';
import UploadArea from './components/UploadArea';
import ARViewer from './components/ARViewer';
import ShareCard from './components/ShareCard';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function App() {
  const [modelUrl, setModelUrl] = useState('');
  const [shareUrl, setShareUrl] = useState('');

  // Handle upload to backend
  const handleUpload = useCallback(async (file) => {
    const form = new FormData();
    form.append('file', file);

    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: 'POST',
      body: form,
    });

    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || 'Upload failed');
    }
    const data = await res.json();
    // data: { id, url }
    const absoluteUrl = data.url.startsWith('http') ? data.url : `${BACKEND_URL}${data.url}`;
    setModelUrl(absoluteUrl);
    setShareUrl(`${window.location.origin}/?id=${data.id}`);
  }, []);

  // If opened with id param, fetch the model URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;
    (async () => {
      const res = await fetch(`${BACKEND_URL}/asset/${id}`);
      if (res.ok) {
        const data = await res.json();
        const absoluteUrl = data.url.startsWith('http') ? data.url : `${BACKEND_URL}${data.url}`;
        setModelUrl(absoluteUrl);
        setShareUrl(`${window.location.origin}/?id=${id}`);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0B0E14] text-white">
      <Hero3D />

      <main className="mx-auto -mt-16 mb-20 flex w-full max-w-6xl flex-col gap-10">
        <UploadArea onUpload={handleUpload} />
        <ARViewer src={modelUrl} />
        <ShareCard url={shareUrl} />

        <section id="image2three" className="mx-auto w-full max-w-5xl px-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-medium">Image → 3D (AI)</h3>
            <p className="mt-1 text-sm text-white/70">Coming soon: generate a 3D model from a single image using AI (Tripo-like). In the meantime, upload GLB/USDZ files to preview in AR.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/60">
        © {new Date().getFullYear()} HoloShare — 3D & AR sharing
      </footer>
    </div>
  );
}
