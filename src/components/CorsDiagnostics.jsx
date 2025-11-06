import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCcw, Server, ShieldAlert } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function Row({ label, value, ok }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1 text-sm">
      <span className="text-white/70">{label}</span>
      <span className={ok === undefined ? 'text-white' : ok ? 'text-emerald-400' : 'text-rose-400'}>
        {value}
      </span>
    </div>
  );
}

export default function CorsDiagnostics() {
  const [running, setRunning] = useState(false);
  const [getTest, setGetTest] = useState({ status: '-', ok: false, headers: {} });
  const [optionsUpload, setOptionsUpload] = useState({ status: '-', ok: false, headers: {} });
  const [error, setError] = useState('');

  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const backendIsHttps = useMemo(() => {
    try {
      return new URL(BACKEND_URL).protocol === 'https:';
    } catch {
      return false;
    }
  }, []);

  const runChecks = async () => {
    setRunning(true);
    setError('');
    try {
      // GET /test
      try {
        const res = await fetch(`${BACKEND_URL}/test`, { method: 'GET' });
        const allowedOrigin = res.headers.get('access-control-allow-origin');
        const allowedMethods = res.headers.get('access-control-allow-methods');
        const allowedHeaders = res.headers.get('access-control-allow-headers');
        setGetTest({
          status: res.status,
          ok: res.ok,
          headers: {
            'access-control-allow-origin': allowedOrigin,
            'access-control-allow-methods': allowedMethods,
            'access-control-allow-headers': allowedHeaders,
          },
        });
      } catch (e) {
        setGetTest({ status: 'network error', ok: false, headers: {} });
      }

      // OPTIONS /upload (preflight)
      try {
        const res = await fetch(`${BACKEND_URL}/upload`, { method: 'OPTIONS' });
        const allowedOrigin = res.headers.get('access-control-allow-origin');
        const allowedMethods = res.headers.get('access-control-allow-methods');
        const allowedHeaders = res.headers.get('access-control-allow-headers');
        setOptionsUpload({
          status: res.status,
          ok: res.ok,
          headers: {
            'access-control-allow-origin': allowedOrigin,
            'access-control-allow-methods': allowedMethods,
            'access-control-allow-headers': allowedHeaders,
          },
        });
      } catch (e) {
        setOptionsUpload({ status: 'network error', ok: false, headers: {} });
      }
    } catch (e) {
      setError(e?.message || 'Unknown error');
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    runChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mixedContent = isHttps && !backendIsHttps;

  return (
    <section className="mx-auto w-full max-w-5xl px-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-white/70" />
            <h3 className="text-lg font-medium">CORS & Connectivity Diagnostics</h3>
          </div>
          <button
            onClick={runChecks}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20 disabled:opacity-50"
          >
            <RefreshCcw className={`h-4 w-4 ${running ? 'animate-spin' : ''}`} />
            {running ? 'Checking...' : 'Re-run checks'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 p-4">
            <div className="mb-2 flex items-center gap-2 text-white/80">
              <Server className="h-4 w-4" />
              <span>GET /test</span>
              {getTest.ok ? (
                <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="ml-auto h-4 w-4 text-amber-300" />
              )}
            </div>
            <Row label="Status" value={String(getTest.status)} ok={getTest.ok} />
            <Row label="access-control-allow-origin" value={getTest.headers['access-control-allow-origin'] || '—'} />
            <Row label="access-control-allow-methods" value={getTest.headers['access-control-allow-methods'] || '—'} />
            <Row label="access-control-allow-headers" value={getTest.headers['access-control-allow-headers'] || '—'} />
          </div>

          <div className="rounded-lg border border-white/10 p-4">
            <div className="mb-2 flex items-center gap-2 text-white/80">
              <Server className="h-4 w-4" />
              <span>OPTIONS /upload</span>
              {optionsUpload.ok ? (
                <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="ml-auto h-4 w-4 text-amber-300" />
              )}
            </div>
            <Row label="Status" value={String(optionsUpload.status)} ok={optionsUpload.ok} />
            <Row label="access-control-allow-origin" value={optionsUpload.headers['access-control-allow-origin'] || '—'} />
            <Row label="access-control-allow-methods" value={optionsUpload.headers['access-control-allow-methods'] || '—'} />
            <Row label="access-control-allow-headers" value={optionsUpload.headers['access-control-allow-headers'] || '—'} />
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          {mixedContent && (
            <div className="flex items-start gap-2 rounded-md border border-amber-300/30 bg-amber-300/10 p-3 text-amber-100">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <p>
                Your site is using HTTPS but the API URL is HTTP. Browsers block mixed-content requests. Host the API over HTTPS or
                update the environment variable to an HTTPS URL.
              </p>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-rose-400/30 bg-rose-400/10 p-3 text-rose-100">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          <p className="text-white/60">
            Tip: Ensure the API sends "Access-Control-Allow-Origin" with your frontend origin (or *), and allows methods GET, POST, OPTIONS. Also include
            "Access-Control-Allow-Headers: Content-Type, Authorization" if needed.
          </p>
        </div>
      </div>
    </section>
  );
}
