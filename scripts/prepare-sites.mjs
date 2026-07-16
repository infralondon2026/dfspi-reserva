import { cpSync, mkdirSync, writeFileSync } from 'node:fs'

mkdirSync('dist/server', { recursive: true })
mkdirSync('dist/.openai', { recursive: true })
cpSync('.openai/hosting.json', 'dist/.openai/hosting.json')

writeFileSync('dist/server/index.js', `
export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404 || request.method !== 'GET') return response
    const url = new URL(request.url)
    url.pathname = '/index.html'
    return env.ASSETS.fetch(new Request(url, request))
  }
}
`)
