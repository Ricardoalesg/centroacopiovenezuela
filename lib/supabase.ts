import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Centro = {
  id: number
  nombre: string
  estado: string
  ciudad: string
  direccion: string
  responsable: string
  telefono: string
  dias: string
  hora_inicio: string
  hora_fin: string
  items: string[]
  info: string | null
  activo: boolean
  created_at: string
}
