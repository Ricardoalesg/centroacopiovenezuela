'use client'
import { useState, FormEvent } from 'react'
import { ESTADOS, ITEMS_BASICOS, ITEMS_RESCATE, DIAS_OPTIONS } from '@/lib/constants'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function RegisterModal({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const toggleItem = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const data = {
      nombre:      (form.elements.namedItem('nombre') as HTMLInputElement).value,
      estado:      (form.elements.namedItem('estado') as HTMLSelectElement).value,
      ciudad:      (form.elements.namedItem('ciudad') as HTMLInputElement).value,
      direccion:   (form.elements.namedItem('direccion') as HTMLInputElement).value,
      responsable: (form.elements.namedItem('responsable') as HTMLInputElement).value,
      telefono:    (form.elements.namedItem('telefono') as HTMLInputElement).value,
      dias:        (form.elements.namedItem('dias') as HTMLSelectElement).value,
      hora_inicio: (form.elements.namedItem('hora_inicio') as HTMLInputElement).value,
      hora_fin:    (form.elements.namedItem('hora_fin') as HTMLInputElement).value,
      items:       selectedItems,
      info:        (form.elements.namedItem('info') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/centros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al registrar')
      }
      onSuccess()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Registrar centro de acopio</h2>
            <p className="text-sm text-gray-500">La información queda visible para la comunidad</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Datos del centro */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Datos del centro</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nombre del centro *</label>
                <input name="nombre" required placeholder="Ej: Centro Comunitario La Paz"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Estado *</label>
                  <select name="estado" required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand bg-white">
                    <option value="">Seleccionar</option>
                    {ESTADOS.map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Ciudad *</label>
                  <input name="ciudad" required placeholder="Ej: Maiquetía"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Dirección exacta *</label>
                <input name="direccion" required placeholder="Ej: Av. Principal, frente al Banco Venezuela"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
              </div>
            </div>
          </div>

          {/* Responsable */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Responsable</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nombre *</label>
                <input name="responsable" required placeholder="Ej: Carmen López"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Teléfono para donaciones *</label>
                <input name="telefono" required placeholder="0412-1234567"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
              </div>
            </div>
          </div>

          {/* Horario */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Horario de atención</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Días *</label>
                <select name="dias" required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand bg-white">
                  {DIAS_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hora inicio *</label>
                <input name="hora_inicio" type="time" defaultValue="08:00" required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hora fin *</label>
                <input name="hora_fin" type="time" defaultValue="17:00" required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">¿Qué reciben?</h3>
            <p className="text-xs text-gray-400 mb-2">Artículos generales</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {ITEMS_BASICOS.map(item => (
                <label key={item} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={selectedItems.includes(item)}
                    onChange={() => toggleItem(item)}
                    className="w-4 h-4 accent-brand rounded" />
                  {item}
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-2">Equipo de búsqueda y rescate</p>
            <div className="grid grid-cols-2 gap-2">
              {ITEMS_RESCATE.map(item => (
                <label key={item} className="flex items-center gap-2 text-sm text-blue-700 cursor-pointer">
                  <input type="checkbox" checked={selectedItems.includes(item)}
                    onChange={() => toggleItem(item)}
                    className="w-4 h-4 rounded" style={{ accentColor: '#185FA5' }} />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* Info adicional */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Información adicional</label>
            <textarea name="info" rows={2}
              placeholder="Ej: También necesitamos voluntarios con experiencia en rescate"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand resize-none" />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="px-6 py-2 text-sm bg-brand hover:bg-brand-dark text-white font-medium rounded-lg transition-colors disabled:opacity-60">
              {loading ? 'Publicando...' : 'Publicar registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
