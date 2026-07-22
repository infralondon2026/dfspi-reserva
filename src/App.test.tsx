import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

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
})
