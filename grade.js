/* BIOL 40B — Grade Calculator.
   Weighted-category grade estimate. Only exams, quizzes, and the final are
   fillable; every blank field and every other category counts as 100%.
   The 2 lecture exams share +30 extra-credit points (total); categories are
   uncapped, so extra credit can push the result above 100%. */
(() => {
  const $ = id => document.getElementById(id);

  /* theme (shared key with the other pages) */
  const root = document.documentElement;
  const saved = localStorage.getItem("mp-theme");
  if (saved) root.setAttribute("data-theme", saved);
  $("theme").onclick = () => {
    const cur = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
    const nxt = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nxt); localStorage.setItem("mp-theme", nxt);
  };

  // fillable categories
  const EDIT = [
    { id:"lecture", name:"Lecture Exams", weight:25, drop:0, ec:30,
      labels:["Exam 1","Exam 2"],
      note:"+30 extra-credit points (total) applied across these two. Lowest is NOT dropped.", noteClass:"ec" },
    { id:"labexam", name:"Lab Exams", weight:25, drop:0, ec:0,
      labels:["Lab Exam 1","Lab Exam 2"] },
    { id:"quizzes", name:"Quizzes", weight:5, drop:1, ec:0,
      labels:["Quiz 1","Quiz 2","Quiz 3","Quiz 4"],
      note:"Lowest quiz is dropped — your best 3 of 4 count." },
    { id:"final", name:"Final Exam", weight:10, drop:0, ec:0,
      labels:["Final Exam"],
      note:"Cumulative. No extra credit." },
  ];
  // locked at 100% (not entered), shown for transparency
  const FIXED = [ {name:"Labs",weight:15}, {name:"Pre-labs",weight:5}, {name:"Assignments",weight:15} ];
  const FIXED_WEIGHT = FIXED.reduce((s,f)=>s+f.weight,0);

  const num = v => {
    if (v==null || String(v).trim()==="") return 100;
    let n = parseFloat(v);
    if (isNaN(n)) return 100;
    return Math.max(0, Math.min(100, n));
  };
  const fmt = n => (Math.round(n*10)/10).toFixed(1);
  const letter = p => p>=90?"A":p>=80?"B":p>=70?"C":p>=60?"D":"F";
  const gradeColor = p => p>=90?"var(--correct)":p>=80?"var(--accent)":p>=70?"var(--hint)":"var(--miss)";

  function catPct(cat, vals){
    const arr = vals.map(num);
    const kept = arr.slice().sort((a,b)=>a-b).slice(cat.drop||0);
    const earned = kept.reduce((s,x)=>s+x,0) + (cat.ec||0);
    const possible = kept.length*100;
    return possible ? earned/possible*100 : 100;
  }
  const readVals = cat => cat.labels.map((_,i)=>{
    const el = document.querySelector(`.gc-in[data-cat="${cat.id}"][data-i="${i}"]`);
    return el ? el.value : "";
  });

  function editCard(cat){
    const items = cat.labels.map((lab,i)=>`
      <div class="gc-item">
        <label>${lab}</label>
        <div class="gc-inwrap"><input class="gc-in" type="number" inputmode="decimal" min="0" max="100" step="any"
          placeholder="100" data-cat="${cat.id}" data-i="${i}" aria-label="${lab} percent"></div>
      </div>`).join("");
    const note = cat.note ? `<p class="gc-note ${cat.noteClass||""}">${cat.noteClass==="ec"?"✨":"•"} ${cat.note}</p>` : "";
    const single = cat.labels.length===1 ? " gc-single" : "";
    return `<div class="gc-cat">
      <div class="gc-head"><span class="gc-name">${cat.name}</span><span class="gc-weight">${cat.weight}%</span>
        <span class="gc-catpct" data-pct="${cat.id}">100%</span></div>
      <div class="gc-body">${note}<div class="gc-items${single}">${items}</div></div>
    </div>`;
  }
  function fixedCard(){
    const list = FIXED.map(f=>`${f.name} ${f.weight}%`).join(" · ");
    return `<div class="gc-cat">
      <div class="gc-head"><span class="gc-name">Everything else</span><span class="gc-weight">${FIXED_WEIGHT}%</span>
        <span class="gc-catpct" style="color:var(--muted)">100%</span></div>
      <div class="gc-body"><p class="gc-note">🔒 Assumed 100% (not entered): ${list}.</p></div>
    </div>`;
  }

  function recompute(){
    let overall = 0;
    for(const cat of EDIT){
      const p = catPct(cat, readVals(cat));
      const el = document.querySelector(`[data-pct="${cat.id}"]`);
      if(el){ el.textContent = fmt(p)+"%"; el.style.color = gradeColor(p); }
      overall += p*cat.weight/100;
    }
    overall += FIXED_WEIGHT; // fixed categories = 100% each → contribute their full weight
    const col = gradeColor(overall);
    $("gc-pct").textContent = fmt(overall)+"%";
    $("gc-letter").textContent = letter(overall);
    $("gc-letter").style.background = col;
    $("hero").style.setProperty("--mc", col);
    const bar = $("gc-bar");
    bar.style.width = Math.max(0, Math.min(100, overall))+"%";
    bar.style.background = col;
  }

  // build
  $("cats").innerHTML = EDIT.map(editCard).join("") + fixedCard();

  $("cats").addEventListener("input", e => {
    const el = e.target.closest(".gc-in"); if(!el) return;
    el.classList.toggle("touched", el.value.trim()!=="");
    recompute();
  });
  $("reset").onclick = () => {
    document.querySelectorAll(".gc-in").forEach(i => { i.value=""; i.classList.remove("touched"); });
    recompute();
  };

  recompute();
})();
