import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Centro de Acopio Venezuela 🇻🇪',
  description: 'Registro de centros de donación tras el terremoto de Venezuela 2026. Encuentra dónde llevar agua, comida, medicamentos, ropa y equipo de rescate.',
  keywords: 'centro acopio venezuela, donaciones terremoto venezuela 2026, ayuda humanitaria',
  openGraph: {
    title: 'Centro de Acopio Venezuela 🇻🇪',
    description: 'Encuentra centros de donación activos en tu estado. Iniciativa ciudadana voluntaria.',
    locale: 'es_VE',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
