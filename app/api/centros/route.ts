import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/centros?estado=&search=&item=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const estado = searchParams.get('estado') || ''
  const search = searchParams.get('search') || ''
  const item   = searchParams.get('item') || ''

  let query = supabase
    .from('centros')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (estado) query = query.eq('estado', estado)
  if (item)   query = query.contains('items', [item])
  if (search) {
    query = query.or(
      `nombre.ilike.%${search}%,ciudad.ilike.%${search}%,responsable.ilike.%${search}%,direccion.ilike.%${search}%`
    )
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' },
  })
}

// POST /api/centros
export async function POST(req: NextRequest) {
  const body = await req.json()

  const required = ['nombre','estado','ciudad','direccion','responsable','telefono','dias','hora_inicio','hora_fin']
  for (const field of required) {
    if (!body[field]?.trim?.()) {
      return NextResponse.json({ error: `Campo requerido: ${field}` }, { status: 400 })
    }
  }

  // Rate limit simple por IP (Vercel pasa x-forwarded-for)
  // Para producción considera usar Upstash Redis

  const { data, error } = await supabase.from('centros').insert([{
    nombre:      body.nombre.trim(),
    estado:      body.estado.trim(),
    ciudad:      body.ciudad.trim(),
    direccion:   body.direccion.trim(),
    responsable: body.responsable.trim(),
    telefono:    body.telefono.trim(),
    dias:        body.dias.trim(),
    hora_inicio: body.hora_inicio,
    hora_fin:    body.hora_fin,
    items:       Array.isArray(body.items) ? body.items : [],
    info:        body.info?.trim() || null,
  }]).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
