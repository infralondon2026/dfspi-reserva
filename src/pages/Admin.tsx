import { useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, Clock3, LockKeyhole, PackageCheck, ShoppingBag } from 'lucide-react'
import { logo, resolveImage } from '../assets'
import { useLocale, useStoreData } from '../context/AppContext'
import type { AdminSession, Product, Reservation, ReservationStatus } from '../types'

const STATUS_LIST: ReservationStatus[] = [
  'confirmada',
  'lista_para_retirar',
  'retirada',
  'cancelada',
  'vencida',
]

export default function Admin() {
  const { tr } = useLocale()
  const { store } = useStoreData()
  const [session, setSession] = useState<AdminSession | null | undefined>(undefined)
  const [tab, setTab] = useState<'reservas' | 'productos'>('reservas')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const load = async () => {
    try {
      const [nextReservations, nextProducts] = await Promise.all([
        store.listReservations(),
        store.listProducts(),
      ])
      setReservations(nextReservations)
      setProducts(nextProducts)
    } catch {
      // keep last known data on transient failures
    }
  }

  useEffect(() => {
    store
      .restoreSession()
      .then(setSession)
      .catch(() => setSession(null))
  }, [store])

  useEffect(() => {
    if (session) void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  if (!store.adminEnabled()) {
    return (
      <div className="page empty">
        <LockKeyhole />
        <h1>{tr('adminDisabled')}</h1>
        <p>{tr('adminDisabledBody')}</p>
      </div>
    )
  }
  if (session === undefined) {
    return (
      <div className="page empty">
        <Clock3 />
        <h1>{tr('loading')}</h1>
      </div>
    )
  }
  if (!session) return <AdminLogin onLogin={setSession} />

  const updateStatus = async (code: string, status: ReservationStatus) => {
    setReservations(list => list.map(r => (r.code === code ? { ...r, status } : r)))
    try {
      await store.setReservationStatus(code, status)
    } catch {
      // reload below restores the truth if the update failed
    }
    void load()
  }

  const updateStock = async (product: Product, value: number) => {
    const stock = Math.max(0, value)
    setProducts(list => list.map(p => (p.id === product.id ? { ...p, stock } : p)))
    try {
      await store.setStock(product.id, stock)
    } catch {
      void load()
    }
  }

  const count = (status: ReservationStatus) => reservations.filter(r => r.status === status).length

  return (
    <div className="admin-page">
      <aside className="admin-nav">
        <img src={logo} alt="DFSPI" />
        <span>{tr('panelInternal')}</span>
        <button className={tab === 'reservas' ? 'active' : ''} onClick={() => setTab('reservas')}>
          <PackageCheck /> {tr('adminReservations')} <b>{count('confirmada')}</b>
        </button>
        <button className={tab === 'productos' ? 'active' : ''} onClick={() => setTab('productos')}>
          <ShoppingBag /> {tr('adminProducts')}
        </button>
        <button
          onClick={() => {
            void store.signOut()
            setSession(null)
          }}
        >
          <LockKeyhole /> {tr('signOut')}
        </button>
      </aside>
      <section className="admin-content">
        <div className="admin-title">
          <div>
            <small>DFSPI · Puerto Iguazú</small>
            <h1>{tab === 'reservas' ? tr('adminReservations') : tr('adminCatalogTitle')}</h1>
          </div>
          <div className="admin-user">
            {(session.email || 'DF').slice(0, 2).toUpperCase()}{' '}
            <span>
              <b>{session.email}</b>
              <small>{session.role}</small>
            </span>
          </div>
        </div>
        {tab === 'reservas' ? (
          <>
            <div className="stats">
              <Stat label={tr('statConfirmed')} value={count('confirmada')} />
              <Stat label={tr('statReady')} value={count('lista_para_retirar')} />
              <Stat label={tr('statPickedUp')} value={count('retirada')} />
              <Stat label={tr('statTotal')} value={`$${reservations.reduce((s, r) => s + r.total, 0)}`} />
            </div>
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{tr('colCode')}</th>
                    <th>{tr('colCustomer')}</th>
                    <th>{tr('colPickup')}</th>
                    <th>{tr('colItems')}</th>
                    <th>{tr('colTotal')}</th>
                    <th>{tr('colStatus')}</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map(reservation => (
                    <tr key={reservation.code}>
                      <td>
                        <b>{reservation.code}</b>
                      </td>
                      <td>
                        {reservation.customer.name}
                        <small>{reservation.customer.email}</small>
                      </td>
                      <td>{new Date(reservation.pickupDate + 'T12:00').toLocaleDateString()}</td>
                      <td>{reservation.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                      <td>USD {reservation.total}</td>
                      <td>
                        <select
                          value={reservation.status}
                          onChange={event =>
                            void updateStatus(reservation.code, event.target.value as ReservationStatus)
                          }
                        >
                          {STATUS_LIST.map(status => (
                            <option key={status} value={status}>
                              {status.replaceAll('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {!reservations.length && (
                    <tr>
                      <td colSpan={6} className="no-data">
                        {tr('noReservations')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="admin-products">
            {products.map(product => (
              <div key={product.id}>
                <img src={resolveImage(product.image)} alt={product.name} />
                <span>
                  <small>{product.brand}</small>
                  <b>{product.name}</b>
                  <em>USD {product.price}</em>
                </span>
                <label>
                  {tr('stockLabel')}{' '}
                  <input
                    type="number"
                    min="0"
                    value={product.stock}
                    onChange={event => void updateStock(product, Number(event.target.value))}
                  />
                </label>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="stat">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  )
}

function AdminLogin({ onLogin }: { onLogin: (session: AdminSession) => void }) {
  const { tr } = useLocale()
  const { store } = useStoreData()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    const data = new FormData(event.currentTarget)
    try {
      onLogin(await store.signIn(String(data.get('email')), String(data.get('password'))))
    } catch {
      setError(tr('badCredentials'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login">
      <form onSubmit={event => void submit(event)}>
        <img src={logo} alt="DFSPI" />
        <div className="lookup-icon">
          <LockKeyhole />
        </div>
        <h1>{tr('adminLoginTitle')}</h1>
        <p>{tr('adminLoginBody')}</p>
        <label>
          <span>Email</span>
          <input type="email" name="email" autoComplete="username" required />
        </label>
        <label>
          <span>{tr('passwordLabel')}</span>
          <input type="password" name="password" autoComplete="current-password" required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="button gold wide" disabled={busy}>
          {tr('signInAction')} <ArrowRight />
        </button>
      </form>
    </div>
  )
}
