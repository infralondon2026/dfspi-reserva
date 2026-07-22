import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('localized public app', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('scrollTo', vi.fn())
  })

  it('renders the English route and updates GEO metadata', async () => {
    render(
      <MemoryRouter initialEntries={['/en/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1, name: /duty-free world/i })).toBeTruthy()
    expect(screen.getByText('Where is Duty Free Shop Puerto Iguazú located?')).toBeTruthy()
    fireEvent.click(screen.getByText('Is online product reservation available?'))
    expect(screen.getByText('Online product reservation is not currently available.')).toBeTruthy()

    await waitFor(() => {
      expect(document.documentElement.lang).toBe('en')
      expect(document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(
        'https://infralondon2026.github.io/dfspi-reserva/en/',
      )
      expect(document.querySelector('link[hreflang="pt-BR"]')).toBeTruthy()
      expect(document.querySelector('#seo-jsonld')?.textContent).toContain('FAQPage')
    })
  })

  it('keeps a controlled FAQ conversation in the chat UI', () => {
    render(
      <MemoryRouter initialEntries={['/es/']}>
        <App />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Ayuda' }))
    const input = screen.getByRole('textbox', { name: 'Escribí tu consulta...' })
    const send = screen.getByRole('button', { name: 'Enviar' })

    fireEvent.change(input, { target: { value: 'hola' } })
    fireEvent.click(send)
    expect(screen.getAllByText(/Puedo ayudarte con horarios/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/No entendí del todo/i)).toBeNull()

    fireEvent.change(input, { target: { value: '¿A qué hora abren los viernes?' } })
    fireEvent.click(send)
    expect(screen.getAllByText(/viernes y sábados de 12:00 a 21:00/i).length).toBeGreaterThan(0)

    fireEvent.change(input, { target: { value: '¿Y los sábados?' } })
    fireEvent.click(send)
    expect(screen.getAllByText(/viernes y sábados de 12:00 a 21:00/i).length).toBeGreaterThan(1)
  })
})
