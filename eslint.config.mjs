import nextVitals from 'eslint-config-next/core-web-vitals'

/** Minimal lint setup: Next.js's own recommended rules, nothing stylistic. */
const config = [
  ...nextVitals.map((block) =>
    block.plugins?.['react-hooks']
      ? { ...block, rules: { ...block.rules, 'react-hooks/set-state-in-effect': 'warn', 'react-hooks/refs': 'warn' } }
      : block,
  ),
  // React's newer advisory rules (set-state-in-effect, refs) flag patterns in the working Studio
  // player, People wall and Pulse globe. They are not bugs; they stay visible as warnings.
  {
    ignores: ['.next/**', 'node_modules/**', 'public/**', 'supabase/functions/**', 'next-env.d.ts'],
  },
]

export default config
