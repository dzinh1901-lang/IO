import './styles.css';
import { App } from './app/App';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Missing #app root container');
}

const app = new App(root);
app.start();
