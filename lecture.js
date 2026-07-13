/* BIOL 40B Lecture Exam 1 Trainer — MCQ engine.
   Pick an answer → correct choice + explanation revealed → Next.
   Missed questions re-queue each round until every one is cleared. */
(() => {
  const $ = id => document.getElementById(id);
  const LETTERS = ["A","B","C","D","E"];

  /* ---------- theme (shared key with the model & histology pages) ---------- */
  const root = document.documentElement;
  const saved = localStorage.getItem("mp-theme");
  if (saved) root.setAttribute("data-theme", saved);
  $("theme").onclick = () => {
    const cur = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
    const nxt = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nxt); localStorage.setItem("mp-theme", nxt);
  };

  const shuffle = a => { for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];} return a; };

  /* ---------- state ---------- */
  let pool=[], idx=0, retry=[], round=1, totalItems=0, firstTry=0, answeredFirst=new Set();
  let missed=[], missedKeys=new Set(), doneMissed=[];
  let locked=false;

  function show(which){ for(const id of ["start","exam","done"]) $(id).classList.toggle("hidden", id!==which); }
  function banner(html){ $("banner").innerHTML = html; }

  function buildPool(){
    let all = LECTURE.slice();
    if($("mode-quick").checked) all = shuffle(all).slice(0,25);
    return all;
  }

  function beginSession(all){
    if(!all.length) return;
    pool = shuffle(all.slice()); idx=0; retry=[]; round=1;
    totalItems=all.length; firstTry=0; answeredFirst=new Set();
    missed=[]; missedKeys=new Set();
    banner(""); show("exam"); render(); window.scrollTo({top:0});
  }
  function start(){ beginSession(buildPool()); }

  /* ---------- render ---------- */
  function render(){
    locked=false;
    const q = pool[idx];
    $("q-badge").textContent = "#"+q.n;
    $("q-tag").textContent = "Multiple choice";
    $("q-prompt").textContent = q.q;

    const box = $("choices"); box.innerHTML = "";
    q.opts.forEach((text,i) => {
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "choice";
      btn.innerHTML = `<span class="ltr">${LETTERS[i]}</span><span class="ctxt">${escapeHtml(text)}</span>`;
      btn.onclick = () => pick(i, btn);
      box.appendChild(btn);
    });

    const ex = $("explain"); ex.className = "explain hidden"; ex.innerHTML = "";
    $("next").classList.add("hidden");
    updateStatus();
  }
  function escapeHtml(s){ return s.replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c])); }

  function updateStatus(){
    $("s-round").textContent = round;
    $("s-left").textContent = pool.length - idx;
    $("s-retry").textContent = retry.length;
    $("s-acc").textContent = answeredFirst.size ? Math.round(100*firstTry/answeredFirst.size)+"%" : "—";
    $("bar").style.width = (100*idx/Math.max(1,pool.length))+"%";
    $("q-count").textContent = `Question ${Math.min(idx+1,pool.length)} of ${pool.length}`+(round>1?" · this round":"");
  }

  /* ---------- answer ---------- */
  function pick(choice, btn){
    if(locked) return;
    locked = true;
    const q = pool[idx];
    const correct = choice === q.ans;
    const key = q.n;

    const firstAttempt = !answeredFirst.has(key);
    if(firstAttempt) answeredFirst.add(key);
    if(correct && firstAttempt) firstTry++;

    // lock & mark every choice
    const btns = $("choices").querySelectorAll(".choice");
    btns.forEach((b,i) => {
      b.disabled = true;
      if(i === q.ans) b.classList.add("correct");
      else if(i === choice) b.classList.add("wrong");
      else b.classList.add("dim");
    });

    // explanation card
    const ex = $("explain");
    ex.className = "explain " + (correct ? "ok" : "no");
    ex.innerHTML = correct
      ? `<div class="head"><span class="mk">✓ CORRECT</span><span class="lbl">why</span></div><div class="why">${escapeHtml(q.why)}</div>`
      : `<div class="head"><span class="mk">✗ INCORRECT</span><span class="lbl">answer: ${LETTERS[q.ans]}</span></div><div class="why"><b>${escapeHtml(q.opts[q.ans])}</b><br>${escapeHtml(q.why)}</div>`;

    if(!correct){
      retry.push(q);
      if(!missedKeys.has(key)){ missedKeys.add(key); missed.push(q); }
    }

    $("next").classList.remove("hidden");
    $("next").focus();
    updateStatus();
  }

  /* ---------- advance ---------- */
  function next(){
    idx++;
    if(idx < pool.length){ render(); window.scrollTo({top:0,behavior:"smooth"}); return; }
    if(retry.length === 0) return finish();
    round++; pool = shuffle(retry.slice()); retry = []; idx = 0;
    banner(`<div class="box"><span class="ico">🔁</span><span><b>Round ${round}.</b> Reviewing the ${pool.length} question${pool.length>1?'s':''} you missed — keep going until every one is cleared.</span></div>`);
    render(); window.scrollTo({top:0,behavior:"smooth"});
  }
  function finish(){
    show("done");
    $("done-p").textContent = firstTry===totalItems
      ? `A clean sweep — you nailed all ${totalItems} on the first try.`
      : `You worked through every miss until nothing was left. That's mastery.`;
    $("d-items").textContent=totalItems; $("d-first").textContent=firstTry; $("d-rounds").textContent=round;
    doneMissed = missed.slice();
    const btn = $("retry-missed");
    if(doneMissed.length){ btn.textContent = `Drill the ${doneMissed.length} you missed`; btn.classList.remove("hidden"); }
    else btn.classList.add("hidden");
  }

  /* ---------- wire ---------- */
  $("next").onclick = next;
  $("quit").onclick = () => { show("start"); banner(""); };
  $("again").onclick = () => show("start");
  $("retry-missed").onclick = () => { if(doneMissed.length) beginSession(doneMissed); };
  $("startBtn").onclick = start;
})();
