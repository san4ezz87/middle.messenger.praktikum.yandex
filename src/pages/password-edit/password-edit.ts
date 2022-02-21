import compileTemplate from './password-edit.pug';
import './password-edit.scss';

const app = document.getElementById('app');
app.innerHTML = compileTemplate({ whom: 'World' });