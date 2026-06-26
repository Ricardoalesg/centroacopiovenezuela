# 🇻🇪 Centro de Acopio Venezuela

Web para registrar centros de donación tras el terremoto de Venezuela 2026.

**Stack:** Next.js 14 · Supabase (Postgres) · Tailwind CSS · Vercel

---

## ⚡ Deploy en 4 pasos (~30 min)

### Paso 1 — Supabase (base de datos)

1. Ve a [supabase.com](https://supabase.com) → **New project**
2. Ponle nombre: `centroacopiovenezuela`
3. Elige región: **South America (São Paulo)**
4. Cuando cargue, ve a **SQL Editor** y pega todo el contenido de `supabase-schema.sql`
5. Ejecuta → te crea la tabla con datos de ejemplo
6. Ve a **Project Settings → API** y copia:
   - `Project URL` → es tu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### Paso 2 — GitHub

```bash
# En tu máquina, dentro de esta carpeta:
git init
git add .
git commit -m "feat: initial commit"

# Crea un repo en github.com/new (nombre: centroacopiovenezuela)
git remote add origin https://github.com/TU_USUARIO/centroacopiovenezuela.git
git push -u origin main
```

---

### Paso 3 — Vercel (deploy automático)

1. Ve a [vercel.com](https://vercel.com) → **Add New Project**
2. Conecta tu repo de GitHub
3. En **Environment Variables** agrega:
   ```
   NEXT_PUBLIC_SUPABASE_URL     = https://XXXX.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJh...
   ```
4. Click **Deploy** → en 2 minutos está viva con URL de Vercel

---

### Paso 4 — Dominio propio

1. Compra `centroacopiovenezuela.com` en Namecheap (~$10/año)
2. En Vercel → tu proyecto → **Settings → Domains** → agrega el dominio
3. Vercel te da 2 registros DNS (A y CNAME)
4. En Namecheap → **Advanced DNS** → pega esos registros
5. En 5-10 minutos propaga y el dominio ya funciona con HTTPS

---

## 🏗 Estructura del proyecto

```
app/
  page.tsx           → Página principal (búsqueda, filtros, listado)
  layout.tsx         → Layout raíz con metadata SEO
  globals.css        → Estilos globales + fuente Inter
  api/
    centros/
      route.ts       → GET (listar/filtrar) y POST (registrar)
components/
  CentroCard.tsx     → Tarjeta de cada centro
  RegisterModal.tsx  → Modal de registro con formulario
lib/
  supabase.ts        → Cliente de Supabase + tipo Centro
  constants.ts       → Estados, items, helpers de horario
supabase-schema.sql  → Schema SQL para ejecutar en Supabase
```

---

## 🚀 Alto tráfico — cómo aguanta

- **Vercel Edge Network**: las respuestas se sirven desde CDN global con `Cache-Control: s-maxage=30`
- **Supabase**: Postgres con connection pooling, aguanta miles de requests/segundo en el plan gratuito
- **Sin auth**: no hay sesiones que gestionar, todo es lectura/escritura pública simple
- **Paginación**: la API devuelve máximo 200 resultados por query

Si el tráfico explota (tipo viral), solo necesitas:
1. Subir Supabase a plan Pro ($25/mes) → 500,000 requests/día
2. Vercel Pro ($20/mes) → ancho de banda ilimitado

---

## 🛡 Moderación (próximo paso)

Para añadir moderación básica:
1. Añade columna `aprobado boolean default false` en Supabase
2. Crea una vista solo de registros aprobados
3. Crea un panel admin protegido con Supabase Auth

---

## Teléfonos de emergencia Venezuela

| Operadora | Número |
|-----------|--------|
| Movistar  | 911    |
| Digitel   | 112    |
| Movilnet  | *1     |
| CANTV fijo| 171    |

