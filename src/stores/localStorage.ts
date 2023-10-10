import { InitialStore, Store } from '../types';

const LOCAL_KEY = 'tic-tac-toe.board';

export const getLocalStorageData = (initialValue: InitialStore): InitialStore => {
  try {
    const localValue = window.localStorage.getItem(LOCAL_KEY);
    return localValue ? JSON.parse(localValue) : initialValue;
  } catch (err) {
    console.log(err);
    return initialValue;
  }
};

export const setLocalStorageData = (state: Store) => {
  const data: InitialStore = {
    gamemode: state.gamemode,
    currentMark: state.currentMark,
    startingMark: state.startingMark,
    playerX: state.playerX,
    playerO: state.playerO,
    currentBoard: state.currentBoard,
    ties: state.ties,
    nbOfMoves: state.nbOfMoves,
    result: state.result,
    isCpuMove: state.isCpuMove,
  };
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
};

export const clearLocalStorageData = () => window.localStorage.removeItem(LOCAL_KEY);
