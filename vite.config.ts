import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import { nitro } from "nitro/vite";

export default defineConfig(({ mode }) => ({

  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    mode !== 'development' && nitro(),
  ].filter(Boolean),
}))