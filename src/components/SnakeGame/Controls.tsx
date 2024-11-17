import React, { useEffect } from 'react';
import { Gamepad2, Pause, Play } from 'lucide-react';
import { Direction } from '@/lib/game';

interface ControlsProps {
  onDirectionChange: (dir: Direction) => void;
  currentDirection: Direction;
  isStarted: boolean;
  setIsStarted: (started: boolean) => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onDirectionChange,
  currentDirection,
  isStarted,
  setIsStarted,
  isPaused,
  onTogglePause
}) => {
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStarted) setIsStarted(true);
      
      switch (e.key) {
        case 'ArrowUp':
          if (currentDirection.y !== 1) onDirectionChange({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (currentDirection.y !== -1) onDirectionChange({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (currentDirection.x !== 1) onDirectionChange({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (currentDirection.x !== -1) onDirectionChange({ x: 1, y: 0 });
          break;
        case ' ':
          onTogglePause();
          break;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX || !touchStartY) return;

      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && currentDirection.x !== -1) {
          onDirectionChange({ x: 1, y: 0 });
        } else if (deltaX < 0 && currentDirection.x !== 1) {
          onDirectionChange({ x: -1, y: 0 });
        }
      } else {
        if (deltaY > 0 && currentDirection.y !== -1) {
          onDirectionChange({ x: 0, y: 1 });
        } else if (deltaY < 0 && currentDirection.y !== 1) {
          onDirectionChange({ x: 0, y: -1 });
        }
      }

      if (!isStarted) setIsStarted(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [currentDirection, isStarted, onDirectionChange, setIsStarted]);

  return (
    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-4">
      <button
        onClick={onTogglePause}
        className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        {isPaused ? <Play size={24} className="text-white" /> : <Pause size={24} className="text-white" />}
      </button>
      <button className="p-3 rounded-full bg-white/10">
        <Gamepad2 size={24} className="text-white" />
      </button>
    </div>
  );
};