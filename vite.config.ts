import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import { nitro } from "nitro/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
      tsconfigPaths: true,
  },
  plugins: [
    tanstackStart(),
    react(),
    babel({ presets: [reactCompilerPreset()]}),
    tailwindcss(),
    nitro(),
  ],
})
