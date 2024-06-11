<template>
	<div class="content" id="rrwebPlayer">回放</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
// import { getReplayConsolePlugin } from "@saola.ai/rrweb-plugin-console-replay";
// import rrwebPlayer from "rrweb-player";
// import "rrweb-player/dist/style.css";
// const events = JSON.parse(localStorage.getItem("rrweb-events") || "[]");
// console.log("events: ", events);
// let replayer: any;
// onMounted(() => {
// 	if (events.length > 0) {
// 		// const replayer = new Replayer(events, {

// 		// });
// 		// replayer.play();
// 		replayer = new rrwebPlayer({
// 			target: document.getElementById("rrwebPlayer"), // 可以自定义 DOM 元素
// 			// 配置项
// 			props: {
// 				events
// 			},
// 			plugins: [
// 				getReplayConsolePlugin({
// 					level: ["info", "log", "warn", "error"]
// 				})
// 			]
// 		});
// 	}
// });
// onUnmounted(() => {
// 	replayer?.destroy();
// });

import { Replayer } from "rrweb";
import { getReplayConsolePlugin } from "@saola.ai/rrweb-plugin-console-replay";
const events = JSON.parse(localStorage.getItem("rrweb-events") || "[]");
console.log("events: ", events);
onMounted(() => {
	const replayer = new Replayer(events, {
		root: document.getElementById("rrwebPlayer"),
		plugins: [
			getReplayConsolePlugin({
				level: ["info", "log", "warn", "error"]
			})
		]
	});
	replayer.play();
});
</script>

<style scoped></style>
