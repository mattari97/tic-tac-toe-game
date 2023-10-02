import styles from './App.module.css';
import { NewGame } from './layouts';

function App() {
  return (
    <div className={styles.container}>
      <NewGame />
    </div>
  );
}

export default App;
