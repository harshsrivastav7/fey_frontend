import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  User, Mail, Building2, Target, Send, CheckCircle,
  ChevronRight, Sparkles, ArrowRight, Zap, Shield, Globe
} from "lucide-react";

/* ─── THEME — same Fey ───────────────────────────────────────────────────── */
const C = {
  lime:   "#c8f060",
  blue:   "#60a8f0",
  purple: "#a78bfa",
  green:  "#4ade80",
  red:    "#f87171",
  bg:     "#060608",
  bg2:    "#0a0a0d",
  border: "rgba(255,255,255,0.07)",
  border2:"rgba(255,255,255,0.12)",
  text:   "#f0ede8",
  muted:  "#888",
  faint:  "#444",
};

const API = "https://fey-backend.onrender.com";

/* ─── GLOBAL CSS ─────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Cabinet+Grotesk:wght@300;400;500;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { overflow-x: hidden; scroll-behavior: smooth; }
  body {
    background: ${C.bg};
    color: ${C.text};
    font-family: 'Cabinet Grotesk', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    cursor: none;
    overflow-x: hidden;
  }
  * { cursor: none !important; }
  ::selection { background: ${C.lime}; color: #000; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: rgba(200,240,96,0.25); border-radius: 2px; }
  .serif { font-family: 'Instrument Serif', serif; }
  input, select, textarea { font-family: 'Cabinet Grotesk', sans-serif; }

  @keyframes grain {
    0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
    20%{transform:translate(3%,2%)}   30%{transform:translate(-1%,4%)}
    40%{transform:translate(4%,-1%)}  50%{transform:translate(-3%,1%)}
  }
  .grain {
    position: fixed; inset: -50%; width: 200%; height: 200%;
    pointer-events: none; z-index: 9990; opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    animation: grain 0.4s steps(1) infinite;
  }

  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-12px); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  .live-dot::after {
    content: '';
    position: absolute; inset: 0;
    border-radius: 50%;
    background: ${C.green};
    animation: pulse-ring 1.8s ease-out infinite;
  }

  @media (max-width: 768px) {
    body { cursor: auto; }
    * { cursor: auto !important; }
  }
`;

/* ─── CUSTOM CURSOR ──────────────────────────────────────────────────────── */
function Cursor() {
  const mx = useMotionValue(-100), my = useMotionValue(-100);
  const tx = useMotionValue(-100), ty = useMotionValue(-100);
  const sx = useSpring(tx, { stiffness: 90, damping: 18 });
  const sy = useSpring(ty, { stiffness: 90, damping: 18 });
  const [big,   setBig]   = useState(false);
  const [click, setClick] = useState(false);

  useEffect(() => {
    const m = e => { mx.set(e.clientX-6); my.set(e.clientY-6); tx.set(e.clientX-18); ty.set(e.clientY-18); };
    const o = e => setBig(!!e.target.closest("button,a,input,select,[data-hover]"));
    const d = () => setClick(true);
    const u = () => setClick(false);
    window.addEventListener("mousemove", m);
    document.addEventListener("mouseover", o);
    document.addEventListener("mouseout", () => setBig(false));
    window.addEventListener("mousedown", d);
    window.addEventListener("mouseup",   u);
    return () => {
      window.removeEventListener("mousemove", m);
      window.removeEventListener("mousedown", d);
      window.removeEventListener("mouseup",   u);
    };
  }, []);

  return (
    <>
      <motion.div style={{ x:mx, y:my, position:"fixed", top:0, left:0, width:12, height:12, borderRadius:"50%", background:C.lime, zIndex:99999, pointerEvents:"none", mixBlendMode:"difference" }}
        animate={{ scale: click ? 0.5 : 1 }} transition={{ duration:0.1 }} />
      <motion.div style={{ x:sx, y:sy, position:"fixed", top:0, left:0, width:36, height:36, borderRadius:"50%", border:`1px solid ${C.lime}`, zIndex:99998, pointerEvents:"none", opacity:0.4 }}
        animate={{ scale: big ? 2.2 : click ? 0.7 : 1 }} transition={{ duration:0.2 }} />
    </>
  );
}

/* ─── PARTICLES ──────────────────────────────────────────────────────────── */
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let mouse = { x: W/2, y: H/2 };

    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3,
      r: Math.random()*1.2+0.4, a: Math.random()*0.35+0.08,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        const dx = mouse.x-p.x, dy = mouse.y-p.y, d = Math.sqrt(dx*dx+dy*dy);
        if (d < 180) { p.vx += dx/d*0.007; p.vy += dy/d*0.007; }
        p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.vy *= 0.99;
        if (p.x<0) p.x=W; if (p.x>W) p.x=0;
        if (p.y<0) p.y=H; if (p.y>H) p.y=0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(200,240,96,${p.a})`; ctx.fill();
      });
      for (let i=0; i<pts.length; i++) {
        for (let j=i+1; j<pts.length; j++) {
          const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
          if (d<110) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(200,240,96,${0.06*(1-d/110)})`; ctx.lineWidth=0.5; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onM = e => { mouse = { x:e.clientX, y:e.clientY }; };
    const onR = () => { W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; };
    window.addEventListener("mousemove", onM);
    window.addEventListener("resize",    onR);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove",onM); window.removeEventListener("resize",onR); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", opacity:0.6 }} />;
}

/* ─── FLOATING LABEL INPUT ───────────────────────────────────────────────── */
function FloatingInput({ label, type="text", value, onChange, icon:Icon, options, required, error }) {
  const [focused, setFocused] = useState(false);
  const filled  = value && value.length > 0;
  const isFloat = focused || filled;

  const baseStyle = {
    width: "100%",
    background: focused ? "rgba(200,240,96,0.04)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${error ? C.red : focused ? "rgba(200,240,96,0.4)" : C.border}`,
    borderRadius: 14,
    padding: options ? "22px 16px 10px 44px" : "22px 16px 10px 44px",
    fontSize: 14,
    color: C.text,
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "Cabinet Grotesk, sans-serif",
    appearance: "none",
    colorScheme: "dark",
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Icon */}
      <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", zIndex: 2, pointerEvents: "none" }}>
        <Icon size={15} color={focused ? C.lime : C.faint} style={{ transition: "color 0.2s" }} />
      </div>

      {/* Floating label */}
      <motion.label
        animate={{ top: isFloat ? 8 : "50%", fontSize: isFloat ? 10 : 14, color: isFloat ? (error ? C.red : focused ? C.lime : C.faint) : C.faint, y: isFloat ? 0 : "-50%" }}
        transition={{ duration: 0.18 }}
        style={{ position: "absolute", left: 44, pointerEvents: "none", zIndex: 2, fontWeight: isFloat ? 700 : 400, letterSpacing: isFloat ? "0.08em" : 0, textTransform: isFloat ? "uppercase" : "none" }}>
        {label}{required && " *"}
      </motion.label>

      {/* Input or Select */}
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...baseStyle, paddingRight: 16 }}>
          <option value="">Select...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={baseStyle} required={required} />
      )}

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
          style={{ fontSize: 11, color: C.red, marginTop: 5, paddingLeft: 4 }}>{error}</motion.div>
      )}
    </div>
  );
}

/* ─── SUCCESS SCREEN ─────────────────────────────────────────────────────── */
function SuccessScreen({ name, onReset }) {
  return (
    <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
      style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"48px 32px" }}>

      {/* Animated checkmark */}
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.2, duration:0.5, type:"spring", stiffness:200 }}
        style={{ width:80, height:80, borderRadius:"50%", background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.3)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28, position:"relative" }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1px solid rgba(74,222,128,0.3)", animation:"pulse-ring 2s ease-out infinite" }} />
        <CheckCircle size={36} color={C.green} />
      </motion.div>

      <motion.h2 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
        className="serif" style={{ fontSize:"clamp(26px,4vw,40px)", letterSpacing:"-0.04em", color:C.text, marginBottom:12 }}>
        You're in, {name?.split(" ")[0]}!
      </motion.h2>

      <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
        style={{ fontSize:15, color:C.muted, lineHeight:1.8, marginBottom:36, maxWidth:380 }}>
        Your interest has been registered. Our team will reach out to you shortly with next steps.
      </motion.p>

      {/* Confetti-like dots */}
      {[...Array(8)].map((_, i) => (
        <motion.div key={i}
          initial={{ opacity:0, scale:0, x:0, y:0 }}
          animate={{ opacity:[0,1,0], scale:[0,1,0], x:(Math.cos(i/8*Math.PI*2))*80, y:(Math.sin(i/8*Math.PI*2))*80 }}
          transition={{ delay:0.2+i*0.04, duration:0.8 }}
          style={{ position:"absolute", width:6, height:6, borderRadius:"50%", background:i%2===0?C.lime:C.blue, top:"50%", left:"50%", marginTop:-3, marginLeft:-3, pointerEvents:"none" }} />
      ))}

      <motion.button initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
        whileHover={{ scale:1.04, boxShadow:`0 0 28px rgba(200,240,96,0.3)` }} whileTap={{ scale:0.97 }}
        onClick={onReset}
        style={{ background:C.lime, color:"#000", border:"none", borderRadius:100, padding:"13px 32px", fontSize:14, fontWeight:800, cursor:"none" }}>
        Submit Another →
      </motion.button>
    </motion.div>
  );
}

/* ─── LEAD FORM ──────────────────────────────────────────────────────────── */
const INTERESTS = [
  "Investment Tools", "Portfolio Analytics", "Earnings Tracking",
  "Market News", "API Access", "Team Features", "Other"
];

const STEPS = [
  { title: "Personal Info",   fields: ["name", "email"]                    },
  { title: "Organization",    fields: ["organization"]                      },
  { title: "Your Interest",   fields: ["interest"]                          },
];

function LeadForm() {
  const [step,    setStep]    = useState(0);
  const [form,    setForm]    = useState({ name:"", email:"", organization:"", interest:"" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiErr,  setApiErr]  = useState("");

  const update = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (step === 0) {
      if (!form.name.trim())                          errs.name  = "Name is required";
      if (!form.email.trim())                         errs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email))     errs.email = "Enter a valid email";
    }
    if (step === 1 && !form.organization.trim())      errs.organization = "Organization is required";
    if (step === 2 && !form.interest)                 errs.interest = "Please select your interest";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setApiErr("");
    try {
      const res = await fetch(`${API}/api/leads`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setSuccess(true);
    } catch (err) {
      setApiErr(err.message || "Cannot connect to server. Please try again.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setForm({ name:"", email:"", organization:"", interest:"" });
    setStep(0);
    setSuccess(false);
    setApiErr("");
  };

  const progress = ((step) / STEPS.length) * 100;

  return (
    <div style={{ width:"100%", maxWidth:480, position:"relative", zIndex:2 }}>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="success"
            style={{ background:"rgba(10,10,14,0.85)", border:`1px solid rgba(74,222,128,0.25)`, borderRadius:28, overflow:"hidden", backdropFilter:"blur(24px)", boxShadow:`0 60px 100px rgba(0,0,0,0.8), 0 0 60px rgba(74,222,128,0.06)`, position:"relative" }}>
            <SuccessScreen name={form.name} onReset={handleReset} />
          </motion.div>
        ) : (
          <motion.div key="form"
            initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-30 }}
            transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
            style={{ background:"rgba(10,10,14,0.85)", border:`1px solid ${C.border2}`, borderRadius:28, overflow:"hidden", backdropFilter:"blur(24px)", boxShadow:`0 60px 100px rgba(0,0,0,0.8), 0 0 60px rgba(200,240,96,0.04)` }}>

            {/* Progress bar */}
            <div style={{ height:2, background:"rgba(255,255,255,0.05)" }}>
              <motion.div animate={{ width:`${progress + (100/STEPS.length)}%` }} transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
                style={{ height:"100%", background:`linear-gradient(90deg, ${C.lime}, ${C.blue})` }} />
            </div>

            {/* Header */}
            <div style={{ padding:"28px 32px 0" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
                {/* Step pills */}
                <div style={{ display:"flex", gap:6 }}>
                  {STEPS.map((s,i) => (
                    <motion.div key={i} animate={{ background: i <= step ? C.lime : "rgba(255,255,255,0.08)", width: i === step ? 24 : 8 }}
                      style={{ height:8, borderRadius:4, transition:"all 0.3s" }} />
                  ))}
                </div>
                <span style={{ fontSize:11, color:C.faint, fontWeight:700 }}>
                  {step+1} / {STEPS.length}
                </span>
              </div>

              <motion.div key={step} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
                <div style={{ fontSize:11, color:C.lime, textTransform:"uppercase", letterSpacing:"0.18em", fontWeight:700, marginBottom:8 }}>
                  Step {step+1}
                </div>
                <h3 className="serif" style={{ fontSize:"clamp(22px,3vw,30px)", letterSpacing:"-0.03em", color:C.text, marginBottom:6 }}>
                  {STEPS[step].title}
                </h3>
              </motion.div>
            </div>

            {/* Fields */}
            <div style={{ padding:"24px 32px" }}>
              <AnimatePresence mode="wait">
                <motion.div key={step}
                  initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
                  transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}
                  style={{ display:"flex", flexDirection:"column", gap:16 }}>

                  {step === 0 && (
                    <>
                      <FloatingInput label="Full Name" icon={User}     value={form.name}  onChange={v=>update("name",v)}  required error={errors.name}  />
                      <FloatingInput label="Email"     icon={Mail}     type="email" value={form.email} onChange={v=>update("email",v)} required error={errors.email} />
                    </>
                  )}
                  {step === 1 && (
                    <FloatingInput label="Organization / Company" icon={Building2} value={form.organization} onChange={v=>update("organization",v)} required error={errors.organization} />
                  )}
                  {step === 2 && (
                    <FloatingInput label="Area of Interest" icon={Target} value={form.interest} onChange={v=>update("interest",v)} options={INTERESTS} required error={errors.interest} />
                  )}

                  {/* API error */}
                  {apiErr && (
                    <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
                      style={{ background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.25)", borderRadius:12, padding:"12px 14px", fontSize:13, color:C.red, display:"flex", alignItems:"center", gap:8 }}>
                      ⚠️ {apiErr}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div style={{ padding:"0 32px 28px", display:"flex", gap:12 }}>
              {step > 0 && (
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={() => setStep(s=>s-1)}
                  style={{ flex:1, padding:"13px", background:"rgba(255,255,255,0.05)", color:C.muted, border:`1px solid ${C.border}`, borderRadius:100, fontSize:14, fontWeight:600, cursor:"none" }}>
                  ← Back
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale:1.03, boxShadow:`0 0 32px rgba(200,240,96,0.4)` }} whileTap={{ scale:0.97 }}
                onClick={handleNext} disabled={loading}
                style={{ flex:2, padding:"13px", background:C.lime, color:"#000", border:"none", borderRadius:100, fontSize:15, fontWeight:800, cursor:"none", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:loading?0.8:1 }}>
                {loading ? (
                  <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:0.8, ease:"linear" }}>
                    <Sparkles size={16} />
                  </motion.div>
                ) : (
                  <>
                    {step === STEPS.length-1 ? "Submit" : "Continue"}
                    <ArrowRight size={15} />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── SOCIAL PROOF ───────────────────────────────────────────────────────── */
const AVATARS = ["AR","PK","NS","VR","DM","AK"];
function SocialProof() {
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8, duration:0.6 }}
      style={{ display:"flex", alignItems:"center", gap:12, marginTop:28 }}>
      <div style={{ display:"flex" }}>
        {AVATARS.map((a,i) => (
          <div key={i} style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${i%2===0?C.lime:C.blue}33,rgba(255,255,255,0.05))`, border:`2px solid ${C.bg}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:i%2===0?C.lime:C.blue, marginLeft: i>0?-8:0, flexShrink:0 }}>{a}</div>
        ))}
      </div>
      <div>
        <div style={{ fontSize:12, color:C.text, fontWeight:600 }}>2,400+ professionals</div>
        <div style={{ fontSize:11, color:C.faint }}>already using Fey</div>
      </div>
    </motion.div>
  );
}

/* ─── FEATURES LIST ──────────────────────────────────────────────────────── */
const PERKS = [
  { I:Zap,    text:"Real-time earnings alerts"      },
  { I:Shield, text:"Bank-grade security"            },
  { I:Globe,  text:"Global market coverage"         },
];

/* ─── MAIN PAGE ──────────────────────────────────────────────────────────── */
export default function LeadPage() {
  useEffect(() => {
    const s = document.createElement("style");
    s.innerHTML = GLOBAL_CSS;
    document.head.prepend(s);
    return () => { try { document.head.removeChild(s); } catch(e){} };
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, overflowX:"hidden", position:"relative" }}>
      <div className="grain" />
      <Cursor />
      <Particles />

      {/* Radial glow */}
      <div style={{ position:"fixed", inset:0, background:`radial-gradient(ellipse 70% 50% at 60% 50%, rgba(200,240,96,0.06) 0%, transparent 65%)`, pointerEvents:"none", zIndex:1 }} />
      <div style={{ position:"fixed", inset:0, background:`radial-gradient(ellipse 50% 60% at 20% 50%, rgba(96,168,240,0.04) 0%, transparent 65%)`, pointerEvents:"none", zIndex:1 }} />

      {/* Navbar */}
      <motion.nav initial={{ y:-60, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
        style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, height:64, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 clamp(16px,5vw,48px)", background:"rgba(6,6,8,0.7)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <motion.div whileHover={{ rotate:180 }} transition={{ duration:0.4 }}
            style={{ width:30, height:30, borderRadius:8, background:`linear-gradient(135deg,${C.lime},${C.blue})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"serif", fontWeight:700, fontSize:14, color:"#000" }}>F</motion.div>
          <span className="serif" style={{ fontSize:18, color:C.text, letterSpacing:"-0.02em" }}>Fey</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:100, padding:"5px 12px" }}>
            <div style={{ position:"relative", width:6, height:6 }}>
              <div className="live-dot" style={{ position:"absolute", inset:0, borderRadius:"50%", background:C.green }} />
            </div>
            <span style={{ fontSize:11, color:C.green, fontWeight:700 }}>Accepting leads</span>
          </div>
        </div>
      </motion.nav>

      {/* Main layout */}
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"80px clamp(16px,5vw,48px) 48px", position:"relative", zIndex:2 }}>
        <div style={{ width:"100%", maxWidth:1100, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(300px,100%),1fr))", gap:"clamp(40px,6vw,80px)", alignItems:"center" }}>

          {/* Left — Copy */}
          <div>
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
              style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(200,240,96,0.07)", border:`1px solid rgba(200,240,96,0.2)`, borderRadius:100, padding:"6px 14px 6px 8px", fontSize:12, color:C.muted, marginBottom:32 }}>
              <motion.span animate={{ scale:[1,1.15,1] }} transition={{ repeat:Infinity, duration:2 }}
                style={{ background:C.lime, color:"#000", borderRadius:100, padding:"2px 10px", fontSize:10, fontWeight:800 }}>NEW</motion.span>
              <span>Early access now open</span>
              <ChevronRight size={11} color={C.faint} />
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.1, ease:[0.22,1,0.36,1] }}
              className="serif" style={{ fontSize:"clamp(38px,6vw,72px)", letterSpacing:"-0.04em", lineHeight:0.95, color:C.text, marginBottom:20 }}>
              Invest with<br />
              <span style={{ color:C.lime, fontStyle:"italic" }}>clarity.</span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.22, ease:[0.22,1,0.36,1] }}
              style={{ fontSize:"clamp(14px,1.6vw,17px)", color:C.muted, lineHeight:1.85, marginBottom:32, maxWidth:460 }}>
              Fey gives you institutional-grade tools, real-time earnings alerts, and AI-powered summaries — all in a beautiful interface built for serious investors.
            </motion.p>

            {/* Perks */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:8 }}>
              {PERKS.map(({ I, text }, i) => (
                <motion.div key={i} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.4+i*0.08 }}
                  style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:30, height:30, borderRadius:9, background:`${C.lime}12`, border:`1px solid ${C.lime}22`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <I size={13} color={C.lime} />
                  </div>
                  <span style={{ fontSize:14, color:C.muted }}>{text}</span>
                </motion.div>
              ))}
            </motion.div>

            <SocialProof />
          </div>

          {/* Right — Form */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <LeadForm />
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"0 24px 32px", borderTop:`1px solid ${C.border}` }}>
        <p style={{ fontSize:12, color:C.faint, marginTop:24 }}>
          © 2025 Fey Labs Inc. · By submitting you agree to our{" "}
          <a href="#" style={{ color:C.muted, textDecoration:"none" }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}