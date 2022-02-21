import compileTemplate from './500.pug';
import './500.scss';

const app = document.getElementById('app');
app.innerHTML = compileTemplate({ whom: 'World' });