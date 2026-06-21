"use client";

import { useState } from "react";
import { useEcoStore } from "@/lib/store";
import { Leaf, Car, Home, Key, ArrowRight, Activity, Zap } from "lucide-react";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [commute, setCommute] = useState(10);
  const [diet, setDiet] = useState(3);
  const [energy, setEnergy] = useState(15);
  const [apiKey, setLocalApiKey] = useState("");
  
  const { completeOnboarding, setApiKey } = useEcoStore();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Calculate a rough baseline in kg CO2e / day
      // Commute: km * 0.2
      // Diet: diet score (1=vegan, 5=heavy meat) * 1.5
      // Energy: kWh * 0.4
      const baseline = (commute * 0.2) + (diet * 1.5) + (energy * 0.4);
      if (apiKey) setApiKey(apiKey);
      completeOnboarding(Number(baseline.toFixed(1)));
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-surface-container">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="mb-8 mt-2 text-center">
          <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
            {step === 1 && <Car size={24} />}
            {step === 2 && <Activity size={24} />}
            {step === 3 && <Zap size={24} />}
            {step === 4 && <Key size={24} />}
          </div>
          <h1 className="text-headline-lg-mobile text-on-surface mb-2 font-display">
            {step === 1 && "Daily Commute"}
            {step === 2 && "Dietary Habits"}
            {step === 3 && "Home Energy"}
            {step === 4 && "AI Integration"}
          </h1>
          <p className="text-body-md text-on-surface-variant font-body">
            {step === 1 && "How many kilometers do you travel daily?"}
            {step === 2 && "How would you describe your typical diet?"}
            {step === 3 && "Average daily electricity usage (kWh)?"}
            {step === 4 && "Enter your Gemini API key for smart receipt scanning (Optional but recommended)."}
          </p>
        </div>

        <div className="space-y-6 min-h-[160px] flex flex-col justify-center">
          {step === 1 && (
            <div className="space-y-4">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={commute}
                onChange={(e) => setCommute(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="text-center text-stats-num text-primary font-display">
                {commute} <span className="text-body-md text-on-surface-variant">km</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {[
                { val: 1, label: "Vegan / Plant-based" },
                { val: 2, label: "Vegetarian" },
                { val: 3, label: "Flexitarian (Occasional meat)" },
                { val: 4, label: "Average (Daily meat)" },
                { val: 5, label: "Heavy Meat Eater" },
              ].map((option) => (
                <button
                  key={option.val}
                  onClick={() => setDiet(option.val)}
                  className={`w-full p-3 rounded-lg border text-left font-body text-body-md transition-colors ${
                    diet === option.val 
                      ? 'border-primary bg-primary-container text-on-primary-container' 
                      : 'border-outline-variant text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="text-center text-stats-num text-primary font-display">
                {energy} <span className="text-body-md text-on-surface-variant">kWh</span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <input 
                type="password" 
                placeholder="AIzaSy..." 
                value={apiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                className="w-full p-3 border-b-2 border-outline-variant bg-surface focus:border-primary outline-none transition-colors text-on-surface font-body"
              />
              <p className="text-label-caps text-on-surface-variant font-label text-center">
                Stored safely in LocalStorage. Used directly from your browser.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <button 
            onClick={() => step > 1 && setStep(step - 1)}
            className={`px-4 py-2 text-label-caps font-label font-bold uppercase ${step === 1 ? 'invisible' : 'text-primary'}`}
          >
            Back
          </button>
          
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2 rounded font-label text-label-caps uppercase hover:bg-[#003d2b] transition-colors"
          >
            {step === 4 ? "Complete" : "Next"}
            {step < 4 && <ArrowRight size={16} />}
          </button>
        </div>

      </div>
    </div>
  );
}
