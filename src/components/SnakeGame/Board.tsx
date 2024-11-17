import React from 'react';
import { Position } from '@/lib/game';

interface BoardProps {
  snake: Position[];
  food: Position;
  cellSize: number;
  boardSize: number;
}

export const Board: React.FC<BoardProps> = ({ snake, food, cellSize, boardSize }) => {
  return (
    <div 
      className="relative bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
      style={{
        width: cellSize * boardSize,
        height: cellSize * boardSize,
      }}
    >
      {/* Food */}
      <div
        className="absolute w-4 h-4 bg-red-500 rounded-full transition-all duration-200 animate-pulse"
        style={{
          left: `${food.x * cellSize + cellSize/2 - 8}px`,
          top: `${food.y * cellSize + cellSize/2 - 8}px`,
        }}
      />

      {/* Snake */}
      {snake.map((segment, index) => (
        <div
          key={`${segment.x}-${segment.y}`}
          className={`absolute transition-all duration-100 rounded-lg ${
            index === 0 
              ? 'bg-green-400 scale-110' 
              : 'bg-green-500'
          }`}
          style={{
            width: cellSize - 2,
            height: cellSize - 2,
            left: segment.x * cellSize + 1,
            top: segment.y * cellSize + 1,
            boxShadow: index === 0 ? '0 0 10px rgba(74, 222, 128, 0.5)' : 'none'
          }}
        />
      ))}

      {/* Grid */}
      <div 
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          opacity: 0.1
        }}
      >
        {Array.from({ length: boardSize * boardSize }).map((_, i) => (
          <div key={i} className="border border-white/10" />
        ))}
      </div>
    </div>
  );
};