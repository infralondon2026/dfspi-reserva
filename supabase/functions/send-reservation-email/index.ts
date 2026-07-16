import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const CODE_PATTERN = /^IGZ-[A-Z0-9]{4}-[A-Z0-9]{4}$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c)

serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders })
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405)

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400)
  }

  const reservation = (payload as { reservation?: Record<string, unknown> } | null)?.reservation
  const code = typeof reservation?.code === 'string' ? reservation.code.toUpperCase() : ''
  const email = typeof reservation?.email === 'string' ? reservation.email.trim() : ''
  const pickupDate = typeof reservation?.pickupDate === 'string' ? reservation.pickupDate : ''
  const locale = reservation?.locale === 'pt' ? 'pt' : 'es'

  if (!CODE_PATTERN.test(code) || !EMAIL_PATTERN.test(email) || !DATE_PATTERN.test(pickupDate)) {
    return json({ ok: false, error: 'invalid_reservation' }, 400)
  }

  const apiKey = Deno.env.get('RESEND_API_KEY')
  const from = Deno.env.get('RESEND_FROM_EMAIL')
  if (!apiKey || !from) return json({ ok: false, error: 'email_not_configured' }, 500)

  const pt = locale === 'pt'
  const html = `<div style="font-family:Arial;color:#071c36;max-width:600px;margin:auto">
    <h1>${pt ? 'Reserva confirmada' : 'Reserva confirmada'}</h1>
    <p>${pt ? 'Guardamos sua seleção até' : 'Guardamos tu selección hasta'} <b>${escapeHtml(pickupDate)}</b>.</p>
    <div style="background:#f5f2e9;padding:24px;text-align:center">
      <small>${pt ? 'Código da reserva' : 'Código de reserva'}</small>
      <h2 style="letter-spacing:3px">${escapeHtml(code)}</h2>
    </div>
    <p>${pt ? 'Você paga na retirada na loja.' : 'Pagás al retirar en tienda.'}</p>
    <p>Duty Free Shop Puerto Iguazú · Ruta 12 km 1645,5</p>
  </div>`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: email,
        subject: pt ? `Sua reserva ${code}` : `Tu reserva ${code}`,
        html,
      }),
    })
    // Never relay Resend's raw body (it may include ids/keys); only the outcome.
    return json({ ok: response.ok }, response.ok ? 200 : 502)
  } catch {
    return json({ ok: false, error: 'send_failed' }, 502)
  }
})
