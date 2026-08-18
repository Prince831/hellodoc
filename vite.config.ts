
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * The component tagger injects `data-lov-*` props into every JSX element.
 * react-three-fiber forwards unknown props onto three.js objects, which throws
 * for scene primitives — so 3D files are excluded from tagging.
 */
const scopedTagger = () => {
  const tagger = componentTagger() as any;
  const originalTransform = tagger.transform;
  return {
    ...tagger,
    transform(this: unknown, code: string, id: string, options: unknown) {
      if (id.includes("/components/three/")) return null;
      const fn = typeof originalTransform === "function" ? originalTransform : originalTransform?.handler;
      return fn ? fn.call(this, code, id, options) : null;
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "a00b6544-1bc1-46dc-8c56-d76a951ad945.lovableproject.com"
    ]
  },
  plugins: [
    react(),
    mode === 'development' && scopedTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
