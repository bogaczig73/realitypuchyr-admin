// Fails the build if a t() key used in code is missing from any locale.
// Catches what `next build` only catches by accident: MISSING_MESSAGE at render time.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const MSG = existsSync('messages') ? 'messages' : 'src/messages'
const SRC = 'src'

const flat = (o, p = '', out = {}) => {
  for (const [k, v] of Object.entries(o)) {
    const key = p ? `${p}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, key, out)
    else out[key] = v
  }
  return out
}

const locales = Object.fromEntries(
  readdirSync(MSG).filter(f => f.endsWith('.json'))
    .map(f => [f.slice(0, -5), flat(JSON.parse(readFileSync(join(MSG, f), 'utf8')))])
)

const files = []
;(function walk(dir) {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === '.next') continue
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(tsx?|jsx?)$/.test(e)) files.push(p)
  }
})(SRC)

const problems = []
for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const ns = {}
  for (const m of src.matchAll(
    /(?:const|let|var)\s+(\w+)\s*=\s*(?:await\s+)?(?:useTranslations|getTranslations)\s*\(\s*(?:['"]([^'"]*)['"])?/g
  )) ns[m[1]] = m[2] ?? ''

  for (const [v, prefix] of Object.entries(ns)) {
    const re = new RegExp(`\\b${v}(?:\\.rich|\\.raw|\\.markup)?\\s*\\(\\s*['"]([^'"]+)['"]`, 'g')
    for (const m of src.matchAll(re)) {
      const key = prefix ? `${prefix}.${m[1]}` : m[1]
      const missing = Object.keys(locales).filter(l => !(key in locales[l])).sort()
      if (missing.length) problems.push(`  ${key}\n      missing in: ${missing.join(', ')}\n      used in:    ${file}`)
    }
  }
}

if (problems.length) {
  console.error(`\ni18n check failed — ${problems.length} key(s) referenced in code but absent from a locale:\n`)
  console.error([...new Set(problems)].join('\n'))
  console.error('')
  process.exit(1)
}
console.log(`i18n check ok — ${files.length} files, locales: ${Object.keys(locales).join(', ')}`)
