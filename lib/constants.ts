export const ESTADOS = [
  'La Guaira','Miranda','Caracas (D.C.)','Aragua','Carabobo',
  'Anzoátegui','Sucre','Bolívar','Zulia','Lara','Táchira','Mérida',
  'Barinas','Apure','Guárico','Cojedes','Portuguesa','Yaracuy',
  'Falcón','Monagas','Nueva Esparta','Delta Amacuro','Amazonas',
]

export const ITEMS_BASICOS = [
  'Agua',
  'Comida no perecedera',
  'Medicamentos',
  'Ropa',
  'Pañales / bebés',
  'Colchonetas / camas',
  'Artículos de higiene',
]

export const ITEMS_RESCATE = [
  'Equipo de rescate',
  'Herramientas manuales',
  'Generadores / electricidad',
  'Cuerdas / arneses',
  'Cascos / EPP',
  'Camillas',
]

export const DIAS_OPTIONS = [
  { value: 'Lun–Dom', label: 'Lunes a domingo' },
  { value: 'Lun–Vie', label: 'Lunes a viernes' },
  { value: 'Lun–Sáb', label: 'Lunes a sábado' },
  { value: 'Sáb–Dom', label: 'Sábados y domingos' },
  { value: 'Solo hoy', label: 'Solo hoy' },
]

export const ITEMS_RESCATE_SET = new Set(ITEMS_RESCATE)

export function isActivo(centro: { hora_inicio: string; hora_fin: string }): boolean {
  const now = new Date()
  const cur = now.getHours() * 60 + now.getMinutes()
  const [sh, sm] = centro.hora_inicio.split(':').map(Number)
  const [eh, em] = centro.hora_fin.split(':').map(Number)
  return cur >= sh * 60 + sm && cur < eh * 60 + em
}

export function fmtHorario(c: { dias: string; hora_inicio: string; hora_fin: string }): string {
  const to12 = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    const ap = h >= 12 ? 'pm' : 'am'
    const h12 = h % 12 || 12
    return `${h12}:${String(m).padStart(2, '0')}${ap}`
  }
  return `${c.dias} · ${to12(c.hora_inicio)} – ${to12(c.hora_fin)}`
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-VE', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
