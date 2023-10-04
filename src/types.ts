export type Mark = 'x' | 'o';

export type Gamemode = 'idle' | 'cpu' | 'player';

export type Board = (Mark | '')[];

export interface Player {
  name: 'P1' | 'P2' | 'You' | 'Cpu';
  score: number;
}

export interface Winner {
  message: string;
  mark: Mark;
}

export interface Store {
  gamemode: Gamemode;
  playerX: Player;
  playerO: Player;
  isDraw: boolean;
  ties: number;
  currentMark: Mark;
  currentBoard: Board;
  winner: Winner | null;
  startGame: (gamemode: Gamemode, p1Choice: Mark) => void;
  updateBoard: (i: number, curr: Mark | '') => void;
}
