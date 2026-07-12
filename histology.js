/* BIOL 40B Histology Trainer — engine (pin quiz + live-slide viewer + marker correction) */
(() => {
  const $ = id => document.getElementById(id);

  /* ---------- theme (shared key with the model page) ---------- */
  const root = document.documentElement;
  const saved = localStorage.getItem("mp-theme");
  if (saved) root.setAttribute("data-theme", saved);
  $("theme").onclick = () => {
    const cur = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
    const nxt = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nxt); localStorage.setItem("mp-theme", nxt);
  };

  /* ---------- text grading ---------- */
  const norm = s => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g,"")
    .replace(/&/g," and ").replace(/[^a-z0-9 ]/g," ")
    .replace(/\b(the|a|an|of)\b/g," ").replace(/\s+/g," ").trim();
  function lev(a,b){const m=a.length,n=b.length;if(!m)return n;if(!n)return m;
    const d=Array.from({length:m+1},(_,i)=>[i,...Array(n).fill(0)]);for(let j=0;j<=n;j++)d[0][j]=j;
    for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
    return d[m][n];}
  function judge(input, accepted){
    const q = norm(input); if(!q) return "wrong";
    let best=99, bl=0;
    for(const a of accepted){const t=norm(a); if(q===t) return "correct"; const d=lev(q,t); if(d<best){best=d;bl=t.length;}}
    const tol = bl<=5 ? 1 : 2;
    return best<=tol ? "close" : "wrong";
  }

  /* ---------- marker corrections (persisted on this device) ---------- */
  const CORR_KEY = "histo-corr-v1";
  let CORR = {};
  try { CORR = JSON.parse(localStorage.getItem(CORR_KEY) || "{}") || {}; } catch { CORR = {}; }
  const ckey = (sid,label) => sid + "#" + label;
  const pinXY = (sid,p) => { const o = CORR[ckey(sid,p.label)]; return o ? {x:o.x,y:o.y} : {x:p.x,y:p.y}; };
  const saveCorr = () => localStorage.setItem(CORR_KEY, JSON.stringify(CORR));
  const hasCorr = () => Object.keys(CORR).length > 0;

  /* ---------- build question pool ---------- */
  const ARABIC = {I:"1",II:"2",III:"3",IV:"4",V:"5",VI:"6",VII:"7",VIII:"8",IX:"9",X:"10",XI:"11",XII:"12"};
  function buildQuestions(opts){
    const qs=[];
    for(const s of HISTO){
      if(s.embedOnly){
        if(opts.gap) for(const c of s.cards) qs.push({
          kind:"embed", label:"Identify · live slide", prompt:c.q,
          accepted:c.accepted, answer:c.a, title:s.title, histoUrl:s.histoUrl });
        continue;
      }
      if(opts.whole && s.whole) qs.push({
        kind:"whole", label:"Name the slide", prompt:"What tissue / slide is this?",
        image:"images/histo/"+s.image, accepted:s.whole, answer:s.whole[0], title:s.title, histoUrl:s.histoUrl });
      if(opts.pin) for(const p of s.pins){
        const xy = pinXY(s.id,p);
        qs.push({ kind:"pin", label:"Identify the target", prompt:"Identify the structure at the target.",
          image:"images/histo/"+s.image, sid:s.id, plabel:p.label, x:xy.x, y:xy.y,
          accepted:p.accepted, answer:p.label, title:s.title, histoUrl:s.histoUrl });
      }
    }
    if(opts.cn) for(const c of CRANIAL){
      qs.push({kind:"fact", label:"Cranial nerve", title:"Cranial nerves",
        prompt:`Cranial nerve ${c.n} is the ______ nerve.`, accepted:[c.name, c.name+" nerve"], answer:c.name});
      qs.push({kind:"fact", label:"Cranial nerve", title:"Cranial nerves",
        prompt:`The ${c.name} nerve is cranial nerve number ______ (Roman numeral).`, accepted:[c.n, ARABIC[c.n]], answer:c.n});
      qs.push({kind:"fact", label:"Cranial nerve", title:"Cranial nerves",
        prompt:`Is the ${c.name} nerve (CN ${c.n}) sensory, motor, or both?`,
        accepted: c.type==="both" ? ["both","mixed"] : [c.type], answer:c.type});
    }
    return qs;
  }
  const shuffle = a => { for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];} return a; };

  /* ---------- state ---------- */
  let pool=[], idx=0, retry=[], round=1, totalItems=0, firstTry=0, answeredFirst=new Set();
  let missed=[], missedKeys=new Set(), doneMissed=[];
  let curKey="", hinted=false, locked=false, fixMode=false;
  const keyOf = q => q.kind+"|"+(q.title||"")+"|"+q.answer+"|"+q.prompt;

  function show(which){ for(const id of ["start","exam","done"]) $(id).classList.toggle("hidden", id!==which); }
  function banner(html){ $("banner").innerHTML = html; }

  function beginSession(all){
    if(!all.length) return;
    pool = shuffle(all.slice()); idx=0; retry=[]; round=1;
    totalItems=all.length; firstTry=0; answeredFirst=new Set();
    missed=[]; missedKeys=new Set(); fixMode=false;
    banner(""); show("exam"); render();
  }
  function start(){
    beginSession(buildQuestions({
      pin:  $("opt-pin").checked,
      gap:  $("opt-gap").checked,
      whole:$("opt-whole").checked,
      cn:   $("opt-cn").checked
    }));
  }

  /* ---------- render ---------- */
  function render(){
    locked=false; hinted=false;
    const q = pool[idx]; curKey = keyOf(q);
    $("q-kind").textContent = q.label;
    $("q-title").textContent = q.title || "";
    $("q-prompt").textContent = q.prompt;

    const field=$("field"), img=$("q-img"), ret=$("reticle"), chip=$("chip");
    chip.innerHTML = ""; ret.classList.remove("ok","bad");
    setFix(false);
    if(q.image){
      field.classList.remove("hidden");
      img.onload = () => positionReticle(q);
      img.src = q.image;
      if(q.kind==="pin") positionReticle(q); else ret.classList.add("hidden");
    } else {
      field.classList.add("hidden");
    }

    // tools
    $("viewBtn").hidden = !q.histoUrl;
    $("fixBtn").hidden  = q.kind!=="pin";
    $("exportBtn").hidden = !hasCorr();

    const inp=$("input");
    inp.value=""; inp.className=""; inp.disabled=false;
    $("feedback").className="feedback"; $("feedback").innerHTML="";
    $("next").classList.add("hidden"); $("submit").classList.remove("hidden");
    setTimeout(()=>inp.focus(),30);
    updateStatus();
  }
  function positionReticle(q){
    const ret=$("reticle");
    if(q.kind!=="pin"){ ret.classList.add("hidden"); return; }
    ret.classList.remove("hidden");
    ret.style.left=(q.x*100)+"%"; ret.style.top=(q.y*100)+"%";
  }
  function updateStatus(){
    $("s-round").textContent=round;
    $("s-left").textContent=pool.length-idx;
    $("s-retry").textContent=retry.length;
    $("s-acc").textContent = answeredFirst.size ? Math.round(100*firstTry/answeredFirst.size)+"%" : "—";
    $("bar").style.width = (100*idx/Math.max(1,pool.length))+"%";
    $("q-count").textContent = `Question ${Math.min(idx+1,pool.length)} of ${pool.length}`+(round>1?" · this round":"");
  }

  /* ---------- grading ---------- */
  function submit(e){
    e.preventDefault();
    if(locked) return;
    const q=pool[idx], inp=$("input"), fb=$("feedback");
    const verdict = judge(inp.value, q.accepted);

    if(verdict==="close" && !hinted){
      hinted=true; inp.className="hint";
      fb.className="feedback"; fb.innerHTML=`<div class="fb-line hint"><span class="mark">✎</span><span><b>So close</b> — check the spelling and try again.</span></div>`;
      inp.select(); return;
    }

    const firstAttempt = !answeredFirst.has(curKey);
    if(firstAttempt) answeredFirst.add(curKey);
    locked=true; inp.disabled=true; setFix(false);
    $("submit").classList.add("hidden"); $("next").classList.remove("hidden"); $("next").focus();

    if(verdict==="correct"){
      if(firstAttempt && !hinted) firstTry++;
      inp.className="ok";
      fb.className="feedback"; fb.innerHTML=`<div class="fb-line ok"><span class="mark">✓</span><span><b>Correct.</b> ${alsoAccepted(q)}</span></div>`;
      markReticle("ok", q);
    } else {
      inp.className="bad";
      fb.className="feedback"; fb.innerHTML=`<div class="fb-line bad"><span class="mark">✗</span><span class="ans">${q.answer}</span> — spelled exactly.</div>`;
      markReticle("bad", q);
      retry.push(q);
      if(!missedKeys.has(curKey)){ missedKeys.add(curKey); missed.push(q); }
    }
    updateStatus();
  }
  function alsoAccepted(q){
    const extra=(q.accepted||[]).filter(a=>norm(a)!==norm(q.answer));
    return extra.length ? `<span class="lc-func">also accepted: ${extra.join(", ")}</span>` : "";
  }
  function markReticle(state, q){
    if(q.kind!=="pin" || !q.image) return;
    const ret=$("reticle"); ret.classList.remove("hidden","ok","bad"); ret.classList.add(state);
    $("chip").innerHTML = `<span class="reveal-chip ${state==="bad"?"bad":""}" style="left:${q.x*100}%;top:${q.y*100}%">${q.answer}</span>`;
  }

  /* ---------- advance ---------- */
  function next(){
    idx++;
    if(idx<pool.length){ render(); return; }
    if(retry.length===0) return finish();
    round++; pool=shuffle(retry.slice()); retry=[]; idx=0;
    banner(`<div class="box"><span class="ico">🔁</span><span><b>Round ${round}.</b> Reviewing the ${pool.length} item${pool.length>1?'s':''} you missed — keep going until every one is cleared.</span></div>`);
    render(); window.scrollTo({top:0,behavior:"smooth"});
  }
  function finish(){
    show("done");
    $("done-p").textContent = firstTry===totalItems
      ? `A clean sweep — you nailed all ${totalItems} on the first try.`
      : `You worked through every miss until nothing was left. That's mastery.`;
    $("d-items").textContent=totalItems; $("d-first").textContent=firstTry; $("d-rounds").textContent=round;
    doneMissed = missed.slice();
    const btn=$("retry-missed");
    if(doneMissed.length){ btn.textContent=`Drill the ${doneMissed.length} you missed`; btn.classList.remove("hidden"); }
    else btn.classList.add("hidden");
  }

  /* ---------- marker correction ---------- */
  function setFix(on){
    fixMode = on && pool[idx] && pool[idx].kind==="pin" && !locked;
    $("field").classList.toggle("fixing", fixMode);
    $("fixhint").classList.toggle("hidden", !fixMode);
    $("fixBtn").classList.toggle("on", fixMode);
    $("fixBtn").textContent = "✎ Fix marker: " + (fixMode ? "on" : "off");
  }
  $("fixBtn").onclick = () => setFix(!fixMode);

  const ret = $("reticle");
  ret.addEventListener("pointerdown", e => {
    if(!fixMode) return;
    const q=pool[idx]; if(!q || q.kind!=="pin") return;
    e.preventDefault(); e.stopPropagation();
    try { ret.setPointerCapture(e.pointerId); } catch {}
    const field=$("field");
    const move = ev => {
      const r=field.getBoundingClientRect();
      let x=(ev.clientX-r.left)/r.width, y=(ev.clientY-r.top)/r.height;
      x=Math.max(0,Math.min(1,x)); y=Math.max(0,Math.min(1,y));
      q.x=x; q.y=y; ret.style.left=(x*100)+"%"; ret.style.top=(y*100)+"%";
    };
    const up = () => {
      ret.removeEventListener("pointermove",move);
      ret.removeEventListener("pointerup",up);
      CORR[ckey(q.sid,q.plabel)] = {x:+q.x.toFixed(4), y:+q.y.toFixed(4)};
      saveCorr(); $("exportBtn").hidden=false;
    };
    ret.addEventListener("pointermove",move);
    ret.addEventListener("pointerup",up);
  });

  /* ---------- export corrections ---------- */
  $("exportBtn").onclick = () => { $("export-ta").value = JSON.stringify(CORR,null,2); $("export-modal").classList.add("on"); };
  $("export-close").onclick = () => $("export-modal").classList.remove("on");
  $("export-copy").onclick = () => { $("export-ta").select(); try{document.execCommand("copy");}catch{} };
  $("export-clear").onclick = () => {
    if(!confirm("Clear all saved marker corrections on this device?")) return;
    CORR={}; saveCorr(); $("export-ta").value="{}"; $("exportBtn").hidden=true;
  };

  /* ---------- live-slide viewer ---------- */
  function openEmbed(url){ if(!url) return; $("embed-frame").src=url; $("embed-open").href=url; $("embed-modal").classList.add("on"); }
  $("viewBtn").onclick = () => openEmbed(pool[idx] && pool[idx].histoUrl);
  $("embed-close").onclick = () => { $("embed-modal").classList.remove("on"); $("embed-frame").src="about:blank"; };

  /* ---------- lightbox ---------- */
  $("field").onclick = () => {
    if(fixMode) return;
    const q=pool[idx]; if(!q || !q.image) return;
    $("lb-img").src = q.image;
    const lr=$("lb-reticle");
    if(q.kind==="pin"){ lr.classList.remove("hidden"); lr.style.left=(q.x*100)+"%"; lr.style.top=(q.y*100)+"%"; }
    else lr.classList.add("hidden");
    $("lightbox").classList.add("on");
  };
  $("lightbox").onclick = () => $("lightbox").classList.remove("on");

  /* ---------- wire ---------- */
  $("answer").addEventListener("submit", submit);
  $("next").onclick = next;
  $("quit").onclick = () => { show("start"); banner(""); };
  $("again").onclick = () => show("start");
  $("retry-missed").onclick = () => { if(doneMissed.length) beginSession(doneMissed); };
  $("startBtn").onclick = start;
  for(const id of ["opt-pin","opt-gap","opt-whole","opt-cn"])
    $(id).addEventListener("change", () => {
      const any = ["opt-pin","opt-gap","opt-whole","opt-cn"].some(i=>$(i).checked);
      $("startBtn").disabled=!any; $("startBtn").style.opacity=any?"1":".5";
    });
})();
