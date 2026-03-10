import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { join } from 'path'

// 读取版本号
const version = readFileSync(join(__dirname, 'version.txt'), 'utf-8').trim()

export default defineConfig({
  plugins: [react()],
  define: {
    __VERSION__: JSON.stringify(version),
  },
  base: '/hot-pot-helper/',
  build: {
    outDir: 'docs',
  },
})
