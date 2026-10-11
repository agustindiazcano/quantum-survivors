import './style.css';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.shadowColor = '#0ff';
  ctx.shadowBlur = 24;
  ctx.fillStyle = '#0ff';
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Quantum Survivors', canvas.width / 2, canvas.height / 2);
  requestAnimationFrame(frame);
}
frame();
