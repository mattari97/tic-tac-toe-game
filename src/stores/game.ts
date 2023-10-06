import { create } from 'zustand';
import { Board, Gamemode, Mark, Player, Store, Result } from '../types';

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

const checkWinner = (
  currentBoard: Store['currentBoard'],
  currentMark: Store['currentMark'],
  nbOfMoves: number
): boolean => {
  if (nbOfMoves < 5) return false;
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

const checkDraw = (currentBoard: Store['currentBoard'], nbOfMoves: number) => {
  if (nbOfMoves < 7) return false;
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

const getWinningMessage = (store: Store): Result => {
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
  return { type: store.currentMark, message };
};

const getCpuNextMove = (currentBoard: Store['currentBoard']) => {
  const clone = [...currentBoard];
  const legalMoves: number[] = [];
  for (let i = 0; i < clone.length; i++) {
    const curr = clone[i];
    if (curr !== '') continue;
    legalMoves.push(i);
  }
  const randomIndex = legalMoves[Math.floor(Math.random() * legalMoves.length)];
  return randomIndex;
};

// const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

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
  nbOfMoves: 0,
  result: null,
  isCpuMove: false,

  startGame: (gamemode: Gamemode, p1Choice: Mark) => {
    const p1Name: Player['name'] = gamemode === 'player' ? 'P1' : 'You';
    const p2Name: Player['name'] = gamemode === 'player' ? 'P2' : 'Cpu';

    const playerX: Player = { name: p1Choice === 'x' ? p1Name : p2Name, score: 0 };
    const playerO: Player = { name: p1Choice === 'o' ? p1Name : p2Name, score: 0 };

    const isCpuMove = gamemode === 'cpu' && playerX.name === 'Cpu';

    return set((state) => ({ ...state, gamemode, playerX, playerO, isCpuMove }));
  },
  updateBoard: (index?: number) =>
    set((state) => {
      if (index && state.currentBoard[index] !== '') return state;
      let currentBoard: Store['currentBoard'];

      if (state.isCpuMove) {
        console.log('cpu move');
        const cpuMoveIndex = getCpuNextMove(state.currentBoard);
        currentBoard = state.currentBoard.map((value, i) => (i === cpuMoveIndex ? state.currentMark : value));
      } else {
        console.log('player move');
        currentBoard = state.currentBoard.map((value, i) => (i === index ? state.currentMark : value));
      }

      const currentMark: Mark = state.currentMark === 'x' ? 'o' : 'x';
      const nbOfMoves = ++state.nbOfMoves;

      if (checkWinner(currentBoard, state.currentMark, nbOfMoves)) {
        const players = updateWinningScores(state);
        const result = getWinningMessage(state);
        return { ...state, ...players, currentBoard, currentMark, result, isCpuMove: false };
      } else if (checkDraw(currentBoard, nbOfMoves)) {
        const result: Result = { type: 'tie' };
        return { ...state, currentBoard, currentMark, result, ties: ++state.ties, isCpuMove: false };
      } else {
        const isCpuMove = !state.isCpuMove && state.gamemode === 'cpu' ? true : false;
        console.log('store', isCpuMove);
        return { ...state, currentBoard, currentMark, nbOfMoves, isCpuMove };
      }
    }),
  startNextGame: () =>
    set((state) => {
      const isCpuMove =
        state.gamemode === 'cpu' &&
        ((state.currentMark === 'x' && state.playerX.name === 'Cpu') ||
          (state.currentMark === 'o' && state.playerO.name === 'Cpu'));
      return { ...state, currentBoard: [...DEFAULT_BOARD], result: null, nbOfMoves: 0, isCpuMove };
    }),
  restartGame: () =>
    set((state) => ({
      ...state,
      currentMark: 'x',
      playerO: { ...state.playerO, score: 0 },
      playerX: { ...state.playerX, score: 0 },
      ties: 0,
      nbOfMoves: 0,
      currentBoard: [...DEFAULT_BOARD],
      isCpuMove: state.gamemode === 'cpu' && state.playerX.name === 'Cpu',
    })),
  quitGame: () =>
    set((state) => ({
      ...state,
      gamemode: 'idle',
      currentMark: 'x',
      playerX: { ...DEFAULT_PLAYER },
      playerO: { ...DEFAULT_PLAYER },
      currentBoard: [...DEFAULT_BOARD],
      ties: 0,
      result: null,
      nbOfMoves: 0,
      isCpuMove: false,
    })),
}));

export default useStore;
