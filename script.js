(function(){
  "use strict";
  function $(id){ return document.getElementById(id); }
  function LSget(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function LSset(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }

  var root=document.documentElement, tbtn=$("theme");
  function paint(t){
    if(t) root.setAttribute("data-theme",t);
    var dark = t ? t==="dark" : window.matchMedia("(prefers-color-scheme:dark)").matches;
    tbtn.textContent = dark ? "Mode terang" : "Mode gelap";
  }
  paint(LSget("sdi.theme"));
  tbtn.addEventListener("click",function(){
    var cur=root.getAttribute("data-theme");
    var dark = cur ? cur==="dark" : window.matchMedia("(prefers-color-scheme:dark)").matches;
    var next = dark ? "light" : "dark";
    LSset("sdi.theme",next); paint(next);
  });

  var waves=[
    {n:1,nama:"Gelombang 1",a:"2026-10-01T00:00:00+07:00",b:"2026-12-31T23:59:59+07:00",teks:"1 Oktober – 31 Desember 2026"},
    {n:2,nama:"Gelombang 2",a:"2027-01-01T00:00:00+07:00",b:"2027-03-31T23:59:59+07:00",teks:"1 Januari – 31 Maret 2027"},
    {n:3,nama:"Gelombang 3",a:"2027-04-01T00:00:00+07:00",b:"2027-05-31T23:59:59+07:00",teks:"1 April – 31 Mei 2027"}
  ];
  waves.forEach(function(w){ w.mulai=Date.parse(w.a); w.akhir=Date.parse(w.b); });

  var now=Date.now(), aktif=null, berikut=null;
  waves.forEach(function(w){
    if(now>=w.mulai&&now<=w.akhir) aktif=w;
    if(!berikut&&now<w.mulai) berikut=w;
  });

  Array.prototype.forEach.call(document.querySelectorAll("#waves .wave"),function(c){
    var w=waves[Number(c.getAttribute("data-wave"))-1], st=c.querySelector(".state");
    if(aktif&&w.n===aktif.n){ c.className="wave active"; st.textContent="Sedang dibuka"; }
    else if(now>w.akhir){ st.textContent="Sudah berakhir"; }
    else { st.textContent="Belum dibuka"; }
  });

  var target=null;
  if(aktif){
    target=aktif.akhir;
    $("nowTag").textContent="Sedang dibuka";
    $("waveName").textContent=aktif.nama;
    $("waveRange").textContent=aktif.teks;
    $("waveNote").textContent="Gelombang ini ditutup dalam hitungan di atas. Pendaftaran tetap dapat dibuka setelahnya apabila kuota belum terpenuhi.";
  } else if(berikut){
    target=berikut.mulai;
    $("nowTag").textContent="Akan dibuka";
    $("waveName").textContent=berikut.nama;
    $("waveRange").textContent=berikut.teks;
    $("waveNote").textContent="Gelombang ini dibuka dalam hitungan di atas.";
  } else {
    $("nowTag").textContent="Di luar jadwal gelombang";
    $("waveName").textContent="Hubungi Admin SPMB";
    $("waveRange").textContent="Sisa kuota dikonfirmasi langsung";
    $("timer").hidden=true;
  }

  function pad(n){ return n<10?"0"+n:""+n; }
  function tick(){
    if(!target) return;
    var gap=target-Date.now();
    if(gap<=0){ $("timer").hidden=true; return; }
    var sec=Math.floor(gap/1000);
    $("td").textContent=Math.floor(sec/86400);
    $("th").textContent=pad(Math.floor(sec%86400/3600));
    $("tm").textContent=pad(Math.floor(sec%3600/60));
    $("ts").textContent=pad(sec%60);
  }
  tick(); setInterval(tick,1000);

  var boxes=Array.prototype.slice.call(document.querySelectorAll("#docs input"));
  function syncDocs(){
    var o={}; boxes.forEach(function(b){ o[b.getAttribute("data-doc")]=b.checked; });
    LSset("sdi.docs",JSON.stringify(o));
    var n=boxes.filter(function(b){ return b.checked; }).length;
    $("docstat").textContent = n===boxes.length ? "Semua berkas siap." : n+" dari "+boxes.length+" siap.";
  }
  (function(){
    var raw=LSget("sdi.docs");
    if(raw){ try{ var s=JSON.parse(raw);
      boxes.forEach(function(b){ if(s[b.getAttribute("data-doc")]) b.checked=true; }); }catch(e){} }
  })();
  syncDocs();
  boxes.forEach(function(b){ b.addEventListener("change",syncDocs); });
})();