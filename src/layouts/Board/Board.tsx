import * as React from 'react';

import styles from './Board.module.css';
import Logo from '../../assets/logo.svg?react';
import IconX from '../../assets/icon-x.svg?react';
import IconXOutline from '../../assets/icon-x-outline.svg?react';
import IconO from '../../assets/icon-o.svg?react';
import IconOOutline from '../../assets/icon-o-outline.svg?react';
import Restart from '../../assets/icon-restart.svg?react';
import { Mark } from '../../types';

const initialBoard: (Mark | '')[] = ['', '', '', '', '', '', '', '', ''];

function Board() {
  const [currMark, setCurrMark] = React.useState<Mark>('x');
  const [board, setBoard] = React.useState<typeof initialBoard>(initialBoard);
  const toggleCurrMark = () => setCurrMark((prev) => (prev === 'x' ? 'o' : 'x'));
  const updateBoard = (i: number, curr: Mark | '') => () => {
    if (curr !== '') return;
    setBoard((prev) => prev.map((value, index) => (index === i ? currMark : value)));
    toggleCurrMark();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Logo />
        <div>
          <IconX />
          <span>Turn</span>
        </div>
        <button aria-label="Restart the game">
          <Restart />
        </button>
      </div>
      <div className={styles.board}>
        {board.map((mark, index) => (
          <button data-mark={mark} data-current={currMark} onClick={updateBoard(index, mark)} key={index}>
            <IconO className={styles.iconO} aria-label="O mark" />
            <IconX className={styles.iconX} aria-label="X mark" />
            <IconOOutline className={styles.iconOOutline} aria-hidden="true" />
            <IconXOutline className={styles.iconXOutline} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className={styles.scores}>
        <div className={styles.scoreX}>
          <span>X (You)</span>
          <span>14</span>
        </div>
        <div className={styles.ties}>
          <span>Ties</span>
          <span>32</span>
        </div>
        <div className={styles.scoreO}>
          <span>O (Cpu)</span>
          <span>12</span>
        </div>
      </div>
    </div>
  );
}

export default Board;
