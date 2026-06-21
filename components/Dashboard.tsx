"use client";

import { useEcoStore } from "@/lib/store";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Camera, Plus, Leaf, Plug, Bus, ArrowRight } from "lucide-react";
import { useState } from "react";
import Scanner from "./Scanner";

export default function Dashboard() {
  const { baselineCarbon, logs, challenges, toggleChallenge, addLog, resetOnboarding } = useEcoStore();
  const [showScanner, setShowScanner] = useState(false);

  // Calculate current carbon used
  const carbonUsed = logs.reduce((acc, log) => acc + log.carbonValue, 0);
  const carbonSaved = challenges.filter(c => c.completed).reduce((acc, c) => acc + c.impact, 0);
  
  const currentTotal = baselineCarbon + carbonUsed + carbonSaved;
  const percentage = Math.max(0, Math.min(100, (currentTotal / baselineCarbon) * 100));

  const isOverBudget = currentTotal > baselineCarbon;

  const handleQuickLog = (title: string, value: number, type: 'transport' | 'diet' | 'energy') => {
    addLog({ title, carbonValue: value, type });
  };

  if (showScanner) {
    return <Scanner onClose={() => setShowScanner(false)} />;
  }

  return (
    <div className="min-h-screen bg-surface md:bg-surface-dim p-4 md:p-8 font-body">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant md:bg-transparent md:border-none md:p-0">
          <div>
            <h1 className="text-headline-md font-display text-on-surface">Eco-Hub</h1>
            <p className="text-body-md text-on-surface-variant">Your daily impact overview</p>
          </div>
          <button 
            onClick={resetOnboarding}
            className="text-label-caps font-label text-primary hover:underline"
          >
            Reset
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Column 1: The Ring (Spans 4 cols on desktop) */}
          <div className="md:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant p-6 flex flex-col items-center shadow-sm">
            <h2 className="text-label-caps font-label text-on-surface-variant uppercase tracking-wider mb-6 w-full text-left">Daily Carbon Budget</h2>
            
            <div className="w-64 h-64 relative mb-6">
              <CircularProgressbar
                value={percentage}
                text={`${currentTotal.toFixed(1)}`}
                strokeWidth={8}
                styles={buildStyles({
                  pathColor: isOverBudget ? 'var(--color-error)' : 'var(--color-secondary)',
                  textColor: 'var(--color-on-surface)',
                  trailColor: 'var(--color-surface-container-high)',
                  textSize: '20px',
                })}
              />
              <div className="absolute bottom-16 left-0 right-0 text-center text-label-caps text-on-surface-variant font-label">
                kg CO2e
              </div>
            </div>

            <div className="flex justify-between w-full pt-4 border-t border-outline-variant">
              <div className="text-center">
                <p className="text-label-caps text-on-surface-variant font-label">Baseline</p>
                <p className="text-body-lg font-bold text-on-surface">{baselineCarbon.toFixed(1)}</p>
              </div>
              <div className="text-center">
                <p className="text-label-caps text-on-surface-variant font-label">Saved</p>
                <p className="text-body-lg font-bold text-secondary">{Math.abs(carbonSaved).toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Logs (Spans 4 cols on desktop) */}
          <div className="md:col-span-4 flex flex-col gap-6">
            
            {/* AI Scanner Button */}
            <button 
              onClick={() => setShowScanner(true)}
              className="w-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors p-6 rounded-xl border border-primary-container flex items-center justify-between group shadow-sm"
            >
              <div className="text-left">
                <h3 className="text-headline-lg-mobile font-display mb-1 flex items-center gap-2">
                  <Camera size={24} /> AI Scanner
                </h3>
                <p className="text-body-md opacity-90 font-body">Scan receipts & bills</p>
              </div>
              <ArrowRight className="transform group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Quick Actions */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex-1">
              <h2 className="text-label-caps font-label text-on-surface-variant uppercase tracking-wider mb-4">Quick Logs</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => handleQuickLog("Public Transit", -0.5, 'transport')}
                  className="w-full flex items-center gap-3 p-3 rounded border border-outline-variant hover:border-primary hover:bg-surface-container transition-colors"
                >
                  <div className="p-2 bg-surface-container-high rounded text-on-surface"><Bus size={18} /></div>
                  <div className="flex-1 text-left font-body text-on-surface">Public Transit</div>
                  <div className="text-secondary font-label text-label-caps">-0.5 kg</div>
                </button>

                <button 
                  onClick={() => handleQuickLog("Meatless Meal", -1.0, 'diet')}
                  className="w-full flex items-center gap-3 p-3 rounded border border-outline-variant hover:border-primary hover:bg-surface-container transition-colors"
                >
                  <div className="p-2 bg-surface-container-high rounded text-on-surface"><Leaf size={18} /></div>
                  <div className="flex-1 text-left font-body text-on-surface">Meatless Meal</div>
                  <div className="text-secondary font-label text-label-caps">-1.0 kg</div>
                </button>
              </div>
            </div>

          </div>

          {/* Column 3: Challenges (Spans 4 cols on desktop) */}
          <div className="md:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
            <h2 className="text-label-caps font-label text-on-surface-variant uppercase tracking-wider mb-4">Daily Challenges</h2>
            <div className="space-y-4">
              {challenges.map(challenge => (
                <label 
                  key={challenge.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    challenge.completed 
                      ? 'bg-secondary-container border-secondary-container text-on-secondary-container' 
                      : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={challenge.completed}
                    onChange={() => toggleChallenge(challenge.id)}
                    className="mt-1 w-5 h-5 accent-secondary"
                  />
                  <div className="flex-1">
                    <p className={`font-body text-body-md ${challenge.completed ? 'line-through opacity-80' : ''}`}>
                      {challenge.title}
                    </p>
                    <p className="font-label text-label-caps mt-1">
                      {Math.abs(challenge.impact)} kg CO2e saved
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
