export const BOARD_SIZE = 20;
export const INITIAL_SNAKE = [{ x: 10, y: 10 }];
export const INITIAL_DIRECTION = { x: 1, y: 0 };
export const GAME_SPEED = {
  EASY: 200,
  MEDIUM: 150,
  HARD: 100,
  EXTREME: 70
};

export type Position = { x: number; y: number };
export type Direction = { x: number; y: number };
export type Difficulty = keyof typeof GAME_SPEED;

export const generateFood = (snake: Position[], boardSize: number): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize)
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

export const checkCollision = (pos: Position, boardSize: number): boolean => {
  return pos.x < 0 || pos.x >= boardSize || pos.y < 0 || pos.y >= boardSize;
};

export const checkSelfCollision = (head: Position, body: Position[]): boolean => {
  return body.some(segment => segment.x === head.x && segment.y === head.y);
};

export const getCurrentStage = (score: number): { stage: number; requiredScore: number } => {
  const stages = [
    { stage: 1, requiredScore: 0 },
    { stage: 2, requiredScore: 5 },
    { stage: 3, requiredScore: 10 },
    { stage: 4, requiredScore: 15 },
    { stage: 5, requiredScore: 20 }
  ];
  
  const currentStage = stages.reverse().find(s => score >= s.requiredScore) || stages[0];
  const nextStage = stages.find(s => s.requiredScore > score) || stages[stages.length - 1];
  
  return {
    stage: currentStage.stage,
    requiredScore: nextStage.requiredScore
  };
};