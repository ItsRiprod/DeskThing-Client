import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy({
    targets: ['Chrome 69'],
  }),],
  base: '/usr/share/qt-superbird-app/webapp/',
})
