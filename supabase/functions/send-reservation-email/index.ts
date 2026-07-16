import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
serve(async(req)=>{
 if(req.method!=='POST')return new Response('Method not allowed',{status:405})
 const secret=req.headers.get('x-webhook-secret');if(secret!==Deno.env.get('WEBHOOK_SECRET'))return new Response('Unauthorized',{status:401})
 const {reservation}=await req.json(),pt=reservation.locale==='pt'
 const html=`<div style="font-family:Arial;color:#071c36;max-width:600px;margin:auto"><h1>${pt?'Reserva confirmada':'Reserva confirmada'}</h1><p>${pt?'Guardamos sua seleção até':'Guardamos tu selección hasta'} <b>${reservation.pickupDate}</b>.</p><div style="background:#f5f2e9;padding:24px;text-align:center"><small>${pt?'Código da reserva':'Código de reserva'}</small><h2 style="letter-spacing:3px">${reservation.code}</h2></div><p>${pt?'Você paga na retirada na loja.':'Pagás al retirar en tienda.'}</p><p>Duty Free Shop Puerto Iguazú · Ruta 12 km 1645,5</p></div>`
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${Deno.env.get('RESEND_API_KEY')}`,'Content-Type':'application/json'},body:JSON.stringify({from:Deno.env.get('RESEND_FROM_EMAIL'),to:reservation.email,subject:pt?`Sua reserva ${reservation.code}`:`Tu reserva ${reservation.code}`,html})})
 return new Response(await response.text(),{status:response.status,headers:{'Content-Type':'application/json'}})
})
