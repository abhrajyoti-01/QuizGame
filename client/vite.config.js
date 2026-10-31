import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The Python server (server/web_app.py) owns /api/questions.
// During `npm run dev` requests are proxied to it. If port 8000 is busy,
// start the API with `python server/web_app.py --port 8080` and run
// `API_PORT=8080 npm run dev`.
const apiTarget = `http://127.0.0.1:${process.env.API_PORT ?? 8000}`;

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": apiTarget,
    },
  },
});
