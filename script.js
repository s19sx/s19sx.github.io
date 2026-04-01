/* CURSOR */
const CR=document.getElementById('cur'),CR2=document.getElementById('cur2'),CR3=document.getElementById('cur3');
document.addEventListener('mousemove',e=>{
  const x=e.clientX-5,y=e.clientY-5;
  CR.style.left=x+'px';CR.style.top=y+'px';
  setTimeout(()=>{CR2.style.left=(x-7)+'px';CR2.style.top=(y-7)+'px';},50);
  setTimeout(()=>{CR3.style.left=(x+3)+'px';CR3.style.top=(y+3)+'px';},110);
});

/* PARTICLES */
const cvs=document.getElementById('cvs'),ctx=cvs.getContext('2d');
let W,H;
function resize(){W=cvs.width=window.innerWidth;H=cvs.height=window.innerHeight;}
resize();window.addEventListener('resize',resize);
const pts=[];
for(let i=0;i<90;i++) pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.4+.5,c:`rgba(${110+Math.random()*60|0},${59+Math.random()*40|0},${200+Math.random()*55|0},${Math.random()*.55+.08})`});
(function draw(){
  ctx.clearRect(0,0,W,H);
  pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.c;ctx.fill();});
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);if(d<120){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(110,59,255,${(1-d/120)*.11})`;ctx.lineWidth=.5;ctx.stroke();}}
  requestAnimationFrame(draw);
})();

/* LOADER */
const ldLines=['Initialisation du café... 80%','npm install talent --save','Chargement de la stack JS...','git commit -m "ready to work"','Compilation des compétences...','Excel et Power BI : avancé ✓','Cybersécurité : curiosité activée...','Rigueur post-médecine : chargée...','Déploiement de Syphax...','Bienvenue sur syphax.dev !'];
let li=0,prog=0;
const ldT=document.getElementById('ld-term'),ldB=document.getElementById('ld-bar'),ldP=document.getElementById('ld-pct');
function ldTick(){
  if(li<ldLines.length){const s=document.createElement('span');s.className='l';s.textContent=ldLines[li++];ldT.appendChild(s);}
  prog=Math.min(100,prog+Math.random()*25+10);ldB.style.width=prog+'%';ldP.textContent=Math.floor(prog)+'%';
  if(prog<100) setTimeout(ldTick,80+Math.random()*100);
  else setTimeout(()=>{const l=document.getElementById('ldr');l.style.opacity='0';setTimeout(()=>{l.style.display='none';init();},500);},350);
}
setTimeout(ldTick,280);

/* INIT */
let score=0;
const sv=document.getElementById('sv');
function addScore(n){score+=n;sv.textContent=String(score).padStart(6,'0');sv.style.color='var(--yellow)';setTimeout(()=>sv.style.color='var(--teal)',400);}

function init(){
  // typed phrases — personnalisées 
  const phr=['HTML, CSS & JS — les fondamentaux d\'abord.','Rigueur garantie.','Co-fondateur Emporio Agency à 18 ans.','Disponible en alternance — Bach.3 ISCOD.','Polyglotte. Analytique. Débrouillard.'];
  let pi=0,ci=0,dl=false;const ty=document.getElementById('ty');
  (function tick(){const p=phr[pi];if(!dl){ty.textContent=p.slice(0,++ci);if(ci===p.length){dl=true;setTimeout(tick,2200);return;}}else{ty.textContent=p.slice(0,--ci);if(ci===0){dl=false;pi=(pi+1)%phr.length;}}setTimeout(tick,dl?35:80);})();

  setInterval(()=>addScore(1),1200);
  let c=0;const cel=document.getElementById('cof');setInterval(()=>{cel.textContent=++c;},7000);

  // fade-in IO
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target);addScore(10);}});},{threshold:.1});
  document.querySelectorAll('.fi').forEach(el=>io.observe(el));

  // skills IO
  const io2=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('.skf').forEach(b=>b.style.width=b.dataset.w+'%');e.target.querySelectorAll('.lang-fill').forEach(b=>b.style.width=b.dataset.w+'%');io2.unobserve(e.target);}});},{threshold:.2});
  document.querySelectorAll('.sc,.langs').forEach(el=>io2.observe(el));

  // counters IO
  const io3=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('[data-count]').forEach(el=>{const t=+el.dataset.count,suf=t===100?'%':'';let v=0;const iv=setInterval(()=>{v=Math.min(v+Math.ceil(t/40),t);el.textContent=v+suf;if(v>=t)clearInterval(iv);},40);});io3.unobserve(e.target);}});},{threshold:.2});
  document.querySelectorAll('.sr').forEach(el=>io3.observe(el));

  // sparkles
  document.querySelectorAll('.btn').forEach(b=>{b.addEventListener('click',e=>{for(let i=0;i<6;i++){const sp=document.createElement('span');sp.className='sp';const ang=Math.random()*Math.PI*2,d=28+Math.random()*28;sp.style.setProperty('--sx',Math.cos(ang)*d+'px');sp.style.setProperty('--sy',Math.sin(ang)*d+'px');sp.style.left=(e.offsetX-2)+'px';sp.style.top=(e.offsetY-2)+'px';b.appendChild(sp);setTimeout(()=>sp.remove(),620);}});});

  initTerm();

  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const el=document.getElementById(a.getAttribute('href').slice(1));if(el)window.scrollTo({top:el.getBoundingClientRect().top+scrollY-100,behavior:'smooth'});}));
}

/* MATRIX */
function toggleMx(){
  document.body.classList.toggle('mx');
  const b=document.getElementById('mx-btn');
  b.classList.toggle('on');
  b.textContent=document.body.classList.contains('mx')?'[ EXIT ]':'[ MATRIX ]';
  addScore(50);
}


/* XP FORM */
const xpF={n:false,e:false,s:false,m:false};let xpV=0;
const xpL={0:'XP 0/100 — Remplis le formulaire',25:'XP 25/100 — Bon début ! ⚡',50:'XP 50/100 — À mi-chemin 🔥',75:'XP 75/100 — Presque ! ⭐',100:'XP 100/100 — Lance le missile ! 🚀'};
function xpA(f){const m={n:'fn',e:'fe',s:'fss',m:'fm'};const el=document.getElementById(m[f]);if(!xpF[f]&&el.value.length>1){xpF[f]=true;xpV=Math.min(100,xpV+25);updXP();addScore(25);}else if(xpF[f]&&el.value.length<=1){xpF[f]=false;xpV=Math.max(0,xpV-25);updXP();}}
function updXP(){document.getElementById('xp').style.width=xpV+'%';document.getElementById('xl').textContent=xpL[xpV]||'XP '+xpV+'/100';}
function submitF(){
  const n=document.getElementById('fn').value,e=document.getElementById('fe').value,msg=document.getElementById('fm').value;
  if(!n||!e||!msg){alert('⚠️ Remplis au moins le nom, email et message !');return;}
  document.getElementById('cff').style.display='none';document.getElementById('fsc').style.display='block';addScore(500);
}


/* CHEAT CODE */
function tCheat(){document.getElementById('ciw').classList.toggle('open');}
function chkCheat(v){const cm=document.getElementById('cm');if(v.trim().length>2){cm.style.display='block';cm.textContent=`Bonjour ${v.trim()}, prêt(e) à me recruter en alternance ? 🎮`;addScore(100);}else cm.style.display='none';}


function initTerm(){
  const tb=document.getElementById('trb'),ti=document.getElementById('tri');
  const ap=(cls,t)=>{const s=document.createElement('span');s.className='tl '+cls;s.textContent=t;tb.appendChild(s);tb.scrollTop=tb.scrollHeight;};
  [['tlok','syphax.dev v1.0.0 — Prêt.'],['tlo','Connecté : visitor'],['tlhi','Tape "help" pour les commandes disponibles.'],['tlo','']].forEach(([c,t])=>ap(c,t));
  const cmds={
    help:()=>[['tlhi','╔═══════════════════════════════╗'],['tlhi','║   COMMANDES DISPONIBLES       ║'],['tlhi','╚═══════════════════════════════╝'],['tlo','about       → Qui est Syphax ?'],['tlo','skills      → Stack technique'],['tlo','xp          → Ce qui me distingue'],['tlo','projects    → Mes projets'],['tlo','alternance  → Ma recherche'],['tlo','score       → Score actuel'],['tlo','matrix      → Toggle mode Matrix'],['tlo','clear       → Vider le terminal']],
    about:()=>[['tlo','> Syphax — Développeur web junior.'],['tlo','> Basé à Lille / Paris. Permis B.'],['tlo','> Autodidacte. Co-fondateur d\'Emporio Agency à 18 ans.'],['tlok','> En alternance ISCOD Bach.3 Dev Web — dispo immédiatement.']],
    skills:()=>[['tlhi','FRONTEND  HTML/CSS ████████████████ 80%'],['tlhi','          JS Vanilla ██████████░░ 55%'],['tlhi','          React/Node ████░░░░░░░ 25% (en cours)'],['tlhi','LANGAGES  Java/C/Python ██████████ 50%'],['tlhi','OUTILS    Excel/Power BI ████████████████ 85%'],['tlhi','          Git ████████████ 60%'],['tlhi','SÉCURITÉ  Cybersécurité ████████ 40%']],
    xp:()=>[['tlhi','► Ancien étudiant médecine → rigueur scientifique'],['tlhi','► 3 langues natives : Français, Arabe, Kabyle'],['tlhi','► Expérience business réelle : co-fondateur agence'],['tlhi','► Certifié : test d\'intrusion web, cybersécurité'],['tlhi','► Excel/Power BI avancé — data + dev, double profil']],
    projects:()=>[['tlok','[001] EMPORIO AGENCY  — Site vitrine co-fondateur'],['tlok','[002] PORTFOLIO ARCADE — Vanilla JS + Canvas'],['tlok','[003] TETRIS          — Canvas 2D + localStorage'],['tlok','[004] CALCULATRICE    — DOM & logique JS']],
    alternance:()=>[['tlhi','STATUS     : 🟢 ACTIF — OPEN TO WORK'],['tlo','FORMATION  : ISCOD Bachelor Dev Web'],['tlo','RYTHME     : 4J entreprise / 1J formation'],['tlo','LIEU       : Lille / Paris (mobilité ok)'],['tlok','RÉPONSE    : Garanti < 24h']],
    score:()=>[['tlhi','SCORE ACTUEL : '+String(score).padStart(6,'0')+' pts'],['tlo','Continue à explorer pour en gagner plus !']],
    matrix:()=>{toggleMx();return[['tlok','Mode Matrix togglé !']]},
    clear:()=>{tb.textContent='';return[]}
  };
  ti.addEventListener('keydown',e=>{
    if(e.key!=='Enter')return;
    const v=ti.value.trim().toLowerCase();if(!v)return;
    ap('tlc',v);
    (cmds[v]?cmds[v]():[['tler',`"${v}" introuvable. Tape "help".`]]).forEach(([c,t])=>ap(c,t));
    if(cmds[v])addScore(20);
    ap('tlo','');ti.value='';
  });
}


