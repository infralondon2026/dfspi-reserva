import '../src/styles.css'
import '../src/overrides.css'
import type { ReactNode } from 'react'

export const metadata={
  title:'DFSPI — Reservá. Viajá. Retirá.',
  description:'Reservá productos del Duty Free Shop Puerto Iguazú y retiralos en tienda.'
}

export default function RootLayout({children}:{children:ReactNode}){
  return <html lang="es"><body>{children}</body></html>
}
