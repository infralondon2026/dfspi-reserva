import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, relative, sep } from 'node:path'

const source='spa-dist'
const target='dist'
rmSync(target,{recursive:true,force:true})
mkdirSync(join(target,'server'),{recursive:true})
mkdirSync(join(target,'.openai'),{recursive:true})
cpSync('.openai/hosting.json',join(target,'.openai','hosting.json'))

const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2'}
const files={}
function collect(dir){for(const name of readdirSync(dir)){const full=join(dir,name);if(statSync(full).isDirectory())collect(full);else{const path='/'+relative(source,full).split(sep).join('/');files[path]={type:mime[extname(full).toLowerCase()]||'application/octet-stream',data:readFileSync(full).toString('base64')}}}}
collect(source)

const server=`const files=${JSON.stringify(files)};
function bytes(value){const raw=atob(value);const out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out}
async function handler(request){const url=new URL(request.url);let key=url.pathname==='/'?'/index.html':url.pathname;let file=files[key];if(!file&&!key.split('/').pop().includes('.'))file=files['/index.html'];if(!file)return new Response('Not found',{status:404});return new Response(bytes(file.data),{headers:{'content-type':file.type,'cache-control':key==='/index.html'?'no-cache':'public, max-age=31536000, immutable','x-content-type-options':'nosniff'}})}
export {handler as fetch};export default handler;`
writeFileSync(join(target,'server','index.js'),server)
