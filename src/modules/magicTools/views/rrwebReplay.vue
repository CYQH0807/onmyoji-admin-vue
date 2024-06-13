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
import { getReplayConsolePlugin } from "@saola.ai/rrweb-plugin-console-replay";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";
let events = JSON.parse(localStorage.getItem("rrweb-events") || "[]");
console.log("events: ", events);
let replayer: any;
function begin() {
	if (events.length > 0) {
		replayer = new rrwebPlayer({
			target: document.getElementById("rrwebPlayer"), // 可以自定义 DOM 元素
			// 配置项
			props: {
				events
			},
			plugins: [
				getReplayConsolePlugin({
					level: ["info", "log", "warn", "error"]
				})
			]
		});
	}
}

import { genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile, UploadRequestOptions } from "element-plus";

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
