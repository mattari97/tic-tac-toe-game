import { create } from 'zustand';
import { Board, Gamemode, Mark, Player, Store, Winner } from '../types';

const DEFAULT_PLAYER: Player = { name: 'P1', score: 0 };
const DEFAULT_BOARD: Board = ['', '', '', '', '', '', '', '', ''];
const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

const checkWinner = (currentBoard: Store['currentBoard'], currentMark: Store['currentMark']): boolean => {
  for (let i = 0; i < WIN_COMBINATIONS.length; i++) {
    const curr = WIN_COMBINATIONS[i];
    if (
      currentBoard[curr[0]] === currentMark &&
      currentBoard[curr[1]] === currentMark &&
      currentBoard[curr[2]] === currentMark
    ) {
      return true;
    }
  }
  return false;
};

const checkDraw = (currentBoard: Store['currentBoard']) => {
  console.log(currentBoard);
  for (let i = 0; i < currentBoard.length; i++) {
    const cell = currentBoard[i];
    if (cell === '') break;
    if (i === 8) return true;
  }
  return false;
};

const updateWinningScores = (store: Store): Pick<Store, 'playerO' | 'playerX'> => {
  if (store.currentMark === 'x') {
    const playerX: Player = { ...store.playerX, score: ++store.playerX.score };
    return { playerX, playerO: store.playerO };
  } else {
    const playerO: Player = { ...store.playerO, score: ++store.playerO.score };
    return { playerO, playerX: store.playerX };
  }
};

const getWinningMessage = (store: Store): Winner => {
  const winningPlayer = store.currentMark === 'x' ? store.playerX : store.playerO;
  let message: string;
  switch (winningPlayer.name) {
    case 'Cpu':
      message = 'Oh no, you lost…';
      break;
    case 'You':
      message = 'You won!';
      break;
    case 'P1':
      message = 'Player 1 wins!';
      break;
    case 'P2':
      message = 'Player 2 wins!';
  }
  return { mark: store.currentMark, message };
};

/* ----------------- */
/* Game Store        */
/* ----------------- */

const useStore = create<Store>()((set) => ({
  gamemode: 'idle',
  currentMark: 'x',
  playerX: { ...DEFAULT_PLAYER },
  playerO: { ...DEFAULT_PLAYER },
  currentBoard: [...DEFAULT_BOARD],
  ties: 0,
  winner: null,
  isDraw: false,

  startGame: (gamemode: Gamemode, p1Choice: Mark) => {
    const p1Name: Player['name'] = gamemode === 'player' ? 'P1' : 'You';
    const p2Name: Player['name'] = gamemode === 'player' ? 'P2' : 'Cpu';

    const playerX: Player = { name: p1Choice === 'x' ? p1Name : p2Name, score: 0 };
    const playerO: Player = { name: p1Choice === 'o' ? p1Name : p2Name, score: 0 };

    return set((state) => ({ ...state, gamemode, playerX, playerO }));
  },
  updateBoard: (index: number, curr: Mark | '') => {
    if (curr !== '') return;

    set((state) => {
      const currentBoard = state.currentBoard.map((value, i) => (i === index ? state.currentMark : value));
      const currentMark: Mark = state.currentMark === 'x' ? 'o' : 'x';
      if (checkWinner(currentBoard, state.currentMark)) {
        const players = updateWinningScores(state);
        const winner = getWinningMessage(state);
        return { ...state, ...players, currentBoard, currentMark, winner };
      } else if (checkDraw(currentBoard)) {
        return { ...state, currentBoard, currentMark, isDraw: true, ties: ++state.ties };
      } else {
        return { ...state, currentBoard, currentMark };
      }
    });
  },
}));

export default useStore;
