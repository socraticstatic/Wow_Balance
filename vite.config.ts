import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { homedir } from 'node:os'
import { existsSync } from 'node:fs'

// Use local skill data if available, otherwise use bundled copy
const skillDataPath = resolve(homedir(), '.agents/skills/balance-druid/data');
const bundledDataPath = resolve(__dirname, 'src/skill-data');
const dataPath = existsSync(skillDataPath) ? skillDataPath : bundledDataPath;

export default defineConfig({
  base: '/Wow_Balance/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@data': dataPath,
    },
  },
})
