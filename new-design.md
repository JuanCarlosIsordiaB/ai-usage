# LexaOS Design System — Guía Completa de Rediseño

> Usa este documento como referencia absoluta al rediseñar cualquier aplicación al estilo LexaOS. Cada sección contiene valores exactos y snippets listos para usar.

---

## 1. Identidad Visual

**Estilo general:** SaaS profesional de escritorio. Clean, corporativo pero con calidez. No minimalista extremo — hay densidad de información pero bien organizada. Sin sombras dramáticas, sin gradientes agresivos. Todo se siente seguro, confiable, legal/enterprise.

**Palabras clave del diseño:** `refined`, `trustworthy`, `structured`, `airy`, `sophisticated`

---

## 2. Paleta de Colores

Implementar como CSS custom properties en `:root`:

```css
:root {
  /* Brand */
  --color-teal:        #1A7F7E;   /* Primary: CTAs, active nav, focus rings, badges */
  --color-teal-light:  #1A7F7E1A; /* 10% opacity — hover bg, active bg, tag bg */
  --color-teal-medium: #1A7F7EE6; /* 90% opacity — hover states on primary buttons */

  /* Text */
  --color-charcoal:    #2C3E50;   /* Headings, strong text, sidebar text active */
  --color-slate-700:   #334155;   /* Body text, table cells */
  --color-slate-600:   #475569;   /* Secondary body, descriptions */
  --color-slate-500:   #64748B;   /* Labels, placeholders, metadata */
  --color-slate-400:   #94A3B8;   /* Timestamps, icons, tertiary */

  /* Backgrounds */
  --bg-white:          #FFFFFF;   /* Cards, modals, inputs, main content area */
  --bg-neutral:        #F8FAFC;   /* Page/chat background */
  --bg-light:          #F1F5F9;   /* Sidebar, scrollbars, secondary areas */
  --bg-slate-50:       #F8FAFC;   /* Hover states, icon containers, table row hover */

  /* Borders */
  --border-default:    #E2E8F0;   /* All dividers, card borders, input borders */
  --border-light:      #F1F5F9;   /* Inner dividers, subtle separators */

  /* Status */
  --status-success:    #10B981;   /* Online indicators */
  --status-error:      #EF4444;   /* Alerts, danger actions */
  --status-warning:    #F59E0B;   /* Warnings, pending */
  --status-info:       #3B82F6;   /* Informational badges */

  /* Specialty */
  --whatsapp-green:    #25D366;   /* WhatsApp integration buttons only */

  /* Badge backgrounds (semantic) */
  --badge-red-bg:      #FFF1F2;   /* bg-rose-50 */
  --badge-red-text:    #BE123C;   /* text-rose-700 */
  --badge-amber-bg:    #FFFBEB;
  --badge-amber-text:  #B45309;
  --badge-teal-bg:     #F0FDFA;
  --badge-teal-text:   #0F766E;
  --badge-slate-bg:    #F8FAFC;
  --badge-slate-text:  #475569;
}
```

**Reglas de uso de color:**
- El teal **solo** aparece en: nav activo, botones primarios, focus rings, badges "unread", bordes de notificación urgente, dot de "en línea".
- Fondos blancos para todas las cards. Fondos `--bg-neutral` para el área de contenido. `--bg-light` para sidebar.
- **Nunca** usar gradientes excepto como sutil mesh de fondo en páginas landing.

---

## 3. Tipografía

### Fuentes a importar

```html
<!-- En el <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
```

> **Nota:** LexaOS usa `Gambetta` (serif) + `Satoshi` (sans) que son fuentes de pago. Los sustitutos exactos open-source son **Playfair Display** (serif) y **DM Sans** (sans-serif). Si tienes acceso a las originales, úsalas.

```css
:root {
  --font-serif: 'Playfair Display', Georgia, serif;  /* Gambetta equivalent */
  --font-sans:  'DM Sans', system-ui, sans-serif;    /* Satoshi equivalent */
}

body {
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-slate-700);
}
```

### Escala tipográfica

| Elemento        | Font          | Size  | Weight | Line Height | Color              |
|----------------|---------------|-------|--------|-------------|-------------------|
| `h1` (página)   | serif         | 32px  | 600    | 1.2         | `--color-charcoal` |
| `h2` (sección)  | serif         | 24px  | 600    | 1.2         | `--color-charcoal` |
| `h3` (card/modal)| serif        | 20px  | 500    | 1.3         | `--color-charcoal` |
| Sub-heading     | sans          | 16px  | 600    | 1.4         | `--color-charcoal` |
| Body            | sans          | 14px  | 400    | 1.5         | `--color-slate-700`|
| Small/meta      | sans          | 12px  | 400    | 1.4         | `--color-slate-500`|
| Micro/labels    | sans          | 10px  | 700    | 1.3         | contextual         |
| Nav items       | sans          | 14px  | 500    | —           | `--color-slate-600`|
| Table headers   | sans          | 12px  | 600    | —           | `--color-slate-500`, uppercase, tracking-wide |

**Regla clave:** `font-serif` SOLO para: títulos de página (h1, h2), títulos de cards de notificaciones importantes, nombre del logo. Todo lo demás es `font-sans`.

---

## 4. Espaciado y Layout

### Sistema de grid (base 8px)

```css
/* Espaciados más usados */
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### Estructura de layout principal

```
┌─────────────────────────────────────────────┐
│  SIDEBAR (256px fijo, h-screen, sticky)     │
│  ┌─────────────────────────────────────────┐│
│  │ Logo header (h: 64px, border-bottom)   ││
│  │ Nav groups (flex-1, overflow-y-auto)   ││
│  │ User/logout footer (border-top)        ││
│  └─────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│  MAIN AREA (flex-1, flex-col)              │
│  ┌─────────────────────────────────────────┐│
│  │ Top header (h: 64px, border-bottom)    ││
│  │ [breadcrumb + search + notifications   ││
│  │  + avatar]                             ││
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ CONTENT (flex-1, overflow-y-auto,      ││
│  │  p: 32px, bg: --bg-neutral)            ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

```css
/* Layout base */
.app-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-neutral);
}

.sidebar {
  width: 256px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-header {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid var(--border-default);
  display: flex;
  align-items: center;
  padding: 0 32px;
  flex-shrink: 0;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}
```

---

## 5. Border Radius

```css
--radius-sm:  6px;   /* Badges, tags, small chips */
--radius-md:  8px;   /* Inputs, small buttons, table rows */
--radius-lg:  12px;  /* Icon containers, medium buttons */
--radius-xl:  16px;  /* Cards medianas */
--radius-2xl: 20px;  /* Cards principales, modals */
--radius-full: 9999px; /* Avatars, status dots, pill badges */
```

---

## 6. Sombras

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.04);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.04);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0,0,0,0.15); /* Modals */
```

**Regla:** Cards en reposo usan `--shadow-sm`. En hover pasan a `--shadow-md`. Modals usan `--shadow-2xl`. El sidebar y header **no tienen sombra** — solo `border-right`/`border-bottom`.

---

## 7. Componentes

### 7.1 Sidebar

```html
<aside class="sidebar">
  <!-- Logo -->
  <div style="height:64px; display:flex; align-items:center; padding:0 24px; border-bottom:1px solid var(--border-default);">
    <span style="font-family:var(--font-serif); font-size:20px; font-weight:600; color:var(--color-charcoal); letter-spacing:-0.5px;">
      Lexa<span style="color:var(--color-teal);">OS</span>
    </span>
  </div>

  <!-- Nav -->
  <nav style="flex:1; overflow-y:auto; padding:24px 16px;">
    <!-- Section label -->
    <p style="font-size:11px; font-weight:700; color:var(--color-slate-400); text-transform:uppercase; letter-spacing:0.08em; padding:0 8px; margin-bottom:8px;">
      Principal
    </p>

    <!-- Active nav item -->
    <a href="#" class="nav-item nav-item--active">
      <svg>...</svg>
      Dashboard
    </a>

    <!-- Inactive nav item -->
    <a href="#" class="nav-item">
      <svg>...</svg>
      Calendario
    </a>
  </nav>

  <!-- Footer -->
  <div style="padding:16px; border-top:1px solid var(--border-default);">
    <button class="nav-item nav-item--danger" style="width:100%;">
      Cerrar Sesión
    </button>
  </div>
</aside>
```

```css
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-slate-600);
  text-decoration: none;
  transition: background 150ms ease, color 150ms ease;
  cursor: pointer;
  border: none;
  background: none;
}
.nav-item:hover {
  background: var(--bg-slate-50);
  color: var(--color-charcoal);
}
.nav-item--active {
  background: var(--color-teal-light);
  color: var(--color-teal);
}
.nav-item--danger:hover {
  background: #FFF1F2;
  color: var(--status-error);
}

/* Badge contador en nav */
.nav-badge {
  margin-left: auto;
  width: 20px; height: 20px;
  display: flex; align-items: center; justify-content: center;
  background: var(--color-teal);
  color: #fff;
  font-size: 10px; font-weight: 700;
  border-radius: var(--radius-full);
}
```

---

### 7.2 Top Header

```html
<header class="top-header">
  <!-- Breadcrumb / título de sección -->
  <div style="display:flex; align-items:center; gap:8px; color:var(--color-slate-500); font-size:14px;">
    <svg>...</svg> <!-- icon de la sección -->
    <span>Repositorio Documental</span>
  </div>

  <!-- Spacer -->
  <div style="flex:1;"></div>

  <!-- Search global (solo en páginas que lo requieren) -->
  <div class="search-bar">
    <svg>...</svg>
    <input placeholder="Buscar...">
    <kbd>⌘K</kbd>
  </div>

  <!-- Notifications bell -->
  <button class="icon-button" style="position:relative;">
    <svg>...</svg>
    <span class="notif-dot"></span>
  </button>

  <!-- Avatar -->
  <div style="display:flex; align-items:center; gap:10px; cursor:pointer; padding:6px 8px; border-radius:var(--radius-md); transition:background 150ms;">
    <img src="avatar.jpg" style="width:34px; height:34px; border-radius:var(--radius-full); object-fit:cover;">
    <span style="font-size:14px; font-weight:500; color:var(--color-charcoal);">Roberto Vargas</span>
    <svg>...</svg> <!-- chevron-down -->
  </div>
</header>
```

```css
.search-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 16px;
  background: var(--bg-neutral);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  width: 340px;
  font-size: 14px; color: var(--color-slate-500);
}
.search-bar input {
  flex: 1; border: none; background: transparent;
  font-size: 14px; color: var(--color-charcoal); outline: none;
}
.search-bar kbd {
  font-size: 11px; color: var(--color-slate-400);
  padding: 2px 6px; border: 1px solid var(--border-default);
  border-radius: 4px; font-family: var(--font-sans);
}

.icon-button {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-md); border: none; background: none;
  color: var(--color-slate-500); cursor: pointer;
  transition: background 150ms, color 150ms;
}
.icon-button:hover { background: var(--bg-slate-50); color: var(--color-charcoal); }

.notif-dot {
  position: absolute; top: 6px; right: 6px;
  width: 8px; height: 8px;
  background: var(--status-error);
  border-radius: var(--radius-full);
  border: 2px solid #fff;
}
```

---

### 7.3 Metric Card (KPI)

```html
<div class="card">
  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
    <p style="font-size:13px; font-weight:500; color:var(--color-slate-500);">Fondo Operativo</p>
    <div style="padding:8px; background:var(--bg-slate-50); border-radius:var(--radius-lg);">
      <svg style="color:var(--color-slate-400);">...</svg>
    </div>
  </div>
  <div style="display:flex; align-items:flex-end; justify-content:space-between;">
    <h3 style="font-family:var(--font-sans); font-size:24px; font-weight:700; color:var(--color-charcoal);">$142,580</h3>
    <span class="badge badge--success">↑ 2.4%</span>
  </div>
</div>
```

```css
.card {
  background: #fff;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-2xl);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 200ms ease;
}
.card:hover { box-shadow: var(--shadow-md); }
```

---

### 7.4 Tabla de Documentos

```html
<div class="card" style="padding:0; overflow:hidden;">
  <!-- Toolbar -->
  <div style="padding:16px 24px; border-bottom:1px solid var(--border-default); display:flex; gap:12px; align-items:center;">
    <div class="filter-chip">
      <svg>...</svg> Tipo de Documento <svg>...</svg>
    </div>
    <div class="filter-chip">
      <svg>...</svg> Cliente
    </div>
    <div class="filter-chip">
      <svg>...</svg> dd/mm/aaaa
    </div>
    <div style="margin-left:auto;">
      <button class="btn btn--primary">
        <svg>...</svg> Subir Documento
      </button>
    </div>
  </div>

  <!-- Table -->
  <table style="width:100%; border-collapse:collapse;">
    <thead>
      <tr style="border-bottom:1px solid var(--border-default);">
        <th class="th">Nombre del Documento</th>
        <th class="th">Tipo</th>
        <th class="th">Cliente / Expediente</th>
        <th class="th">Fecha</th>
        <th class="th">Subido Por</th>
      </tr>
    </thead>
    <tbody>
      <tr class="table-row">
        <td class="td">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:40px; height:40px; border-radius:var(--radius-lg); background:#FFF1F2; display:flex; align-items:center; justify-content:center; color:var(--status-error); flex-shrink:0;">
              <!-- file-pdf icon -->
            </div>
            <div>
              <p style="font-weight:500; color:var(--color-charcoal); cursor:pointer; transition:color 150ms;">Demanda_Inicial.pdf</p>
              <p style="font-size:12px; color:var(--color-slate-400); margin-top:2px;">2.4 MB</p>
            </div>
          </div>
        </td>
        <td class="td"><span class="badge badge--danger">Demanda</span></td>
        <td class="td">
          <p style="font-weight:500; color:var(--color-slate-700);">Global Corp</p>
          <p style="font-size:12px; color:var(--color-slate-500); display:flex; align-items:center; gap:4px; margin-top:2px;">
            <svg>...</svg> Exp. 145/2023
          </p>
        </td>
        <td class="td" style="color:var(--color-slate-600);">24 Oct, 2023</td>
        <td class="td">
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="avatar.jpg" style="width:28px; height:28px; border-radius:var(--radius-full); border:1px solid var(--border-default);">
            <span style="font-size:12px; color:var(--color-slate-600);">E. Morales</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

```css
.th {
  padding: 12px 24px;
  text-align: left;
  font-size: 11px; font-weight: 600;
  color: var(--color-slate-500);
  text-transform: uppercase; letter-spacing: 0.06em;
  background: var(--bg-neutral);
}
.td { padding: 16px 24px; }
.table-row { border-bottom: 1px solid var(--border-default); transition: background 150ms; }
.table-row:hover { background: var(--bg-slate-50); }
.table-row:last-child { border-bottom: none; }

.filter-chip {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: 13px; font-weight: 500; color: var(--color-slate-600);
  background: #fff; cursor: pointer;
  transition: background 150ms, border-color 150ms;
}
.filter-chip:hover { background: var(--bg-slate-50); border-color: #CBD5E1; }
```

---

### 7.5 Badges / Tags

```css
.badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: 12px; font-weight: 600;
  white-space: nowrap;
}

.badge--primary  { background: var(--color-teal-light); color: var(--color-teal); }
.badge--success  { background: #ECFDF5; color: #065F46; }
.badge--danger   { background: var(--badge-red-bg); color: var(--badge-red-text); }
.badge--warning  { background: var(--badge-amber-bg); color: var(--badge-amber-text); }
.badge--neutral  { background: var(--bg-light); color: var(--color-slate-600); border: 1px solid var(--border-default); }

/* Micro badge (pill tiny, para labels de tipo) */
.badge--micro {
  padding: 1px 6px;
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.04em;
  border-radius: 3px; /* cuadrado, no pill */
}
```

---

### 7.6 Botones

```css
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 13px; font-weight: 600;
  cursor: pointer; border: none;
  transition: background 150ms, box-shadow 150ms;
  white-space: nowrap;
}

.btn--primary {
  background: var(--color-charcoal); /* LexaOS usa charcoal para CTAs en toolbar */
  color: #fff;
}
.btn--primary:hover { background: #1e2d3d; }

.btn--teal {
  background: var(--color-teal);
  color: #fff;
}
.btn--teal:hover { background: var(--color-teal-medium); }

.btn--secondary {
  background: #fff;
  border: 1px solid var(--border-default);
  color: var(--color-slate-700);
}
.btn--secondary:hover { background: var(--bg-slate-50); }

.btn--ghost {
  background: transparent;
  color: var(--color-slate-500);
}
.btn--ghost:hover { background: var(--bg-slate-50); color: var(--color-charcoal); }

.btn--sm { padding: 5px 12px; font-size: 12px; }
.btn--icon { width: 36px; height: 36px; padding: 0; justify-content: center; }
```

---

### 7.7 Inputs y Forms

```css
.input {
  width: 100%;
  padding: 9px 14px;
  background: #fff;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-charcoal);
  outline: none;
  transition: border-color 150ms, box-shadow 150ms;
}
.input::placeholder { color: var(--color-slate-400); }
.input:hover { border-color: #CBD5E1; }
.input:focus {
  border-color: var(--color-teal);
  box-shadow: 0 0 0 3px var(--color-teal-light);
}

.form-label {
  display: block;
  font-size: 13px; font-weight: 500;
  color: var(--color-slate-700);
  margin-bottom: 6px;
}

.form-group { margin-bottom: 20px; }
```

---

### 7.8 Modal

```html
<!-- Backdrop -->
<div class="modal-backdrop" id="modal">
  <!-- Panel -->
  <div class="modal-panel">
    <!-- Header -->
    <div class="modal-header">
      <h3 style="font-family:var(--font-serif); font-size:20px; font-weight:500; color:var(--color-charcoal);">
        Título del Modal
      </h3>
      <button class="icon-button" onclick="closeModal()">✕</button>
    </div>

    <!-- Body -->
    <div class="modal-body">
      <!-- form fields aquí -->
    </div>

    <!-- Footer -->
    <div class="modal-footer">
      <button class="btn btn--ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn--teal">Confirmar</button>
    </div>
  </div>
</div>
```

```css
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(44,62,80,0.4);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}
.modal-panel {
  background: #fff;
  border-radius: var(--radius-2xl);
  width: 100%; max-width: 520px;
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
}
.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-default);
  display: flex; justify-content: space-between; align-items: center;
  background: var(--bg-neutral);
}
.modal-body { padding: 24px; }
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-default);
  display: flex; justify-content: flex-end; gap: 10px;
  background: var(--bg-neutral);
}
```

---

### 7.9 Notification Card

```html
<div class="card notification-card">
  <!-- Barra de color izquierda (urgente = teal, warning = amber) -->
  <div class="notification-bar notification-bar--teal"></div>
  <div style="padding:20px;">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="badge badge--neutral badge--micro">Juzgado Tercero</span>
        <span class="badge badge--danger badge--micro">Litigio / Amparo</span>
      </div>
      <span style="font-size:12px; font-weight:600; color:var(--color-teal); display:flex; align-items:center; gap:6px;">
        <span class="pulse-dot"></span> Hoy, 09:30 AM
      </span>
    </div>
    <h3 style="font-family:var(--font-serif); font-size:20px; font-weight:600; color:var(--color-charcoal); margin-bottom:8px;">
      Acuerdo de Radicación de Amparo Indirecto
    </h3>
    <p style="font-size:13px; color:var(--color-slate-600); line-height:1.6; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
      Se admite a trámite la demanda...
    </p>
    <button class="btn btn--ghost btn--sm" style="margin-top:12px; padding-left:0; color:var(--color-teal);">
      Ver detalle completo →
    </button>
  </div>
</div>
```

```css
.notification-card { position: relative; overflow: hidden; padding: 0 !important; }
.notification-bar {
  position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
}
.notification-bar--teal  { background: var(--color-teal); }
.notification-bar--amber { background: var(--status-warning); }

.pulse-dot {
  width: 8px; height: 8px;
  background: var(--color-teal);
  border-radius: var(--radius-full);
  display: inline-block;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.8); }
}
```

---

### 7.10 Chat Interface

```css
/* Contenedor */
.chat-layout {
  display: flex;
  height: 100%;
  background: #fff;
  border-radius: var(--radius-2xl);
  border: 1px solid var(--border-default);
  overflow: hidden;
}

/* Sidebar de conversaciones */
.chat-sidebar {
  width: 280px; flex-shrink: 0;
  border-right: 1px solid var(--border-default);
  display: flex; flex-direction: column;
}
.chat-sidebar-header {
  padding: 16px; border-bottom: 1px solid var(--border-default);
  display: flex; justify-content: space-between; align-items: center;
  font-weight: 600; font-size: 15px; color: var(--color-charcoal);
}

/* Ítem de conversación */
.chat-item {
  display: flex; gap: 10px; padding: 14px 16px;
  cursor: pointer; transition: background 150ms;
  border-bottom: 1px solid var(--border-light);
}
.chat-item:hover { background: var(--bg-slate-50); }
.chat-item--active { background: var(--bg-slate-50); }

/* Mensajes */
.message-bubble {
  padding: 12px 14px;
  border-radius: var(--radius-xl);
  font-size: 14px; line-height: 1.5;
  max-width: 100%;
}
.message-bubble--incoming {
  background: #fff;
  border: 1px solid var(--border-default);
  color: var(--color-slate-700);
  border-bottom-left-radius: 4px;
  box-shadow: var(--shadow-sm);
}
.message-bubble--outgoing {
  background: var(--color-teal);
  color: #fff;
  border-bottom-right-radius: 4px;
}

/* Input bar */
.chat-input-bar {
  padding: 12px 16px;
  border-top: 1px solid var(--border-default);
  display: flex; align-items: center; gap: 10px;
}
.chat-input {
  flex: 1; padding: 10px 16px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  font-size: 14px; outline: none;
  transition: border-color 150ms;
}
.chat-input:focus { border-color: var(--color-teal); }

.send-button {
  width: 40px; height: 40px;
  background: var(--color-teal); color: #fff;
  border-radius: var(--radius-full);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 150ms, transform 100ms;
}
.send-button:hover { background: var(--color-teal-medium); }
.send-button:active { transform: scale(0.94); }
```

---

### 7.11 Avatar con status indicator

```html
<div style="position:relative; display:inline-block;">
  <img src="avatar.jpg" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
  <span style="position:absolute; bottom:1px; right:1px; width:10px; height:10px; background:var(--status-success); border:2px solid #fff; border-radius:50%;"></span>
</div>
```

---

## 8. Animaciones y Transiciones

```css
/* Regla global de transiciones */
*, *::before, *::after {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Durations */
--transition-fast:   100ms;  /* :active states, clicks */
--transition-base:   150ms;  /* hover bg/color changes */
--transition-medium: 200ms;  /* card shadow, modal open */
--transition-slow:   300ms;  /* page transitions, complex reveals */

/* Toggle switch */
.toggle-track {
  width: 32px; height: 18px;
  background: var(--border-default);
  border-radius: var(--radius-full);
  position: relative; cursor: pointer;
  transition: background var(--transition-medium);
}
.toggle-track.active { background: var(--color-teal); }
.toggle-thumb {
  position: absolute; top: 2px; left: 2px;
  width: 14px; height: 14px;
  background: #fff; border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-medium);
}
.toggle-track.active .toggle-thumb { transform: translateX(14px); }
```

---

## 9. Scrollbar personalizada

```css
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg-light); }
::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: var(--radius-full); }
::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
```

---

## 10. Page Header (dentro de content area)

```html
<div style="margin-bottom:32px;">
  <div style="display:flex; justify-content:space-between; align-items:flex-start;">
    <div>
      <h1 style="font-family:var(--font-serif); font-size:28px; font-weight:600; color:var(--color-charcoal); margin-bottom:4px;">
        Base de Datos Legal
      </h1>
      <p style="font-size:14px; color:var(--color-slate-500);">
        Almacenamiento seguro y búsqueda de documentos, expedientes y contratos.
      </p>
    </div>
    <button class="btn btn--ghost" style="font-size:12px; color:var(--color-teal);">
      Alternar Vista
    </button>
  </div>
</div>
```

---

## 11. Tabs / Sub-navigation

```html
<div class="tabs">
  <button class="tab tab--active">Notificaciones del Tribunal <span class="tab-badge">3</span></button>
  <button class="tab">Diario Oficial <span class="tab-badge tab-badge--neutral">1</span></button>
</div>
```

```css
.tabs {
  display: flex; gap: 4px;
  border-bottom: 1px solid var(--border-default);
  margin-bottom: 24px;
}
.tab {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px;
  font-size: 13px; font-weight: 500;
  color: var(--color-slate-500);
  border: none; background: none; cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 150ms, border-color 150ms;
}
.tab:hover { color: var(--color-charcoal); }
.tab--active {
  color: var(--color-teal);
  border-bottom-color: var(--color-teal);
  font-weight: 600;
}
.tab-badge {
  padding: 1px 7px;
  background: var(--status-error);
  color: #fff;
  border-radius: var(--radius-full);
  font-size: 10px; font-weight: 700;
}
.tab-badge--neutral {
  background: var(--bg-light);
  color: var(--color-slate-600);
  border: 1px solid var(--border-default);
}
```

---

## 12. Checklist de implementación con Claude Code

Al ejecutar este documento con Claude Code, asegúrate de que el agente:

- [ ] Reemplaza **todas** las fuentes existentes por `Playfair Display` + `DM Sans` (o Gambetta + Satoshi si disponibles)
- [ ] Declara **todos** los colores como CSS custom properties en `:root` — sin colores hardcodeados en componentes
- [ ] Aplica `border-radius: var(--radius-2xl)` a todas las cards principales
- [ ] Elimina cualquier sombra dramática — solo `shadow-sm` en reposo, `shadow-md` en hover
- [ ] El sidebar tiene `background: #fff` y `border-right` — **no** `background: dark`
- [ ] Los botones primarios de CTAs importantes (toolbar) usan `--color-charcoal`, no teal
- [ ] Los botones primarios de modals y acciones de confirmación usan `--color-teal`
- [ ] Todos los inputs tienen `focus: border-color teal + box-shadow ring`
- [ ] Implementa el scrollbar personalizado globalmente
- [ ] Los headers de modals y footers tienen `background: var(--bg-neutral)`, el body tiene `background: #fff`
- [ ] Las tablas no tienen background en filas — solo hover con `--bg-slate-50`
- [ ] Los badges de tipo usan la variante `--micro` (border-radius: 3px, no pill)
- [ ] El logo usa `font-serif` semibold con el sufijo en `--color-teal`
- [ ] Todas las transiciones usan `150ms ease` como default

---

*Documento generado para rediseño completo al estilo LexaOS. Versión 1.0.*a