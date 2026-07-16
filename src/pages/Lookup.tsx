import { useState, type FormEvent } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import ReservationView from '../components/ReservationView'
import { useLocale, useStoreData } from '../context/AppContext'
import type { Reservation } from '../types'

export default function Lookup() {
  const { tr } = useLocale()
  const { store } = useStoreData()
  const [result, setResult] = useState<Reservation | null | undefined>(undefined)
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    const data = new FormData(event.currentTarget)
    try {
      setResult(await store.findReservation(String(data.get('code')), String(data.get('email'))))
    } catch {
      setResult(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="lookup-page">
      <div className="lookup-card">
        <div className="lookup-icon">
          <Search />
        </div>
        <h1>{tr('lookupTitle')}</h1>
        <p>{tr('lookupBody')}</p>
        <form onSubmit={event => void submit(event)}>
          <label>
            <span>{tr('code')}</span>
            <input name="code" placeholder="IGZ-XXXX-XXXX" required />
          </label>
          <label>
            <span>{tr('email')}</span>
            <input name="email" type="email" required />
          </label>
          <button className="button gold wide" disabled={busy}>
            {tr('lookup')} <ArrowRight />
          </button>
        </form>
        {result === null && <p className="not-found">{tr('notFound')}</p>}
        {result && <ReservationView reservation={result} />}
      </div>
    </div>
  )
}
