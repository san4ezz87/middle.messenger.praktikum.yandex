import compileTemplate from './sign-up.pug';
import './sign-up.scss';

const app = document.getElementById('app');
app.innerHTML = compileTemplate({ whom: 'World' });