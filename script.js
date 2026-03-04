
/* Intro */
const intro = document.getElementById("intro");
setTimeout(()=> intro?.classList.add("hide"), 1700);
intro?.addEventListener("click", ()=> intro.classList.add("hide"));

/* Reveal on scroll */
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add("show");
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=> obs.observe(el));

/* Blood particles canvas */
const c = document.getElementById("bloodCanvas");
const ctx = c.getContext("2d");
let W=0,H=0,particles=[];

function resize(){
  W = c.width = window.innerWidth * devicePixelRatio;
  H = c.height = window.innerHeight * devicePixelRatio;
}
window.addEventListener("resize", resize);
resize();

function rnd(a,b){ return a + Math.random()*(b-a); }

function spawn(){
  // droplet
  const x = rnd(0,W);
  const y = rnd(-H*0.2, 0);
  const r = rnd(2, 7) * devicePixelRatio;
  const vy = rnd(0.6, 1.6) * devicePixelRatio;
  const vx = rnd(-0.12, 0.12) * devicePixelRatio;
  const life = rnd(180, 360);
  particles.push({x,y,r,vx,vy,life,age:0,drip:rnd(0.002, 0.010)});
  // occasional smear blob
  if(Math.random()<0.10){
    particles.push({x:rnd(0,W),y:rnd(0,H),r:rnd(16,40)*devicePixelRatio,vx:0,vy:0,life:rnd(220,420),age:0,drip:rnd(0.0,0.002),blob:true});
  }
  if(particles.length>220) particles.splice(0, particles.length-220);
}

for(let i=0;i<120;i++) spawn();

function draw(){
  ctx.clearRect(0,0,W,H);

  // soft red glow layer
  const g = ctx.createRadialGradient(W*0.5,H*0.2, 0, W*0.5,H*0.2, Math.max(W,H)*0.8);
  g.addColorStop(0,"rgba(255,31,31,0.10)");
  g.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);

  for(const p of particles){
    p.age++;
    p.x += p.vx;
    p.y += p.vy;
    if(!p.blob){
      p.vy += p.drip; // gravity-ish
    }

    const a = 1 - (p.age/p.life);
    const alpha = Math.max(0, a)*0.55;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,31,31,${alpha})`;
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();

    // tail
    if(!p.blob){
      ctx.beginPath();
      ctx.strokeStyle = `rgba(160,0,0,${alpha*0.55})`;
      ctx.lineWidth = Math.max(1, p.r*0.35);
      ctx.moveTo(p.x, p.y - p.r*1.8);
      ctx.lineTo(p.x - p.vx*8, p.y - p.r*6);
      ctx.stroke();
    }
  }

  // recycle
  particles = particles.filter(p => p.age < p.life && p.y < H + p.r*6);
  if(Math.random()<0.60) spawn();

  requestAnimationFrame(draw);
}
draw();
