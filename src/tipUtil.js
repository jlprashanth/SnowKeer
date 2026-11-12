// Build an inline hover-help card without registering it in tips.js
export const dyn = (title, body, real) => 'dyn:' + encodeURIComponent(JSON.stringify({ title, body, real }))
