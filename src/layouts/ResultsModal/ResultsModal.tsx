import * as React from 'react';

import { useStore } from '../../stores';
import styles from './ResultsModal.module.css';
import IconX from '../../assets/icon-x.svg?react';
import IconO from '../../assets/icon-o.svg?react';

function ResultsModal() {
  const ref = React.useRef<HTMLDialogElement>(null);
  const result = useStore((state) => state.result);
  const quitGame = useStore((state) => state.quitGame);
  const startNextGame = useStore((state) => state.startNextGame);
  React.useEffect(() => {
    if (!ref.current) return;
    if (result) console.log(result);
    return result ? ref.current.showModal() : ref.current.close();
  }, [ref, result]);

  return (
    <dialog ref={ref} className={styles.dialog}>
      <div className={styles.container}>
        {result?.message && <h2>{result.message}</h2>}
        <div data-variant={result?.type}>
          {result?.type === 'x' && <IconX />}
          {result?.type === 'o' && <IconO />}
          <span>{result?.type === 'tie' ? 'Round tied' : 'Takes the round'}</span>
        </div>
        <div className={styles.actions}>
          <button onClick={quitGame} className="btn-sm btn-sm-light">
            Quit
          </button>
          <button onClick={startNextGame} className="btn-sm btn-sm-primary">
            Next Round
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ResultsModal;
