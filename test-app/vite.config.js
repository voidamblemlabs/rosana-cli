import { defineConfig } from "vite";

export default defineConfig({
    build: {
        minify: false,
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
        output: {
            beautify: false,
            comments: "some",
            preserve_annotations: true,
            semicolons: true,
        },
    },
});
