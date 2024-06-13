import { createApp } from "vue";
import App from "./App.vue";
import "uno.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}
app.use(ElementPlus);

import RrwebRecord from "./rrwebRecord";
const obj = {
	// rrwebRecord: new RrwebRecord(),

	init: () => {
		// obj.rrwebRecord = new RrwebRecord();

		setTimeout(() => {
			// obj.rrwebRecord.upload();
		}, 35000);
	}
};

export default obj;

function initStyle(root) {
	const style = document.createElement("style");
	style.type = "text/css";
	style.innerText = `
	#myTestRoot{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		#myTest{
			
		}
	}
	`;
	root.appendChild(style);
}

window.onload = () => {
	const myTest = document.createElement("div");
	const root = document.createElement("div");
	myTest.id = "myTest";
	root.id = "myTestRoot";
	initStyle(myTest);
	myTest.appendChild(root);
	document.body.appendChild(myTest);

	app.mount("#myTestRoot");
};
