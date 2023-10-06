export type Mark = 'x' | 'o';

export type Gamemode = 'idle' | 'cpu' | 'player';

export type Board = (Mark | '')[];

export interface Player {
  name: 'P1' | 'P2' | 'You' | 'Cpu';
  score: number;
}

export interface Result {
  message?: string;
  type: Mark | 'tie' | 'restart';
}

export interface Store {
  gamemode: Gamemode;
  playerX: Player;
  playerO: Player;
  nbOfMoves: number;
  ties: number;
  currentMark: Mark;
  currentBoard: Board;
  result: Result | null;
  isCpuMove: boolean;
  startGame: (gamemode: Gamemode, p1Choice: Mark) => void;
  updateBoard: (i?: number) => void;
  startNextGame: () => void;
  restartGame: () => void;
  quitGame: () => void;
}
