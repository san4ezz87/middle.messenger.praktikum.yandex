import compileTemplate from './chat-empty.pug';
import './chat-empty.scss';

const app = document.getElementById('app');
app.innerHTML = compileTemplate({ whom: 'World' });