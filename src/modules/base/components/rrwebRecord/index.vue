<template>
	<el-badge is-dot>
		<div id="textaaa" class="btn" @click="toggle">
			<span>{{ btnText }}</span>
		</div>
	</el-badge>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { record } from "rrweb";
import { getRecordConsolePlugin } from "@saola.ai/rrweb-plugin-console-record";

const recordFlag = ref(false);
const btnText = computed(() => {
	return recordFlag.value ? "停止录制" : "开始录制";
});
let events: any[] = [];
let stopFn: any = undefined;
function toggle() {
	recordFlag.value = !recordFlag.value;

	if (recordFlag.value) {
		stopFn = record({
			emit(event) {
				const defaultLog = console.log["__rrweb_original__"] ? console.log["__rrweb_original__"] : console.log;
				defaultLog(event);
				// 将 event 存入 events 数组中
				events.push(event);
			},
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
	} else {
		stopFn?.();
		stopFn = undefined;
		localStorage.setItem("rrweb-events", JSON.stringify(events));
		events = [];
	}
}
</script>

<style scoped lang="scss">
.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	background-color: #2f3447;
	color: #fff;
	position: relative;
	border-radius: 4px;
	padding: 5px 10px;
	letter-spacing: 1px;

	span {
		&:nth-child(1) {
			color: #fff;
		}
	}

	&:hover {
		background-color: var(--color-primary);
	}
}
</style>
