import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collision with walls
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused, score, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'DOWN') directionRef.current = 'UP';
          setIsPaused(false);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'UP') directionRef.current = 'DOWN';
          setIsPaused(false);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
          setIsPaused(false);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
          setIsPaused(false);
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
      setDirection(directionRef.current);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#050505');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#ffffff' : '#00f3ff';
      
      // Glow effect
      ctx.shadowBlur = isHead ? 15 : 8;
      ctx.shadowColor = isHead ? '#ffffff' : '#00f3ff';
      
      ctx.fillRect(
        segment.x * CELL_SIZE, 
        segment.y * CELL_SIZE, 
        CELL_SIZE, 
        CELL_SIZE
      );
      
      ctx.shadowBlur = 0;
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="border-2 border-neon-cyan/50 shadow-[0_0_30px_rgba(0,243,255,0.2)] bg-black"
        />
        
        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center backdrop-blur-md">
            <h3 className="text-neon-magenta font-sans font-black text-3xl mb-4 uppercase tracking-[4px]">Game Over</h3>
            <p className="text-text-dim font-mono mb-8 uppercase tracking-widest">Score: {score}</p>
            <button
              onClick={resetGame}
              className="bg-neon-magenta text-black px-10 py-3 font-sans font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,0,255,0.4)] hover:scale-105 transition-all"
            >
              Restart System
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center backdrop-blur-[1px]">
            <p className="text-neon-cyan font-sans font-bold text-sm animate-pulse uppercase tracking-[3px]">System Idle</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex gap-8 font-mono text-xs uppercase tracking-tighter text-white/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-500 rounded-sm shadow-[0_0_8px_cyan]" />
          <span>Snake</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-magenta-500 rounded-full shadow-[0_0_8px_magenta]" />
          <span>Fruit</span>
        </div>
      </div>
    </div>
  );
};
