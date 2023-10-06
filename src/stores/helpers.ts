import { Mark, Player, Result, Store } from '../types';
import { WIN_COMBINATIONS } from './constants';

export const checkWinner = (
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

export const checkDraw = (currentBoard: Store['currentBoard'], nbOfMoves: number) => {
  if (nbOfMoves < 7) return false;
  for (let i = 0; i < currentBoard.length; i++) {
    const cell = currentBoard[i];
    if (cell === '') break;
    if (i === 8) return true;
  }
  return false;
};

export const updateWinningScores = (store: Store): Pick<Store, 'playerO' | 'playerX'> => {
  if (store.currentMark === 'x') {
    const playerX: Player = { ...store.playerX, score: ++store.playerX.score };
    return { playerX, playerO: store.playerO };
  } else {
    const playerO: Player = { ...store.playerO, score: ++store.playerO.score };
    return { playerO, playerX: store.playerX };
  }
};

export const getWinningMessage = (store: Store): Result => {
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

export const getCpuNextMove = (currentBoard: Store['currentBoard'], currentMark: Mark) => {
  const clone = [...currentBoard];
  const legalMoves: number[] = [];
  for (let i = 0; i < clone.length; i++) {
    const curr = clone[i];
    if (curr !== '') continue;
    legalMoves.push(i);
  }

  /* play 1st winning move */
  for (let i = 0; i < legalMoves.length; i++) {
    const curr = legalMoves[i];
    const offenseArr = [...currentBoard];
    offenseArr[curr] = currentMark;
    if (checkWinner(offenseArr, currentMark, 5)) return curr;
  }

  /* Play 1st defense move */
  const oppositeMark = currentMark === 'x' ? 'o' : 'x';
  for (let i = 0; i < legalMoves.length; i++) {
    const curr = legalMoves[i];
    const offenseArr = [...currentBoard];
    offenseArr[curr] = oppositeMark;
    if (checkWinner(offenseArr, oppositeMark, 5)) return curr;
  }

  /* Play random legal move */
  const randomIndex = legalMoves[Math.floor(Math.random() * legalMoves.length)];
  return randomIndex;
};
