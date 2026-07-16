// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { createReservation, findReservation, getProducts, getReservations, setReservationStatus } from './store'

describe('reservation inventory flow',()=>{
 beforeEach(()=>localStorage.clear())
 it('creates a reservation and atomically reduces available stock',()=>{
  const before=getProducts().find(p=>p.id==='ch-212')!.stock
  const r=createReservation({name:'Ada Lovelace',email:'ada@example.com',phone:'12345678'},new Date(Date.now()+86400000).toISOString().slice(0,10),[{productId:'ch-212',quantity:2}],'es')
  expect(r.code).toMatch(/^IGZ-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
  expect(getProducts().find(p=>p.id==='ch-212')!.stock).toBe(before-2)
  expect(findReservation(r.code,'ADA@example.com')?.code).toBe(r.code)
 })
 it('rejects quantities larger than stock',()=>{
  expect(()=>createReservation({name:'Test User',email:'test@example.com',phone:'12345678'},new Date(Date.now()+86400000).toISOString().slice(0,10),[{productId:'airpods',quantity:99}],'pt')).toThrow('stock')
  expect(getReservations()).toHaveLength(0)
 })
 it('returns stock once when a reservation is cancelled',()=>{
  const before=getProducts().find(p=>p.id==='amor-amor')!.stock
  const r=createReservation({name:'Grace Hopper',email:'grace@example.com',phone:'12345678'},new Date(Date.now()+86400000).toISOString().slice(0,10),[{productId:'amor-amor',quantity:1}],'es')
  setReservationStatus(r.code,'cancelada');setReservationStatus(r.code,'cancelada')
  expect(getProducts().find(p=>p.id==='amor-amor')!.stock).toBe(before)
 })
})
