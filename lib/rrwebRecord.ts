import { record } from "rrweb";
import { getRecordConsolePlugin } from "@saola.ai/rrweb-plugin-console-record";

export default class rrwebRecord {
	private stopFn: any;
	private eventsMatrix: any[] = [[]];
	private lastEvents: any[] = [];

	constructor() {
		this.begin();
	}

	begin() {
		console.log("开始记录");
		this.stopFn = record({
			emit: (event, isCheckout) => {
				// const defaultLog = console.log["__rrweb_original__"] ? console.log["__rrweb_original__"] : console.log;
				// defaultLog(event);
				// isCheckout 是一个标识，告诉你重新制作了快照
				if (isCheckout) {
					this.eventsMatrix.push([]);
				}
				this.lastEvents = this.eventsMatrix[this.eventsMatrix.length - 1];
				this.lastEvents.push(event);
			},
			checkoutEveryNms: 15 * 1000, // 每3分钟重新制作快照

			plugins: [
				getRecordConsolePlugin({
					level: ["info", "log", "warn", "error"],
					lengthThreshold: 10000,
					stringifyOptions: {
						stringLengthLimit: 1000,
						numOfKeysLimit: 100,
						depthOfLimit: 1
					},
					logger: window.console
				})
			]
		});
	}

	upload() {
		const len = this.eventsMatrix.length;
		console.log("this.eventsMatrix: ", this.eventsMatrix);
		const events = this.eventsMatrix[len - 2].concat(this.eventsMatrix[len - 1]);

		const jsonString = JSON.stringify(events, null, 4);
		const blob = new Blob([jsonString], { type: "application/json" });
		// 创建一个 a 标签，设置 href 属性为 Blob 对象的 URL，并触发点击事件以下载文件
		const downloadLink = document.createElement("a");
		downloadLink.href = URL.createObjectURL(blob);
		downloadLink.download = "data.json";

		// 在 DOM 中添加 a 标签，并触发点击事件
		document.body.appendChild(downloadLink);
		downloadLink.click();

		// 移除 a 标签
		document.body.removeChild(downloadLink);

		// 释放 URL 对象
		URL.revokeObjectURL(downloadLink.href);

		// localStorage.setItem("rrweb-events", JSON.stringify(events));
		this.stopFn();
		this.eventsMatrix = [[]];
		console.log("记录停止");
	}
}
