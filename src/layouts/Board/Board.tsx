import styles from './Board.module.css';
import Logo from '../../assets/logo.svg?react';
import IconX from '../../assets/icon-x.svg?react';
import IconXOutline from '../../assets/icon-x-outline.svg?react';
import IconO from '../../assets/icon-o.svg?react';
import IconOOutline from '../../assets/icon-o-outline.svg?react';
import Restart from '../../assets/icon-restart.svg?react';
import { useStore } from '../../stores';

interface BoardProps {
  toggleRestartModal: (props: unknown) => void;
}

function Board({ toggleRestartModal }: BoardProps) {
  const currMark = useStore((state) => state.currentMark);
  const currBoard = useStore((state) => state.currentBoard);
  const playerX = useStore((state) => state.playerX);
  const playerO = useStore((state) => state.playerO);
  const ties = useStore((state) => state.ties);
  const updateBoard = useStore((state) => state.updateBoard);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Logo />
        <div>
          {currMark === 'x' ? <IconX /> : <IconO />}
          <span>Turn</span>
        </div>
        <button onClick={toggleRestartModal} aria-label="Restart the game">
          <Restart />
        </button>
      </div>
      <div className={styles.board}>
        {currBoard.map((mark, index) => (
          <button data-mark={mark} data-current={currMark} onClick={() => updateBoard(index, mark)} key={index}>
            <IconO className={styles.iconO} aria-label="O mark" aria-hidden="true" />
            <IconX className={styles.iconX} aria-label="X mark" aria-hidden="true" />
            <IconOOutline className={styles.iconOOutline} aria-hidden="true" />
            <IconXOutline className={styles.iconXOutline} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className={styles.scores}>
        <div className={styles.scoreX}>
          <span>X ({playerX.name})</span>
          <span>{playerX.score}</span>
        </div>
        <div className={styles.ties}>
          <span>Ties</span>
          <span>{ties}</span>
        </div>
        <div className={styles.scoreO}>
          <span>O ({playerO.name})</span>
          <span>{playerO.score}</span>
        </div>
      </div>
    </div>
  );
}

export default Board;
