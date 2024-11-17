import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScores: number[];
  gameOver: boolean;
  isPaused: boolean;
  currentStage: { stage: number; requiredScore: number };
  onRestart: () => void;
  onTogglePause: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  highScores,
  gameOver,
  isPaused,
  currentStage,
  onRestart,
  onTogglePause
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Score: {score}</h2>
          <p className="text-white/70">Stage {currentStage.stage}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRestart}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
            style={{
              width: `${(score / currentStage.requiredScore) * 100}%`
            }}
          />
        </div>
        <p className="text-sm text-white/70">
          {score} / {currentStage.requiredScore} points to next stage
        </p>
      </div>

      {(gameOver || isPaused) && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
            <Trophy size={20} className="text-yellow-400" />
            High Scores
          </h3>
          <ol className="space-y-1">
            {highScores.map((score, index) => (
              <li key={index} className="flex justify-between">
                <span>#{index + 1}</span>
                <span>{score}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {gameOver && (
        <button
          onClick={onRestart}
          className="w-full mt-4 py-2 px-4 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
        >
          Play Again
        </button>
      )}
    </div>
  );
};