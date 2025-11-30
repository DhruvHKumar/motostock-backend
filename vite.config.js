import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        proxy: {
            '/api/analyse': {
                target: 'https://n8n.dnklabs.xyz',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/analyse/, '/webhook/motostock-analyse'),
                secure: false
            },
            '/api/restock': {
                target: 'https://n8n.dnklabs.xyz',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/restock/, '/webhook/motostock-restock'),
                secure: false
            }
        }
    }
})


