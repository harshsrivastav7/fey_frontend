import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence, motionValue, useMotionValue } from "framer-motion";
import {
  TrendingUp, TrendingDown, BarChart2, Bell, Search, Settings,
  Calendar, Eye, GitCompare, Zap, Lock, Cpu, Radio,
  ChevronRight, ArrowUpRight, ArrowDownRight, Play, FileText,
  Wallet, Activity, LineChart, Menu, X, Star, Check,
  ExternalLink, Shield, Globe, Layers, PieChart, Sparkles,
  Newspaper
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  THEME                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
const C = {
  lime:   "#c8f060",
  blue:   "#60a8f0",
  bg:     "#060608",
  bg2:    "#0a0a0d",
  glass:  "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.07)",
  text:   "#f0ede8",
  muted:  "#888",
  faint:  "#444",
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  GLOBAL CSS                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Cabinet+Grotesk:wght@300;400;500;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body {
    background: ${C.bg};
    color: ${C.text};
    font-family: 'Cabinet Grotesk', system-ui, sans-serif;
    overflow-x: hidden;
    cursor: none;
    -webkit-font-smoothing: antialiased;
  }
  ::selection { background: ${C.lime}; color: #000; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: rgba(200,240,96,0.3); border-radius: 2px; }
  a, button, [role="button"] { cursor: none; }

  @keyframes grain {
    0%, 100% { transform: translate(0,0); }
    10% { transform: translate(-2%,-3%); }
    20% { transform: translate(3%,2%); }
    30% { transform: translate(-1%,4%); }
    40% { transform: translate(4%,-1%); }
    50% { transform: translate(-3%,1%); }
    60% { transform: translate(1%,-4%); }
    70% { transform: translate(-4%,3%); }
    80% { transform: translate(2%,-2%); }
    90% { transform: translate(-2%,4%); }
  }
  .grain-overlay {
    position: fixed; inset: -50%; width: 200%; height: 200%;
    pointer-events: none; z-index: 9998; opacity: 0.028;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    animation: grain 0.5s steps(1) infinite;
  }

  .serif { font-family: 'Instrument Serif', serif; }

  /* nav show */
  @media (max-width: 768px) {
    .nav-links { display: none !important; }
    .nav-mobile-btn { display: flex !important; }
    body { cursor: auto; }
    a, button { cursor: pointer; }
  }
  @media (min-width: 769px) {
    .nav-mobile-btn { display: none !important; }
  }
`;

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CUSTOM CURSOR                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
function MagneticCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX  = useMotionValue(-100);
  const trailY  = useMotionValue(-100);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const springX = useSpring(trailX, { stiffness: 80, damping: 18 });
  const springY = useSpring(trailY, { stiffness: 80, damping: 18 });

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX - 6);
      cursorY.set(e.clientY - 6);
      trailX.set(e.clientX - 20);
      trailY.set(e.clientY - 20);
    };
    const over = (e) => {
      if (e.target.closest('button, a, [data-cursor-grow]')) setHovered(true);
    };
    const out = () => setHovered(false);
    const down = () => setClicked(true);
    const up   = () => setClicked(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup",   up);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup",   up);
    };
  }, []);

  return (
    <>
      {/* dot */}
      <motion.div
        style={{ x: cursorX, y: cursorY, position:"fixed", top:0, left:0, width:12, height:12, borderRadius:"50%", background: C.lime, zIndex:99999, pointerEvents:"none", mixBlendMode:"difference" }}
        animate={{ scale: clicked ? 0.5 : 1 }}
        transition={{ duration: 0.1 }}
      />
      {/* ring */}
      <motion.div
        style={{ x: springX, y: springY, position:"fixed", top:0, left:0, width:40, height:40, borderRadius:"50%", border:`1px solid ${C.lime}`, zIndex:99998, pointerEvents:"none", opacity: 0.5 }}
        animate={{ scale: hovered ? 2.2 : clicked ? 0.8 : 1, opacity: hovered ? 0.2 : 0.5 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  PARTICLE FIELD                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let mouse = { x: W/2, y: H/2 };

    const PARTICLES = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      PARTICLES.forEach(p => {
        // Drift toward mouse subtly
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 200) {
          p.vx += dx / dist * 0.008;
          p.vy += dy / dist * 0.008;
        }
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.99; p.vy *= 0.99;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(200,240,96,${p.alpha})`;
        ctx.fill();
      });

      // Connect nearby particles
      for (let i = 0; i < PARTICLES.length; i++) {
        for (let j = i+1; j < PARTICLES.length; j++) {
          const dx = PARTICLES[i].x - PARTICLES[j].x;
          const dy = PARTICLES[i].y - PARTICLES[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(PARTICLES[i].x, PARTICLES[i].y);
            ctx.lineTo(PARTICLES[j].x, PARTICLES[j].y);
            ctx.strokeStyle = `rgba(200,240,96,${0.07*(1-d/120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onMouse = (e) => { mouse = { x: e.clientX, y: e.clientY }; };
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", opacity:0.7 }} />;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  SCROLL PROGRESS BAR                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin:"left", position:"fixed", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${C.lime}, ${C.blue})`, zIndex:9999 }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  ANIMATED COUNTER                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
function Counter({ to, prefix="", suffix="", duration=2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 1000/60);
    return () => clearInterval(timer);
  }, [inView, to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  PORTFOLIO CANVAS CHART                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */
function PortfolioChart() {
  const canvasRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(null);
  const data = [118,126,121,139,134,151,146,160,155,169,164,179,173,186,181,195,190,206,201,214,209,222,217,231,226,241,235,249,244,257];
  const [drawn, setDrawn] = useState(0);

  // Animate draw-in
  useEffect(() => {
    let raf, start = null;
    const dur = 1800;
    const animate = (ts) => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / dur, 1);
      setDrawn(pct);
      if (pct < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height;
    const pad = { top:14, right:14, bottom:24, left:46 };
    const cW = W - pad.left - pad.right, cH = H - pad.top - pad.bottom;
    const max = Math.max(...data), min = Math.min(...data);
    const visibleCount = Math.max(2, Math.round(drawn * data.length));
    const visData = data.slice(0, visibleCount);
    const px = i => pad.left + (i / (data.length - 1)) * cW;
    const py = v => pad.top + cH - ((v - min) / (max - min)) * cH;

    ctx.clearRect(0, 0, W, H);

    // Grid
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (i/4)*cH;
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4,6]);
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W-pad.right, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = `500 10px Cabinet Grotesk`;
      ctx.textAlign = "right";
      ctx.fillText("$"+Math.round(max - (i/4)*(max-min)), pad.left-6, y+4);
    }

    if (visData.length < 2) return;

    // Area gradient
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top+cH);
    grad.addColorStop(0, "rgba(200,240,96,0.22)");
    grad.addColorStop(0.5, "rgba(200,240,96,0.06)");
    grad.addColorStop(1, "rgba(200,240,96,0)");
    ctx.beginPath();
    ctx.moveTo(px(0), py(visData[0]));
    visData.forEach((v,i) => { if(i>0) ctx.lineTo(px(i), py(v)); });
    ctx.lineTo(px(visData.length-1), pad.top+cH);
    ctx.lineTo(px(0), pad.top+cH);
    ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    // Line glow
    ctx.shadowColor = C.lime;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(px(0), py(visData[0]));
    visData.forEach((v,i) => { if(i>0) ctx.lineTo(px(i), py(v)); });
    ctx.strokeStyle = C.lime; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.stroke();
    ctx.shadowBlur = 0;

    // Hover
    if (hoverIdx !== null && hoverIdx < visData.length) {
      const x = px(hoverIdx), y = py(visData[hoverIdx]);
      ctx.strokeStyle = "rgba(200,240,96,0.2)"; ctx.lineWidth = 1;
      ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top+cH); ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowColor = C.lime; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI*2);
      ctx.fillStyle = C.lime; ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();

      const tW = 90, tH = 40, tX = Math.min(x+10, W-tW-10), tY = Math.max(y-tH-8, 4);
      ctx.fillStyle = "rgba(6,6,8,0.95)";
      if (ctx.roundRect) ctx.roundRect(tX, tY, tW, tH, 8); else ctx.rect(tX, tY, tW, tH);
      ctx.fill();
      ctx.strokeStyle = "rgba(200,240,96,0.3)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = C.lime; ctx.font = "bold 13px Cabinet Grotesk"; ctx.textAlign = "left";
      ctx.fillText(`$${visData[hoverIdx]}.00`, tX+8, tY+16);
      ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.font = "11px Cabinet Grotesk";
      ctx.fillText(`Day ${hoverIdx+1}`, tX+8, tY+30);
    }
  }, [drawn, hoverIdx]);

  return (
    <canvas ref={canvasRef} style={{ width:"100%", height:"100%", display:"block", cursor:"crosshair" }}
      onMouseMove={e => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const idx = Math.round(((x-46)/(rect.width-60))*(data.length-1));
        if (idx >= 0 && idx < data.length) setHoverIdx(idx);
      }}
      onMouseLeave={() => setHoverIdx(null)} />
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  REVEAL WRAPPER                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
const fadeUp = { hidden:{opacity:0, y:40}, visible:(i=0)=>({ opacity:1, y:0, transition:{ duration:0.7, delay:i*0.1, ease:[0.22,1,0.36,1] } }) };
const fadeIn  = { hidden:{opacity:0}, visible:(i=0)=>({ opacity:1, transition:{ duration:0.6, delay:i*0.08 } }) };

function Reveal({ children, delay=0, y=40, className="", style={} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity:0, y }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.75, delay, ease:[0.22,1,0.36,1] }}>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  NAVBAR                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y:-80, opacity:0 }}
        animate={{ y:0, opacity:1 }}
        transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}
        style={{
          position:"fixed", top:0, left:0, right:0, zIndex:50, height:64,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 clamp(16px,4vw,40px)",
          background: scrolled ? "rgba(6,6,8,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
          transition: "all 0.4s ease",
        }}>

        {/* Logo */}
        <a href="#" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <motion.div
            whileHover={{ rotate:180, scale:1.1 }}
            transition={{ duration:0.4 }}
            style={{ width:30, height:30, borderRadius:8, background:`linear-gradient(135deg,${C.lime},${C.blue})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"serif", fontWeight:700, fontSize:15, color:"#000" }}>F</motion.div>
          <span className="serif" style={{ fontSize:20, color:C.text, letterSpacing:"-0.02em" }}>Fey</span>
        </a>

        {/* Desktop Links */}
       <div className="nav-links" style={{ display:"flex", gap:36, alignItems:"center" }}>
  {[
    { label: "CRM Dashboard", path: "/CrmDashboard" },
    { label: "Lead",       path: "/LeadPage"   },
    { label: "Updates",       path: null   },
    { label: "Students",      path: null   },
  ].map((item, i) => (
    <motion.a
      key={item.label}
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (item.path) navigate(item.path);
      }}
      whileHover={{ color: C.text }}
      style={{ color: C.muted, fontSize: 14, textDecoration: "none", fontWeight: 500 }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + i * 0.08 }}
    >
      {item.label}
    </motion.a>
  ))}
</div>

        {/* Desktop CTA */}
        <div className="nav-links" style={{ display:"flex", gap:12, alignItems:"center" }}>
          <motion.a href="#" whileHover={{ color:C.text }} style={{ color:C.muted, fontSize:14, textDecoration:"none" }}>Sign in</motion.a>
          <motion.button
            whileHover={{ scale:1.04, boxShadow:`0 0 20px rgba(200,240,96,0.35)` }}
            whileTap={{ scale:0.97 }}
            style={{ background:C.lime, color:"#000", border:"none", borderRadius:100, padding:"9px 22px", fontSize:13, fontWeight:700, cursor:"none" }}>
            Try for free
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <button className="nav-mobile-btn" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background:"none", border:"none", color:C.muted, cursor:"none" }}>
          {menuOpen ? <X size={22} color={C.text} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity:0, y:-20 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-20 }}
            transition={{ duration:0.25 }}
            style={{ position:"fixed", top:64, left:0, right:0, zIndex:49, background:"rgba(6,6,8,0.97)", backdropFilter:"blur(24px)", borderBottom:`1px solid ${C.border}`, padding:"20px 24px 28px", display:"flex", flexDirection:"column", gap:18 }}>
            {["Dashboard","Pricing","Updates","Students","Sign in"].map(l => (
              <a key={l} href="#" onClick={() => setMenuOpen(false)}
                style={{ color:C.muted, fontSize:15, textDecoration:"none", fontWeight:500 }}>{l}</a>
            ))}
            <button style={{ background:C.lime, color:"#000", border:"none", borderRadius:100, padding:"12px 24px", fontSize:14, fontWeight:700, cursor:"none", width:"fit-content" }}>
              Try for free
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  TYPED TEXT                                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */
function TypedText() {
  const words = ["investments.", "decisions.", "returns.", "portfolio.", "future."];
  const [wIdx, setWIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[wIdx];
    let t;
    if (!del && typed !== w) t = setTimeout(() => setTyped(w.slice(0, typed.length+1)), 75);
    else if (!del && typed === w) t = setTimeout(() => setDel(true), 2400);
    else if (del && typed !== "") t = setTimeout(() => setTyped(typed.slice(0, -1)), 38);
    else { setDel(false); setWIdx(p => (p+1)%words.length); }
    return () => clearTimeout(t);
  }, [typed, del, wIdx]);
  return (
    <span className="serif" style={{ color:C.lime, fontStyle:"italic" }}>
      {typed}
      <motion.span
        animate={{ opacity:[1,0,1] }}
        transition={{ repeat:Infinity, duration:1.1, times:[0,0.5,1] }}
        style={{ display:"inline-block", width:3, height:"0.82em", background:C.lime, verticalAlign:"middle", marginLeft:3, borderRadius:1 }} />
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  HERO                                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */
const TICKERS_DATA = [
  {sym:"AAPL",val:"$192.40",chg:"+1.2%",pos:true},{sym:"NVDA",val:"$875.30",chg:"+4.8%",pos:true},
  {sym:"MSFT",val:"$415.20",chg:"-0.3%",pos:false},{sym:"TSLA",val:"$245.10",chg:"+2.1%",pos:true},
  {sym:"AMZN",val:"$182.60",chg:"-0.9%",pos:false},{sym:"GOOGL",val:"$172.90",chg:"+1.7%",pos:true},
  {sym:"META",val:"$504.80",chg:"+3.2%",pos:true},{sym:"JPM",val:"$196.50",chg:"-0.6%",pos:false},
];

function Hero() {
  const { scrollY } = useScroll();
  const heroY    = useTransform(scrollY, [0,600], [0,180]);
  const heroOpacity = useTransform(scrollY, [0,500], [1,0]);

  return (
    <section style={{ minHeight:"100vh", position:"relative", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"120px clamp(16px,6vw,60px) 80px", overflow:"hidden", textAlign:"center" }}>

      {/* Radial glow */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 70% 50% at 50% 0%, rgba(200,240,96,0.1) 0%, transparent 60%)`, pointerEvents:"none", zIndex:1 }} />
      <div style={{ position:"absolute", left:"-20%", top:"20%", width:"40vw", height:"40vw", borderRadius:"50%", background:`radial-gradient(circle, rgba(96,168,240,0.06) 0%, transparent 70%)`, pointerEvents:"none", zIndex:1 }} />

      <motion.div style={{ y:heroY, opacity:heroOpacity, width:"100%", display:"flex", flexDirection:"column", alignItems:"center", position:"relative", zIndex:2 }}>

        {/* Announcement badge */}
        <motion.div
          initial={{ opacity:0, scale:0.8, y:20 }}
          animate={{ opacity:1, scale:1, y:0 }}
          transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
          style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(200,240,96,0.07)", border:`1px solid rgba(200,240,96,0.2)`, borderRadius:100, padding:"6px 16px 6px 8px", fontSize:12, color:C.muted, marginBottom:40, backdropFilter:"blur(12px)" }}>
          <motion.span
            animate={{ scale:[1,1.15,1] }}
            transition={{ repeat:Infinity, duration:2 }}
            style={{ background:C.lime, color:"#000", borderRadius:100, padding:"2px 10px", fontSize:10, fontWeight:800, letterSpacing:"0.04em" }}>NEW</motion.span>
          <span style={{ color:"rgba(240,237,232,0.7)" }}>Fey has joined Wealthsimple →</span>
        </motion.div>

        {/* Headline */}
        <div style={{ overflow:"hidden", marginBottom:24, maxWidth:"min(1100px, 100%)" }}>
          <motion.h1
            initial={{ opacity:0, y:80 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:1, ease:[0.22,1,0.36,1], delay:0.15 }}
            className="serif"
            style={{ fontSize:"clamp(44px,9vw,108px)", fontWeight:400, lineHeight:0.95, letterSpacing:"-0.04em", color:C.text }}>
            Make better
          </motion.h1>
        </div>
        <div style={{ overflow:"hidden", marginBottom:36, maxWidth:"min(1100px, 100%)" }}>
          <motion.h1
            initial={{ opacity:0, y:80 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:1, ease:[0.22,1,0.36,1], delay:0.28 }}
            className="serif"
            style={{ fontSize:"clamp(44px,9vw,108px)", fontWeight:400, lineHeight:0.95, letterSpacing:"-0.04em" }}>
            <TypedText />
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity:0, y:30 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8, delay:0.45, ease:[0.22,1,0.36,1] }}
          style={{ fontSize:"clamp(15px,1.8vw,19px)", color:C.muted, maxWidth:"min(580px,100%)", lineHeight:1.85, marginBottom:44, padding:"0 16px" }}>
          Fey transforms overwhelming market data into clarity — real-time earnings alerts, AI-powered summaries, and institutional-grade tools, beautifully designed.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, delay:0.6 }}
          style={{ display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center", marginBottom:64, width:"100%", maxWidth:"min(440px, calc(100% - 32px))" }}>
          <motion.button
            whileHover={{ scale:1.05, boxShadow:`0 0 40px rgba(200,240,96,0.45)` }}
            whileTap={{ scale:0.97 }}
            style={{ flex:1, minWidth:150, background:C.lime, color:"#000", border:"none", borderRadius:100, padding:"15px 32px", fontSize:15, fontWeight:800, cursor:"none", letterSpacing:"-0.01em" }}>
            Start free trial
          </motion.button>
          <motion.button
            whileHover={{ background:"rgba(255,255,255,0.07)", scale:1.03 }}
            whileTap={{ scale:0.97 }}
            style={{ flex:1, minWidth:150, background:"transparent", color:C.text, border:`1px solid ${C.border}`, borderRadius:100, padding:"15px 32px", fontSize:15, cursor:"none", display:"flex", alignItems:"center", justifyContent:"center", gap:7, fontWeight:500 }}>
            See features <ArrowUpRight size={15} />
          </motion.button>
        </motion.div>

        {/* Dashboard mockup card */}
        <motion.div
          initial={{ opacity:0, y:80, scale:0.94 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:1.1, delay:0.7, ease:[0.22,1,0.36,1] }}
          style={{ width:"calc(100% - 32px)", maxWidth:1100, borderRadius:28, overflow:"hidden", background:"rgba(10,10,14,0.8)", border:`1px solid rgba(255,255,255,0.1)`, boxShadow:`0 80px 120px rgba(0,0,0,0.9), 0 0 80px rgba(200,240,96,0.05), inset 0 1px 0 rgba(255,255,255,0.08)`, backdropFilter:"blur(20px)" }}>

          {/* Chrome bar */}
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"14px 18px", borderBottom:`1px solid ${C.border}`, background:"rgba(255,255,255,0.02)" }}>
            {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width:12, height:12, borderRadius:"50%", background:c }} />)}
            <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
              <span style={{ fontSize:11, color:"#333", background:"rgba(255,255,255,0.04)", borderRadius:6, padding:"3px 14px" }}>fey.com/portfolio</span>
            </div>
          </div>

          {/* Inner layout */}
          <div style={{ display:"grid", gridTemplateColumns:"clamp(180px,22%,240px) 1fr", minHeight:340 }}>
            {/* Sidebar */}
            <div style={{ borderRight:`1px solid ${C.border}`, padding:"20px 14px", display:"flex", flexDirection:"column", gap:4 }}>
              {[
                { I:Newspaper, l:"News",     active:false },
                { I:BarChart2, l:"Portfolio",active:true  },
                { I:Bell,      l:"Earnings", active:false },
                { I:Eye,       l:"Watchlist",active:false },
                { I:Search,    l:"Finder",   active:false },
                { I:LineChart, l:"Analysis", active:false },
              ].map(({ I, l, active }) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 10px", borderRadius:10, background:active?`rgba(200,240,96,0.1)`:"transparent", cursor:"none" }}>
                  <I size={14} color={active?C.lime:C.faint} />
                  <span style={{ fontSize:12, color:active?C.lime:C.faint, fontWeight:active?600:400 }}>{l}</span>
                </div>
              ))}
            </div>

            {/* Main chart area */}
            <div style={{ padding:"clamp(16px,3vw,24px)" }}>
              <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:20 }}>
                <div>
                  <div style={{ fontSize:10, color:C.faint, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:5 }}>Portfolio Value</div>
                  <div className="serif" style={{ fontSize:"clamp(26px,4vw,44px)", letterSpacing:"-0.04em", color:C.text }}>
                    $130,067<span style={{ fontSize:"clamp(15px,2vw,24px)", color:"#555" }}>.25</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:6 }}>
                    <TrendingUp size={14} color="#4ade80" />
                    <span style={{ color:"#4ade80", fontSize:13, fontWeight:700 }}>+31.52%</span>
                    <span style={{ color:"#555", fontSize:12 }}>Past year</span>
                  </div>
                </div>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {["1D","1W","1M","1Y","All"].map((t,i) => (
                    <button key={t} style={{ borderRadius:8, padding:"5px 12px", fontSize:11, fontWeight:700, border:"none", cursor:"none", background:i===3?C.lime:"rgba(255,255,255,0.05)", color:i===3?"#000":C.faint }}>{t}</button>
                  ))}
                </div>
              </div>
              <div style={{ width:"100%", height:"clamp(140px,20vw,220px)" }}>
                <PortfolioChart />
              </div>
            </div>
          </div>

          {/* Ticker strip */}
          <div style={{ borderTop:`1px solid ${C.border}`, overflow:"hidden", padding:"10px 0", position:"relative" }}>
            <div style={{ position:"absolute", left:0, top:0, bottom:0, width:60, background:`linear-gradient(to right, ${C.bg2}, transparent)`, zIndex:2, pointerEvents:"none" }} />
            <div style={{ position:"absolute", right:0, top:0, bottom:0, width:60, background:`linear-gradient(to left, ${C.bg2}, transparent)`, zIndex:2, pointerEvents:"none" }} />
            <motion.div
              animate={{ x:["0%","-50%"] }}
              transition={{ duration:30, ease:"linear", repeat:Infinity }}
              style={{ display:"flex", width:"max-content" }}>
              {[...TICKERS_DATA,...TICKERS_DATA].map((t,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"0 24px", borderRight:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"#555" }}>{t.sym}</span>
                  <span style={{ fontSize:12, color:C.text }}>{t.val}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:t.pos?"#4ade80":"#f87171" }}>{t.chg}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  STATS STRIP                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */
const STATS = [
  { value:2400000, suffix:"+", prefix:"$", label:"AUM tracked", decimals:false },
  { value:180000,  suffix:"+", prefix:"",  label:"Active users" },
  { value:99.9,    suffix:"%", prefix:"",  label:"Uptime SLA" },
  { value:14,      suffix:"ms",prefix:"<", label:"Data latency" },
];
function StatsStrip() {
  return (
    <div style={{ borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:"48px clamp(16px,5vw,40px)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(180px,100%), 1fr))", gap:"clamp(24px,4vw,48px)", textAlign:"center" }}>
        {STATS.map((s,i) => (
          <Reveal key={i} delay={i*0.1}>
            <div className="serif" style={{ fontSize:"clamp(32px,4vw,52px)", letterSpacing:"-0.04em", color:C.lime }}>
              <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div style={{ fontSize:13, color:C.faint, marginTop:6, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.label}</div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MARQUEE FEATURES                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
const MARQUEE_ITEMS = ["Real-time earnings","AI summaries","Insider transactions","Graph comparison","Economic calendar","Broker sync","Press releases","Stock finder","Advanced metrics","Watchlist tracking"];
function MarqueeBar({ dir=1 }) {
  const all = [...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS];
  return (
    <div style={{ overflow:"hidden", padding:"18px 0", borderTop:`1px solid ${C.border}`, position:"relative" }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, background:`linear-gradient(to right, ${C.bg}, transparent)`, zIndex:2, pointerEvents:"none" }} />
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, background:`linear-gradient(to left, ${C.bg}, transparent)`, zIndex:2, pointerEvents:"none" }} />
      <motion.div
        animate={{ x: dir>0 ? ["0%","-33.33%"] : ["-33.33%","0%"] }}
        transition={{ duration:28, ease:"linear", repeat:Infinity }}
        style={{ display:"flex", width:"max-content", gap:0 }}>
        {all.map((item,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"0 28px", whiteSpace:"nowrap" }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:C.lime, flexShrink:0 }} />
            <span style={{ fontSize:13, color:C.muted, fontWeight:500, letterSpacing:"0.02em" }}>{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  FEATURES BENTO                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
const FEATURES = [
  { Icon:Bell,      title:"Earnings in real time",      desc:"Alerts the second calls start. Live join or read instant AI summaries as events unfold.",  accent:C.lime, span:"col" },
  { Icon:Search,    title:"Screener reimagined",         desc:"Type exactly what you want. No complex filters — just intelligent, instant results.",      accent:C.blue },
  { Icon:Wallet,    title:"Portfolio in sync",           desc:"Bank-grade encryption connecting every brokerage account you own into one unified view.",   accent:"#a78bfa" },
  { Icon:Eye,       title:"Insider transactions",        desc:"Track executives buying and selling their own shares before the market catches on.",        accent:"#f97316" },
  { Icon:BarChart2, title:"Advanced metrics",            desc:"P/E, EPS, DCF, ROIC and 40+ fundamental ratios updated in real time.",                     accent:"#34d399" },
  { Icon:Globe,     title:"Global coverage",             desc:"Every listed stock and ETF worldwide. Emerging markets, developed markets — nothing missing.", accent:"#60a8f0" },
];

function FeatureBento() {
  return (
    <section style={{ padding:"120px clamp(16px,5vw,40px)", maxWidth:1200, margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
      <Reveal style={{ textAlign:"center", marginBottom:72 }}>
        <div style={{ fontSize:11, color:C.lime, textTransform:"uppercase", letterSpacing:"0.22em", marginBottom:16, fontWeight:700 }}>Features</div>
        <h2 className="serif" style={{ fontSize:"clamp(32px,5.5vw,66px)", letterSpacing:"-0.04em", lineHeight:0.95, color:C.text }}>
          Everything you need.<br /><em style={{ color:"#444" }}>Nothing you don't.</em>
        </h2>
      </Reveal>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(300px,100%), 1fr))", gap:14 }}>
        {FEATURES.map(({ Icon, title, desc, accent }, i) => (
          <Reveal key={i} delay={i*0.08}>
            <motion.div
              whileHover={{ y:-6, boxShadow:`0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px ${accent}33` }}
              transition={{ duration:0.3 }}
              style={{ background:"rgba(10,10,14,0.6)", border:`1px solid ${C.border}`, borderRadius:22, padding:"30px 26px", height:"100%", backdropFilter:"blur(12px)", cursor:"none", position:"relative", overflow:"hidden" }}>
              {/* accent glow corner */}
              <div style={{ position:"absolute", top:-40, right:-40, width:120, height:120, borderRadius:"50%", background:`radial-gradient(circle, ${accent}18 0%, transparent 70%)`, pointerEvents:"none" }} />
              <motion.div
                whileHover={{ scale:1.1, rotate:8 }}
                style={{ width:44, height:44, borderRadius:14, background:`${accent}14`, border:`1px solid ${accent}30`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                <Icon size={18} color={accent} />
              </motion.div>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:10, letterSpacing:"-0.01em" }}>{title}</div>
              <div style={{ fontSize:13, color:"#666", lineHeight:1.65 }}>{desc}</div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  DOCK SECTION                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */
const DOCK = [
  { Icon:Newspaper,  label:"News",     title:"News & Market Overview",  desc:"Curated news feed with daily recaps and market performance. Cross-checked against filings and earnings calls so every story is backed by data." },
  { Icon:LineChart,  label:"Analysis", title:"Deep Analysis",           desc:"Track economic indicators, insider trades, and macro trends in one unified view. Everything that moves markets — distilled into clarity." },
  { Icon:Bell,       label:"Earnings", title:"Earnings Tracker",        desc:"View upcoming earnings across day, week, or month. Join calls live or read AI summaries the moment they're generated." },
  { Icon:Eye,        label:"Watchlist",title:"Watchlist & Holdings",    desc:"Track every portfolio in one place. Drag to reorder, create custom lists, and monitor performance with real-time P&L." },
  { Icon:GitCompare, label:"Compare",  title:"Graph Comparison",        desc:"Overlay charts across price, valuation, or growth. See correlations and divergences at a glance." },
  { Icon:Search,     label:"Finder",   title:"Stock Finder",            desc:"Type exactly what you want in plain English. No complex filters — just clear, intelligent results in under a second." },
  { Icon:Settings,   label:"Settings", title:"Settings",                desc:"Manage your subscription, referrals, and account details — all in one clean, distraction-free place." },
];

function DockSection() {
  const [active, setActive] = useState(0);
  const item = DOCK[active];
  return (
    <section style={{ padding:"120px clamp(16px,5vw,40px)", background:C.bg2, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, width:"100%", boxSizing:"border-box" }}>
      <div style={{ maxWidth:800, margin:"0 auto" }}>
        <Reveal style={{ textAlign:"center", marginBottom:56 }}>
          <h2 className="serif" style={{ fontSize:"clamp(30px,5.5vw,62px)", letterSpacing:"-0.04em", color:C.text }}>
            From <em style={{ color:"#444" }}>chaos</em> to<br />effortless clarity.
          </h2>
        </Reveal>

        {/* Panel */}
        <Reveal delay={0.1} style={{ marginBottom:20 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-20 }}
              transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
              style={{ background:"rgba(10,10,14,0.7)", border:`1px solid rgba(255,255,255,0.08)`, borderRadius:24, padding:"clamp(24px,5vw,52px)", position:"relative", overflow:"hidden", backdropFilter:"blur(20px)" }}>
              <div style={{ position:"absolute", top:0, right:0, width:260, height:260, borderRadius:"50%", background:`radial-gradient(circle, rgba(200,240,96,0.06) 0%, transparent 70%)`, transform:"translate(40%,-40%)", pointerEvents:"none" }} />
              <motion.div
                initial={{ scale:0.8 }}
                animate={{ scale:1 }}
                transition={{ duration:0.4 }}
                style={{ width:52, height:52, borderRadius:16, background:"rgba(200,240,96,0.08)", border:`1px solid rgba(200,240,96,0.2)`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
                <item.Icon size={22} color={C.lime} />
              </motion.div>
              <h3 className="serif" style={{ fontSize:"clamp(22px,3.5vw,36px)", letterSpacing:"-0.03em", color:C.text, marginBottom:14 }}>{item.title}</h3>
              <p style={{ fontSize:16, color:C.muted, lineHeight:1.8, maxWidth:560 }}>{item.desc}</p>
            </motion.div>
          </AnimatePresence>
        </Reveal>

        {/* Dock bar */}
        <Reveal delay={0.2} style={{ display:"flex", justifyContent:"center" }}>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:5, padding:"12px 14px", background:"rgba(255,255,255,0.02)", backdropFilter:"blur(24px)", border:`1px solid ${C.border}`, borderRadius:22 }}>
            {DOCK.map(({ Icon, label }, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                whileHover={{ scale:1.12 }}
                whileTap={{ scale:0.95 }}
                style={{
                  display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                  padding:"8px 12px", borderRadius:14, cursor:"none",
                  background:active===i?"rgba(200,240,96,0.12)":"transparent",
                  border:active===i?`1px solid rgba(200,240,96,0.3)`:"1px solid transparent",
                }}>
                <Icon size={17} color={active===i?C.lime:"#555"} />
                <span style={{ fontSize:9, color:active===i?C.lime:"#444", fontWeight:active===i?700:400, whiteSpace:"nowrap" }}>{label}</span>
              </motion.button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  COMMAND K                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
const CMD = [
  { name:"Apple Inc.",  sym:"AAPL",  I:BarChart2,  chg:"+1.2%", pos:true  },
  { name:"Amazon",      sym:"AMZN",  I:TrendingUp, chg:"-0.4%", pos:false },
  { name:"Alphabet",    sym:"GOOGL", I:Globe,      chg:"+1.7%", pos:true  },
  { name:"AMD",         sym:"AMD",   I:Cpu,        chg:"+3.1%", pos:true  },
  { name:"Airbnb",      sym:"ABNB",  I:Layers,     chg:"-0.9%", pos:false },
];
function CommandK() {
  const [q, setQ] = useState("");
  const filtered = q ? CMD.filter(r => r.name.toLowerCase().includes(q.toLowerCase()) || r.sym.toLowerCase().includes(q.toLowerCase())) : CMD;
  return (
    <section style={{ padding:"120px clamp(16px,5vw,40px)", width:"100%", boxSizing:"border-box" }}>
      <div style={{ maxWidth:680, margin:"0 auto", width:"100%" }}>
        <Reveal style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ fontSize:11, color:"#e8c870", textTransform:"uppercase", letterSpacing:"0.22em", marginBottom:16, fontWeight:700 }}>⌘ K</div>
          <h2 className="serif" style={{ fontSize:"clamp(30px,5.5vw,60px)", letterSpacing:"-0.04em", color:C.text, marginBottom:18 }}>At your command.</h2>
          <p style={{ fontSize:15, color:C.muted, lineHeight:1.85, maxWidth:"min(460px,100%)", margin:"0 auto" }}>
            Navigate everything with natural language — stocks, news, your portfolio — without touching the mouse.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <motion.div
            whileHover={{ boxShadow:`0 0 60px rgba(200,240,96,0.08)` }}
            style={{ background:"rgba(10,10,14,0.8)", border:`1px solid rgba(255,255,255,0.1)`, borderRadius:22, overflow:"hidden", backdropFilter:"blur(20px)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:11, padding:"14px 20px", borderBottom:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)" }}>
              <Search size={15} color="#444" style={{ flexShrink:0 }} />
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search stocks, news, portfolio…"
                style={{ flex:1, background:"transparent", border:"none", outline:"none", color:C.text, fontSize:14, fontFamily:"Cabinet Grotesk, sans-serif", minWidth:0 }} />
              <kbd style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${C.border}`, borderRadius:6, padding:"2px 8px", fontSize:10, color:"#555", fontFamily:"monospace", flexShrink:0 }}>⌘K</kbd>
            </div>
            <AnimatePresence>
              {filtered.map((r,i) => (
                <motion.div key={r.sym}
                  initial={{ opacity:0, x:-10 }}
                  animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:10 }}
                  transition={{ delay:i*0.04 }}
                  whileHover={{ background:"rgba(255,255,255,0.03)" }}
                  style={{ display:"flex", alignItems:"center", gap:11, padding:"13px 20px", borderBottom:i<filtered.length-1?`1px solid rgba(255,255,255,0.04)`:"none", cursor:"none" }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <r.I size={13} color="#555" />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <span style={{ fontSize:13, color:C.text, fontWeight:500 }}>{r.name}</span>
                    <span style={{ fontSize:13, color:"#555", marginLeft:8 }}>— {r.sym}</span>
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, color:r.pos?"#4ade80":"#f87171", flexShrink:0 }}>{r.chg}</span>
                  <ExternalLink size={12} color="#333" style={{ flexShrink:0 }} />
                </motion.div>
              ))}
            </AnimatePresence>
            <div style={{ display:"flex", gap:20, padding:"10px 20px", borderTop:`1px solid ${C.border}` }}>
              {["↑↓ Navigate","↵ Select","Esc Close"].map(h => <span key={h} style={{ fontSize:10, color:"#444" }}>{h}</span>)}
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  NEWS SECTION                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */
const NEWS = [
  { sym:"NV", color:"#76b900", headline:"Saudi Arabia partners with Nvidia to advance its national AI ambitions", time:"Just now", chg:"+4.8%", pos:true,  tag:"AI"       },
  { sym:"MS", color:"#00a4ef", headline:"Microsoft cuts 3% of global workforce in major reorganisation",         time:"2m ago",  chg:"-0.4%", pos:false, tag:"Tech"     },
  { sym:"AP", color:"#888",    headline:"Apple reports record services revenue amid hardware sales slowdown",     time:"9m ago",  chg:"+1.2%", pos:true,  tag:"Earnings" },
  { sym:"TS", color:"#cc0000", headline:"Tesla deliveries beat analyst estimates despite global EV competition",  time:"16m ago", chg:"+2.7%", pos:true,  tag:"Auto"     },
  { sym:"AM", color:"#ff9900", headline:"Amazon unveils next-gen AI chip designed to rival Nvidia H100",         time:"23m ago", chg:"-0.8%", pos:false, tag:"AI"       },
];
function NewsSection() {
  const [tab, setTab] = useState(0);
  return (
    <section style={{ padding:"120px clamp(16px,5vw,40px)", maxWidth:1100, margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(280px,100%), 1fr))", gap:"clamp(40px,6vw,80px)", alignItems:"start" }}>
        <Reveal>
          <div style={{ fontSize:11, color:"#555", textTransform:"uppercase", letterSpacing:"0.22em", marginBottom:18, fontWeight:700 }}>News</div>
          <h2 className="serif" style={{ fontSize:"clamp(28px,4.5vw,54px)", letterSpacing:"-0.04em", color:C.text, marginBottom:20 }}>
            News you<br /><em style={{ color:"#444" }}>can trust.</em>
          </h2>
          <p style={{ fontSize:15, color:C.muted, lineHeight:1.85, marginBottom:28 }}>
            Fey cross-checks every story against company filings, earnings transcripts, and financial data — delivering only verified, high-signal news.
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {[{l:"Price context",I:TrendingUp},{l:"Fact-checked",I:Shield},{l:"AI summaries",I:Cpu},{l:"Key takeaways",I:Star}].map(({l,I}) => (
              <motion.span key={l} whileHover={{ borderColor:"rgba(200,240,96,0.3)", color:C.text }}
                style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.03)", border:`1px solid ${C.border}`, borderRadius:100, padding:"6px 14px", fontSize:12, color:C.muted, cursor:"none", whiteSpace:"nowrap" }}>
                <I size={10} color="#555" /> {l}
              </motion.span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <motion.div
            whileHover={{ boxShadow:`0 0 60px rgba(0,0,0,0.6)` }}
            style={{ background:"rgba(10,10,14,0.8)", border:`1px solid rgba(255,255,255,0.1)`, borderRadius:22, overflow:"hidden", backdropFilter:"blur(20px)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"13px 16px", borderBottom:`1px solid ${C.border}`, overflowX:"auto" }}>
              {["Breakdown","Headlines","Insights"].map((t,i) => (
                <motion.button key={t} onClick={() => setTab(i)} whileTap={{ scale:0.95 }}
                  style={{ padding:"5px 14px", borderRadius:100, fontSize:12, whiteSpace:"nowrap", cursor:"none", background:tab===i?"rgba(200,240,96,0.1)":"transparent", border:tab===i?`1px solid rgba(200,240,96,0.28)`:"1px solid transparent", color:tab===i?C.lime:C.faint, fontWeight:tab===i?700:400, flexShrink:0 }}>{t}</motion.button>
              ))}
              <span style={{ marginLeft:"auto", fontSize:10, color:"#333", whiteSpace:"nowrap", flexShrink:0 }}>Generated 5:00 PM</span>
            </div>
            {NEWS.map((n,i) => (
              <motion.div key={i} whileHover={{ background:"rgba(255,255,255,0.025)" }}
                style={{ display:"flex", alignItems:"flex-start", gap:11, padding:"13px 16px", borderBottom:i<NEWS.length-1?`1px solid rgba(255,255,255,0.04)`:"none", cursor:"none" }}>
                <div style={{ width:32, height:32, borderRadius:9, background:n.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:"#fff", flexShrink:0, marginTop:1 }}>{n.sym}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:12, lineHeight:1.55, color:C.text, marginBottom:6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{n.headline}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontSize:10, color:"#444" }}>{n.time}</span>
                    <span style={{ fontSize:10, fontWeight:700, color:n.pos?"#4ade80":"#f87171", display:"flex", alignItems:"center", gap:2 }}>
                      {n.pos?<ArrowUpRight size={9}/>:<ArrowDownRight size={9}/>}{n.chg}
                    </span>
                    <span style={{ fontSize:10, color:"#333", background:"rgba(255,255,255,0.04)", borderRadius:4, padding:"1px 7px" }}>{n.tag}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  PRICING                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
const PLANS = [
  { name:"Basic", price:"$0",  period:"/mo", desc:"Get started for free",  features:["10 watchlist stocks","Basic charts","Daily news digest","Mobile app"],                                          cta:"Get started",    popular:false },
  { name:"Pro",   price:"$19", period:"/mo", desc:"For serious investors",  features:["Unlimited watchlist","Advanced analytics","AI summaries","Broker sync","Earnings alerts","Priority support"],   cta:"Start free trial",popular:true  },
  { name:"Teams", price:"$49", period:"/mo", desc:"For investment teams",   features:["Everything in Pro","Team collaboration","Full API access","Custom webhooks","Dedicated CSM","SLA guarantee"],   cta:"Contact us",     popular:false },
];
function Pricing() {
  return (
    <section style={{ padding:"120px clamp(16px,5vw,40px)", background:C.bg2, borderTop:`1px solid ${C.border}`, width:"100%", boxSizing:"border-box" }}>
      <div style={{ maxWidth:1060, margin:"0 auto", width:"100%" }}>
        <Reveal style={{ textAlign:"center", marginBottom:64 }}>
          <div style={{ fontSize:11, color:C.lime, textTransform:"uppercase", letterSpacing:"0.22em", marginBottom:16, fontWeight:700 }}>Pricing</div>
          <h2 className="serif" style={{ fontSize:"clamp(30px,5.5vw,62px)", letterSpacing:"-0.04em", color:C.text, marginBottom:12 }}>Finance made effortless.</h2>
          <p style={{ color:C.muted, fontSize:15 }}>7-day free trial. No credit card required. Cancel anytime.</p>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(260px,100%), 1fr))", gap:16 }}>
          {PLANS.map((p,i) => (
            <Reveal key={i} delay={i*0.1} style={{ position:"relative" }}>
              {p.popular && (
                <div style={{ position:"absolute", top:-1, left:"50%", transform:"translateX(-50%)", background:C.lime, color:"#000", fontSize:10, fontWeight:800, padding:"4px 16px", borderRadius:"0 0 12px 12px", letterSpacing:"0.06em", zIndex:1, whiteSpace:"nowrap" }}>MOST POPULAR</div>
              )}
              <motion.div
                whileHover={{ y:-8, boxShadow: p.popular ? `0 32px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,240,96,0.4)` : `0 24px 48px rgba(0,0,0,0.5)` }}
                transition={{ duration:0.3 }}
                style={{ background:p.popular?"rgba(200,240,96,0.04)":"rgba(10,10,14,0.6)", border:`1px solid ${p.popular?"rgba(200,240,96,0.3)":C.border}`, borderRadius:24, padding:"28px 26px", height:"100%", display:"flex", flexDirection:"column", backdropFilter:"blur(12px)", cursor:"none", boxSizing:"border-box" }}>
                <div style={{ fontSize:13, color:C.muted, marginBottom:8, marginTop:p.popular?10:0, fontWeight:600 }}>{p.name}</div>
                <div className="serif" style={{ fontSize:"clamp(36px,5vw,50px)", letterSpacing:"-0.05em", color:C.text, marginBottom:6 }}>
                  {p.price}<span style={{ fontSize:16, color:"#555", fontFamily:"Cabinet Grotesk, sans-serif" }}>{p.period}</span>
                </div>
                <div style={{ fontSize:13, color:"#555", marginBottom:26 }}>{p.desc}</div>
                <div style={{ flex:1 }}>
                  {p.features.map(f => (
                    <motion.div key={f} whileHover={{ x:4 }} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:`1px solid rgba(255,255,255,0.04)`, fontSize:13, color:C.muted, cursor:"none" }}>
                      <Check size={12} color={C.lime} style={{ flexShrink:0 }} /> {f}
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale:1.03, ...(p.popular && { boxShadow:`0 0 28px rgba(200,240,96,0.35)` }) }}
                  whileTap={{ scale:0.97 }}
                  style={{ width:"100%", marginTop:26, padding:"13px 0", background:p.popular?C.lime:"rgba(255,255,255,0.07)", color:p.popular?"#000":C.text, border:p.popular?"none":`1px solid ${C.border}`, borderRadius:100, fontSize:14, fontWeight:700, cursor:"none" }}>
                  {p.cta}
                </motion.button>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  FOOTER                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ padding:"100px clamp(16px,5vw,40px) 40px", borderTop:`1px solid ${C.border}`, width:"100%", boxSizing:"border-box" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", width:"100%" }}>
        <Reveal style={{ textAlign:"center", marginBottom:80 }}>
          <h2 className="serif" style={{ fontSize:"clamp(38px,8vw,96px)", fontWeight:400, lineHeight:0.92, letterSpacing:"-0.05em", color:C.text, marginBottom:36 }}>
            Start investing<br />
            <em style={{ color:C.lime }}>smarter today.</em>
          </h2>
          <motion.button
            whileHover={{ scale:1.05, boxShadow:`0 0 48px rgba(200,240,96,0.45)` }}
            whileTap={{ scale:0.97 }}
            style={{ background:C.lime, color:"#000", border:"none", borderRadius:100, padding:"17px 44px", fontSize:16, fontWeight:800, cursor:"none", letterSpacing:"-0.01em" }}>
            Try Fey free for 7 days
          </motion.button>
        </Reveal>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(150px,100%), 1fr))", gap:"clamp(24px,4vw,48px)", marginBottom:56 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:26, height:26, borderRadius:8, background:`linear-gradient(135deg,${C.lime},${C.blue})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"serif", fontWeight:700, fontSize:12, color:"#000", flexShrink:0 }}>F</div>
              <span className="serif" style={{ fontSize:18, color:C.text }}>Fey</span>
            </div>
            <p style={{ fontSize:13, color:"#555", lineHeight:1.75 }}>Make better investments with real-time data and AI-powered insights.</p>
          </div>
          {[
            { title:"Product", links:["Features","Earnings","Portfolio","Finder","Pricing"] },
            { title:"Company", links:["Updates","Download","Privacy","Terms","Students"] },
            { title:"Connect", links:["Twitter","LinkedIn","GitHub","Discord"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize:10, color:"#333", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:16, fontWeight:700 }}>{col.title}</div>
              {col.links.map(l => (
                <motion.a key={l} href="#" whileHover={{ color:C.text, x:4 }} style={{ display:"block", fontSize:13, color:"#555", textDecoration:"none", marginBottom:10 }}>{l}</motion.a>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:24, display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:12, color:"#333" }}>© 2025, Fey Labs Inc.</span>
          <span style={{ fontSize:12, color:"#333" }}>Built with ❤️ by Harsh Srivastav</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  APP ROOT                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function FeyElite() {
  useEffect(() => {
    const s = document.createElement("style");
    s.innerHTML = GLOBAL_CSS;
    document.head.prepend(s);
    return () => { try { document.head.removeChild(s); } catch(e){} };
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, width:"100%", maxWidth:"100vw", overflowX:"hidden", position:"relative" }}>
      {/* Film grain overlay */}
      <div className="grain-overlay" />

      {/* Particle field */}
      <ParticleField />

      {/* Custom cursor */}
      <MagneticCursor />

      {/* Scroll progress */}
      <ScrollBar />

      {/* Nav */}
      <Navbar />

      {/* Sections */}
      <div style={{ position:"relative", zIndex:2 }}>
        <Hero />
        <StatsStrip />
        <MarqueeBar dir={1} />
        <FeatureBento />
        <MarqueeBar dir={-1} />
        <DockSection />
        <CommandK />
        <NewsSection />
        <Pricing />
        <Footer />
      </div>
    </div>
  );
}