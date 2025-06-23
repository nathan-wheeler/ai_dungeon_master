import './styles.css';
import './app.js';
import { setupD20Roller } from './d20roller.js';
import d20Logo from './images/d20_logo.png';
import quill from './images/quill.png';

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('img[alt="D20 Logo"]').src = d20Logo;
  document.querySelector('img[alt="Quill"]').src = quill;
  setupD20Roller('diceCanvas');
});