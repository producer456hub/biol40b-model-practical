/* BIOL 40B — Cram sheet. Pulls answers LIVE from the trainer data files so it can
   never drift out of sync, and renders them for active recall (cover → recall →
   tap to reveal) with mnemonics, word-roots, and the model images (dual coding).
   Phone-first: single column, big tap targets, collapsible sections. */
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

  const esc = s => (s==null?"":String(s)).replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
  const ROMAN = {I:1,II:2,III:3,IV:4,V:5,VI:6,VII:7,VIII:8,IX:9,X:10,XI:11,XII:12};

  // load a data file in an isolated scope and hand back the value it defines
  async function loadJS(url, expr){
    const txt = await fetch(url).then(r => r.text());
    return new Function(txt + "\n;return (" + expr + ");")();
  }

  // extra memory hooks per model (mnemonics / chunking cues)
  const MNEMONICS = {
    cranial: [
      { title: "Names, I→XII", text: "“<b>O</b>h <b>O</b>h <b>O</b>h <b>T</b>o <b>T</b>ouch <b>A</b>nd <b>F</b>eel <b>V</b>ery <b>G</b>ood <b>V</b>elvet, <b>A</b>h <b>H</b>eaven.” — Olfactory · Optic · Oculomotor · Trochlear · Trigeminal · Abducens · Facial · Vestibulocochlear · Glossopharyngeal · Vagus · Accessory · Hypoglossal." },
      { title: "Sensory / Motor / Both", text: "“<b>S</b>ome <b>S</b>ay <b>M</b>arry <b>M</b>oney <b>B</b>ut <b>M</b>y <b>B</b>rother <b>S</b>ays <b>B</b>ig <b>B</b>rains <b>M</b>atter <b>M</b>ost.” — S S M M B M B S B B M M (I→XII)." },
    ],
    ear: [
      { title: "The 3 ossicles, in order", text: "<b>Malleus → Incus → Stapes</b> = <b>Hammer → Anvil → Stirrup</b> (they’re literally named after the tools they look like)." },
    ],
    eye: [
      { title: "Light’s path", text: "Cornea → aqueous → pupil (iris) → <b>lens</b> → vitreous → <b>retina</b> → macula → optic nerve. Trace it and the parts fall in order." },
    ],
  };

  function badge(color, txt){ return `<span class="cram-num" style="background:${color||"var(--accent)"}">${esc(txt)}</span>`; }

  // one revealable answer row: cue (number) visible, answer hidden until tapped
  function row(color, num, name, roots, func){
    return `<button type="button" class="cram-row" aria-expanded="false">
      ${badge(color, num)}
      <span class="cram-reveal">tap to reveal ›</span>
      <span class="cram-ans">
        <span class="cram-name">${esc(name)}</span>
        ${roots ? `<span class="cram-roots">${esc(roots)}</span>` : ""}
        <span class="cram-func">${esc(func)}</span>
      </span>
    </button>`;
  }

  function modelSection(m){
    const rows = m.items.map(it => row(m.numColor, "#"+it.n, it.name, it.roots, it.func)).join("");
    const mnem = (MNEMONICS[m.id]||[]).map(x =>
      `<div class="cram-mnem"><span class="cram-mnem-t">${x.title}</span><span>${x.text}</span></div>`).join("");
    return `<details class="cram-sec" id="sec-${m.id}" open>
      <summary style="--mc:${m.numColor||"var(--accent)"}"><span class="cram-dot" style="background:${m.numColor||"var(--accent)"}"></span>${esc(m.title)}<span class="cram-count">${m.items.length}</span></summary>
      <div class="cram-body">
        ${m.image ? `<img class="cram-img" src="${esc(m.image)}" alt="${esc(m.title)}" loading="lazy">` : ""}
        ${mnem}
        <div class="cram-rows">${rows}</div>
      </div>
    </details>`;
  }

  // ordered I→XII cranial-nerve master table (number · name · S/M/B · function)
  function cranialTable(cranialModel, facts){
    if(!cranialModel) return "";
    const typeOf = {};
    (facts||[]).forEach(f => { typeOf[f.name.toLowerCase()] = f.type; });
    const rows = cranialModel.items
      .map(it => {
        const num = (it.name.match(/\(([IVX]+)\)/)||[])[1] || "";
        const base = it.name.replace(/\s*nerve.*/i,"").toLowerCase();
        return { ...it, num, order: ROMAN[num]||99, type: typeOf[base] || "" };
      })
      .sort((a,b)=>a.order-b.order);
    const tclass = t => t==="sensory"?"t-s":t==="motor"?"t-m":"t-b";
    const tlabel = t => t==="sensory"?"Sensory":t==="motor"?"Motor":t==="both"?"Both":"";
    const body = rows.map(r =>
      `<button type="button" class="cram-row cn" aria-expanded="false">
        <span class="cram-num" style="background:#d22">${esc(r.num)}</span>
        <span class="cram-reveal">tap to reveal ›</span>
        <span class="cram-ans">
          <span class="cram-name">${esc(r.name.replace(/\s*\(.*\)/,""))} ${r.type?`<em class="cn-type ${tclass(r.type)}">${tlabel(r.type)}</em>`:""}</span>
          ${r.roots?`<span class="cram-roots">${esc(r.roots)}</span>`:""}
          <span class="cram-func">${esc(r.func)}</span>
        </span>
      </button>`).join("");
    const mnem = MNEMONICS.cranial.map(x =>
      `<div class="cram-mnem"><span class="cram-mnem-t">${x.title}</span><span>${x.text}</span></div>`).join("");
    const img = cranialModel.image ? `<img class="cram-img" src="${esc(cranialModel.image)}" alt="Cranial nerves, inferior view" loading="lazy">` : "";
    return `<details class="cram-sec" id="sec-cnorder" open>
      <summary style="--mc:#d22"><span class="cram-dot" style="background:#d22"></span>Cranial nerves — in order (I → XII)<span class="cram-count">12</span></summary>
      <div class="cram-body">${img}${mnem}<div class="cram-rows">${body}</div></div>
    </details>`;
  }

  async function build(){
    const host = $("cram"), toc = $("toc");
    let models, cranialModel, facts=[];
    try {
      models = await loadJS("data.js", "MODELS");                 // 5 physical models
      const cm = await loadJS("cranial_data.js", "MODELS");        // [cranial]
      cranialModel = cm[0];
      const h = await loadJS("histology_data.js", "({HISTO:HISTO,CRANIAL:CRANIAL})");
      facts = h.CRANIAL || [];
    } catch(e){
      host.innerHTML = `<div class="card pad">Couldn't load the answer data (${esc(e.message)}). Open this over http, not a file:// path.</div>`;
      return;
    }

    const sections = [];
    // physical models first, then the ordered cranial-nerve master table
    models.forEach(m => sections.push({ id: m.id, title: m.title, html: modelSection(m) }));
    sections.push({ id: "cnorder", title: "Cranial nerves I→XII", html: cranialTable(cranialModel, facts) });

    host.innerHTML = sections.map(s => s.html).join("");
    toc.innerHTML = sections.map(s => `<a href="#sec-${s.id}" class="toc-chip">${esc(s.title)}</a>`).join("");

    wireReveal();
  }

  function wireReveal(){
    document.getElementById("cram").addEventListener("click", e => {
      const r = e.target.closest(".cram-row"); if(!r) return;
      const on = r.classList.toggle("show");
      r.setAttribute("aria-expanded", on ? "true" : "false");
    });
    const all = v => document.querySelectorAll("#cram .cram-row").forEach(r => {
      r.classList.toggle("show", v); r.setAttribute("aria-expanded", v?"true":"false");
    });
    $("revealAll").onclick = () => { all(true);  document.querySelectorAll("#cram details").forEach(d=>d.open=true); };
    $("coverAll").onclick  = () => all(false);
    $("printBtn").onclick   = () => { all(true); document.querySelectorAll("#cram details").forEach(d=>d.open=true); setTimeout(()=>window.print(), 60); };
  }

  build();
})();
