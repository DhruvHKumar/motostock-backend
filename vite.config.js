import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api/webhook': {
                target: 'https://n8n.dnklabs.xyz',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/webhook/, '/webhook/motostock'),
                secure: false
            }
        }
    }
})
