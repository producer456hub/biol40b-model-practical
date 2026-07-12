/* BIOL 40B Model Practical Trainer — engine */
(() => {
  const $ = id => document.getElementById(id);

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const saved = localStorage.getItem("mp-theme");
  if (saved) root.setAttribute("data-theme", saved);
  $("theme").onclick = () => {
    const cur = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
    const nxt = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nxt); localStorage.setItem("mp-theme", nxt);
  };

  /* ---------- text tools ---------- */
  const norm = s => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g,"")
    .replace(/&/g," and ").replace(/[^a-z0-9 ]/g," ")
    .replace(/\b(the|a|an|of)\b/g," ").replace(/\s+/g," ").trim();
  function lev(a,b){const m=a.length,n=b.length;if(!m)return n;if(!n)return m;
    const d=Array.from({length:m+1},(_,i)=>[i,...Array(n).fill(0)]);for(let j=0;j<=n;j++)d[0][j]=j;
    for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
    return d[m][n];}
  // name: "correct" | "close" | "wrong"
  function judgeName(input, accepted){
    const q = norm(input); if(!q) return "wrong";
    let best=99, bl=0;
    for(const a of accepted){const t=norm(a); if(q===t) return "correct"; const d=lev(q,t); if(d<best){best=d;bl=t.length;}}
    const tol = bl<=5 ? 1 : 2;
    return best<=tol ? "close" : "wrong";
  }
  // function is a genuine attempt (very lax; the model answer is always revealed)
  const genuineFunc = s => { const g = norm(s); return g.length>=3 && /[a-z]/.test(g); };
  const softMatch = (s, fkeys) => { const g = norm(s); return (fkeys||[]).some(k => g.includes(k)); };

  /* ---------- start screen ---------- */
  const speclist = $("speclist"), opts = $("opts");
  for (const m of MODELS){
    const d = document.createElement("div"); d.className="spec";
    d.innerHTML = `<span class="n">${m.items.length}</span><span><b>${m.title}</b></span>`;
    speclist.appendChild(d);
    const l = document.createElement("label"); l.className="opt";
    l.innerHTML = `<input type="checkbox" class="mdl" value="${m.id}" checked>
      <span class="txt"><span class="lab">${m.title}</span>
      <span class="sub">${m.items.length} structures — name &amp; function</span></span>`;
    opts.appendChild(l);
  }

  /* ---------- build questions ---------- */
  function buildQuestions(ids){
    const qs=[];
    for(const m of MODELS){
      if(!ids.includes(m.id)) continue;
      for(const it of m.items) qs.push({
        model:m.title, modelId:m.id, image:m.image, n:it.n, color:m.numColor,
        name:it.name, accept: it.accept.includes(norm(it.name))||it.accept.map(norm).includes(norm(it.name)) ? it.accept : [it.name, ...it.accept],
        func:it.func, fkeys:it.fkeys||[]
      });
    }
    return qs;
  }
  const shuffle = a => { for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];} return a; };

  /* ---------- state ---------- */
  let pool=[], idx=0, retry=[], round=1, totalItems=0, firstTry=0, answeredFirst=new Set();
  let missed=[], missedKeys=new Set(), doneMissed=[];
  let curKey="", hintedName=false, locked=false;
  const keyOf = q => q.modelId + "#" + q.n;
  const rotBy = {};   // user rotation per image (0/90/180/270), persists across that model's questions

  // fit the (possibly rotated) image inside the field without overflow
  function fitField(){
    const q=pool[idx]; if(!q) return;
    const img=$("q-img"), field=$("field");
    const W=img.naturalWidth, H=img.naturalHeight; if(!W||!H) return;
    const rot=((rotBy[q.image]||0)%360+360)%360;
    if(rot%180===0){
      field.style.height=""; img.style.position=""; img.style.left=""; img.style.top="";
      img.style.width="100%"; img.style.height="auto"; img.style.transformOrigin="";
      img.style.transform = rot ? `rotate(${rot}deg)` : "";
    } else {
      const fw=field.clientWidth||600;
      const w0=Math.min(fw, fw*W/H);           // pre-rotate rendered width so the 90° bbox fits
      field.style.height=w0+"px";              // rotated visual height = pre-rotate width
      img.style.position="absolute"; img.style.left="50%"; img.style.top="50%";
      img.style.width=w0+"px"; img.style.height="auto"; img.style.transformOrigin="center";
      img.style.transform=`translate(-50%,-50%) rotate(${rot}deg)`;
    }
  }

  function show(which){ for(const id of ["start","exam","done"]) $(id).classList.toggle("hidden", id!==which); }
  function banner(html){ $("banner").innerHTML = html; }

  function beginSession(all){
    if(!all.length) return;
    pool = shuffle(all.slice()); idx=0; retry=[]; round=1;
    totalItems=all.length; firstTry=0; answeredFirst=new Set();
    missed=[]; missedKeys=new Set();
    banner(""); show("exam"); render();
  }
  function start(ids){ beginSession(buildQuestions(ids)); }

  /* ---------- render ---------- */
  function render(){
    locked=false; hintedName=false;
    const q = pool[idx]; curKey = keyOf(q);
    root.style.setProperty("--mc", q.color);              // per-model color identity (retention: color-location binding)
    $("q-badge").textContent = "#"+q.n;
    $("q-model").textContent = q.model;
    $("q-prompt").innerHTML = `On the <span class="hl">${q.model}</span>, identify structure <span class="hl">#${q.n}</span> — its name and its function.`;
    const img=$("q-img"); img.onload = fitField; img.src = q.image; setTimeout(fitField, 0);

    const nm=$("in-name"), fn=$("in-func");
    nm.value=""; fn.value=""; nm.className=""; fn.className=""; nm.disabled=false; fn.disabled=false;
    $("feedback").innerHTML="";
    $("next").classList.add("hidden"); $("submit").classList.remove("hidden");
    setTimeout(()=>nm.focus(),30);
    updateStatus();
  }
  function updateStatus(){
    $("s-round").textContent=round;
    $("s-left").textContent=pool.length-idx;
    $("s-retry").textContent=retry.length;
    $("s-acc").textContent = answeredFirst.size ? Math.round(100*firstTry/answeredFirst.size)+"%" : "—";
    $("bar").style.width = (100*idx/Math.max(1,pool.length))+"%";
    $("q-count").textContent = `Question ${Math.min(idx+1,pool.length)} of ${pool.length}`
      + (round>1 ? " · this round" : "");
  }

  /* ---------- submit ---------- */
  function submit(e){
    e.preventDefault();
    if(locked) return;
    const q=pool[idx], nm=$("in-name"), fn=$("in-func"), fb=$("feedback");
    const verdict = judgeName(nm.value, q.accept);

    // name spelling nudge (once)
    if(verdict==="close" && !hintedName){
      hintedName=true; nm.className="hint";
      fb.innerHTML = `<div class="fb-line hint"><span class="mark">✎</span><span><b>Check the spelling</b> — you're close on the name.</span></div>`;
      nm.focus(); nm.select(); return;
    }
    const nameCorrect = verdict==="correct";

    // name right but no function yet → ask for it (not a miss)
    if(nameCorrect && !genuineFunc(fn.value)){
      nm.className="ok"; fn.className="hint";
      fb.innerHTML = `<div class="fb-line hint"><span class="mark">＋</span><span>Good name. Now add its <b>function</b> too (any reasonable attempt).</span></div>`;
      fn.focus(); return;
    }

    // resolve the item
    const firstAttempt = !answeredFirst.has(curKey);
    if(firstAttempt) answeredFirst.add(curKey);
    locked=true; nm.disabled=true; fn.disabled=true;
    $("submit").classList.add("hidden"); $("next").classList.remove("hidden"); $("next").focus();

    let head="";
    if(nameCorrect){
      if(firstAttempt && !hintedName) firstTry++;
      nm.className="ok";
      const good = softMatch(fn.value, q.fkeys);
      fn.className = good ? "ok" : "";
      head = `<div class="fb-line ok"><span class="mark">✓</span><span>Correct${good?' — and your function looks right':', function noted'}.</span></div>`;
    } else {
      nm.className="bad";
      retry.push(q);
      if(!missedKeys.has(curKey)){ missedKeys.add(curKey); missed.push(q); }
      head = `<div class="fb-line bad"><span class="mark">✗</span><span>Not quite — study the card, it'll come back.</span></div>`;
    }
    // unified learn card: name + function paired, shown every time for clean encoding
    fb.innerHTML = head +
      `<div class="learn-card">
         <div class="lc-top"><span class="lc-badge">#${q.n}</span><span class="lc-model">${q.model}</span></div>
         <div class="lc-name">${q.name}</div>
         <div class="lc-func">${q.func}</div>
       </div>`;
    updateStatus();
  }

  /* ---------- advance ---------- */
  function next(){
    idx++;
    if(idx<pool.length){ render(); return; }
    if(retry.length===0) return finish();
    round++; pool=shuffle(retry.slice()); retry=[]; idx=0;
    banner(`<div class="box"><span class="ico">🔁</span><span><b>Round ${round}.</b> Reviewing the ${pool.length} structure${pool.length>1?'s':''} you missed — keep going until every one is cleared.</span></div>`);
    render(); window.scrollTo({top:0,behavior:"smooth"});
  }
  function finish(){
    show("done");
    $("done-p").textContent = firstTry===totalItems
      ? `A clean sweep — you nailed all ${totalItems} names on the first try.`
      : `You worked through every miss until nothing was left. That's mastery.`;
    $("d-items").textContent=totalItems; $("d-first").textContent=firstTry; $("d-rounds").textContent=round;
    // offer a focused re-drill of everything missed at least once this session
    doneMissed = missed.slice();
    const btn = $("retry-missed");
    if(doneMissed.length){
      btn.textContent = `Drill the ${doneMissed.length} you missed`;
      btn.classList.remove("hidden");
    } else {
      btn.classList.add("hidden");
    }
  }

  /* ---------- rotate control ---------- */
  $("rotate").onclick = (e) => {
    e.stopPropagation();
    const q=pool[idx]; if(!q) return;
    rotBy[q.image] = ((rotBy[q.image]||0)+90)%360;
    fitField();
  };
  addEventListener("resize", () => { if(!$("exam").classList.contains("hidden")) fitField(); });

  /* ---------- lightbox ---------- */
  $("field").onclick = () => {
    const q=pool[idx]; if(!q) return;
    const lbi=$("lb-img"); lbi.src=q.image;
    const rot=((rotBy[q.image]||0)%360+360)%360;
    lbi.style.transform = rot ? `rotate(${rot}deg)` : "";
    if(rot%180){ lbi.style.maxWidth="94vh"; lbi.style.maxHeight="94vw"; }
    else { lbi.style.maxWidth="100%"; lbi.style.maxHeight="94vh"; }
    $("lightbox").classList.add("on");
  };
  $("lightbox").onclick = () => $("lightbox").classList.remove("on");

  /* ---------- wire ---------- */
  $("answer").addEventListener("submit", submit);
  $("next").onclick = next;
  $("quit").onclick = () => { show("start"); banner(""); };
  $("again").onclick = () => show("start");
  $("retry-missed").onclick = () => { if(doneMissed.length) beginSession(doneMissed); };
  $("startBtn").onclick = () => {
    const ids = [...document.querySelectorAll(".mdl:checked")].map(c=>c.value);
    start(ids);
  };
  document.addEventListener("change", e => {
    if(e.target.classList && e.target.classList.contains("mdl")){
      const any = document.querySelectorAll(".mdl:checked").length>0;
      $("startBtn").disabled=!any; $("startBtn").style.opacity=any?"1":".5";
    }
  });
})();
