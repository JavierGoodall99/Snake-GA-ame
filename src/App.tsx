import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useSound from 'use-sound';
import { Board } from "./components/SnakeGame/Board";
import { Controls } from "./components/SnakeGame/Controls";
import { ScoreBoard } from "./components/SnakeGame/ScoreBoard";
import {
  BOARD_SIZE,
  GAME_SPEED,
  INITIAL_DIRECTION,
  INITIAL_SNAKE,
  Position,
  Direction,
  Difficulty,
  checkCollision,
  checkSelfCollision,
  generateFood,
  getCurrentStage,
} from "./lib/game";

export default function Index() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>(generateFood(INITIAL_SNAKE, BOARD_SIZE));
  const [isStarted, setIsStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState<number[]>([0, 0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [playEat] = useSound('/sounds/eat.mp3', { volume: 0.5 });
  const [playGameOver] = useSound('/sounds/game-over.mp3', { volume: 0.5 });

  const cellSize = Math.min(
    Math.floor((window.innerWidth * 0.8) / BOARD_SIZE),
    Math.floor((window.innerHeight * 0.6) / BOARD_SIZE)
  );

  const currentStage = getCurrentStage(score);
  const gameLoopRef = useRef<number>();

  const moveSnake = useCallback(() => {
    if (gameOver || !isStarted || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
      };

      // Check collisions
      if (checkCollision(newHead, BOARD_SIZE) || checkSelfCollision(newHead, prevSnake)) {
        setGameOver(true);
        playGameOver();
        setHighScores(prev => {
          const newScores = [...prev, score].sort((a, b) => b - a).slice(0, 3);
          localStorage.setItem('snakeHighScores', JSON.stringify(newScores));
          return newScores;
        });
        return prevSnake;
      }

      // Check if snake ate food
      if (newHead.x === food.x && newHead.y === food.y) {
        playEat();
        setScore(s => s + 1);
        setFood(generateFood([newHead, ...prevSnake], BOARD_SIZE));
        return [newHead, ...prevSnake];
      }

      return [newHead, ...prevSnake.slice(0, -1)];
    });
  }, [direction, food, gameOver, isStarted, isPaused, score]);

  useEffect(() => {
    const savedScores = localStorage.getItem('snakeHighScores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  useEffect(() => {
    if (isStarted && !gameOver && !isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED[difficulty]);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isStarted, gameOver, isPaused, moveSnake, difficulty]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE, BOARD_SIZE));
    setGameOver(false);
    setScore(0);
    setIsStarted(false);
    setIsPaused(false);
  };

  const togglePause = () => {
    if (isStarted && !gameOver) {
      setIsPaused(p => !p);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2c3e50] to-[#3498db] p-4">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-lg">
        🐍 Smooth Snake
      </h1>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-7xl mx-auto">
        <div className="relative order-2 md:order-1">
          <Board
            snake={snake}
            food={food}
            cellSize={cellSize}
            boardSize={BOARD_SIZE}
          />
          <Controls
            onDirectionChange={setDirection}
            currentDirection={direction}
            isStarted={isStarted}
            setIsStarted={setIsStarted}
            isPaused={isPaused}
            onTogglePause={togglePause}
          />
          
          {!isStarted && !gameOver && (
            <p className="text-white/70 mt-4 text-center animate-pulse">
              {window.innerWidth < 768 
                ? "Swipe to Move 👆" 
                : "Press any Arrow Key to Start 🎮"}
            </p>
          )}
        </div>

        <div className="w-full max-w-md order-1 md:order-2">
          <ScoreBoard
            score={score}
            highScores={highScores}
            gameOver={gameOver}
            isPaused={isPaused}
            currentStage={currentStage}
            onRestart={resetGame}
            onTogglePause={togglePause}
          />
        </div>
      </div>
    </div>
    </div>
  );
}