import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Hero3D from './components/Hero3D';
import UploadArea from './components/UploadArea';
import ARViewer from './components/ARViewer';
import ShareCard from './components/ShareCard';
import CorsDiagnostics from './components/CorsDiagnostics';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function App() {
  const [modelUrl, setModelUrl] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [backendHealth, setBackendHealth] = useState({ ok: true, message: '' });

  const isSecureContext = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const backendIsHttps = useMemo(() => {
    try {
      const u = new URL(BACKEND_URL);
      return u.protocol === 'https:';
    } catch {
      return false;
    }
  }, []);

  // Lightweight health check to surface clearer errors than generic "Failed to fetch"
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/test`, { method: 'GET' });
        if (!ignore) {
          if (!res.ok) {
            setBackendHealth({ ok: false, message: `Backend responded with ${res.status}` });
          } else {
            setBackendHealth({ ok: true, message: '' });
          }
        }
      } catch (e) {
        if (!ignore) {
          const mixedContent = isSecureContext && !backendIsHttps;
          const hint = mixedContent
            ? 'Your site is on HTTPS but the API is HTTP. Update VITE_BACKEND_URL to an HTTPS URL.'
            : "The API is unreachable. Confirm VITE_BACKEND_URL points to the live backend.";
        setBackendHealth({ ok: false, message: `${e?.message || 'Network error'}. ${hint}` });
        }
      }
    })();
    return () => {
      ignore = true;
    };
  }, [backendIsHttps, isSecureContext]);

  // Handle upload to backend
  const handleUpload = useCallback(async (file) => {
    const form = new FormData();
    form.append('file', file);

    let res;
    try {
      res = await fetch(`${BACKEND_URL}/upload`, {
        method: 'POST',
        body: form,
      });
    } catch (e) {
      const mixedContent = isSecureContext && !backendIsHttps;
      const base = e?.message || 'Network error.';
      const mixedHint = mixedContent ? ' Your site is on HTTPS but the API is HTTP. Use an HTTPS API URL.' : '';
      const corsHint = ' If the API is HTTPS and reachable, ensure it sends Access-Control-Allow-Origin with your frontend origin (or *), and allows POST on /upload.';
      throw new Error(`${base}${mixedHint}${corsHint}`.trim());
    }

    if (!res.ok) {
      const t = await res.text();
      // Help users who run into opaque/CORS errors where body may be empty
      const extra = res.status === 0 ? ' Possible CORS error: backend must include Access-Control-Allow-Origin header.' : '';
      throw new Error((t || 'Upload failed') + extra);
    }
    const data = await res.json();
    // data: { id, url }
    const absoluteUrl = String(data.url || '').startsWith('http') ? data.url : `${BACKEND_URL}${data.url}`;
    setModelUrl(absoluteUrl);
    setShareUrl(`${window.location.origin}/?id=${data.id}`);
  }, [backendIsHttps, isSecureContext]);

  // If opened with id param, fetch the model URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/asset/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        const absoluteUrl = String(data.url || '').startsWith('http') ? data.url : `${BACKEND_URL}${data.url}`;
        setModelUrl(absoluteUrl);
        setShareUrl(`${window.location.origin}/?id=${id}`);
      } catch (e) {
        // no-op; UploadArea will surface errors during uploads
      }
    })();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0B0E14] text-white">
      <Hero3D />

      {!backendHealth.ok && (
        <div className="mx-auto -mt-12 mb-8 w-full max-w-5xl px-6">
          <div className="rounded-lg border border-yellow-400/30 bg-yellow-400/10 p-3 text-sm text-yellow-200">
            {backendHealth.message}
          </div>
        </div>
      )}

      <main className="mx-auto -mt-16 mb-20 flex w-full max-w-6xl flex-col gap-10">
        <UploadArea onUpload={handleUpload} />
        <ARViewer src={modelUrl} />
        <ShareCard url={shareUrl} />
        <CorsDiagnostics />

        <section id="image2three" className="mx-auto w-full max-w-5xl px-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-medium">Image → 3D (AI)</h3>
            <p className="mt-1 text-sm text-white/70">Coming soon: generate a 3D model from a single image using AI. In the meantime, upload GLB/USDZ files to preview in AR.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/60">
        © {new Date().getFullYear()} HoloShare — 3D & AR sharing
      </footer>
    </div>
  );
}
