import React, { useMemo } from 'react';
import { Link as LinkIcon, QrCode } from 'lucide-react';

export default function ShareCard({ url }) {
  const qrUrl = useMemo(() => {
    if (!url) return '';
    const encoded = encodeURIComponent(url);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`;
  }, [url]);

  if (!url) return null;

  return (
    <section className="mx-auto mt-10 w-full max-w-5xl px-6">
      <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:flex-row">
        <div className="flex-1">
          <h4 className="text-lg font-medium text-white">Share your 3D model</h4>
          <p className="mt-1 text-sm text-white/70">Your model is stored temporarily and will auto-delete after 15 days.</p>
          <div className="mt-3 flex items-center gap-2 rounded-md bg-black/60 p-2 text-white">
            <LinkIcon className="h-4 w-4 text-white/60" />
            <input
              readOnly
              value={url}
              className="w-full bg-transparent text-sm outline-none"
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={() => navigator.clipboard.writeText(url)}
              className="rounded-md bg-white px-2 py-1 text-xs font-medium text-black hover:bg-white/90"
            >
              Copy
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <img src={qrUrl} alt="QR code" className="h-28 w-28 rounded-md bg-white p-2" />
          <div className="hidden items-center gap-2 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-xs text-white md:flex">
            <QrCode className="h-4 w-4" /> Scan to open
          </div>
        </div>
      </div>
    </section>
  );
}
