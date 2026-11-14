// Newer-JavaScript syntax that her PDI REJECTS in a Background Script (measured there on 2026-11-14) and in any server script whose
// 'Turn on ECMAScript 2021 (ES12) mode' toggle is OFF (Business Rules / Script Includes have that toggle per script). The in-browser runner accepts all of it, so the runner shows
// these as warnings and the dev-tools checks keep reference solutions free of them.
// Works in her PDI (so NOT listed): const, arrow functions, template literals, includes, padStart, startsWith,
// Object.entries / values / assign, Array.from / find.
const RULES = [
  [/\blet\s+[A-Za-z_$[{]/, "`let` → Background Script lo (ES12 mode off) SyntaxError (\"let is an ECMAScript 6 feature - not supported\"). `var` leda `const` vaadu."],
  [/\b(?:var|const|let)\s*[{[]/, 'Destructuring (var { a } = obj) → Background Script lo (ES12 mode off) SyntaxError. obj.a ani direct ga chaduvu.'],
  [/\.\.\.\s*[A-Za-z_$[{(]/, 'Spread / rest (...) → Background Script lo (ES12 mode off) syntax error. concat() / apply() / arguments vaadu.'],
  [/\bclass\s+[A-Za-z_$]/, '`class` → Background Script lo (ES12 mode off) reserved word error. ServiceNow lo Class.create() + prototype vaadu.'],
  [/\bfunction\b[^(]*\([^)]*[^=!<>]=[^=>]/, 'Default parameter value (function (a = 1)) → Background Script lo (ES12 mode off) error. Lopala a = a || 1 ani rayi.'],
  [/\bfor\s*\(\s*(?:var|let|const)?\s*[A-Za-z_$][\w$]*\s+of\b/, '`for…of` → Background Script lo (ES12 mode off) syntax error. Normal for loop leda forEach vaadu.'],
  [/\bnew\s+(?:Map|Set|WeakMap|WeakSet|Promise)\b|\bPromise\./, 'Map / Set / Promise → Background Script lo (ES12 mode off) undefined. Object / array vaadu.'],
]

// drop comments and the CONTENT of string / template literals so words inside text never trigger a rule
function stripStringsAndComments(code) {
  let out = ''
  let i = 0
  const s = String(code)
  while (i < s.length) {
    const c = s[i]
    const n = s[i + 1]
    if (c === '/' && n === '/') {
      while (i < s.length && s[i] !== '\n') i++
    } else if (c === '/' && n === '*') {
      i += 2
      while (i < s.length && !(s[i] === '*' && s[i + 1] === '/')) i++
      i += 2
    } else if (c === '"' || c === "'" || c === '`') {
      out += c + c
      i++
      while (i < s.length && s[i] !== c) i += s[i] === '\\' ? 2 : 1
      i++
    } else {
      out += c
      i++
    }
  }
  return out
}

export function brazilSyntaxWarnings(code) {
  const clean = stripStringsAndComments(code)
  return RULES.filter(([re]) => re.test(clean)).map(([, msg]) => msg)
}
