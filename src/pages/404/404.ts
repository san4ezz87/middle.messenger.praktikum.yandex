import compileTemplate from './404.pug';
import './404.scss';

const app = document.getElementById('app');
app.innerHTML = compileTemplate({ whom: 'World' });