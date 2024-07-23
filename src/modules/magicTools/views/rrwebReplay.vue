<template>
	<div class="content" id="rrwebPlayer">
		<el-button @click="begin"> 开始回放</el-button>
		<el-upload ref="upload" class="upload-demo" :http-request="httpRequest" :limit="1">
			<template #trigger>
				<el-button type="primary">选择文件</el-button>
			</template>
		</el-upload>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { getReplayConsolePlugin } from "@rrweb/rrweb-plugin-console-replay";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";
let events = [];
let replayer: any;
function begin() {
	if (events.length > 0) {
		replayer = new rrwebPlayer({
			target: document.getElementById("rrwebPlayer"), // 可以自定义 DOM 元素
			// 配置项
			props: {
				events,
				plugins: [
					getReplayConsolePlugin({
						level: ["info", "log", "warn", "error"]
						// 通过插件获取到的 console 信息会以 console.log 的形式输出到控制台
						// 你也可以通过插件获取到的 console 信息，通过自定义的插件输出到其他地方
						// 例如：将 console 信息输出到自定义的 DOM 元素中
						// replayLogger: {
						// 	log: (msg: LogData) => {
						// 		console.log("msg: ", msg);
						// 	}
						// }
					})
				]
			}
		});
	}
}

import { genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile, UploadRequestOptions } from "element-plus";
import { LogData } from "rrweb";

const upload = ref<UploadInstance>();

function httpRequest(file: UploadRequestOptions) {
	return new Promise<void>((resolve, reject) => {
		console.log("file: ", file);
		// 将File对象解析为json
		const reader = new FileReader();
		reader.readAsText(file.file);
		reader.onload = (e) => {
			const result = e.target?.result;
			console.log("result: ", result);
			if (result && typeof result === "string") {
				events = JSON.parse(result);
				begin();
				resolve();
			}
		};
	});
}

onUnmounted(() => {
	// console.log(replayer);
	replayer?.pause();
});

// import { Replayer } from "rrweb";
// import { getReplayConsolePlugin } from "@saola.ai/rrweb-plugin-console-replay";
// const events = JSON.parse(localStorage.getItem("rrweb-events") || "[]");
// console.log("events: ", events);
// onMounted(() => {
// 	const replayer = new Replayer(events, {
// 		root: document.getElementById("rrwebPlayer"),
// 		plugins: [
// 			getReplayConsolePlugin({
// 				level: ["info", "log", "warn", "error"]
// 			})
// 		]
// 	});
// 	replayer.play();
// });
</script>

<style scoped></style>
