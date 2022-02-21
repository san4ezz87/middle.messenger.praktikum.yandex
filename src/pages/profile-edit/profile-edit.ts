import compileTemplate from './profile-edit.pug';
import './profile-edit.scss';

const app = document.getElementById('app');
app.innerHTML = compileTemplate({ whom: 'World' });