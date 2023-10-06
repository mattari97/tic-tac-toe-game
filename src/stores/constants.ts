import { Board, Player } from '../types';

export const DEFAULT_PLAYER: Player = { name: 'P1', score: 0 };
export const DEFAULT_BOARD: Board = ['', '', '', '', '', '', '', '', ''];
export const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];
