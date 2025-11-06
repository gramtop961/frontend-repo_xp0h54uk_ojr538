import React, { useRef, useState } from 'react';
import { Upload, Loader2, Check, AlertCircle } from 'lucide-react';

export default function UploadArea({ onUpload }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supported = ['model/gltf-binary', 'model/gltf+json', 'model/vnd.usdz+zip', '.glb', '.gltf', '.usdz'];

  const handleFiles = async (files) => {
    const file = files[0];
    if (!file) return;

    const isSupported =
      supported.includes(file.type) ||
      supported.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isSupported) {
      setError('Unsupported format. Please upload .glb, .gltf, or .usdz');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Pass file up to parent to handle API upload
      await onUpload(file);
    } catch (e) {
      console.error(e);
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="upload" className="mx-auto w-full max-w-5xl px-6">
      <div
        className={`relative rounded-2xl border ${dragOver ? 'border-emerald-400 bg-emerald-400/5' : 'border-white/10 bg-white/5'} p-8 text-center backdrop-blur transition`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".glb,.gltf,.usdz,model/gltf-binary,model/gltf+json,model/vnd.usdz+zip"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-white">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-white/10">
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
          </div>
          <h3 className="text-xl font-medium">Drop your 3D model here</h3>
          <p className="text-sm text-white/70">Supported: GLB, GLTF, USDZ up to ~50MB</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-white/70">
            <span className="rounded bg-white/10 px-2 py-1">AR-ready</span>
            <span className="rounded bg-white/10 px-2 py-1">Private link</span>
            <span className="rounded bg-white/10 px-2 py-1">QR share</span>
          </div>
          <button
            disabled={loading}
            onClick={() => inputRef.current?.click()}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> Choose file
              </>
            )}
          </button>

          {error && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-left text-sm text-red-200">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
