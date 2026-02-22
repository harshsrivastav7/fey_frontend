import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence, useInView } from "framer-motion";
import {
  Users, TrendingUp, TrendingDown, Target, Activity,
  ArrowUpRight, ArrowDownRight, RefreshCw, Trash2,
  Edit3, Search, Plus, Bell, Download, Eye,
  BarChart2, PieChart, Zap, CheckCircle, XCircle,
  Mail, Calendar, Filter, ChevronDown, Layers,
  Globe, Star, Clock, AlertCircle
} from "lucide-react";


/* ─── THEME — same as Fey ────────────────────────────────────────────────── */
const C = {
  lime:   "#c8f060",
  blue:   "#60a8f0",
  purple: "#a78bfa",
  orange: "#f97316",
  green:  "#4ade80",
  red:    "#f87171",
  bg:     "#060608",
  bg2:    "#0a0a0d",
  bg3:    "#0e0e12",
  border: "rgba(255,255,255,0.07)",
  text:   "#f0ede8",
  muted:  "#888",
  faint:  "#444",
};

/* ─── API BASE ───────────────────────────────────────────────────────────── */
const API = "https://fey-backend.onrender.com";

/* ─── GLOBAL CSS ─────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Cabinet+Grotesk:wght@300;400;500;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { overflow-x: hidden; }
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
  input, textarea, select { font-family: 'Cabinet Grotesk', sans-serif; }
  input::placeholder, textarea::placeholder { color: ${C.faint}; }

  @keyframes grain {
    0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
    20%{transform:translate(3%,2%)} 30%{transform:translate(-1%,4%)}
    40%{transform:translate(4%,-1%)} 50%{transform:translate(-3%,1%)}
  }
  .grain {
    position: fixed; inset: -50%; width: 200%; height: 200%;
    pointer-events: none; z-index: 9990; opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    animation: grain 0.4s steps(1) infinite;
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1); opacity: 0.7; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  .live-pulse::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: ${C.green};
    animation: pulse-ring 1.8s ease-out infinite;
  }
  @media (max-width: 768px) {
    .crm-sidebar { display: none !important; }
    .crm-main    { margin-left: 0 !important; max-width: 100vw !important; }
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
  const [big, setBig]     = useState(false);
  const [click, setClick] = useState(false);

  useEffect(() => {
    const m = e => { mx.set(e.clientX - 6); my.set(e.clientY - 6); tx.set(e.clientX - 18); ty.set(e.clientY - 18); };
    const o = e => setBig(!!e.target.closest("button,a,[data-hover]"));
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
      <motion.div style={{ x: mx, y: my, position: "fixed", top: 0, left: 0, width: 12, height: 12, borderRadius: "50%", background: C.lime, zIndex: 99999, pointerEvents: "none", mixBlendMode: "difference" }}
        animate={{ scale: click ? 0.5 : 1 }} transition={{ duration: 0.1 }} />
      <motion.div style={{ x: sx, y: sy, position: "fixed", top: 0, left: 0, width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.lime}`, zIndex: 99998, pointerEvents: "none", opacity: 0.4 }}
        animate={{ scale: big ? 2.2 : click ? 0.7 : 1 }} transition={{ duration: 0.2 }} />
    </>
  );
}

/* ─── ANIMATED COUNTER ───────────────────────────────────────────────────── */
function Counter({ to, prefix = "", suffix = "", duration = 1.6 }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    const step = to / (duration * 60);
    const id = setInterval(() => {
      s = Math.min(s + step, to);
      setV(Math.floor(s));
      if (s >= to) clearInterval(id);
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [inView, to]);
  return <span ref={ref}>{prefix}{v.toLocaleString()}{suffix}</span>;
}

/* ─── MINI SPARKLINE ─────────────────────────────────────────────────────── */
function Spark({ data, color = C.lime, w = 90, h = 28 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data), r = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / r) * (h - 4) - 2}`).join(" ");
  const id  = `sg${color.replace("#", "")}`;
  return (
    <svg width={w} height={h} style={{ overflow: "visible", flexShrink: 0 }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── DONUT CHART ────────────────────────────────────────────────────────── */
function Donut({ segments, size = 130, thickness = 14, centerLabel = "", centerSub = "" }) {
  const r     = size / 2 - thickness / 2;
  const circ  = 2 * Math.PI * r;
  const total = segments.reduce((a, b) => a + b.value, 0);
  let offset  = 0;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={thickness} />
        {segments.map((seg, i) => {
          const pct  = seg.value / total;
          const dash = pct * circ;
          const el   = (
            <motion.circle key={i}
              cx={size/2} cy={size/2} r={r}
              fill="none" stroke={seg.color} strokeWidth={thickness}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset * circ}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circ}` }}
              animate={{ strokeDasharray: `${dash} ${circ - dash}` }}
              transition={{ duration: 1.2, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
          );
          offset += pct;
          return el;
        })}
      </svg>
      {centerLabel && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="serif" style={{ fontSize: 20, color: C.lime, letterSpacing: "-0.04em" }}>{centerLabel}</div>
          <div style={{ fontSize: 9, color: C.faint, textTransform: "uppercase", letterSpacing: "0.08em" }}>{centerSub}</div>
        </div>
      )}
    </div>
  );
}

/* ─── BAR CHART ──────────────────────────────────────────────────────────── */
function BarChart({ data, labels, color = C.lime }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });
  const [prog, setProg] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = null, raf;
    const dur  = 1400;
    const tick = ts => {
      if (!start) start = ts;
      setProg(Math.min((ts - start) / dur, 1));
      if ((ts - start) < dur) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !data.length) return;
    const dpr  = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height;
    const padL = 40, padB = 28, padT = 12, padR = 12;
    const cW = W - padL - padR, cH = H - padT - padB;
    const max   = Math.max(...data) || 1;
    const barW  = (cW / data.length) * 0.5;
    const gap   = cW / data.length;

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i <= 4; i++) {
      const y = padT + (i / 4) * cH;
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle   = "rgba(255,255,255,0.2)";
      ctx.font        = "10px Cabinet Grotesk";
      ctx.textAlign   = "right";
      ctx.fillText(Math.round(max * (1 - i / 4)), padL - 5, y + 4);
    }

    data.forEach((v, i) => {
      const barH = (v / max) * cH * prog;
      const x    = padL + i * gap + (gap - barW) / 2;
      const y    = padT + cH - barH;
      const grad = ctx.createLinearGradient(0, y, 0, padT + cH);
      grad.addColorStop(0, `${color}ee`);
      grad.addColorStop(1, `${color}22`);
      if (ctx.roundRect) ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      else ctx.rect(x, y, barW, Math.max(barH, 0));
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.fillStyle   = "rgba(255,255,255,0.25)";
      ctx.font        = "9px Cabinet Grotesk";
      ctx.textAlign   = "center";
      ctx.fillText(labels[i] || "", x + barW / 2, padT + cH + 16);
    });
  }, [prog, data, labels, color]);

  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}

/* ─── STAT CARD ──────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, change, positive, spark, color = C.lime, delay = 0, prefix = "", suffix = "", raw }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, boxShadow: `0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px ${color}22` }}
      style={{ background: "rgba(10,10,14,0.7)", border: `1px solid ${C.border}`, borderRadius: 20, padding: "22px 22px 18px", backdropFilter: "blur(12px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle,${color}12 0%,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: `${color}14`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color={color} />
        </div>
        {change !== undefined && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: positive ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)", borderRadius: 100, padding: "3px 9px" }}>
            {positive ? <ArrowUpRight size={11} color={C.green} /> : <ArrowDownRight size={11} color={C.red} />}
            <span style={{ fontSize: 11, fontWeight: 700, color: positive ? C.green : C.red }}>{change}</span>
          </div>
        )}
      </div>
      <div className="serif" style={{ fontSize: "clamp(22px,2.5vw,32px)", letterSpacing: "-0.04em", color: C.text, marginBottom: 4 }}>
        {raw ? value : <Counter to={typeof value === "number" ? value : parseInt(value) || 0} prefix={prefix} suffix={suffix} />}
      </div>
      <div style={{ fontSize: 12, color: C.faint, fontWeight: 500, marginBottom: spark ? 12 : 0 }}>{label}</div>
      {spark && <Spark data={spark} color={color} w={100} h={24} />}
    </motion.div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────────────────── */
const NAV = [
  { I: BarChart2, label: "Overview",  id: "overview"  },
  { I: Users,     label: "Leads",     id: "leads"     },
  { I: Activity,  label: "Analytics", id: "analytics" },
];

function Sidebar({ active, setActive }) {
  return (
    <motion.aside className="crm-sidebar"
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0,   opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: 220, minHeight: "100vh", background: C.bg2, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "0 12px", position: "fixed", top: 0, left: 0, zIndex: 40 }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "22px 10px 28px", borderBottom: `1px solid ${C.border}` }}>
        <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}
          style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${C.lime},${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "serif", fontWeight: 700, fontSize: 14, color: "#000", flexShrink: 0 }}>F</motion.div>
        <span className="serif" style={{ fontSize: 18, color: C.text, letterSpacing: "-0.02em" }}>Fey CRM</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 16, display: "flex", flexDirection: "column", gap: 3 }}>
        {NAV.map(({ I, label, id }) => (
          <motion.button key={id} onClick={() => setActive(id)}
            whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, border: "none", cursor: "none", textAlign: "left", background: active === id ? "rgba(200,240,96,0.1)" : "transparent", width: "100%" }}>
            <I size={16} color={active === id ? C.lime : C.faint} />
            <span style={{ fontSize: 13, color: active === id ? C.lime : C.muted, fontWeight: active === id ? 700 : 500 }}>{label}</span>
            {active === id && <motion.div layoutId="pill" style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: C.lime }} />}
          </motion.button>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: "16px 10px 24px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C.lime}33,${C.blue}33)`, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.lime, flexShrink: 0 }}>HS</div>
          <div>
            <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>Harsh S.</div>
            <div style={{ fontSize: 10, color: C.faint }}>Admin</div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

/* ─── TOPBAR ─────────────────────────────────────────────────────────────── */
function Topbar({ title, subtitle, onRefresh, loading }) {
  return (
    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: `1px solid ${C.border}`, background: C.bg2, flexWrap: "wrap", gap: 12 }}>
      <div>
        <h1 className="serif" style={{ fontSize: "clamp(20px,2.5vw,28px)", letterSpacing: "-0.03em", color: C.text }}>{title}</h1>
        <p style={{ fontSize: 13, color: C.faint, marginTop: 2 }}>{subtitle}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 100, padding: "5px 12px" }}>
          <div style={{ position: "relative", width: 7, height: 7 }}>
            <div className="live-pulse" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.green }} />
          </div>
          <span style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>LIVE</span>
        </div>
        <motion.button whileHover={{ scale: 1.05, rotate: 180 }} whileTap={{ scale: 0.97 }} onClick={onRefresh}
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 10px", cursor: "none", color: C.muted }}>
          <motion.div animate={loading ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
            <RefreshCw size={15} />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── OVERVIEW TAB ───────────────────────────────────────────────────────── */
function OverviewTab({ leads }) {
  const total      = leads.length;
  const thisWeek   = leads.filter(l => {
    const d = new Date(l.createdAt);
    const now = new Date();
    return (now - d) < 7 * 24 * 60 * 60 * 1000;
  }).length;
  const today      = leads.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length;

  // Interest breakdown
  const interestMap = {};
  leads.forEach(l => { if (l.interest) interestMap[l.interest] = (interestMap[l.interest] || 0) + 1; });
  const interests = Object.entries(interestMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Leads per day (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return {
      label: d.toLocaleDateString("en", { weekday: "short" }),
      count: leads.filter(l => new Date(l.createdAt).toDateString() === d.toDateString()).length,
    };
  });

  const DONUT_COLORS = [C.lime, C.blue, C.purple, C.orange, C.green];

  const STATS = [
    { icon: Users,      label: "Total Leads",    value: total,    change: "+100%", positive: true,  color: C.lime,   spark: last7.map(d => d.count || 0) },
    { icon: TrendingUp, label: "This Week",       value: thisWeek, change: "+12%",  positive: true,  color: C.blue,   spark: last7.map(d => d.count) },
    { icon: Zap,        label: "Today",           value: today,    color: C.green },
    { icon: Target,     label: "Unique Interests",value: interests.length, color: C.purple },
  ];

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(180px,100%),1fr))", gap: 16 }}>
        {STATS.map((s, i) => <StatCard key={i} {...s} delay={i * 0.08} />)}
      </div>

      {/* Bar + Donut */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(min(260px,100%),300px)", gap: 16 }}>

        {/* Bar chart — leads per day */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          style={{ background: "rgba(10,10,14,0.7)", border: `1px solid ${C.border}`, borderRadius: 20, padding: "24px", backdropFilter: "blur(12px)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>Leads Per Day</div>
          <div style={{ fontSize: 12, color: C.faint, marginBottom: 20 }}>Last 7 days</div>
          <div style={{ width: "100%", height: "clamp(130px,18vw,190px)" }}>
            <BarChart data={last7.map(d => d.count)} labels={last7.map(d => d.label)} color={C.lime} />
          </div>
        </motion.div>

        {/* Donut — interest breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
          style={{ background: "rgba(10,10,14,0.7)", border: `1px solid ${C.border}`, borderRadius: 20, padding: "24px", backdropFilter: "blur(12px)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>Interest Breakdown</div>
          <div style={{ fontSize: 12, color: C.faint, marginBottom: 20 }}>By category</div>

          {interests.length > 0 ? (
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <Donut
                  segments={interests.map((item, i) => ({ value: item[1], color: DONUT_COLORS[i % DONUT_COLORS.length] }))}
                  size={120} thickness={13}
                  centerLabel={total.toString()} centerSub="total"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {interests.map(([name, count], i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: DONUT_COLORS[i % DONUT_COLORS.length], flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: C.muted, textTransform: "capitalize" }}>{name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0", color: C.faint, fontSize: 13 }}>No interest data yet</div>
          )}
        </motion.div>
      </div>

      {/* Recent leads */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
        style={{ background: "rgba(10,10,14,0.7)", border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden", backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Recent Leads</div>
          <span style={{ fontSize: 12, color: C.faint }}>{leads.slice(0, 5).length} of {total}</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Name", "Email", "Organization", "Interest", "Date"].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, color: C.faint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {leads.slice(0, 5).map((l, i) => (
                <motion.tr key={l._id} whileHover={{ background: "rgba(255,255,255,0.02)" }}
                  style={{ borderBottom: i < 4 ? `1px solid rgba(255,255,255,0.04)` : "none" }}>
                  <td style={{ padding: "13px 20px", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${C.lime}18`, border: `1px solid ${C.lime}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.lime, flexShrink: 0 }}>
                        {l.name?.slice(0, 2).toUpperCase() || "?"}
                      </div>
                      <span style={{ color: C.text, fontWeight: 500 }}>{l.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 20px", color: C.muted, whiteSpace: "nowrap" }}>{l.email}</td>
                  <td style={{ padding: "13px 20px", color: C.muted, whiteSpace: "nowrap" }}>{l.organization || "—"}</td>
                  <td style={{ padding: "13px 20px", whiteSpace: "nowrap" }}>
                    {l.interest ? <span style={{ background: `${C.lime}14`, border: `1px solid ${C.lime}28`, borderRadius: 100, padding: "2px 10px", fontSize: 11, color: C.lime, fontWeight: 600, textTransform: "capitalize" }}>{l.interest}</span> : <span style={{ color: C.faint }}>—</span>}
                  </td>
                  <td style={{ padding: "13px 20px", color: C.faint, whiteSpace: "nowrap", fontSize: 12 }}>
                    {new Date(l.createdAt).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </motion.tr>
              ))}
              {leads.length === 0 && (
                <tr><td colSpan={5} style={{ padding: "32px", textAlign: "center", color: C.faint }}>No leads yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── LEADS TAB ──────────────────────────────────────────────────────────── */
function LeadsTab({ leads, onDelete, onRefresh }) {
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");
  const [editId,   setEditId]   = useState(null);
  const [editData, setEditData] = useState({});
  const [saving,   setSaving]   = useState(false);

  const INTERESTS = ["all", ...Array.from(new Set(leads.map(l => l.interest).filter(Boolean)))];

  const filtered = leads.filter(l => {
    const matchSearch = l.name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase()) || l.organization?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || l.interest === filter;
    return matchSearch && matchFilter;
  });

  const handleEdit = (lead) => {
    setEditId(lead._id);
    setEditData({ name: lead.name, email: lead.email, organization: lead.organization, interest: lead.interest });
  };

  const handleSave = async (id) => {
    setSaving(true);
    try {
      await fetch(`${API}/api/leads/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(editData),
      });
      setEditId(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  return (
    <div style={{ padding: "28px 32px" }}>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "rgba(10,10,14,0.7)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 14px", minWidth: 200 }}>
          <Search size={14} color={C.faint} style={{ flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: C.text, minWidth: 0 }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {INTERESTS.slice(0, 6).map(int => (
            <motion.button key={int} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setFilter(int)}
              style={{ padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, border: "none", cursor: "none", background: filter === int ? C.lime : "rgba(255,255,255,0.05)", color: filter === int ? "#000" : C.muted, textTransform: "capitalize", whiteSpace: "nowrap" }}>
              {int}
            </motion.button>
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onRefresh}
          style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 16px", fontSize: 13, color: C.muted, cursor: "none", whiteSpace: "nowrap" }}>
          <Download size={14} /> Export
        </motion.button>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ background: "rgba(10,10,14,0.7)", border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden", backdropFilter: "blur(12px)" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: C.faint }}>{filtered.length} leads found</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Name", "Email", "Organization", "Interest", "Date", "Actions"].map(h => (
                <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 11, color: C.faint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: C.faint }}>No leads found</td></tr>
              ) : filtered.map((l, i) => (
                <AnimatePresence key={l._id}>
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ background: "rgba(255,255,255,0.02)" }}
                    style={{ borderBottom: i < filtered.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none" }}>

                    {editId === l._id ? (
                      // Edit row
                      <>
                        {["name", "email", "organization", "interest"].map(field => (
                          <td key={field} style={{ padding: "8px 12px" }}>
                            <input value={editData[field] || ""} onChange={e => setEditData(p => ({ ...p, [field]: e.target.value }))}
                              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid rgba(200,240,96,0.3)`, borderRadius: 8, padding: "7px 10px", fontSize: 12, color: C.text, outline: "none", width: "100%", minWidth: 80 }} />
                          </td>
                        ))}
                        <td style={{ padding: "8px 12px", whiteSpace: "nowrap" }}>—</td>
                        <td style={{ padding: "8px 12px", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleSave(l._id)}
                              style={{ background: C.lime, border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "#000", cursor: "none" }}>
                              {saving ? "…" : "Save"}
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => setEditId(null)}
                              style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px", fontSize: 11, color: C.muted, cursor: "none" }}>
                              Cancel
                            </motion.button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // Normal row
                      <>
                        <td style={{ padding: "13px 20px", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${C.lime}18`, border: `1px solid ${C.lime}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.lime, flexShrink: 0 }}>
                              {l.name?.slice(0, 2).toUpperCase() || "?"}
                            </div>
                            <span style={{ color: C.text, fontWeight: 500 }}>{l.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "13px 20px", color: C.muted, whiteSpace: "nowrap" }}>{l.email}</td>
                        <td style={{ padding: "13px 20px", color: C.muted, whiteSpace: "nowrap" }}>{l.organization || "—"}</td>
                        <td style={{ padding: "13px 20px", whiteSpace: "nowrap" }}>
                          {l.interest
                            ? <span style={{ background: `${C.lime}14`, border: `1px solid ${C.lime}28`, borderRadius: 100, padding: "2px 10px", fontSize: 11, color: C.lime, fontWeight: 600, textTransform: "capitalize" }}>{l.interest}</span>
                            : <span style={{ color: C.faint }}>—</span>}
                        </td>
                        <td style={{ padding: "13px 20px", color: C.faint, fontSize: 12, whiteSpace: "nowrap" }}>
                          {new Date(l.createdAt).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td style={{ padding: "13px 20px", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <motion.button whileHover={{ scale: 1.2, color: C.lime }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(l)}
                              style={{ background: "none", border: "none", cursor: "none", color: C.faint }}><Edit3 size={14} /></motion.button>
                            <motion.button whileHover={{ scale: 1.2, color: C.red }} whileTap={{ scale: 0.9 }} onClick={() => onDelete(l._id)}
                              style={{ background: "none", border: "none", cursor: "none", color: C.faint }}><Trash2 size={14} /></motion.button>
                          </div>
                        </td>
                      </>
                    )}
                  </motion.tr>
                </AnimatePresence>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── ANALYTICS TAB ──────────────────────────────────────────────────────── */
function AnalyticsTab({ leads }) {

  // Leads per day — last 14 days
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    return {
      label: d.toLocaleDateString("en", { day: "numeric", month: "short" }),
      count: leads.filter(l => new Date(l.createdAt).toDateString() === d.toDateString()).length,
    };
  });

  // Interest breakdown
  const interestMap = {};
  leads.forEach(l => { if (l.interest) interestMap[l.interest] = (interestMap[l.interest] || 0) + 1; });
  const interests    = Object.entries(interestMap).sort((a, b) => b[1] - a[1]);
  const DONUT_COLORS = [C.lime, C.blue, C.purple, C.orange, C.green, C.red];

  // Organization breakdown
  const orgMap = {};
  leads.forEach(l => { if (l.organization) orgMap[l.organization] = (orgMap[l.organization] || 0) + 1; });
  const orgs = Object.entries(orgMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Growth rate
  const thisWeek = leads.filter(l => (new Date() - new Date(l.createdAt)) < 7 * 86400000).length;
  const lastWeek = leads.filter(l => {
    const diff = new Date() - new Date(l.createdAt);
    return diff >= 7 * 86400000 && diff < 14 * 86400000;
  }).length;
  const growthRate = lastWeek > 0 ? (((thisWeek - lastWeek) / lastWeek) * 100).toFixed(1) : 100;

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Top stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(180px,100%),1fr))", gap: 16 }}>
        <StatCard icon={TrendingUp}  label="Growth Rate (WoW)"  value={`${growthRate}%`} raw positive={growthRate >= 0} change={`${Math.abs(growthRate)}%`} color={C.lime}   delay={0}    />
        <StatCard icon={Users}       label="Total Leads"         value={leads.length}      positive change="all time"         color={C.blue}  delay={0.08} />
        <StatCard icon={Target}      label="This Week"           value={thisWeek}           positive change={`vs ${lastWeek} last wk`} color={C.purple} delay={0.16} />
        <StatCard icon={Activity}    label="Unique Orgs"         value={Object.keys(orgMap).length} color={C.orange} delay={0.24} />
      </div>

      {/* 14-day chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
        style={{ background: "rgba(10,10,14,0.7)", border: `1px solid ${C.border}`, borderRadius: 20, padding: "24px", backdropFilter: "blur(12px)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>Lead Acquisition — 14 Days</div>
        <div style={{ fontSize: 12, color: C.faint, marginBottom: 20 }}>Daily new leads from your backend</div>
        <div style={{ width: "100%", height: "clamp(130px,18vw,200px)" }}>
          <BarChart data={last14.map(d => d.count)} labels={last14.map(d => d.label)} color={C.lime} />
        </div>
      </motion.div>

      {/* Interest + Org row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Interest donut */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          style={{ background: "rgba(10,10,14,0.7)", border: `1px solid ${C.border}`, borderRadius: 20, padding: "24px", backdropFilter: "blur(12px)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>Interest Categories</div>
          <div style={{ fontSize: 12, color: C.faint, marginBottom: 20 }}>What your leads care about</div>
          {interests.length > 0 ? (
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <Donut segments={interests.map((item, i) => ({ value: item[1], color: DONUT_COLORS[i % DONUT_COLORS.length] }))}
                  size={120} thickness={13} centerLabel={leads.length.toString()} centerSub="leads" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {interests.map(([name, count], i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: DONUT_COLORS[i % DONUT_COLORS.length], flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: C.muted, textTransform: "capitalize", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <div style={{ width: 50, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(count / leads.length) * 100}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                          style={{ height: "100%", background: DONUT_COLORS[i % DONUT_COLORS.length], borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "30px 0", color: C.faint, fontSize: 13 }}>No interest data yet</div>
          )}
        </motion.div>

        {/* Top Organizations */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
          style={{ background: "rgba(10,10,14,0.7)", border: `1px solid ${C.border}`, borderRadius: 20, padding: "24px", backdropFilter: "blur(12px)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>Top Organizations</div>
          <div style={{ fontSize: 12, color: C.faint, marginBottom: 20 }}>Where your leads come from</div>
          {orgs.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {orgs.map(([org, count], i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{org}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text, flexShrink: 0 }}>{count} leads</span>
                  </div>
                  <div style={{ width: "100%", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(count / (orgs[0]?.[1] || 1)) * 100}%` }}
                      transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: "100%", background: `linear-gradient(90deg, ${C.lime}, ${C.blue})`, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "30px 0", color: C.faint, fontSize: 13 }}>No organization data yet</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── MAIN APP ───────────────────────────────────────────────────────────── */
export default function CrmDashboard() {
  const [active,  setActive]  = useState("overview");
  const [leads,   setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API}/api/leads`);
      const json = await res.json();
      // Handle both { data: [] } and direct [] response
      setLeads(Array.isArray(json) ? json : json.data || []);
    } catch (err) {
      setError("Cannot connect to backend. Make sure server is running on port 3001.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const s = document.createElement("style");
    s.innerHTML = GLOBAL_CSS;
    document.head.prepend(s);
    return () => { try { document.head.removeChild(s); } catch(e){} };
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // Auto-refresh every 30s
  useEffect(() => {
    const id = setInterval(fetchLeads, 30000);
    return () => clearInterval(id);
  }, [fetchLeads]);

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/api/leads/${id}`, { method: "DELETE" });
      setLeads(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const TITLES = {
    overview:  { title: "Overview",  subtitle: "Your CRM at a glance — live from MongoDB" },
    leads:     { title: "Leads",     subtitle: "All leads from your Node.js backend"       },
    analytics: { title: "Analytics", subtitle: "Deep dive into lead acquisition trends"    },
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, color: C.text, overflowX: "hidden" }}>
      <div className="grain" />
      <Cursor />
      <Sidebar active={active} setActive={setActive} />

      <div className="crm-main" style={{ flex: 1, marginLeft: 220, minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: "calc(100vw - 220px)", overflowX: "hidden" }}>
        <Topbar {...TITLES[active]} onRefresh={fetchLeads} loading={loading} />

        {/* Error state */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ margin: "16px 32px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <AlertCircle size={16} color={C.red} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: C.red }}>{error}</span>
          </motion.div>
        )}

        {/* Loading state */}
        {loading && !error && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px", flexDirection: "column", gap: 16 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <RefreshCw size={24} color={C.lime} />
            </motion.div>
            <span style={{ fontSize: 13, color: C.faint }}>Loading leads from MongoDB…</span>
          </div>
        )}

        {/* Views */}
        {!loading && !error && (
          <div style={{ flex: 1, overflowY: "auto" }}>
            <AnimatePresence mode="wait">
              <motion.div key={active}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}>
                {active === "overview"  && <OverviewTab  leads={leads} />}
                {active === "leads"     && <LeadsTab     leads={leads} onDelete={handleDelete} onRefresh={fetchLeads} />}
                {active === "analytics" && <AnalyticsTab leads={leads} />}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}