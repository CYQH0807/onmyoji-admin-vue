import VueECharts from "vue-echarts";
import ElementPlus from "element-plus";
import { useStore } from "./store";
import { config } from "/@/config";
import type { ModuleConfig } from "/@/cool";
import "element-plus/theme-chalk/src/index.scss";
import "./static/css/index.scss";

export default (): ModuleConfig => {
	return {
		order: 99,
		components: Object.values(import.meta.glob("./components/**/*.{vue,tsx}")),
		views: [
			{
				path: "/my/info",
				meta: {
					label: "个人中心"
				},
				component: () => import("./views/info.vue")
			}
		],
		toolbar: {
			order: 2,
			component: import("./components/rrwebRecord/index.vue")
		},
		pages: [
			{
				path: "/login",
				component: () => import("./pages/login/index.vue")
			},
			{
				path: "/401",
				meta: {
					process: false
				},
				component: () => import("./pages/error/401.vue")
			},
			{
				path: "/403",
				meta: {
					process: false
				},
				component: () => import("./pages/error/403.vue")
			},
			{
				path: "/404",
				meta: {
					process: false
				},
				component: () => import("./pages/error/404.vue")
			},
			{
				path: "/500",
				meta: {
					process: false
				},
				component: () => import("./pages/error/500.vue")
			},
			{
				path: "/502",
				meta: {
					process: false
				},
				component: () => import("./pages/error/502.vue")
			}
		],
		install(app) {
			// element-plus
			app.use(ElementPlus);

			// charts
			app.component("v-chart", VueECharts);

			// 设置标题
			document.title = config.app.name;
		},
		async onLoad() {
			const { user, menu, app } = useStore();

			// token 事件
			async function hasToken(cb: () => Promise<any> | void) {
				if (cb) {
					app.addEvent("hasToken", cb);

					if (user.token) {
						await cb();
					}
				}
			}

			await hasToken(async () => {
				// 获取用户信息
				user.get();
				// 获取菜单权限
				await menu.get();
			});

			return {
				hasToken
			};
		}
	};
};
