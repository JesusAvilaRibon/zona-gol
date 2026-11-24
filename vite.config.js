import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// base "./" = rutas relativas: el build funciona igual en GitHub Pages, Netlify o Vercel.
export default defineConfig({
  plugins: [vue()],
  base: "./",
});
