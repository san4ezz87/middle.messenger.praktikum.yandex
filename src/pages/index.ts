import compileTemplate from './index.pug';
import './index.scss';

const app = document.getElementById('app');
app.innerHTML = compileTemplate({ whom: 'World' });