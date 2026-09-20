/* Elite Escape v2 — slider, counters, testimonials, popup, chatbot, sticky CTA */
(function(){
  "use strict";
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine=matchMedia("(pointer: fine)").matches;

  /* normal instant navigation — no page-transition overlay */

  /* header */
  const head=$("#head");
  const sbar=$("#scrollBar");
  const onScroll=()=>{head&&head.classList.toggle("solid",scrollY>24);
    const st=$("#sticky"); if(st) st.style.transform=scrollY>innerHeight*.7?"none":"translateY(140%)";
    if(sbar){const h=document.documentElement;const p=h.scrollTop/((h.scrollHeight-h.clientHeight)||1);sbar.style.width=(p*100)+"%"}};
  addEventListener("scroll",onScroll,{passive:true}); onScroll();

  /* 3D tilt on trip/destination/testimonial cards — fine pointers, motion-safe */
  if(fine&&!reduced){
    $$(".card-trip,.dest,.testi-card").forEach(el=>{
      el.addEventListener("pointermove",e=>{
        const r=el.getBoundingClientRect();
        const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
        el.style.setProperty("--ry",((px-.5)*10).toFixed(2)+"deg");
        el.style.setProperty("--rx",((.5-py)*10).toFixed(2)+"deg");
      });
      el.addEventListener("pointerleave",()=>{el.style.setProperty("--rx","0deg");el.style.setProperty("--ry","0deg")});
    });
  }

  /* mobile nav */
  const burger=$("#burger"),nav=$("#nav");
  const setNav=o=>{nav.classList.toggle("open",o);burger.setAttribute("aria-expanded",o)};
  burger&&burger.addEventListener("click",()=>setNav(!nav.classList.contains("open")));
  nav&&nav.addEventListener("click",e=>{if(e.target.closest("a")||e.target.closest(".nav-close"))setNav(false)});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav&&nav.classList.contains("open")){setNav(false);burger.focus()}});

  /* reveals */
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.1,rootMargin:"0px 0px -6% 0px"});
  $$(".rv,.rv-l,.rv-scale").forEach(el=>io.observe(el));

  /* magnetic (fine pointers, motion-safe) */
  if(fine&&!reduced){$$(".btn-primary,.btn-outline").forEach(b=>{
    b.addEventListener("pointermove",e=>{const r=b.getBoundingClientRect();
      b.style.setProperty("--bx",((e.clientX-r.left)/r.width-.5)*8+"px");
      b.style.setProperty("--by",((e.clientY-r.top)/r.height-.5)*6+"px")});
    b.addEventListener("pointerleave",()=>{b.style.setProperty("--bx","0px");b.style.setProperty("--by","0px")})})}

  /* hero slider */
  const hero=$("#heroSlider");
  if(hero){
    const slides=$$(".hero-slide",hero), dots=$$(".dot"), prev=$("#heroPrev"), next=$("#heroNext");
    let i=0,timer=null;
    const go=n=>{slides[i].classList.remove("on");dots[i]&&dots[i].classList.remove("on");dots[i]&&dots[i].setAttribute("aria-selected","false");
      i=(n+slides.length)%slides.length;
      // restart Ken Burns
      const img=$("img",slides[i]); if(img&&!reduced){img.style.animation="none";void img.offsetWidth;img.style.animation=""}
      slides[i].classList.add("on");dots[i]&&dots[i].classList.add("on");dots[i]&&dots[i].setAttribute("aria-selected","true")};
    const auto=()=>{if(reduced)return;clearInterval(timer);timer=setInterval(()=>go(i+1),6500)};
    dots.forEach((d,k)=>d.addEventListener("click",()=>{go(k);auto()}));
    prev&&prev.addEventListener("click",()=>{go(i-1);auto()});
    next&&next.addEventListener("click",()=>{go(i+1);auto()});
    hero.addEventListener("pointerenter",()=>clearInterval(timer));
    hero.addEventListener("pointerleave",auto);
    hero.addEventListener("focusin",()=>clearInterval(timer));
    hero.addEventListener("focusout",auto);
    let tx=null;
    hero.addEventListener("touchstart",e=>tx=e.touches[0].clientX,{passive:true});
    hero.addEventListener("touchend",e=>{if(tx==null)return;const dx=e.changedTouches[0].clientX-tx;
      if(Math.abs(dx)>44){go(i+(dx<0?1:-1));auto()}tx=null},{passive:true});
    auto();
    if(fine&&!reduced)hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect();
      hero.style.setProperty("--mx",((e.clientX-r.left)/r.width*100).toFixed(1)+"%");
      hero.style.setProperty("--my",((e.clientY-r.top)/r.height*100).toFixed(1)+"%")});
  }

  /* counters */
  const cio=new IntersectionObserver(es=>es.forEach(x=>{
    if(!x.isIntersecting)return;cio.unobserve(x.target);
    const el=x.target,end=parseFloat(el.dataset.count),dec=el.dataset.dec?1:0,suf=el.dataset.suffix||"";
    if(reduced){el.textContent=(dec?end.toFixed(1):end)+suf;return}
    const t0=performance.now(),dur=1400;
    const step=t=>{const p=Math.min(1,(t-t0)/dur),e2=1-Math.pow(1-p,3),v=end*e2;
      el.textContent=(dec?v.toFixed(1):Math.round(v).toLocaleString("en-US"))+(p===1?suf:"");
      if(p<1)requestAnimationFrame(step)};
    requestAnimationFrame(step)}),{threshold:.5});
  $$("[data-count]").forEach(el=>cio.observe(el));

  /* testimonials render as a standard card grid — no slider, no overlap */

  /* offer popup: 25s OR exit-intent, 7-day suppression */
  const back=$("#offerBack");
  const KEY="ee_offer_v2";
  const suppressed=()=>{try{const v=JSON.parse(localStorage.getItem(KEY));return v&&Date.now()<v}catch(_){return false}};
  const suppress=days=>{try{localStorage.setItem(KEY,JSON.stringify(Date.now()+days*864e5))}catch(_){}};
  let lastFocus=null;
  const openPop=()=>{if(!back||suppressed()||back.classList.contains("open"))return;
    lastFocus=document.activeElement;back.classList.add("open");document.body.style.overflow="hidden";
    const c=$(".pop-close",back);c&&c.focus()};
  const closePop=days=>{if(!back)return;back.classList.remove("open");document.body.style.overflow="";
    suppress(days==null?7:days);lastFocus&&lastFocus.focus&&lastFocus.focus()};
  if(back&&!suppressed()){
    if(!reduced){
      setTimeout(openPop,25000);
      document.addEventListener("mouseout",e=>{if(!e.relatedTarget&&e.clientY<=0)openPop()},{once:false});
    }
    back.addEventListener("click",e=>{if(e.target===back)closePop()});
    $$("[data-pop-close]",back).forEach(b=>b.addEventListener("click",()=>closePop()));
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&back.classList.contains("open"))closePop()});
  }

  /* focus trap for modal dialogs */
  document.addEventListener("keydown",e=>{
    if(e.key!=="Tab")return;
    const open=["#offerBack","#cbBack"].map(s=>$(s)).find(b=>b&&b.classList.contains("open"));
    if(!open)return;
    const f=$$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])',open).filter(el=>el.offsetParent!==null);
    if(!f.length)return;
    const first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  });
  const cbBack=$("#cbBack");
  let cbReturn=null;
  const openCb=()=>{if(!cbBack)return;cbReturn=document.activeElement;cbBack.classList.add("open");document.body.style.overflow="hidden";const f=$("input",cbBack);f&&f.focus()};
  const closeCb=()=>{if(!cbBack)return;cbBack.classList.remove("open");document.body.style.overflow="";cbReturn&&cbReturn.focus&&cbReturn.focus()};
  document.addEventListener("click",e=>{
    const t=e.target.closest("[data-callback]");
    if(t){e.preventDefault();closeChatIfOpen();openCb();return}
    if(e.target.closest("[data-cb-close]")||e.target===cbBack)closeCb();
  });
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&cbBack&&cbBack.classList.contains("open"))closeCb()});
  const cbForm=$("#cbForm");
  cbForm&&cbForm.addEventListener("submit",e=>{e.preventDefault();
    const fd=new FormData(cbForm);
    const msg=`Callback request — Name: ${fd.get("name")||"-"}, Phone: ${fd.get("phone")||"-"}, Topic: ${fd.get("topic")||"-"}`;
    open(`${WA}?text=${encodeURIComponent(msg)}`,"_blank","noopener");closeCb()});
  const dealForm=$("#dealForm");
  dealForm&&dealForm.addEventListener("submit",e=>{e.preventDefault();
    const fd=new FormData(dealForm);
    const msg=`Deal alerts signup — Name: ${fd.get("name")||"-"}, WhatsApp: ${fd.get("phone")||"-"}, Interested in: ${fd.get("interest")||"-"}. I agree to receive trip alerts on WhatsApp.`;
    open(`${WA}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
    const ok=$("#dealOk");ok&&(ok.hidden=false);dealForm.reset()});
  const contactForm=$("#contactForm");
  contactForm&&contactForm.addEventListener("submit",e=>{e.preventDefault();
    const fd=new FormData(contactForm);
    const name=fd.get("text")||"-",where=fd.get("where")||"";
    const msg=`Hello Elite Escape, my name is ${name}.${where?" I'm planning: "+where+".":""}`;
    open(`${WA}?text=${encodeURIComponent(msg)}`,"_blank","noopener")});
  const closeChatIfOpen=()=>{const p=$("#chatPanel");p&&p.classList.remove("open")};
  const WA="https://wa.me/971555753133";
  const fab=$("#chatFab"),panel=$("#chatPanel"),nudge=$("#chatNudge"),input=$("#chatInput"),chatBody=$("#chatBody"),form=$("#chatForm");
  const openChat=()=>{panel.classList.add("open");fab.setAttribute("aria-expanded","true");nudge&&nudge.classList.remove("show");input&&input.focus()};
  const closeChat=()=>{panel.classList.remove("open");fab.setAttribute("aria-expanded","false");fab.focus()};
  if(fab&&panel){
    fab.addEventListener("click",()=>panel.classList.contains("open")?closeChat():openChat());
    $("#chatClose").addEventListener("click",closeChat);
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&panel.classList.contains("open"))closeChat()});
    const nudged=(()=>{try{return sessionStorage.getItem("ee_nudge")}catch(_){return "1"}})();
    if(!reduced&&!nudged)setTimeout(()=>{if(!panel.classList.contains("open")){nudge&&nudge.classList.add("show");try{sessionStorage.setItem("ee_nudge","1")}catch(_){}}},12000);
    const say=(html,who="bot")=>{const d=document.createElement("div");d.className="msg "+who;d.innerHTML=html;chatBody.appendChild(d);chatBody.scrollTop=chatBody.scrollHeight;return d};
    const waLink=t=>`${WA}?text=${encodeURIComponent(t)}`;
    const COUNTRIES=["usa","america","uk","britain","london","canada","australia","schengen","france","paris","italy","spain","germany","japan","china","georgia","armenia","turkey","thailand","singapore","malaysia","russia"];
    const reply=q=>{
      const s=q.toLowerCase();
      const greet=/^(hi|hello|salam|hey|good (morning|afternoon|evening))\b/.test(s);
      if(greet)return `Hello and welcome to Elite Escape! I can help with <b>holiday packages</b>, <b>visa assistance</b> or <b>desert safari &amp; attractions</b>. What are you dreaming of?`;
      if(/human|agent|phone|number|contact|whatsapp/.test(s))return `You can reach our specialists right away: <a href="tel:+971555753133"><b>+971 55 575 3133</b></a> (Mon–Fri 9–5, WhatsApp 7 days), <a href="#" data-callback><b>request a callback →</b></a> or <a href="${waLink("Hello Elite Escape, I need help")}" target="_blank" rel="noopener"><b>continue on WhatsApp →</b></a>`;
      if(/call me|callback|ring me/.test(s))return `Done — tap <a href="#" data-callback><b>Call me back</b></a>, leave your number, and a specialist rings within 30 minutes in working hours (Mon–Fri 9–5).`;
      if(/price|cost|cheap|deal|offer|discount/.test(s))return `Our starting fares: Bali <b>AED 1,299</b> · Georgia–Armenia <b>AED 2,000</b> · Japan <b>AED 4,000</b> · Paris <b>AED 5,000</b> (per person, 2 sharing). Tell me dates + travellers on <a href="${waLink("Hi! I want a holiday quote")}" target="_blank" rel="noopener"><b>WhatsApp for a fixed quote →</b></a>`;
      if(/safari|desert|dhow|burj|attraction|museum|ferrari|miracle/.test(s))return `Desert safari runs <b>daily with hotel pickup</b> — dune bashing, camel, BBQ &amp; Tanoura. See <a href="/attractions.html"><b>all 14 UAE icons →</b></a> or <a href="${waLink("I want to book a desert safari")}" target="_blank" rel="noopener"><b>book on WhatsApp →</b></a>`;
      const hit=COUNTRIES.find(c=>s.includes(c));
      if(/visa/.test(s)||hit){const where=hit?` for <b>${hit.charAt(0).toUpperCase()+hit.slice(1)}</b>`:"";
        return `For visas${where}: message us your <b>passport nationality + travel dates</b> and a specialist replies with a dated checklist. <a href="/visa.html"><b>Browse 49 visa desks →</b></a> or <a href="${waLink("Visa help"+(hit?" to "+hit:""))}" target="_blank" rel="noopener"><b>start on WhatsApp →</b></a>`}
      if(/honeymoon|family|holiday|package|tour|japan|bali|georgia|paris|travel|trip|book/.test(s))return `Lovely choice. Our signatures: <a href="/tours/japan-7-day-essential.html"><b>Japan 7-day</b></a> · <a href="/tours/georgia-armenia-7-day.html"><b>Georgia–Armenia</b></a> · <a href="/tours/bali-5-day.html"><b>Bali 5-day</b></a>. Or see <a href="/holidays.html"><b>all 24 tours →</b></a>. For dates &amp; availability: <a href="${waLink("Holiday enquiry: "+q.slice(0,80))}" target="_blank" rel="noopener"><b>ask on WhatsApp →</b></a>`;
      if(/thank|shukran/.test(s))return `You're most welcome! Anything else — I'm here.`;
      return `Got it. A specialist can confirm that in one message — <a href="${waLink("Enquiry: "+q.slice(0,100))}" target="_blank" rel="noopener"><b>continue on WhatsApp →</b></a> or try: <i>visa for France</i>, <i>Japan price</i>, <i>desert safari</i>.`;
    };
    const ask=text=>{const q=(text||"").trim();if(!q)return;say(q.replace(/</g,"&lt;"),"user");input.value="";
      const t=document.createElement("div");t.className="msg bot typing";t.innerHTML="<i></i><i></i><i></i>";chatBody.appendChild(t);chatBody.scrollTop=chatBody.scrollHeight;
      setTimeout(()=>{t.remove();say(reply(q))},reduced?60:650)};
    form.addEventListener("submit",e=>{e.preventDefault();ask(input.value)});
    $$(".chat-chips button").forEach(b=>{if(b.hasAttribute("data-callback"))return;b.addEventListener("click",()=>ask(b.textContent))});
  }

  $$("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());
  if(location.hash){try{const d=document.querySelector(location.hash);d&&d.tagName==="DETAILS"&&(d.open=true)}catch(_){}}
})();
