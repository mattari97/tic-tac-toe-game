import * as React from 'react';

import styles from './ResultsModal.module.css';
import IconX from '../../assets/icon-x.svg?react';
import IconO from '../../assets/icon-o.svg?react';
import { Result } from '../../types';

interface Btn {
  label: string;
  onClick: (props: unknown) => void;
}

interface ResultsModalProps {
  result: Result | null;
  cancelBtn: Btn;
  ctaBtn: Btn;
  toggleCondition: boolean;
}

function ResultsModal({ cancelBtn, ctaBtn, result, toggleCondition }: ResultsModalProps) {
  const ref = React.useRef<HTMLDialogElement>(null);

  const typeMessage = React.useMemo(() => {
    if (!result) return '';
    if (result.type === 'restart') return 'Restart Game?';
    if (result.type === 'tie') return 'Round Tied';
    return 'Takes the round';
  }, [result]);

  React.useEffect(() => {
    if (!ref.current) return;
    return toggleCondition ? ref.current.showModal() : ref.current.close();
  }, [ref, toggleCondition]);

  return (
    <dialog ref={ref} className={styles.dialog}>
      <div className={styles.container}>
        {result?.message && <h2>{result.message}</h2>}
        <div data-variant={result?.type}>
          {result?.type === 'x' && <IconX />}
          {result?.type === 'o' && <IconO />}
          <span>{typeMessage}</span>
        </div>
        <div className={styles.actions}>
          <button onClick={cancelBtn.onClick} className="btn-sm btn-sm-light">
            {cancelBtn.label}
          </button>
          <button onClick={ctaBtn.onClick} className="btn-sm btn-sm-primary">
            {ctaBtn.label}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ResultsModal;
