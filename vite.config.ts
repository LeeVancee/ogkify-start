import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nitro } from "nitro/vite";

export default defineConfig(({ mode }) => ({

  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart(),
    react({ compiler: true }),
    tailwindcss(),
    mode !== 'development' && nitro(),
  ].filter(Boolean),
}))
