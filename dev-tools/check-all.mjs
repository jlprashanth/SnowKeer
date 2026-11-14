// Runs every content/mock check — run: node dev-tools/check-all.mjs  (also: npm run check; the deploy workflow runs it too)
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const dir = path.dirname(fileURLToPath(import.meta.url))
const CHECKS = ['check-mock', 'check-js', 'check-cs', 'check-quiz', 'check-exercises', 'check-glossary', 'check-page-terms', 'check-pdi-checks']
const failed = []
for (const c of CHECKS) {
  const r = spawnSync(process.execPath, [path.join(dir, c + '.mjs')], { encoding: 'utf8' })
  const out = (r.stdout + r.stderr).trim().split('\n')
  console.log(`${r.status === 0 ? '✔' : '✘'} ${c}: ${out[out.length - 1]}`)
  if (r.status !== 0) {
    failed.push(c)
    console.log(out.filter((l) => /FAIL|✗|MISSING|problem|error/i.test(l)).slice(0, 15).map((l) => '    ' + l).join('\n'))
  }
}
console.log(failed.length ? `\n${failed.length} check(s) failed: ${failed.join(', ')}` : '\nAll checks passed')
process.exit(failed.length ? 1 : 0)
