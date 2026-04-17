import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { NeonCard } from './components/NeonCard';
import { Trophy, Activity, Zap, PlayCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] relative border-[4px] border-border-dim overflow-hidden font-sans">
      <div className="scanline" />

      {/* Header */}
      <header className="h-20 px-10 flex items-center justify-between border-b border-border-dim bg-gradient-to-r from-[#050505] to-[#0a0a0a] z-10">
        <div className="text-2xl font-black tracking-[4px] uppercase text-neon-cyan neon-text-cyan">
          SYNTH-STRYKE
        </div>
        <div className="flex gap-10">
          <div className="text-right">
            <div className="text-[11px] uppercase text-text-dim tracking-[2px] mb-1">Score</div>
            <div className="font-mono text-3xl font-bold text-neon-lime neon-text-lime">
              {score.toString().padStart(5, '0')}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase text-text-dim tracking-[2px] mb-1">Hi-Score</div>
            <div className="font-mono text-3xl font-bold text-neon-cyan neon-text-cyan">
              {highScore.toString().padStart(5, '0')}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="flex-1 grid grid-cols-[280px_1fr_280px] overflow-hidden">
        {/* Left Sidebar: Playlist */}
        <div className="bg-surface-dim border-r border-border-dim p-8 overflow-y-auto">
          <div className="text-xs font-bold uppercase mb-5 text-text-dim border-b border-border-dim pb-2 tracking-widest">
            System Audio
          </div>
          <MusicPlayer />
        </div>

        {/* Center: Game Arena */}
        <div className="relative bg-[radial-gradient(circle_at_center,#0a0a0a_0%,#050505_100%)] flex items-center justify-center p-8">
           <SnakeGame onScoreChange={handleScoreChange} />
        </div>

        {/* Right Sidebar: Controls Info */}
        <div className="bg-surface-dim border-l border-border-dim p-8">
          <div className="text-xs font-bold uppercase mb-6 text-text-dim border-b border-border-dim pb-2 tracking-widest">
            Game Analysis
          </div>
          
          <div className="space-y-8">
            <div>
              <div className="text-[11px] uppercase text-text-dim tracking-[2px] mb-3">Navigation</div>
              <div className="text-sm font-bold text-white uppercase font-sans border border-white/10 p-2 text-center bg-white/5">
                WASD // ARROWS
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase text-text-dim tracking-[2px] mb-3">Multiplier</div>
              <div className="font-mono text-2xl font-bold text-neon-magenta neon-text-magenta">
                {(1.0 + (score / 1000)).toFixed(1)}x
              </div>
              <div className="text-[11px] uppercase text-text-dim tracking-[2px] mt-4 mb-2">BPM Sync</div>
              <div className="text-xs font-mono text-neon-lime neon-text-lime uppercase">
                128 BPM // ACTIVE
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 opacity-30">
              <div className="text-[10px] font-mono leading-relaxed text-text-dim">
                CRITICAL ALERT: NEURAL FLOW OPTIMIZED. MAINTAIN SIGNAL INTEGRITY.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Meta */}
      <footer className="h-[40px] bg-surface border-t border-border-dim flex items-center justify-center z-10">
        <div className="font-mono text-[9px] text-white/20 uppercase tracking-[0.5em] animate-pulse">
           Signal Stable // Neural Interface Online // {new Date().toLocaleTimeString()}
        </div>
      </footer>
    </div>
  );
}

