Import { defineConfig } from 'vite'
import react from '@viewjs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', 
  plugins: [react()],
})
