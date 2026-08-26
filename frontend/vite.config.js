import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// vite.config.js
// This file configures Vite — our development server and build tool.
// We add two plugins:
//   1. react()        → enables React/JSX support
//   2. tailwindcss()  → enables Tailwind CSS

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
