# EcoTrack AI Scanner 🌍

A Progressive Web App (PWA) built for instantaneous, zero-friction carbon footprint tracking. Bridge the gap between abstract climate science and daily human behavior with gamified, actionable steps and AI-powered receipt scanning.

![Deploy with Vercel](https://vercelbadge.vercel.app/api/ashxris/ecotrack-ai-scanner)

## 🚀 Features

- **Zero-Friction Onboarding:** Instantly calculate your baseline carbon footprint right from your browser—no sign-ups, no cloud databases.
- **Progressive Web App (PWA):** Install it directly to your home screen for a native app-like experience. Completely functional offline.
- **Eco-Hub Dashboard:** Track your daily carbon budget with a massive circular progress ring and 1-click quick logs.
- **Gamified Eco-Challenges:** Check off low-carbon actions (like unplugging standby electronics) to dynamically shrink your carbon ring.
- **Smart AI Eco-Scanner (BYOK):** Snap a photo of a grocery receipt or utility bill. Using your own Google Gemini API key securely stored in LocalStorage, the AI will automatically extract and calculate the carbon impact of those items.

## 🛠️ The Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **PWA Engine:** `@ducanh2912/next-pwa`
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (with LocalStorage persist middleware)
- **AI Integration:** Google Gemini SDK (`@google/genai`)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🏃‍♂️ Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/ashxris/ecotrack-ai-scanner.git
   cd ecotrack-ai-scanner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧠 Architecture Notes

- **Zero-Backend Architecture:** To ensure ultimate user privacy and instant load times, all user data—including onboarding results, daily logs, and API keys—is saved entirely on the client-side within the browser's LocalStorage.
- **Serverless API Proxy:** The AI Eco-Scanner utilizes a Next.js API route (`/api/scan`) as a proxy to communicate with the Gemini API, preventing client-side CORS errors while preserving the Bring-Your-Own-Key model.

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to check the issues page.
