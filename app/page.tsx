'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import CentroCard from '@/components/CentroCard'
import RegisterModal from '@/components/RegisterModal'
import { Centro, isActivo, ESTADOS } from '@/lib/constants'

const TABS = ['centros', 'guia'] as const
type Tab = typeof TABS[number]

const FILTER_CHIPS = [
  { label: 'Todos', value: '' },
  { label: 'Activos ahora', value: 'activo' },
  { label: 'Agua', value: 'Agua' },
  { label: 'Comida', value: 'Comida no perecedera' },
  { label: 'Medicamentos', value: 'Medicamentos' },
  { label: 'Ropa', value: 'Ropa' },
  { label: 'Equipo de rescate', value: 'Equipo de rescate' },
  { label: 'Herramientas', value: 'Herramientas manuales' },
]

export default function Home() {
  const [centros, setCentros] = useState<Centro[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('centros')
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('')
  const [itemFilter, setItemFilter] = useState('')
  const [toast, setToast] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchCentros = useCallback(async (s = search, e = estadoFilter, i = itemFilter) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (s) params.set('search', s)
    if (e) params.set('estado', e)
    // For activo filter we fetch all and filter client-side
    if (i && i !== 'activo') params.set('item', i)
    try {
      const res = await fetch(`/api/centros?${params}`)
      let data: Centro[] = await res.json()
      if (i === 'activo') data = data.filter(isActivo)
      setCentros(data)
    } catch {
      setCentros([])
    } finally {
      setLoading(false)
    }
  }, [search, estadoFilter, itemFilter])

  useEffect(() => { fetchCentros() }, []) // eslint-disable-line

  const handleSearch = (val: string) => {
    setSearch(val)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => fetchCentros(val, estadoFilter, itemFilter), 400)
  }

  const handleEstado = (val: string) => {
    setEstadoFilter(val)
    fetchCentros(search, val, itemFilter)
  }

  const handleItemFilter = (val: string) => {
    setItemFilter(val)
    fetchCentros(search, estadoFilter, val)
  }

  const handleSuccess = () => {
    setToast(true)
    fetchCentros()
    setTimeout(() => setToast(false), 3500)
  }

  const activos = centros.filter(isActivo).length
  const inactivos = centros.length - activos

  return (
    <div className="min-h-screen bg-[#F9F8F6]">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇻🇪</span>
            <div>
              <h1 className="font-semibold text-gray-900 text-base leading-tight">Centro de Acopio Venezuela</h1>
              <p className="text-xs text-gray-400">Registro de centros de donación · Terremoto 2026</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
            Registrar centro
          </button>
        </div>
      </header>

      {/* ── Stats ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-3 gap-3">
          {[
            { num: centros.length, label: 'Centros registrados', color: 'text-amber-600' },
            { num: activos,        label: 'Activos ahora',        color: 'text-emerald-600' },
            { num: inactivos,      label: 'Fuera de horario',     color: 'text-red-500' },
          ].map(s => (
            <div key={s.label} className="text-center bg-gray-50 rounded-xl py-3">
              <div className={`text-2xl font-semibold ${s.color}`}>{s.num}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Nav tabs ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 flex gap-0">
          {([['centros', 'Centros de acopio'], ['guia', '¿Qué llevar?']] as const).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm border-b-2 transition-colors ${
                tab === t
                  ? 'border-brand text-amber-700 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">

        {/* ── TAB: CENTROS ── */}
        {tab === 'centros' && (
          <>
            {/* Search + state filter */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                </svg>
                <input
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Buscar por nombre, ciudad o responsable..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand"
                />
              </div>
              <select
                value={estadoFilter}
                onChange={e => handleEstado(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-brand min-w-[160px]"
              >
                <option value="">Todos los estados</option>
                {ESTADOS.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {FILTER_CHIPS.map(chip => (
                <button key={chip.value}
                  onClick={() => handleItemFilter(chip.value)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    itemFilter === chip.value
                      ? 'bg-brand text-white border-brand'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}>
                  {chip.label}
                </button>
              ))}
            </div>

            {/* List */}
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : centros.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                </svg>
                <p className="text-sm">No se encontraron centros con esos filtros.</p>
                <button onClick={() => { setSearch(''); setEstadoFilter(''); handleItemFilter('') }}
                  className="mt-3 text-sm text-amber-600 hover:underline">
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {centros.map(c => <CentroCard key={c.id} centro={c} />)}
              </div>
            )}
          </>
        )}

        {/* ── TAB: GUÍA ── */}
        {tab === 'guia' && (
          <div className="max-w-2xl space-y-4">

            <GuideSection
              icon="🚨" color="red"
              title="Prioridad alta — lo más urgente"
              items={[
                'Agua potable en botellones o botellas selladas',
                'Medicamentos básicos (analgésicos, antibióticos, sueros)',
                'Pañales de todas las tallas y toallas húmedas',
                'Alimentos no perecederos (atún, sardinas, caraotas, arroz, pasta)',
                'Vendas, gasas, yodopovidona y guantes',
              ]}
            />

            <GuideSection
              icon="🔧" color="blue"
              title="Equipo de búsqueda y rescate"
              items={[
                'Martillos, mazos y picos',
                'Esmeriles y cortadoras de metal',
                'Palas, barretas y pies de cabra',
                'Cuerdas, poleas y arneses',
                'Linternas de alta potencia y cascos de seguridad',
                'Generadores eléctricos y extensiones largas',
                'Guantes de trabajo y botas de seguridad',
                'Camillas plegables y sillas de ruedas',
              ]}
            />

            <GuideSection
              icon="📦" color="amber"
              title="Prioridad media"
              items={[
                'Ropa en buen estado (limpias y dobladas por talla)',
                'Colchonetas, cobijas y sábanas',
                'Artículos de higiene (jabón, papel higiénico, shampoo)',
                'Velas, fósforos y linternas con pilas',
                'Cargadores y bancos de energía',
              ]}
            />

            <GuideSection
              icon="✅" color="green"
              title="Cómo llevar las donaciones"
              items={[
                'Empaca en bolsas resistentes o cajas selladas y etiquetadas',
                'Escribe en la caja: tipo de contenido, cantidad y fecha',
                'Verifica el horario del centro antes de salir',
                'Llama al responsable para confirmar que están recibiendo',
                'Si llevas equipos pesados, coordina primero por teléfono',
              ]}
            />

            <GuideSection
              icon="🚫" color="red"
              title="No llevar"
              items={[
                'Ropa sucia, rota o en muy mal estado',
                'Alimentos perecederos sin refrigeración',
                'Medicamentos vencidos',
                'Herramientas rotas o sin funcionar',
                'Electrodomésticos sin coordinación previa',
              ]}
            />
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-10 text-center">
          <div className="text-2xl mb-3">🇻🇪</div>
          <h2 className="font-semibold text-gray-900 text-lg mb-2">Centro de Acopio Venezuela</h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto mb-4 leading-relaxed">
            Iniciativa ciudadana, voluntaria y sin fines de lucro para ayudar a coordinar las
            donaciones tras el terremoto de Venezuela 2026.
          </p>
          <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
            No vendemos ni compartimos tu información con terceros y solo la usamos para ayudar a
            coordinar donaciones. Los datos que se publican son responsabilidad de quien los envía,
            verifícalos antes de difundirlos.
          </p>
          <div className="mt-6 flex justify-center gap-6 text-xs text-gray-400">
            <span>Telefonos de emergencia</span>
            <span><strong>911</strong> · Movistar</span>
            <span><strong>112</strong> · Digitel</span>
            <span><strong>*1</strong> · Movilnet</span>
            <span><strong>171</strong> · CANTV fijo</span>
          </div>
        </div>
      </footer>

      {/* ── Modal ── */}
      {showModal && (
        <RegisterModal
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5"/>
          </svg>
          Centro registrado correctamente
        </div>
      )}
    </div>
  )
}

// ── GuideSection helper ──
const colorMap = {
  red:   { bg: 'bg-red-50',   border: 'border-red-100',   text: 'text-red-700'   },
  blue:  { bg: 'bg-blue-50',  border: 'border-blue-100',  text: 'text-blue-700'  },
  amber: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
  green: { bg: 'bg-emerald-50',border:'border-emerald-100',text:'text-emerald-700'},
}

function GuideSection({ icon, color, title, items }: {
  icon: string; color: keyof typeof colorMap; title: string; items: string[]
}) {
  const c = colorMap[color]
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-5`}>
      <h3 className={`font-semibold ${c.text} text-sm mb-3 flex items-center gap-2`}>
        <span>{icon}</span> {title}
      </h3>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
            <span className={`mt-0.5 ${c.text} shrink-0`}>·</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
