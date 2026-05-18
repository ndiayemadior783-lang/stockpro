import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const CATEGORIES = ["Tous", "Électronique", "Accessoires", "Câbles", "Stockage"];
const LOCATIONS = ["A1-01", "A1-02", "A1-03", "A2-01", "B2-01", "B2-02", "C3-01", "C3-02"];
const MOVE_TYPES = { entrée: "#22c55e", sortie: "#ef4444", ajustement: "#f59e0b", transfert: "#6366f1" };

const USERS = [
  { email: "admin@stockpro.com", password: "Admin2026!", name: "Administrateur", role: "admin" },
  { email: "gestionnaire@stockpro.com", password: "Gest2026!", name: "Marie Dupont", role: "gestionnaire" },
  { email: "lecteur@stockpro.com", password: "Lect2026!", name: "Jean Martin", role: "lecteur" },
];

// ─── ICÔNES ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    inventory: <><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></>,
    movement: <><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    close: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    report: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    trending_up: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    box: <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
    user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    refresh: <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ─── PAGE LOGIN ───────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 600));
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError("Email ou mot de passe incorrect.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0",
    fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#f8fafc"
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: "min(420px, 95vw)", background: "#fff", borderRadius: 20, padding: 40, boxShadow: "0 32px 80px rgba(0,0,0,.4)" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #6366f1, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#fff" }}>
            <Icon name="box" size={28} />
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#0f172a" }}>StockPro</h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#64748b" }}>Gestion de stock intelligente</p>
        </div>

        {/* Formulaire */}
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".5px" }}>Email</label>
            <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".5px" }}>Mot de passe</label>
            <div style={{ position: "relative" }}>
              <input style={{ ...inputStyle, paddingRight: 44 }} type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
              <button onClick={() => setShowPwd(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <Icon name="eye" size={16} />
              </button>
            </div>
          </div>

          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#ef4444", fontWeight: 600 }}>⚠ {error}</div>}

          <button onClick={handleLogin} disabled={loading}
            style={{ padding: "13px", borderRadius: 10, border: "none", background: loading ? "#94a3b8" : "linear-gradient(135deg, #6366f1, #0ea5e9)", color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 15, marginTop: 4 }}>
            {loading ? "Connexion..." : "Se connecter →"}
          </button>
        </div>

        {/* Comptes de démo */}
        <div style={{ marginTop: 28, padding: 16, background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
          <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".5px" }}>Comptes de démonstration</p>
          {USERS.map(u => (
            <button key={u.email} onClick={() => { setEmail(u.email); setPassword(u.password); }}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", marginBottom: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", fontSize: 12, color: "#475569" }}>
              <span style={{ fontWeight: 700, color: u.role === "admin" ? "#6366f1" : u.role === "gestionnaire" ? "#0ea5e9" : "#22c55e" }}>
                {u.role.toUpperCase()}
              </span> — {u.email}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── COMPOSANTS RÉUTILISABLES ─────────────────────────────────────────────────
const Badge = ({ type }) => {
  const config = {
    entrée: { bg: "#dcfce7", color: "#15803d", label: "↑ Entrée" },
    sortie: { bg: "#fee2e2", color: "#b91c1c", label: "↓ Sortie" },
    ajustement: { bg: "#fef9c3", color: "#b45309", label: "⟳ Ajust." },
    transfert: { bg: "#ede9fe", color: "#5b21b6", label: "⇄ Transfert" },
  };
  const c = config[type] || config.ajustement;
  return <span style={{ background: c.bg, color: c.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{c.label}</span>;
};

const StockBar = ({ quantity, minStock }) => {
  const pct = Math.min((quantity / Math.max(minStock * 3, 1)) * 100, 100);
  const color = quantity <= minStock ? "#ef4444" : quantity <= minStock * 1.5 ? "#f59e0b" : "#22c55e";
  return (
    <div style={{ width: "100%", background: "#f1f5f9", borderRadius: 4, height: 6 }}>
      <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 4, transition: "width .4s" }} />
    </div>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ background: "#fff", borderRadius: 16, width: "min(540px,95vw)", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #e2e8f0" }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><Icon name="close" /></button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

// ─── EXPORT CSV ───────────────────────────────────────────────────────────────
const exportCSV = (data, filename, headers) => {
  const rows = [headers.join(";"), ...data.map(row => headers.map(h => row[h] ?? "").join(";"))];
  const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

// ─── FORMULAIRE PRODUIT ───────────────────────────────────────────────────────
const ProductForm = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState(product || { sku: "", name: "", category: "Électronique", quantity: 0, min_stock: 5, unit_price: 0, location: "A1-01", unit: "pcs" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: ".5px" };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label style={labelStyle}>SKU *</label><input style={inputStyle} value={form.sku} onChange={e => set("sku", e.target.value)} placeholder="PRD-XXX" /></div>
        <div><label style={labelStyle}>Unité</label>
          <select style={inputStyle} value={form.unit} onChange={e => set("unit", e.target.value)}>
            {["pcs", "kg", "L", "m", "boîte"].map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div><label style={labelStyle}>Nom du produit *</label><input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label style={labelStyle}>Catégorie</label>
          <select style={inputStyle} value={form.category} onChange={e => set("category", e.target.value)}>
            {CATEGORIES.filter(c => c !== "Tous").map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label style={labelStyle}>Emplacement</label>
          <select style={inputStyle} value={form.location} onChange={e => set("location", e.target.value)}>
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div><label style={labelStyle}>Quantité</label><input style={inputStyle} type="number" value={form.quantity} onChange={e => set("quantity", +e.target.value)} /></div>
        <div><label style={labelStyle}>Stock min</label><input style={inputStyle} type="number" value={form.min_stock} onChange={e => set("min_stock", +e.target.value)} /></div>
        <div><label style={labelStyle}>Prix (€)</label><input style={inputStyle} type="number" step="0.01" value={form.unit_price} onChange={e => set("unit_price", +e.target.value)} /></div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8 }}>
        <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#475569" }}>Annuler</button>
        <button onClick={() => onSave(form)} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#0f172a", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Enregistrer</button>
      </div>
    </div>
  );
};

// ─── FORMULAIRE MOUVEMENT ─────────────────────────────────────────────────────
const MovementForm = ({ products, currentUser, onSave, onClose }) => {
  const [form, setForm] = useState({ type: "entrée", productId: products[0]?.id || 1, quantity: 1, reference: "", note: "", user_name: currentUser.name });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: ".5px" };
  const typeColors = { entrée: "#22c55e", sortie: "#ef4444", ajustement: "#f59e0b", transfert: "#6366f1" };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <label style={labelStyle}>Type de mouvement</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.keys(MOVE_TYPES).map(t => (
            <button key={t} onClick={() => set("type", t)}
              style={{ padding: "10px", borderRadius: 8, border: `2px solid ${form.type === t ? typeColors[t] : "#e2e8f0"}`, background: form.type === t ? typeColors[t] + "18" : "#fff", cursor: "pointer", fontWeight: 600, color: form.type === t ? typeColors[t] : "#475569", textTransform: "capitalize" }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div><label style={labelStyle}>Produit *</label>
        <select style={inputStyle} value={form.productId} onChange={e => set("productId", +e.target.value)}>
          {products.map(p => <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>)}
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label style={labelStyle}>Quantité *</label><input style={inputStyle} type="number" min="1" value={form.quantity} onChange={e => set("quantity", +e.target.value)} /></div>
        <div><label style={labelStyle}>Référence</label><input style={inputStyle} value={form.reference} onChange={e => set("reference", e.target.value)} placeholder="BON-2026-XXX" /></div>
      </div>
      <div><label style={labelStyle}>Note</label><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 72 }} value={form.note} onChange={e => set("note", e.target.value)} /></div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8 }}>
        <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#475569" }}>Annuler</button>
        <button onClick={() => onSave(form)} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#0f172a", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Enregistrer</button>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ products, movements, onPage }) => {
  const totalValue = products.reduce((s, p) => s + p.quantity * p.unit_price, 0);
  const alerts = products.filter(p => p.quantity <= p.min_stock);
  const totalItems = products.reduce((s, p) => s + p.quantity, 0);
  const today = new Date().toISOString().slice(0, 10);
  const todayMoves = movements.filter(m => m.created_at?.startsWith(today)).length;

  const statCard = (label, value, sub, color, icon) => (
    <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,.07)", border: "1px solid #f1f5f9", display: "flex", gap: 16, alignItems: "center" }}>
      <div style={{ width: 52, height: 52, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
        <Icon name={icon} size={22} />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{value}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    return { day: d.getDate(), count: movements.filter(m => m.created_at?.startsWith(key)).length };
  });
  const maxCount = Math.max(...last7.map(d => d.count), 1);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {statCard("Produits référencés", products.length, `${totalItems} unités en stock`, "#6366f1", "box")}
        {statCard("Valeur totale stock", `${totalValue.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`, "Valorisation", "#0ea5e9", "trending_up")}
        {statCard("Alertes stock faible", alerts.length, alerts.length > 0 ? "À réapprovisionner" : "Tout est OK ✓", alerts.length > 0 ? "#ef4444" : "#22c55e", "alert")}
        {statCard("Mouvements aujourd'hui", todayMoves, "Opérations du jour", "#f59e0b", "movement")}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,.07)", border: "1px solid #f1f5f9" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700 }}>Activité des 7 derniers jours</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
            {last7.map(({ day, count }) => (
              <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>{count}</span>
                <div style={{ width: "100%", height: `${(count / maxCount) * 110}px`, background: count > 0 ? "#6366f1" : "#e2e8f0", borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                <span style={{ fontSize: 10, color: "#94a3b8" }}>{day}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,.07)", border: "1px solid #f1f5f9" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>⚠ Stock critique</h3>
          {alerts.length === 0
            ? <div style={{ textAlign: "center", padding: "20px 0", color: "#22c55e" }}><Icon name="check" size={32} /><p style={{ margin: "8px 0 0", fontSize: 13, fontWeight: 600 }}>Aucune alerte</p></div>
            : alerts.slice(0, 5).map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{p.sku}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#ef4444" }}>{p.quantity}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>min: {p.min_stock}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,.07)", border: "1px solid #f1f5f9" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Derniers mouvements</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Date", "Type", "Produit", "Qté", "Référence", "Utilisateur"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {movements.slice(-5).reverse().map(m => (
              <tr key={m.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569" }}>{m.created_at?.slice(0, 16).replace("T", " ")}</td>
                <td style={{ padding: "12px 14px" }}><Badge type={m.type} /></td>
                <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600 }}>{m.product_name}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 700, color: m.type === "sortie" ? "#ef4444" : "#22c55e" }}>{m.type === "sortie" ? "-" : "+"}{Math.abs(m.quantity)}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "#6366f1", fontWeight: 600 }}>{m.reference || "—"}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#475569" }}>{m.user_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── INVENTAIRE ───────────────────────────────────────────────────────────────
const Inventory = ({ products, movements, currentUser, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Tous");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const canEdit = currentUser.role !== "lecteur";

  const filtered = products.filter(p =>
    (cat === "Tous" || p.category === cat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSaveProduct = async (form) => {
    setSaving(true);
    if (modal === "add") {
      await supabase.from("products").insert([{ sku: form.sku, name: form.name, category: form.category, quantity: form.quantity, min_stock: form.min_stock, unit_price: form.unit_price, location: form.location, unit: form.unit }]);
    } else {
      await supabase.from("products").update({ sku: form.sku, name: form.name, category: form.category, quantity: form.quantity, min_stock: form.min_stock, unit_price: form.unit_price, location: form.location, unit: form.unit }).eq("id", selected.id);
    }
    await onRefresh();
    setSaving(false);
    setModal(null);
  };

  const handleDelete = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    await onRefresh();
    setConfirm(null);
  };

  const handleSaveMove = async (form) => {
    setSaving(true);
    const prod = products.find(p => p.id === form.productId);
    const delta = form.type === "sortie" ? -form.quantity : form.quantity;
    await supabase.from("products").update({ quantity: prod.quantity + delta }).eq("id", form.productId);
    await supabase.from("movements").insert([{ product_id: form.productId, product_name: prod.name, type: form.type, quantity: form.quantity, reference: form.reference, user_name: form.user_name, note: form.note }]);
    await onRefresh();
    setSaving(false);
    setModal(null);
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}><Icon name="search" size={16} /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            style={{ width: "100%", padding: "10px 12px 10px 38px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${cat === c ? "#0f172a" : "#e2e8f0"}`, background: cat === c ? "#0f172a" : "#fff", color: cat === c ? "#fff" : "#475569", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => exportCSV(filtered, "inventaire.csv", ["sku", "name", "category", "quantity", "min_stock", "unit_price", "location", "unit"])}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#475569" }}>
          <Icon name="download" size={16} /> Export CSV
        </button>
        {canEdit && <>
          <button onClick={() => { setSelected(null); setModal("move"); }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: "none", background: "#6366f1", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
            <Icon name="movement" size={16} /> Mouvement
          </button>
          <button onClick={() => { setSelected(null); setModal("add"); }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: "none", background: "#0f172a", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
            <Icon name="plus" size={16} /> Nouveau produit
          </button>
        </>}
      </div>

      <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,.07)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["SKU", "Produit", "Catégorie", "Stock", "Progression", "Min", "Prix unit.", "Valeur", "Emplac.", ...(canEdit ? ["Actions"] : [])].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const low = p.quantity <= p.min_stock;
                return (
                  <tr key={p.id} style={{ borderTop: "1px solid #f1f5f9", background: low ? "#fff5f5" : "#fff" }}>
                    <td style={{ padding: "13px 14px", fontSize: 12, fontWeight: 700, color: "#6366f1" }}>{p.sku}</td>
                    <td style={{ padding: "13px 14px", fontSize: 14, fontWeight: 700 }}>{p.name}</td>
                    <td style={{ padding: "13px 14px" }}><span style={{ background: "#f1f5f9", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#475569" }}>{p.category}</span></td>
                    <td style={{ padding: "13px 14px" }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: low ? "#ef4444" : "#0f172a" }}>{p.quantity}</span>
                      <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 4 }}>{p.unit}</span>
                      {low && <span style={{ marginLeft: 6, fontSize: 10, background: "#fef2f2", color: "#ef4444", padding: "2px 6px", borderRadius: 10, fontWeight: 700 }}>⚠ BAS</span>}
                    </td>
                    <td style={{ padding: "13px 14px", minWidth: 90 }}><StockBar quantity={p.quantity} minStock={p.min_stock} /></td>
                    <td style={{ padding: "13px 14px", fontSize: 13, color: "#64748b" }}>{p.min_stock}</td>
                    <td style={{ padding: "13px 14px", fontSize: 13, fontWeight: 600 }}>{p.unit_price?.toFixed(2)} €</td>
                    <td style={{ padding: "13px 14px", fontSize: 13, fontWeight: 700, color: "#0ea5e9" }}>{(p.quantity * p.unit_price).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €</td>
                    <td style={{ padding: "13px 14px" }}><span style={{ background: "#ede9fe", color: "#5b21b6", padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{p.location}</span></td>
                    {canEdit && <td style={{ padding: "13px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => { setSelected(p); setModal("edit"); }} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "6px", cursor: "pointer", color: "#475569" }}><Icon name="edit" size={14} /></button>
                        <button onClick={() => setConfirm(p.id)} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "6px", cursor: "pointer", color: "#ef4444" }}><Icon name="trash" size={14} /></button>
                      </div>
                    </td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", fontSize: 12, color: "#64748b", display: "flex", justifyContent: "space-between" }}>
          <span>{filtered.length} produit(s)</span>
          <span>Valeur : <strong style={{ color: "#0f172a" }}>{filtered.reduce((s, p) => s + p.quantity * p.unit_price, 0).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €</strong></span>
        </div>
      </div>

      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Nouveau produit" : "Modifier produit"} onClose={() => setModal(null)}>
          <ProductForm product={selected} onSave={handleSaveProduct} onClose={() => setModal(null)} />
          {saving && <p style={{ textAlign: "center", color: "#6366f1" }}>Sauvegarde...</p>}
        </Modal>
      )}
      {modal === "move" && (
        <Modal title="Saisir un mouvement" onClose={() => setModal(null)}>
          <MovementForm products={products} currentUser={currentUser} onSave={handleSaveMove} onClose={() => setModal(null)} />
          {saving && <p style={{ textAlign: "center", color: "#6366f1" }}>Sauvegarde...</p>}
        </Modal>
      )}
      {confirm && (
        <Modal title="Confirmer la suppression" onClose={() => setConfirm(null)}>
          <p style={{ color: "#475569", marginTop: 0 }}>Cette action est irréversible.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setConfirm(null)} style={{ padding: "10px 20px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#475569" }}>Annuler</button>
            <button onClick={() => handleDelete(confirm)} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Supprimer</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── MOUVEMENTS ───────────────────────────────────────────────────────────────
const Movements = ({ movements, products }) => {
  const [filter, setFilter] = useState("tous");
  const [search, setSearch] = useState("");

  const filtered = movements.filter(m =>
    (filter === "tous" || m.type === filter) &&
    (m.product_name?.toLowerCase().includes(search.toLowerCase()) || m.reference?.toLowerCase().includes(search.toLowerCase()))
  ).slice().reverse();

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}><Icon name="search" size={16} /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Produit, référence..."
            style={{ width: "100%", padding: "10px 12px 10px 38px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        {["tous", ...Object.keys(MOVE_TYPES)].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${filter === t ? "#0f172a" : "#e2e8f0"}`, background: filter === t ? "#0f172a" : "#fff", color: filter === t ? "#fff" : "#475569", cursor: "pointer", fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
        <button onClick={() => exportCSV(filtered, "mouvements.csv", ["created_at", "type", "product_name", "quantity", "reference", "user_name", "note"])}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#475569" }}>
          <Icon name="download" size={16} /> Export CSV
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,.07)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Date", "Type", "Produit", "Qté", "Référence", "Utilisateur", "Note"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: "#475569", whiteSpace: "nowrap" }}>{m.created_at?.slice(0, 16).replace("T", " ")}</td>
                  <td style={{ padding: "12px 14px" }}><Badge type={m.type} /></td>
                  <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 700 }}>{m.product_name}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: m.type === "sortie" ? "#ef4444" : "#22c55e" }}>
                      {m.type === "sortie" ? "−" : "+"}{m.quantity}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 700, color: "#6366f1" }}>{m.reference || "—"}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: "#475569" }}>{m.user_name}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: "#94a3b8", maxWidth: 200 }}>{m.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", fontSize: 12, color: "#64748b" }}>
          {filtered.length} mouvement(s) · Traçabilité complète
        </div>
      </div>
    </div>
  );
};

// ─── RAPPORTS ─────────────────────────────────────────────────────────────────
const Reports = ({ products, movements }) => {
  const totalValue = products.reduce((s, p) => s + p.quantity * p.unit_price, 0);
  const byCategory = [...new Set(products.map(p => p.category))].map(c => {
    const ps = products.filter(p => p.category === c);
    return { category: c, count: ps.length, total: ps.reduce((s, p) => s + p.quantity, 0), value: ps.reduce((s, p) => s + p.quantity * p.unit_price, 0) };
  });
  const maxValue = Math.max(...byCategory.map(c => c.value), 1);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,.07)", border: "1px solid #f1f5f9" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700 }}>Valeur par catégorie</h3>
          {byCategory.map(({ category, count, total, value }) => (
            <div key={category} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{category}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#0ea5e9" }}>{value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €</span>
              </div>
              <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4 }}>
                <div style={{ height: "100%", width: `${(value / maxValue) * 100}%`, background: "linear-gradient(90deg, #6366f1, #0ea5e9)", borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{count} réf. · {total} unités</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,.07)", border: "1px solid #f1f5f9" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700 }}>Résumé financier</h3>
          {[
            { label: "Valeur totale stock", value: `${totalValue.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`, color: "#0ea5e9" },
            { label: "Produits en alerte", value: `${products.filter(p => p.quantity <= p.min_stock).length} / ${products.length}`, color: "#ef4444" },
            { label: "Total mouvements", value: movements.length, color: "#22c55e" },
            { label: "Entrées (valeur)", value: `${movements.filter(m => m.type === "entrée").reduce((s, m) => { const p = products.find(x => x.id === m.product_id); return s + m.quantity * (p?.unit_price || 0); }, 0).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`, color: "#22c55e" },
            { label: "Sorties (valeur)", value: `${movements.filter(m => m.type === "sortie").reduce((s, m) => { const p = products.find(x => x.id === m.product_id); return s + m.quantity * (p?.unit_price || 0); }, 0).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`, color: "#ef4444" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
              <span style={{ fontSize: 15, fontWeight: 800, color }}>{value}</span>
            </div>
          ))}
          <button onClick={() => exportCSV(products, "rapport_stock.csv", ["sku", "name", "category", "quantity", "min_stock", "unit_price", "location"])}
            style={{ marginTop: 16, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
            <Icon name="download" size={16} /> Exporter rapport CSV
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,.07)", border: "1px solid #f1f5f9" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Top produits par valeur</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Rang", "SKU", "Produit", "Qté", "Prix unit.", "Valeur stock", "% total"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...products].sort((a, b) => (b.quantity * b.unit_price) - (a.quantity * a.unit_price)).slice(0, 8).map((p, i) => {
              const val = p.quantity * p.unit_price;
              const pct = ((val / totalValue) * 100).toFixed(1);
              return (
                <tr key={p.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ width: 26, height: 26, borderRadius: "50%", background: i < 3 ? ["#fbbf24", "#94a3b8", "#cd7c2f"][i] : "#f1f5f9", color: i < 3 ? "#fff" : "#64748b", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{i + 1}</span>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 700, color: "#6366f1" }}>{p.sku}</td>
                  <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 700 }}>{p.name}</td>
                  <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 700 }}>{p.quantity}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13 }}>{p.unit_price?.toFixed(2)} €</td>
                  <td style={{ padding: "12px 14px", fontSize: 15, fontWeight: 800, color: "#0ea5e9" }}>{val.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 3 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "#6366f1", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", minWidth: 36 }}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: prods }, { data: moves }] = await Promise.all([
      supabase.from("products").select("*").order("id"),
      supabase.from("movements").select("*").order("created_at"),
    ]);
    setProducts(prods || []);
    setMovements(moves || []);
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser) fetchData();
  }, [currentUser]);

  if (!currentUser) return <LoginPage onLogin={setCurrentUser} />;

  const alerts = products.filter(p => p.quantity <= p.min_stock).length;
  const navItems = [
    { key: "dashboard", label: "Tableau de bord", icon: "dashboard" },
    { key: "inventory", label: "Inventaire", icon: "inventory" },
    { key: "movements", label: "Mouvements", icon: "movement" },
    { key: "reports", label: "Rapports", icon: "report" },
  ];
  const pageTitle = { dashboard: "Tableau de bord", inventory: "Inventaire produits", movements: "Historique mouvements", reports: "Rapports & Analyses" };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: "#f8fafc" }}>
      {/* SIDEBAR */}
      <aside style={{ width: sidebarOpen ? 240 : 68, background: "#0f172a", display: "flex", flexDirection: "column", flexShrink: 0, transition: "width .25s", overflow: "hidden" }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff" }}>
            <Icon name="box" size={18} />
          </div>
          {sidebarOpen && <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>StockPro</div>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: ".5px" }}>Gestion de stock</div>
          </div>}
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(({ key, label, icon }) => {
            const active = page === key;
            return (
              <button key={key} onClick={() => setPage(key)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? "rgba(99,102,241,.2)" : "transparent", color: active ? "#a5b4fc" : "#64748b", fontWeight: active ? 700 : 500, fontSize: 14, textAlign: "left" }}>
                <span style={{ flexShrink: 0 }}><Icon name={icon} size={18} /></span>
                {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}
                {key === "inventory" && alerts > 0 && sidebarOpen && (
                  <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 800 }}>{alerts}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
              {currentUser.name[0]}
            </div>
            {sidebarOpen && <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.name}</div>
              <div style={{ fontSize: 11, color: "#475569", textTransform: "capitalize" }}>{currentUser.role}</div>
            </div>}
            {sidebarOpen && <button onClick={() => setCurrentUser(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }} title="Déconnexion"><Icon name="logout" size={16} /></button>}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSidebarOpen(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{pageTitle[page]}</h1>
              <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{products.length} produits · {movements.length} mouvements</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={fetchData} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#475569" }}>
              <Icon name="refresh" size={14} /> {loading ? "Chargement..." : "Actualiser"}
            </button>
            {alerts > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#fef2f2", borderRadius: 10, border: "1px solid #fecaca", cursor: "pointer" }} onClick={() => setPage("inventory")}>
                <Icon name="alert" size={16} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>{alerts} alerte{alerts > 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {loading && products.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
                <p style={{ fontWeight: 600 }}>Chargement des données depuis Supabase...</p>
              </div>
            : <>
              {page === "dashboard" && <Dashboard products={products} movements={movements} onPage={setPage} />}
              {page === "inventory" && <Inventory products={products} movements={movements} currentUser={currentUser} onRefresh={fetchData} />}
              {page === "movements" && <Movements movements={movements} products={products} />}
              {page === "reports" && <Reports products={products} movements={movements} />}
            </>
          }
        </main>
      </div>
    </div>
  );
}
