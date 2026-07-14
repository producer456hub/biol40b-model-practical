/* BIOL 40B — Lecture Exam 1 Cram Sheet.
   Renders the distilled fact banks (LECTURE_CRAM) for active recall:
   cover → recall → tap to reveal, with per-topic colour coding, mnemonics,
   reveal-all / cover-all / print. Phone-first single column. */
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

  // one revealable row: text cue stays visible, answer hidden until tapped.
  function row(cue, ans){
    return `<button type="button" class="cram-row" aria-expanded="false">
      <span class="lc-cue">${esc(cue)}</span>
      <span class="cram-reveal">tap to reveal ›</span>
      <span class="cram-ans"><span class="cram-func">${esc(ans)}</span></span>
    </button>`;
  }

  function section(sec){
    const color = sec.color || "var(--accent)";
    const rows = sec.items.map(it => row(it.c, it.a)).join("");
    const mnem = (sec.mn || []).map(m =>
      `<div class="cram-mnem"><span class="cram-mnem-t">${esc(m.t)}</span><span>${m.x}</span></div>`).join("");
    return `<details class="cram-sec" id="sec-${sec.id}" open>
      <summary style="--mc:${color}"><span class="cram-dot" style="background:${color}"></span>${esc(sec.title)}<span class="cram-count">${sec.items.length}</span></summary>
      <div class="cram-body">${mnem}<div class="cram-rows">${rows}</div></div>
    </details>`;
  }

  function build(){
    const host = $("cram"), toc = $("toc");
    if (typeof LECTURE_CRAM === "undefined") {
      host.innerHTML = `<div class="card pad">Couldn't load the cram data. Open this over http, not a file:// path.</div>`;
      return;
    }
    host.innerHTML = LECTURE_CRAM.map(section).join("");
    // short TOC label = the part after the "N · " prefix
    toc.innerHTML = LECTURE_CRAM.map(s => {
      const short = s.title.replace(/^\s*\d+\s*·\s*/, "");
      return `<a href="#sec-${s.id}" class="toc-chip">${esc(short)}</a>`;
    }).join("");
    wireReveal();
  }

  function wireReveal(){
    $("cram").addEventListener("click", e => {
      const r = e.target.closest(".cram-row"); if(!r) return;
      const on = r.classList.toggle("show");
      r.setAttribute("aria-expanded", on ? "true" : "false");
    });
    const all = v => document.querySelectorAll("#cram .cram-row").forEach(r => {
      r.classList.toggle("show", v); r.setAttribute("aria-expanded", v ? "true" : "false");
    });
    $("revealAll").onclick = () => { all(true);  document.querySelectorAll("#cram details").forEach(d=>d.open=true); };
    $("coverAll").onclick  = () => all(false);
    $("printBtn").onclick   = () => { all(true); document.querySelectorAll("#cram details").forEach(d=>d.open=true); setTimeout(()=>window.print(), 60); };
  }

  build();
})();
