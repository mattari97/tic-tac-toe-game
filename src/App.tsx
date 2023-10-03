import styles from './App.module.css';
import { Board, NewGame } from './layouts';

type Rules = null | 'cpu' | 'player';

function App() {
  const rules: Rules = 'cpu';

  return <div className={styles.container}>{!rules ? <NewGame /> : <Board />}</div>;
}

export default App;
