import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'kine_app_admin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`, 
  build: {
    outDir: 'build' 
  }
})