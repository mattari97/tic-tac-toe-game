import styles from './App.module.css';
import { Board, NewGame, ResultsModal } from './layouts';
import { useStore } from './stores';

function App() {
  const gamemode = useStore((state) => state.gamemode);

  return (
    <>
      <div className={styles.container}>{gamemode === 'idle' ? <NewGame /> : <Board />}</div>
      <ResultsModal />
    </>
  );
}

export default App;
