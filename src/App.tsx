import * as React from 'react';

import styles from './App.module.css';
import { Board, NewGame, ResultsModal } from './layouts';
import { useStore } from './stores';
import { Result } from './types';

const restartResult: Result = { type: 'restart' };

function App() {
  const gamemode = useStore((state) => state.gamemode);
  const result = useStore((state) => state.result);
  const quitGame = useStore((state) => state.quitGame);
  const startNextGame = useStore((state) => state.startNextGame);
  const restartGame = useStore((state) => state.restartGame);

  const [restartIsOpen, setRestartIsOpen] = React.useState<boolean>(false);
  const toggleRestartIsOpen = () => setRestartIsOpen((prev) => !prev);

  return (
    <>
      <div className={styles.container}>
        {gamemode === 'idle' ? <NewGame /> : <Board toggleRestartModal={toggleRestartIsOpen} />}
      </div>
      <ResultsModal
        result={result}
        toggleCondition={!!result}
        cancelBtn={{ label: 'Quit', onClick: quitGame }}
        ctaBtn={{ label: 'Next Round', onClick: startNextGame }}
      />
      <ResultsModal
        result={restartResult}
        toggleCondition={restartIsOpen}
        cancelBtn={{ label: 'No, cancel', onClick: toggleRestartIsOpen }}
        ctaBtn={{
          label: 'Yes, restart',
          onClick: () => {
            restartGame();
            toggleRestartIsOpen();
          },
        }}
      />
    </>
  );
}

export default App;
