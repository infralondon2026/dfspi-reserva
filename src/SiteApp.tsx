'use client'

import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

export default function SiteApp(){
  const [mounted,setMounted]=useState(false)
  useEffect(()=>setMounted(true),[])
  if(!mounted)return <div style={{minHeight:'100vh',background:'#fff'}} />
  const base=import.meta.env.BASE_URL==='/'?undefined:import.meta.env.BASE_URL.replace(/\/$/,'')
  return <BrowserRouter basename={base}><App/></BrowserRouter>
}
