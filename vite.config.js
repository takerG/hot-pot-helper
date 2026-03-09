import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { join } from 'path'
import replace from '@rollup/plugin-replace'

// 读取版本号
const version = readFileSync(join(__dirname, 'VERSION'), 'utf-8').trim()

export default defineConfig({
  plugins: [
    react(),
    replace({
      __VERSION__: `"${version}"`,
      preventAssignment: true,
    }),
  ],
  base: '/hot-pot-helper/',
  build: {
    outDir: 'docs',
  },
})
