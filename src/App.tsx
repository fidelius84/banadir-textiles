import { useState, useEffect, useRef, createContext, useContext } from "react";
import { PRODUCTS, CATEGORIES, formatPrice, CURRENCY_SYMBOLS, CURRENCY_FLAGS, type Category, type Product, type Currency } from "./data/catalogue";
import { useCurrency, type Rates } from "./hooks/useCurrency";
import { LOGO_B64 } from "./assets/logo-b64";

/* ── CURRENCY CONTEXT ──────────────────────────── */
const CurrCtx = createContext<{ currency: Currency; rates: Rates; loading: boolean }>({ currency:"GBP", rates:{}, loading:false });
const useCurr = () => useContext(CurrCtx);

/* ── CURRENCY SWITCHER ─────────────────────────── */
function CurrencySwitcher({ currency, setCurrency, loading }: { currency:Currency; setCurrency:(c:Currency)=>void; loading:boolean }) {
  const currencies: Currency[] = ["GBP","USD","EUR","CNY"];
  return (
    <div className="flex items-center gap-1 bg-bt-cream/20 backdrop-blur-sm border border-white/30 p-1">
      {loading && <span className="text-xs text-bt-cream/60 px-2 animate-pulse">↻</span>}
      {currencies.map(c => (
        <button key={c} onClick={() => setCurrency(c)}
          title={`View prices in ${c}`}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-all ${currency===c ? "bg-bt-gold text-bt-dark" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
          <span className="text-sm">{CURRENCY_FLAGS[c]}</span>
          <span className="hidden sm:inline">{c}</span>
        </button>
      ))}
    </div>
  );
}

/* ── HELPERS ───────────────────────────────────── */
function useInView(threshold=0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if(!el) return;
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setInView(true); },{threshold});
    obs.observe(el); return ()=>obs.disconnect();
  },[threshold]);
  return {ref,inView};
}

/* ── NAVIGATION ────────────────────────────────── */
function Navigation({ currency, setCurrency, loading }: { currency:Currency; setCurrency:(c:Currency)=>void; loading:boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = ()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",fn); return ()=>window.removeEventListener("scroll",fn);
  },[]);
  const links = ["About","Services","Catalogue","Order","Contact"];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled?"bg-white shadow-md py-2":"bg-transparent py-4"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <a href="#hero" className="flex items-center gap-3 flex-shrink-0">
          <img src={LOGO_B64} alt="Banadir Textiles" className="h-11 w-11 object-contain"/>
          <div className="hidden sm:block">
            <p className="font-display font-bold text-bt-brown text-base leading-tight">Banadir Textiles</p>
            <p className="font-body text-bt-medium text-xs tracking-widest uppercase">London · Est. 2025</p>
          </div>
        </a>
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {links.map(l=>(
            <a key={l} href={`#${l.toLowerCase()}`} className="font-body text-xs font-semibold tracking-widest text-bt-dark hover:text-bt-gold transition-colors uppercase">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className={`${scrolled?"":"hidden"} lg:flex`}>
            <CurrencySwitcher currency={currency} setCurrency={setCurrency} loading={loading}/>
          </div>
          <a href="#order" className="hidden lg:block bg-bt-brown text-bt-cream font-body text-xs font-bold tracking-widest uppercase px-4 py-2.5 hover:bg-bt-dark transition-colors whitespace-nowrap">Get a Quote</a>
          <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={()=>setMenuOpen(!menuOpen)}>
            <span className={`block w-6 h-0.5 bg-bt-brown transition-all ${menuOpen?"rotate-45 translate-y-2":""}`}/>
            <span className={`block w-6 h-0.5 bg-bt-brown ${menuOpen?"opacity-0":""}`}/>
            <span className={`block w-6 h-0.5 bg-bt-brown transition-all ${menuOpen?"-rotate-45 -translate-y-2":""}`}/>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-bt-sand px-6 py-5 flex flex-col gap-4">
          {links.map(l=>(
            <a key={l} href={`#${l.toLowerCase()}`} className="font-body font-semibold text-bt-dark tracking-wide uppercase text-sm" onClick={()=>setMenuOpen(false)}>{l}</a>
          ))}
          <div className="pt-2 border-t border-bt-sand">
            <p className="font-body text-xs text-bt-medium uppercase tracking-widest mb-2">View prices in:</p>
            <CurrencySwitcher currency={currency} setCurrency={setCurrency} loading={loading}/>
          </div>
          <a href="#order" onClick={()=>setMenuOpen(false)} className="bg-bt-brown text-bt-cream text-center font-body font-semibold text-sm uppercase tracking-widest py-3">Get a Quote</a>
        </div>
      )}
    </nav>
  );
}

/* ── HERO ──────────────────────────────────────── */
function Hero({ currency, setCurrency, loading }: { currency:Currency; setCurrency:(c:Currency)=>void; loading:boolean }) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1800&q=85" alt="Fabric rolls" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-r from-bt-dark/92 via-bt-brown/75 to-transparent"/>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none">
        <svg viewBox="0 0 600 800" className="w-full h-full" fill="none">
          {Array.from({length:24}).map((_,i)=>(
            <line key={i} x1="600" y1="400" x2={600+500*Math.cos((i/24)*Math.PI*2-Math.PI/2)} y2={400+500*Math.sin((i/24)*Math.PI*2-Math.PI/2)} stroke="#F7EED8" strokeWidth="1.5"/>
          ))}
        </svg>
      </div>
      <div className="relative max-w-7xl mx-auto px-6 py-32 pt-36 w-full">
        <div className="max-w-2xl">
          <p className="font-body text-bt-gold text-sm tracking-[0.25em] uppercase mb-4">Textile Import &amp; Export Specialists</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
            Threads of<br/><em className="text-bt-gold not-italic">Heritage.</em><br/>Global Reach.
          </h1>
          <p className="font-body text-bt-cream/90 text-lg leading-relaxed mb-6 max-w-xl">
            Banadir Textiles connects manufacturers, retailers and wholesalers with premium fabrics sourced from East Africa, Turkey, Egypt, India and beyond.
          </p>
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <p className="font-body text-xs text-bt-cream/70 uppercase tracking-widest">View prices in:</p>
            <CurrencySwitcher currency={currency} setCurrency={setCurrency} loading={loading}/>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="#catalogue" className="bg-bt-gold text-bt-dark font-body font-bold text-sm uppercase tracking-widest px-8 py-4 hover:bg-white transition-colors">View Catalogue</a>
            <a href="#order" className="border-2 border-white text-white font-body font-semibold text-sm uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-bt-dark transition-colors">Request a Quote</a>
          </div>
          <div className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/20">
            {[["20+","Years Experience"],["50+","Products"],["30+","Countries Served"],["100%","UK Registered"]].map(([n,l])=>(
              <div key={l}><p className="font-display text-3xl font-bold text-bt-gold">{n}</p><p className="font-body text-xs text-bt-cream/70 uppercase tracking-wide mt-0.5">{l}</p></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── TICKER ────────────────────────────────────── */
function Ticker() {
  const items = ["UK Registered Co. No. 16559699","Premium Textile Import & Export","East African Heritage · Global Standards","Wholesale · Retail · Custom Orders","Based in Leyton, London","Worldwide Shipping Available","OEKO-TEX & GOTS Certified Lines Available"];
  const doubled = [...items,...items];
  return (
    <div className="bg-bt-brown overflow-hidden py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((t,i)=>(
          <span key={i} className="font-body text-sm text-bt-cream/90 tracking-[0.15em] uppercase mx-10">{t} <span className="text-bt-gold mx-4">✦</span></span>
        ))}
      </div>
    </div>
  );
}

/* ── ABOUT ─────────────────────────────────────── */
function About() {
  const {ref,inView}=useInView();
  return (
    <section id="about" className="py-24 bg-bt-light">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-body text-bt-gold text-sm tracking-[0.2em] uppercase mb-3">Our Story</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-bt-dark mb-6 leading-tight">Rooted in East African textile tradition</h2>
            <div style={{width:"60px",height:"3px",background:"linear-gradient(90deg,#C4944A,#5C3317)",marginBottom:"1.5rem"}}/>
            <p className="font-body text-bt-medium text-lg leading-relaxed mb-5">Banadir — the ancient Somali coastal region — has been a crossroads of trade and textiles for over a millennium. We carry that legacy into modern commerce, bridging master producers with buyers who demand both quality and provenance.</p>
            <p className="font-body text-bt-medium leading-relaxed mb-8">Founded in London and operating under UK company law, Banadir Textiles Ltd brings decades of sector knowledge to every transaction — from raw grey goods to finished garments, from single rolls to full container loads.</p>
            <div className="grid grid-cols-2 gap-6">
              {[["Ethical Sourcing","We audit all supplier relationships against international labour and environmental standards."],["Trade Finance","Structured payment terms through leading UK banks and trade finance providers."],["Logistics Expertise","FCL and LCL shipping from source country to UK port and onward delivery."],["Quality Control","Third-party lab testing — GSM, tensile strength, colourfastness, REACH/OEKO-TEX."]].map(([t,d])=>(
                <div key={t} className="border-l-2 border-bt-gold pl-4 py-1">
                  <p className="font-body font-bold text-bt-dark text-sm mb-1">{t}</p>
                  <p className="font-body text-bt-medium text-sm leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1594638019040-4b0cd0e72e7a?auto=format&fit=crop&w=700&q=85" alt="Fabric" className="w-full h-[480px] object-cover"/>
            <div className="absolute -bottom-6 -left-6 bg-bt-brown p-6 shadow-xl">
              <p className="font-display text-3xl font-bold text-bt-gold">426</p>
              <p className="font-body text-xs text-bt-cream/80 uppercase tracking-widest mt-0.5">High Road Leyton</p>
              <p className="font-body text-xs text-bt-cream/60 uppercase tracking-widest">London, E10 6QE</p>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-bt-gold opacity-40"/>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SERVICES ──────────────────────────────────── */
function Services() {
  const {ref,inView}=useInView();
  const svcs=[
    {icon:"🌍",title:"Textile Import",desc:"Sourcing from East Africa, Turkey, Egypt, India and South-East Asia. Customs clearance, tariff classification and HMRC documentation handled."},
    {icon:"📦",title:"Export & Distribution",desc:"Finished and semi-finished goods exported globally. Bills of Lading, Certificates of Origin, and Letters of Credit managed end-to-end."},
    {icon:"🏭",title:"Wholesale Supply",desc:"Bulk fabric supply to garment manufacturers, fashion brands, and traders across the UK and EU. From 50m minimum order quantities."},
    {icon:"✂️",title:"Custom & Private Label",desc:"Bespoke fabric development — custom weaves, colourways, finishes. From design brief to production-ready swatch in 8–14 weeks."},
    {icon:"🔬",title:"Quality Assurance",desc:"Third-party testing through accredited UK labs. GSM, tensile strength, colourfastness, REACH and OEKO-TEX® compliance certified."},
    {icon:"💼",title:"Trade Finance",desc:"Flexible structures: Letters of Credit, Documentary Collections, and Open Account terms through our UK banking partners."},
  ];
  return (
    <section id="services" className="py-24 bg-white sunburst-bg">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
        <div className="text-center mb-14">
          <p className="font-body text-bt-gold text-sm tracking-[0.2em] uppercase mb-3">What We Do</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-bt-dark mb-4">End-to-End Textile Services</h2>
          <div style={{width:"60px",height:"3px",background:"linear-gradient(90deg,#C4944A,#5C3317)",margin:"0 auto"}}/>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {svcs.map(s=>(
            <div key={s.title} className="border border-bt-sand bg-bt-light p-8 hover:border-bt-brown hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="font-display text-xl font-bold text-bt-dark mb-3">{s.title}</h3>
              <p className="font-body text-bt-medium text-sm leading-relaxed mb-5">{s.desc}</p>
              <a href="#contact" className="font-body text-xs font-bold text-bt-brown uppercase tracking-widest border-b border-bt-gold pb-0.5 hover:text-bt-gold transition-colors">Enquire →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PRODUCT CARD ──────────────────────────────── */
function ProductCard({ p, onEnquire }: { p:Product; onEnquire:(p:Product)=>void }) {
  const {currency,rates}=useCurr();
  const price = formatPrice(p,currency,rates);
  return (
    <div className="bg-white border border-bt-sand hover:border-bt-brown hover:shadow-xl transition-all group flex flex-col">
      <div className="relative overflow-hidden h-52">
        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        {p.featured&&<span className="absolute top-3 left-3 bg-bt-gold text-bt-dark text-xs font-bold uppercase tracking-widest px-3 py-1">Featured</span>}
        <span className="absolute top-3 right-3 bg-bt-brown/90 text-bt-cream text-xs uppercase tracking-wide px-2 py-1">{p.category}</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="font-body text-xs text-bt-medium uppercase tracking-widest mb-1">Origin: {p.origin}</p>
        <h3 className="font-display font-semibold text-bt-dark text-lg leading-tight mb-2">{p.name}</h3>
        <p className="font-body text-bt-medium text-sm leading-relaxed mb-4 flex-1">{p.description}</p>
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          {p.gsm&&<div className="bg-bt-cream px-3 py-1.5"><span className="text-bt-medium">GSM:</span> <span className="font-bold text-bt-dark">{p.gsm}</span></div>}
          {p.width&&<div className="bg-bt-cream px-3 py-1.5"><span className="text-bt-medium">Width:</span> <span className="font-bold text-bt-dark">{p.width}</span></div>}
          <div className="bg-bt-cream px-3 py-1.5"><span className="text-bt-medium">Min:</span> <span className="font-bold text-bt-dark">{p.minOrder}</span></div>
          <div className="bg-bt-gold/20 border border-bt-gold/40 px-3 py-1.5 col-span-2">
            <span className="text-bt-medium">Price:</span> <span className="font-bold text-bt-brown text-sm">{price}</span>
            <span className="text-bt-medium ml-1">({CURRENCY_SYMBOLS[currency]})</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">{p.tags.slice(0,3).map(t=><span key={t} className="text-xs bg-bt-sand text-bt-medium px-2 py-0.5">{t}</span>)}</div>
        <button onClick={()=>onEnquire(p)} className="w-full bg-bt-brown text-bt-cream font-body text-xs font-bold uppercase tracking-widest py-3 hover:bg-bt-dark transition-colors">Enquire / Order</button>
      </div>
    </div>
  );
}

/* ── CATALOGUE ─────────────────────────────────── */
function Catalogue({ onEnquire }: { onEnquire:(p:Product)=>void }) {
  const [activeCategory,setActiveCategory]=useState<Category>("All");
  const {ref,inView}=useInView();
  const {currency,setCurrency,rates,loading}=useCurr();
  const filtered=activeCategory==="All"?PRODUCTS:PRODUCTS.filter(p=>p.category===activeCategory);
  return (
    <section id="catalogue" className="py-24 bg-bt-cream">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
        <div className="text-center mb-10">
          <p className="font-body text-bt-gold text-sm tracking-[0.2em] uppercase mb-3">Product Range</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-bt-dark mb-4">Textile Catalogue</h2>
          <div style={{width:"60px",height:"3px",background:"linear-gradient(90deg,#C4944A,#5C3317)",margin:"0 auto 1rem"}}/>
          <p className="font-body text-bt-medium max-w-xl mx-auto text-sm mb-6">Browse our current stock. Contact us for firm quotations, samples and bulk pricing.</p>
          <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
            <span className="font-body text-xs text-bt-medium uppercase tracking-widest">Currency:</span>
            <CurrencySwitcher currency={currency} setCurrency={setCurrency} loading={loading}/>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map(cat=>(
            <button key={cat} onClick={()=>setActiveCategory(cat)} className={`font-body text-xs font-bold uppercase tracking-widest px-5 py-2.5 border transition-colors ${activeCategory===cat?"bg-bt-brown text-bt-cream border-bt-brown":"border-bt-medium text-bt-medium hover:border-bt-brown hover:text-bt-brown"}`}>{cat}</button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(p=><ProductCard key={p.id} p={p} onEnquire={onEnquire}/>)}
        </div>
        <div className="mt-10 p-6 bg-bt-brown/10 border border-bt-gold/40 text-center">
          <p className="font-body text-bt-dark text-sm"><strong>Don't see what you need?</strong> We source to specification. <a href="#contact" className="text-bt-brown font-bold underline underline-offset-2">Speak to our team →</a></p>
        </div>
      </div>
    </section>
  );
}

/* ── HOW TO ORDER ──────────────────────────────── */
function HowToOrder() {
  const {ref,inView}=useInView();
  return (
    <section className="py-24 bg-bt-dark">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
        <div className="text-center mb-14">
          <p className="font-body text-bt-gold text-sm tracking-[0.2em] uppercase mb-3">Simple Process</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">How to Order</h2>
          <div style={{width:"60px",height:"3px",background:"linear-gradient(90deg,#C4944A,rgba(196,148,74,0.3))",margin:"0 auto"}}/>
        </div>
        <div className="grid md:grid-cols-4 gap-0">
          {[{n:"01",title:"Browse & Enquire",desc:"Browse the catalogue or send your specification. Use the form below or email admin@banadirtextiles.com."},
            {n:"02",title:"Sample & Confirm",desc:"We dispatch physical samples within 5–7 days. Once approved, we issue a formal pro-forma invoice."},
            {n:"03",title:"Payment & Production",desc:"Confirm with a 30–50% deposit. We arrange production or locate stock and keep you updated."},
            {n:"04",title:"Ship & Receive",desc:"Your order ships with full documentation (BL, Packing List, CO). UK delivery or port collection."}].map((s,i)=>(
            <div key={s.n} className={`relative p-8 border-t-2 border-bt-gold/30 hover:border-bt-gold transition-colors ${i<3?"md:border-r md:border-r-white/10":""}`}>
              <p className="font-display text-6xl font-bold text-bt-gold/20 mb-4 leading-none">{s.n}</p>
              <h3 className="font-display text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="font-body text-bt-cream/70 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ORDER FORM ────────────────────────────────── */
type FormData = { name:string; company:string; email:string; phone:string; product:string; quantity:string; unit:string; deliveryCountry:string; preferredCurrency:string; message:string; };

function OrderForm({ selectedProduct }: { selectedProduct?:Product }) {
  const {currency}=useCurr();
  const {ref,inView}=useInView();
  const [form,setForm]=useState<FormData>({name:"",company:"",email:"",phone:"",product:selectedProduct?.name||"",quantity:"",unit:"Metres",deliveryCountry:"United Kingdom",preferredCurrency:currency,message:""});
  const [status,setStatus]=useState<"idle"|"sending"|"sent"|"error">("idle");
  useEffect(()=>{ if(selectedProduct) setForm(f=>({...f,product:selectedProduct.name})); },[selectedProduct]);
  useEffect(()=>{ setForm(f=>({...f,preferredCurrency:currency})); },[currency]);
  const set=(k:keyof FormData)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>setForm(f=>({...f,[k]:e.target.value}));
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setStatus("sending");
    try {
      const res=await fetch("https://formspree.io/f/xwpboqlp",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({_subject:`New Textile Enquiry — ${form.company||form.name} (${form.preferredCurrency})`,...form})});
      setStatus(res.ok?"sent":"error");
    } catch { setStatus("error"); }
  };
  const inp="w-full bg-white border border-bt-sand font-body text-sm text-bt-dark px-4 py-3 focus:border-bt-brown focus:outline-none placeholder:text-bt-medium/50 transition-colors";
  const lbl="font-body text-xs font-bold uppercase tracking-widest text-bt-dark mb-1.5 block";
  return (
    <section id="order" className="py-24 bg-bt-light">
      <div ref={ref} className={`max-w-5xl mx-auto px-6 transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
        <div className="text-center mb-12">
          <p className="font-body text-bt-gold text-sm tracking-[0.2em] uppercase mb-3">Ready to Trade</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-bt-dark mb-4">Request a Quote or Order</h2>
          <div style={{width:"60px",height:"3px",background:"linear-gradient(90deg,#C4944A,#5C3317)",margin:"0 auto 1rem"}}/>
          <p className="font-body text-bt-medium max-w-lg mx-auto text-sm">Complete the form and our team will respond within 24 hours with pricing and next steps.</p>
        </div>
        {status==="sent"?(
          <div className="bg-white border-l-4 border-bt-gold p-10 text-center shadow-lg">
            <div className="text-5xl mb-4">✦</div>
            <h3 className="font-display text-2xl font-bold text-bt-dark mb-3">Enquiry Received</h3>
            <p className="font-body text-bt-medium mb-6">Thank you, {form.name}. We'll contact you at <strong>{form.email}</strong> within 24 hours.</p>
            <button onClick={()=>setStatus("idle")} className="font-body text-sm font-bold uppercase tracking-widest text-bt-brown border border-bt-brown px-6 py-3 hover:bg-bt-brown hover:text-white transition-colors">Submit Another Enquiry</button>
          </div>
        ):(
          <form onSubmit={submit} className="bg-white shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div><label className={lbl}>Full Name *</label><input required value={form.name} onChange={set("name")} placeholder="Your full name" className={inp}/></div>
              <div><label className={lbl}>Company Name</label><input value={form.company} onChange={set("company")} placeholder="Trading or company name" className={inp}/></div>
              <div><label className={lbl}>Email Address *</label><input required type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" className={inp}/></div>
              <div><label className={lbl}>Phone / WhatsApp</label><input type="tel" value={form.phone} onChange={set("phone")} placeholder="+44 7000 000000" className={inp}/></div>
            </div>
            <div className="border-t border-bt-sand pt-6 mb-6">
              <p className="font-body text-xs font-bold uppercase tracking-widest text-bt-medium mb-4">Product & Order Details</p>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label className={lbl}>Product / Fabric Required *</label>
                  <select value={form.product} onChange={set("product")} className={inp} required>
                    <option value="">— Select a product —</option>
                    {PRODUCTS.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
                    <option value="Other / Custom Specification">Other / Custom Specification</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={lbl}>Quantity *</label><input required type="number" min="1" value={form.quantity} onChange={set("quantity")} placeholder="e.g. 200" className={inp}/></div>
                  <div><label className={lbl}>Unit</label><select value={form.unit} onChange={set("unit")} className={inp}><option>Metres</option><option>Kilograms</option><option>Units</option><option>Rolls</option><option>Bales</option><option>Container</option></select></div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div><label className={lbl}>Delivery Country *</label><select value={form.deliveryCountry} onChange={set("deliveryCountry")} className={inp} required>{["United Kingdom","Germany","France","Netherlands","Belgium","USA","Canada","UAE","Saudi Arabia","Kenya","Ethiopia","Somalia","Tanzania","Nigeria","South Africa","China","India","Other"].map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label className={lbl}>Preferred Currency</label><select value={form.preferredCurrency} onChange={set("preferredCurrency")} className={inp}>
                  {(["GBP","USD","EUR","CNY"] as Currency[]).map(c=><option key={c} value={c}>{CURRENCY_FLAGS[c]} {c}</option>)}</select></div>
              </div>
              <div><label className={lbl}>Additional Notes / Specification</label><textarea value={form.message} onChange={set("message")} rows={4} placeholder="Colour, finish, weight, certifications needed, delivery timeline..." className={`${inp} resize-none`}/></div>
            </div>
            {status==="error"&&<div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-body">Something went wrong. Please email <strong>admin@banadirtextiles.com</strong> directly.</div>}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="font-body text-xs text-bt-medium max-w-xs">By submitting you agree to our privacy policy. We never share your data.</p>
              <button type="submit" disabled={status==="sending"} className="bg-bt-brown text-bt-cream font-body font-bold text-sm uppercase tracking-widest px-10 py-4 hover:bg-bt-dark transition-colors disabled:opacity-60 flex items-center gap-3">
                {status==="sending"?"Sending…":"Submit Enquiry"}{status!=="sending"&&<span className="text-bt-gold">→</span>}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

/* ── WHY BANADIR ───────────────────────────────── */
function WhyBanadir() {
  const {ref,inView}=useInView();
  return (
    <section className="py-24 bg-bt-brown">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-body text-bt-gold text-sm tracking-[0.2em] uppercase mb-3">Why Choose Us</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">The trade partner that goes further</h2>
            <div style={{width:"60px",height:"3px",background:"linear-gradient(90deg,#C4944A,rgba(196,148,74,0.3))",marginBottom:"1.5rem"}}/>
            <p className="font-body text-bt-cream/80 leading-relaxed mb-8">Unlike general commodity traders, Banadir Textiles is a specialist. Every person in our team has worked in the textile or garment industry. We know what quality means at every price point.</p>
            <div className="space-y-4">
              {["Deep source relationships across 3 continents","UK-regulated, fully compliant trade documentation","Sample service before you commit to bulk","Flexible MOQs — from 50m rolls to container loads","OEKO-TEX, GOTS, GRS certifications available","Dedicated account manager on all orders over £5,000"].map(item=>(
                <div key={item} className="flex items-start gap-3"><span className="text-bt-gold mt-0.5 flex-shrink-0">✦</span><p className="font-body text-bt-cream/90 text-sm">{item}</p></div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1586495777744-4e6232bf4796?auto=format&fit=crop&w=700&q=85" alt="Production" className="w-full h-[420px] object-cover opacity-80"/>
            <div className="absolute inset-0 border-2 border-bt-gold/30"/>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bt-dark/80 to-transparent p-8">
              <div className="flex gap-8">{[["50+","Products"],["30+","Countries"],["99%","Retention"]].map(([n,l])=>(
                <div key={l}><p className="font-display text-3xl font-bold text-bt-gold">{n}</p><p className="font-body text-xs text-white/70 uppercase tracking-wide">{l}</p></div>
              ))}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ───────────────────────────────────── */
function Contact() {
  const {ref,inView}=useInView();
  return (
    <section id="contact" className="py-24 bg-bt-light">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
        <div className="text-center mb-14">
          <p className="font-body text-bt-gold text-sm tracking-[0.2em] uppercase mb-3">Get in Touch</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-bt-dark mb-4">Contact Banadir Textiles</h2>
          <div style={{width:"60px",height:"3px",background:"linear-gradient(90deg,#C4944A,#5C3317)",margin:"0 auto"}}/>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {[{icon:"📍",label:"Registered Office",lines:["426 High Road Leyton","London, E10 6QE","United Kingdom"]},{icon:"✉️",label:"Email",lines:["admin@banadirtextiles.com","Enquiries & Orders","We respond within 24h"]},{icon:"🏛️",label:"Company Details",lines:["Banadir Textiles Ltd","Co. No. 16559699","Incorporated July 2025"]}].map(({icon,label,lines})=>(
            <div key={label} className="bg-white border border-bt-sand p-8 text-center hover:border-bt-brown hover:shadow-md transition-all">
              <div className="text-4xl mb-4">{icon}</div>
              <p className="font-body text-xs font-bold text-bt-gold uppercase tracking-widest mb-3">{label}</p>
              {lines.map((l,i)=><p key={i} className={`font-body ${i===0?"font-semibold text-bt-dark":"text-bt-medium"} text-sm`}>{l}</p>)}
            </div>
          ))}
        </div>
        <div className="h-72 border border-bt-sand overflow-hidden">
          <iframe title="Banadir Textiles" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d620.1!2d-0.0089!3d51.5598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761d3b5a20eed5%3A0x400!2s426+High+Rd%2C+Leyton%2C+London+E10+6QE!5e0!3m2!1sen!2suk!4v1" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy"/>
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-bt-dark py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO_B64} alt="Banadir Textiles" className="h-14 w-14 object-contain opacity-90"/>
              <div><p className="font-display font-bold text-white text-lg">Banadir Textiles</p><p className="font-body text-bt-medium text-xs tracking-widest uppercase">Ltd — London</p></div>
            </div>
            <p className="font-body text-bt-medium text-sm leading-relaxed max-w-xs">Premium textile import and export. Connecting global producers with UK and international buyers.</p>
          </div>
          <div>
            <p className="font-body text-xs font-bold text-bt-gold uppercase tracking-widest mb-4">Navigation</p>
            {["About","Services","Catalogue","Order","Contact"].map(l=><a key={l} href={`#${l.toLowerCase()}`} className="block font-body text-sm text-bt-medium hover:text-white transition-colors mb-2">{l}</a>)}
          </div>
          <div>
            <p className="font-body text-xs font-bold text-bt-gold uppercase tracking-widest mb-4">Legal</p>
            <p className="font-body text-sm text-bt-medium mb-2">Company No. 16559699</p>
            <p className="font-body text-sm text-bt-medium mb-2">Registered in England & Wales</p>
            <p className="font-body text-sm text-bt-medium mb-4">VAT Registration Pending</p>
            <a href="mailto:admin@banadirtextiles.com" className="font-body text-sm text-bt-gold hover:text-white transition-colors">admin@banadirtextiles.com</a>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-bt-medium">© 2025 Banadir Textiles Ltd. All rights reserved.</p>
          <p className="font-body text-xs text-bt-medium/50">Exchange rates via Frankfurter API · Prices indicative only</p>
        </div>
      </div>
    </footer>
  );
}

/* ── PRODUCT MODAL ─────────────────────────────── */
function ProductModal({ product,onClose,onOrder }: { product:Product; onClose:()=>void; onOrder:(p:Product)=>void }) {
  const {currency,rates}=useCurr();
  useEffect(()=>{ const fn=(e:KeyboardEvent)=>{ if(e.key==="Escape") onClose(); }; window.addEventListener("keydown",fn); return ()=>window.removeEventListener("keydown",fn); },[onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="relative h-72">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover"/>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 w-10 h-10 flex items-center justify-center font-bold text-xl hover:bg-white transition-colors">×</button>
          <span className="absolute bottom-4 left-4 bg-bt-brown/90 text-bt-cream text-xs uppercase tracking-widest px-3 py-1.5">{product.category}</span>
        </div>
        <div className="p-8">
          <p className="font-body text-xs text-bt-medium uppercase tracking-widest mb-2">Origin: {product.origin}</p>
          <h2 className="font-display text-2xl font-bold text-bt-dark mb-3">{product.name}</h2>
          <p className="font-body text-bt-medium leading-relaxed mb-6">{product.description}</p>
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            {product.gsm&&<div className="bg-bt-cream px-4 py-3"><span className="text-bt-medium text-xs uppercase tracking-wide block mb-0.5">GSM</span><strong className="text-bt-dark">{product.gsm}</strong></div>}
            {product.width&&<div className="bg-bt-cream px-4 py-3"><span className="text-bt-medium text-xs uppercase tracking-wide block mb-0.5">Width</span><strong className="text-bt-dark">{product.width}</strong></div>}
            <div className="bg-bt-cream px-4 py-3"><span className="text-bt-medium text-xs uppercase tracking-wide block mb-0.5">Min Order</span><strong className="text-bt-dark">{product.minOrder}</strong></div>
            <div className="bg-bt-gold/20 border border-bt-gold/40 px-4 py-3"><span className="text-bt-medium text-xs uppercase tracking-wide block mb-0.5">Price ({currency})</span><strong className="text-bt-brown text-lg">{formatPrice(product,currency,rates)}</strong></div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">{product.tags.map(t=><span key={t} className="text-xs bg-bt-sand text-bt-medium px-3 py-1">{t}</span>)}</div>
          <button onClick={()=>{onOrder(product);onClose();}} className="w-full bg-bt-brown text-bt-cream font-body font-bold text-sm uppercase tracking-widest py-4 hover:bg-bt-dark transition-colors">Request a Quote for This Product</button>
        </div>
      </div>
    </div>
  );
}

/* ── APP ───────────────────────────────────────── */
export default function App() {
  const currState = useCurrency();
  const [selectedProduct,setSelectedProduct]=useState<Product|undefined>();
  const [modalProduct,setModalProduct]=useState<Product|undefined>();
  const handleEnquire=(p:Product)=>setModalProduct(p);
  const handleOrderFromModal=(p:Product)=>{ setSelectedProduct(p); setTimeout(()=>document.getElementById("order")?.scrollIntoView({behavior:"smooth"}),100); };
  return (
    <CurrCtx.Provider value={currState}>
      <div className="min-h-screen">
        <Navigation currency={currState.currency} setCurrency={currState.setCurrency} loading={currState.loading}/>
        <Hero currency={currState.currency} setCurrency={currState.setCurrency} loading={currState.loading}/>
        <Ticker/>
        <About/>
        <Services/>
        <Catalogue onEnquire={handleEnquire}/>
        <HowToOrder/>
        <OrderForm selectedProduct={selectedProduct}/>
        <WhyBanadir/>
        <Contact/>
        <Footer/>
        {modalProduct&&<ProductModal product={modalProduct} onClose={()=>setModalProduct(undefined)} onOrder={handleOrderFromModal}/>}
      </div>
    </CurrCtx.Provider>
  );
}
