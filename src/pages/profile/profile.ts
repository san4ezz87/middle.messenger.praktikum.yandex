import compileTemplate from './profile.pug';
import './profile.scss';

const app = document.getElementById('app');
app.innerHTML = compileTemplate({ whom: 'World' });