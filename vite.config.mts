import path from "path";
import { ConfigEnv, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import { proxy } from "./src/config/proxy";
import { cool } from "@cool-vue/vite-plugin";
import { constants } from "crypto";

function resolve(dir: string) {
	return path.resolve(__dirname, ".", dir);
}

function isDev(mode: string | undefined): boolean {
	return mode === "development";
}

function isLib(mode: string | undefined): boolean {
	return mode === "lib";
}

import Unocss from "unocss/vite";
import { presetAttributify, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from "unocss";

// https://vitejs.dev/config
export default ({ mode }: ConfigEnv): UserConfig => {
	console.log("mode: ", mode);
	const libBuild = {
		target: "esnext",
		cssCodeSplit: true,
		lib: {
			entry: "./lib/main.ts",
			name: "my-test",
			fileName: "my-test"
		},
		external: [],
		rollupOptions: {
			plugins: [visualizer()],
			external: [],
			input: {
				main: "./lib/main.ts"
			},
			output: {
				dir: "distLib"
			}
		}
	};

	return {
		plugins: [
			vue(),
			compression(),
			vueJsx(),
			cool({
				type: "admin",
				proxy
			}),
			visualizer({
				open: false,
				gzipSize: true,
				brotliSize: true
			}),
			// https://github.com/antfu/unocss
			// see unocss.config.ts for config
			Unocss({
				presets: [
					presetUno(),
					presetAttributify(),
					presetIcons({
						scale: 1.2,
						warn: true
					})
				],
				transformers: [transformerDirectives(), transformerVariantGroup()]
			})
		],
		base: "/",
		server: {
			port: 9000,
			proxy,
			hmr: {
				overlay: true
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					charset: false
				}
			}
		},
		resolve: {
			alias: {
				"/@": resolve("src"),
				"/$": resolve("src/modules"),
				"/#": resolve("src/plugins"),
				"/~": resolve("packages")
			}
		},
		esbuild: {
			drop: isDev(mode) ? [] : ["console", "debugger"]
		},
		build: {
			minify: "esbuild",
			// terserOptions: {
			// 	compress: {
			// 		drop_console: true,
			// 		drop_debugger: true
			// 	}
			// },
			sourcemap: isDev(mode),
			rollupOptions: {
				output: {
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
					manualChunks(id) {
						if (id.includes("node_modules")) {
							if (!["@cool-vue/crud"].find((e) => id.includes(e))) {
								if (id.includes("prettier")) {
									return;
								}

								return id.toString().split("node_modules/")[1].replace(".pnpm/", "").split("/")[0];
							} else {
								return "comm";
							}
						}
					}
				}
			}
		}
	};
};
