import { create } from 'zustand';
import { Gamemode, Mark, Player, Store, Result } from '../types';
import { DEFAULT_PLAYER, DEFAULT_BOARD } from './constants';
import { checkDraw, checkWinner, getCpuNextMove, getWinningMessage, updateWinningScores } from './helpers';

const DEFAULT_STORE = {
  gamemode: 'idle',
  currentMark: 'x',
  startingMark: 'x',
  playerX: { ...DEFAULT_PLAYER },
  playerO: { ...DEFAULT_PLAYER },
  currentBoard: [...DEFAULT_BOARD],
  ties: 0,
  nbOfMoves: 0,
  result: null,
  isCpuMove: false,
} as Omit<Store, 'startGame' | 'updateBoard' | 'startNextGame' | 'restartGame' | 'quitGame'>;

/* ----------------- */
/* Game Store        */
/* ----------------- */

const useStore = create<Store>()((set) => ({
  ...DEFAULT_STORE,

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
        const cpuMoveIndex = getCpuNextMove(state.currentBoard, state.currentMark);
        currentBoard = state.currentBoard.map((value, i) => (i === cpuMoveIndex ? state.currentMark : value));
      } else {
        currentBoard = state.currentBoard.map((value, i) => (i === index ? state.currentMark : value));
      }

      const nbOfMoves = ++state.nbOfMoves;

      if (checkWinner(currentBoard, state.currentMark, nbOfMoves)) {
        const players = updateWinningScores(state);
        const result = getWinningMessage(state);
        return { ...state, ...players, currentBoard, result, isCpuMove: false };
      } else if (checkDraw(currentBoard, nbOfMoves)) {
        const result: Result = { type: 'tie' };
        return { ...state, currentBoard, result, ties: ++state.ties, isCpuMove: false };
      } else {
        const currentMark: Mark = state.currentMark === 'x' ? 'o' : 'x';
        const isCpuMove = !state.isCpuMove && state.gamemode === 'cpu' ? true : false;
        return { ...state, currentBoard, currentMark, nbOfMoves, isCpuMove };
      }
    }),
  startNextGame: () =>
    set((state) => {
      const currentMark: Mark = state.startingMark === 'x' ? 'o' : 'x';
      const startingMark: Mark = currentMark;
      const isCpuMove =
        state.gamemode === 'cpu' &&
        ((currentMark === 'x' && state.playerX.name === 'Cpu') ||
          (currentMark === 'o' && state.playerO.name === 'Cpu'));
      return {
        ...state,
        currentMark,
        startingMark,
        currentBoard: [...DEFAULT_BOARD],
        result: null,
        nbOfMoves: 0,
        isCpuMove,
      };
    }),
  restartGame: () =>
    set((state) => ({
      ...state,
      currentMark: 'x',
      startingMark: 'x',
      playerO: { ...state.playerO, score: 0 },
      playerX: { ...state.playerX, score: 0 },
      ties: 0,
      nbOfMoves: 0,
      currentBoard: [...DEFAULT_BOARD],
      isCpuMove: state.gamemode === 'cpu' && state.playerX.name === 'Cpu',
    })),
  quitGame: () => set((state) => ({ ...state, ...DEFAULT_STORE })),
}));

export default useStore;
