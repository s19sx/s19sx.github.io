document.addEventListener('DOMContentLoaded', () => { 
 /*SLIDE LOGIC*/
document.getElementById('btn-tetris').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('cart-tetris').classList.add('open');
  setTimeout(() => startTetris(), 600);
});
document.getElementById('close-tetris').addEventListener('click', () => {
  document.getElementById('cart-tetris').classList.remove('open');
  stopTetris();
});
document.getElementById('btn-calc').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('cart-calc').classList.add('open');
});
document.getElementById('close-calc').addEventListener('click', () => {
  document.getElementById('cart-calc').classList.remove('open');
});

/* TETRIS */
const canvas = document.getElementById('tetris-canvas');
const ctx = canvas.getContext('2d');
const COLS = 10, ROWS = 20, SZ = 20;
const COLORS = ['#00e5c4','#0ff','#f0f','#ff0','#f80','#0f0','#f00'];

const PIECES = [
  [[1,1,1,1]],
  [[1,1],[1,1]],
  [[0,1,0],[1,1,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]],
  [[0,1,1],[1,1,0]],
  [[1,1,0],[0,1,1]],
];

let board, piece, pieceX, pieceY, pieceColor, score, level, lines, running, paused, raf, dropTimer, dropInterval;

function initBoard() {
  board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
}

function newPiece() {
  const idx = Math.floor(Math.random() * PIECES.length);
  piece = PIECES[idx];
  pieceColor = COLORS[idx];
  pieceX = Math.floor((COLS - piece[0].length) / 2);
  pieceY = 0;
  if (collide()) { gameOver(); }
}

function rotate(p) {
  // On crée une nouvelle matrice avec les dimensions inversées
  const rotated = p[0].map((_, i) => p.map(r => r[i]).reverse());
  return rotated;
}

function collide(px = pieceX, py = pieceY, pc = piece) {
  for (let r = 0; r < pc.length; r++)
    for (let c = 0; c < pc[r].length; c++)
      if (pc[r][c]) {
        const nx = px + c, ny = py + r;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && board[ny][nx]) return true;
      }
  return false;
}

function merge() {
  for (let r = 0; r < piece.length; r++)
    for (let c = 0; c < piece[r].length; c++)
      if (piece[r][c]) board[pieceY + r][pieceX + c] = pieceColor;
}

function clearLines() {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(c => c)) {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(0));
      cleared++; r++;
    }
  }
  if (cleared) {
    const pts = [0, 100, 300, 500, 800];
    score += (pts[cleared] || 800) * level;
    lines += cleared;
    level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(100, 800 - (level - 1) * 70);
    document.getElementById('t-score').textContent = score;
    document.getElementById('t-level').textContent = level;
    const best = parseInt(localStorage.getItem('tetris-best') || '0');
    if (score > best) {
      localStorage.setItem('tetris-best', score);
      document.getElementById('t-best').textContent = score;
    }
  }
}

function draw() {
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // grid
  ctx.strokeStyle = '#1a1a1a';
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      ctx.strokeRect(c*SZ, r*SZ, SZ, SZ);
    }
  // board
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (board[r][c]) {
        ctx.fillStyle = board[r][c];
        ctx.fillRect(c*SZ+1, r*SZ+1, SZ-2, SZ-2);
      }
  // ghost
  let ghostY = pieceY;
  while (!collide(pieceX, ghostY + 1)) ghostY++;
  for (let r = 0; r < piece.length; r++)
    for (let c = 0; c < piece[r].length; c++)
      if (piece[r][c]) {
        ctx.fillStyle = pieceColor + '30';
        ctx.fillRect((pieceX+c)*SZ+1, (ghostY+r)*SZ+1, SZ-2, SZ-2);
      }
  // current piece
  for (let r = 0; r < piece.length; r++)
    for (let c = 0; c < piece[r].length; c++)
      if (piece[r][c]) {
        ctx.fillStyle = pieceColor;
        ctx.fillRect((pieceX+c)*SZ+1, (pieceY+r)*SZ+1, SZ-2, SZ-2);
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect((pieceX+c)*SZ+1, (pieceY+r)*SZ+1, SZ-2, 4);
      }
}

let lastTime = 0;
function loop(ts = 0) {
  if (!running) return;
  if (!paused) {
    const dt = ts - lastTime;
    dropTimer += dt;
    if (dropTimer > dropInterval) {
      dropTimer = 0;
      if (!collide(pieceX, pieceY + 1)) { pieceY++; }
      else { merge(); clearLines(); newPiece(); }
    }
    draw();
  }
  lastTime = ts;
  raf = requestAnimationFrame(loop);
}

function gameOver() {
  running = false;
  cancelAnimationFrame(raf);
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00e5c4';
  ctx.font = 'bold 14px Space Mono';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 10);
  ctx.fillStyle = '#888';
  ctx.font = '10px Space Mono';
  ctx.fillText('Score: ' + score, canvas.width/2, canvas.height/2 + 10);
  ctx.fillText('ESPACE pour rejouer', canvas.width/2, canvas.height/2 + 28);
  document.getElementById('tetris-msg').textContent = 'Game over — ESPACE pour rejouer';
}

function startTetris() {
  score = 0; level = 1; lines = 0; dropInterval = 800; dropTimer = 0;
  document.getElementById('t-score').textContent = 0;
  document.getElementById('t-level').textContent = 1;
  document.getElementById('t-best').textContent = localStorage.getItem('tetris-best') || 0;
  initBoard(); newPiece();
  running = true; paused = false;
  document.getElementById('tetris-msg').textContent = 'ESPACE = pause';
  lastTime = 0;
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
}

function stopTetris() {
  running = false;
  cancelAnimationFrame(raf);
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('cart-tetris').classList.contains('open')) return;
  if (!running && e.code === 'Space') { startTetris(); return; }
  if (!running) return;
  switch(e.code) {
    case 'ArrowLeft':
      if (!collide(pieceX - 1, pieceY)) pieceX--; break;
    case 'ArrowRight':
      if (!collide(pieceX + 1, pieceY)) pieceX++; break;
    case 'ArrowDown':
      if (!collide(pieceX, pieceY + 1)) pieceY++;
      else { merge(); clearLines(); newPiece(); } break;
    case 'ArrowUp':
  // Si c'est le cube (2x2), on ne fait rien pour éviter les bugs de collision
  if (piece.length === 2 && piece[0].length === 2) break; 
  
      const rot = rotate(piece);
  
  if (!collide(pieceX, pieceY, rot)) {
      piece = rot;
  } else if (!collide(pieceX - 1, pieceY, rot)) {
      pieceX--;
      piece = rot;
  } else if (!collide(pieceX + 1, pieceY, rot)) {
      pieceX++;
      piece = rot;
  }
  break;
    case 'Space':
      paused = !paused;
      document.getElementById('tetris-msg').textContent = paused ? '⏸ PAUSE — ESPACE pour reprendre' : 'ESPACE = pause';
      break;
  }
  e.preventDefault();
});

// Draw idle board on load
initBoard();
piece = PIECES[0]; pieceColor = COLORS[0]; pieceX = 4; pieceY = 0;
draw();

/*CALCULATOR*/
let calcState = { current: '0', prev: null, op: null, fresh: true, history: '' };

function calcDisplay() {
  document.getElementById('calc-screen').textContent = calcState.current;
  document.getElementById('calc-history').textContent = calcState.history;
}

function calcNum(v) {
  if (calcState.fresh) { calcState.current = v; calcState.fresh = false; }
  else calcState.current = calcState.current === '0' ? v : calcState.current + v;
  calcDisplay();
}

function calcOp(op) {
  calcState.prev = parseFloat(calcState.current);
  calcState.op = op;
  calcState.history = calcState.current + ' ' + {'+':'+','-':'−','*':'×','/':'÷'}[op];
  calcState.fresh = true;
  calcDisplay();
}

function calcEquals() {
  if (calcState.op === null || calcState.prev === null) return;
  const a = calcState.prev, b = parseFloat(calcState.current);
  const ops = {'+': a+b, '-': a-b, '*': a*b, '/': b===0 ? 'Erreur' : a/b};
  const res = ops[calcState.op];
  calcState.history = a + ' ' + {'+':'+','-':'−','*':'×','/':'÷'}[calcState.op] + ' ' + b + ' =';
  calcState.current = typeof res === 'number' ? parseFloat(res.toPrecision(10)).toString() : res;
  calcState.op = null; calcState.prev = null; calcState.fresh = true;
  calcDisplay();
}

document.querySelectorAll('.cb').forEach(btn => {
  btn.addEventListener('click', () => {
    const a = btn.dataset.action, v = btn.dataset.val;
    if (a === 'num') calcNum(v);
    else if (a === 'op') calcOp(v);
    else if (a === 'equals') calcEquals();
    else if (a === 'clear') {
      calcState = { current: '0', prev: null, op: null, fresh: true, history: '' };
      calcDisplay();
    } else if (a === 'sign') {
      calcState.current = (parseFloat(calcState.current) * -1).toString();
      calcDisplay();
    } else if (a === 'percent') {
      calcState.current = (parseFloat(calcState.current) / 100).toString();
      calcDisplay();
    } else if (a === 'dot') {
      if (!calcState.current.includes('.')) { calcState.current += '.'; calcState.fresh = false; calcDisplay(); }
    }
  });
});

// Keyboard for calculator
document.addEventListener('keydown', e => {
  if (!document.getElementById('cart-calc').classList.contains('open')) return;
  if (document.getElementById('cart-tetris').classList.contains('open')) return;
  if ('0123456789'.includes(e.key)) calcNum(e.key);
  else if (['+','-','*','/'].includes(e.key)) calcOp(e.key);
  else if (e.key === 'Enter' || e.key === '=') calcEquals();
  else if (e.key === 'Backspace') {
    calcState.current = calcState.current.length > 1 ? calcState.current.slice(0,-1) : '0';
    calcDisplay();
  } else if (e.key === 'Escape') {
    calcState = { current: '0', prev: null, op: null, fresh: true, history: '' };
    calcDisplay();
  } else if (e.key === '.') {
    if (!calcState.current.includes('.')) { calcState.current += '.'; calcDisplay(); }
  }
});
});