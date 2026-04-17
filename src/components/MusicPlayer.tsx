import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'SynthWave AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon/200/200'
  },
  {
    id: '2',
    title: 'Digital Rain',
    artist: 'Cyber Runner',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber/200/200'
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'Retro Logic',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/grid/200/200'
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    let nextIndex = currentTrackIndex;
    if (direction === 'next') {
      nextIndex = (currentTrackIndex + 1) % DUMMY_TRACKS.length;
    } else {
      nextIndex = (currentTrackIndex - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length;
    }
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback failed", e));
    }
  }, [currentTrackIndex]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Playlist Side */}
      <div className="flex-1 space-y-1">
        {DUMMY_TRACKS.map((track, index) => (
          <div
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
            className={`group p-3 cursor-pointer border-l-[3px] transition-all duration-200 ${
              currentTrackIndex === index 
                ? 'bg-neon-magenta/5 border-neon-magenta' 
                : 'border-transparent hover:bg-white/5'
            }`}
          >
            <div className="font-sans text-sm font-semibold text-white/90">{track.title}</div>
            <div className="font-sans text-[10px] text-text-dim uppercase tracking-wider">{track.artist}</div>
          </div>
        ))}
      </div>

      {/* Actual Audio element */}
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={onTimeUpdate}
        onEnded={() => skipTrack('next')}
      />

      {/* Bottom Controls - styled like the design's footer */}
      <div className="mt-8 pt-6 border-t border-border-dim">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex flex-col">
            <div className="text-white text-sm font-bold truncate max-w-[150px]">{currentTrack.title}</div>
            <div className="text-text-dim text-[10px] uppercase tracking-widest font-sans font-bold">Now Playing</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 justify-center">
            <button 
              onClick={() => skipTrack('prev')}
              className="w-10 h-10 rounded-full border border-text-dim flex items-center justify-center text-white hover:border-white transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-neon-magenta text-black flex items-center justify-center border-none shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
            <button 
              onClick={() => skipTrack('next')}
              className="w-10 h-10 rounded-full border border-text-dim flex items-center justify-center text-white hover:border-white transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex-1 h-1 bg-border-dim rounded-full relative overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-neon-magenta shadow-[0_0_8px_#ff00ff]"
                  style={{ width: `${progress}%` }}
                />
             </div>
             <span className="font-mono text-[10px] text-text-dim">
               {audioRef.current ? Math.floor(audioRef.current.currentTime / 60).toString().padStart(2, '0') : '00'}:
               {audioRef.current ? Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0') : '00'}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};
