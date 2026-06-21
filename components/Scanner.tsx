"use client";

import { useState, useRef } from "react";
import { useEcoStore } from "@/lib/store";
import { Camera, X, Upload, Loader2, CheckCircle2 } from "lucide-react";

interface ScannerProps {
  onClose: () => void;
}

export default function Scanner({ onClose }: ScannerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ title: string; carbonValue: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { apiKey, addLog } = useEcoStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    if (!apiKey) {
      setError("Gemini API Key is required. Please set it in Settings.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Remove data:image/jpeg;base64, prefix
      const base64Data = image.split(",")[1];
      const mimeType = image.split(";")[0].split(":")[1];

      const res = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ image: base64Data, mimeType }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setResult({
        title: data.title || "Scanned Item",
        carbonValue: data.carbonValue || 0,
      });

      // Add to logs
      addLog({
        title: data.title || "Scanned Item",
        carbonValue: data.carbonValue || 0,
        type: 'scan'
      });

    } catch (err: any) {
      setError(err.message || "Failed to scan image. Check API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface flex flex-col font-body">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-outline-variant bg-surface-container-lowest">
        <h1 className="text-headline-md font-display text-on-surface flex items-center gap-2">
          <Camera size={24} /> AI Scanner
        </h1>
        <button onClick={onClose} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
          <X size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center max-w-3xl mx-auto w-full">
        
        {!apiKey && (
          <div className="w-full bg-error-container text-on-error-container p-4 rounded-xl mb-6">
            <p className="font-bold mb-1">API Key Missing</p>
            <p className="text-sm">You need to provide a Google Gemini API key to use this feature. Please set it via the Dashboard settings (or reset and add during onboarding).</p>
          </div>
        )}

        <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col mb-6">
          {image ? (
            <div className="relative w-full aspect-[3/4] md:aspect-video bg-black flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="To scan" className="max-w-full max-h-full object-contain" />
              {!loading && !result && (
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 bg-surface/80 p-2 rounded-full backdrop-blur-sm shadow hover:bg-surface transition-colors text-on-surface"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ) : (
            <div 
              className="w-full aspect-[3/4] md:aspect-video bg-surface-container flex flex-col items-center justify-center border-2 border-dashed border-outline-variant m-4 rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors text-on-surface-variant"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="mb-4 opacity-50" />
              <p className="text-headline-lg-mobile font-display mb-2">Upload or Snap</p>
              <p className="text-body-md text-center max-w-xs opacity-80">
                Take a picture of a receipt, utility bill, or travel ticket.
              </p>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            capture="environment"
            className="hidden" 
          />
        </div>

        {error && (
          <div className="w-full text-error bg-error-container p-4 rounded text-center mb-6">
            {error}
          </div>
        )}

        {result ? (
          <div className="w-full bg-secondary-container text-on-secondary-container p-6 rounded-xl text-center shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 size={48} className="mx-auto mb-4 text-secondary" />
            <h2 className="text-headline-md font-display mb-2">Scan Complete!</h2>
            <p className="text-body-lg mb-4">Found: <strong>{result.title}</strong></p>
            <div className="text-stats-num font-display text-primary">
              +{result.carbonValue.toFixed(2)} <span className="text-body-md text-on-secondary-container">kg CO2e</span>
            </div>
            <button 
              onClick={onClose}
              className="mt-6 w-full bg-secondary text-on-secondary py-3 rounded-lg font-label text-label-caps uppercase hover:bg-[#005439] transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <button 
            disabled={!image || loading || !apiKey}
            onClick={handleScan}
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-label text-label-caps uppercase text-lg tracking-wider hover:bg-[#003d2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={24} /> Analyzing with AI...</>
            ) : (
              "Analyze Carbon Impact"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
