<template>
	<div class="footer">
		<div class="tools">
			<ul>
				<li>
					<el-icon><picture-filled /></el-icon>
				</li>

				<li>
					<el-icon><video-camera /></el-icon>
				</li>

				<li>
					<el-icon>
						<microphone />
					</el-icon>
				</li>

				<li>
					<el-icon>
						<location />
					</el-icon>
				</li>
			</ul>
		</div>

		<div class="input">
			<el-input
				v-model="value"
				@keydown.enter="onTextSend($event)"
				type="textarea"
				:rows="4"
				resize="none"
				:autosize="{
					minRows: 4,
					maxRows: 10
				}"
				placeholder="输入内容"
			></el-input>
			<el-button type="success" @click="onTextSend" :disabled="sendDisable">发送</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { PictureFilled, VideoCamera, Microphone, Location } from "@element-plus/icons-vue";
// 定义发送消息事件
import { defineEmits } from "vue";
const emit = defineEmits(["sendMsg"]);

import { useStore } from "../../../store";
const { socketStore } = useStore();

// 接收errorMsg参数
const props = defineProps<{
	errorMsg: string;
}>();

// 消息发送绑定值
const value = ref<string>("");

// 判断是否能发送消息
const sendDisable = computed(() => {
	// 检查文本框内容是否不为空
	const hasValue = value.value.trim() !== "";
	// 检查是否已连接
	const isConnected = socketStore.connected === true;
	// 检查房间ID是否不为空
	const hasRoomId = socketStore.roomId !== "";
	// 检查错误信息是否为空
	const hasNoErrorMsg = props.errorMsg === "";

	// 所有条件必须满足，按钮才不被禁用
	return !(hasValue && isConnected && hasRoomId && hasNoErrorMsg);
});

function onTextSend(event: any) {
	console.log("发送文本消息", event, value.value);
	if (!event.ctrlKey || !event.metaKey) {
		// 如果没有按下组合键ctrl，则会阻止默认事件
		event.preventDefault();
		// // 抛出发送消息事件
		if (value.value.trim()) {
			socketStore.sendMessage(value.value);
			emit("sendMsg", value.value);
		}
		// 清空输入框
		value.value = "";
	} else {
		// 如果同时按下ctrl+回车键，则会换行
		value.value += "\n";
	}
}
</script>

<style scoped lang="scss">
.footer {
	padding: 10px;
	position: relative;

	&:before {
		background: linear-gradient(0deg, #f3f7f9 0%, rgba(243, 247, 249, 0) 100%);
		content: "";
		position: absolute;
		width: 100%;
		top: -16px;
		left: 0;
		height: 16px;
	}

	.tools {
		display: flex;
		margin-bottom: 10px;

		ul {
			display: flex;
			align-items: center;
			flex: 1;

			li {
				height: 26px;
				width: 26px;
				border-radius: 4px;
				margin-right: 10px;
				list-style: none;
				display: flex;
				justify-content: center;
				align-items: center;
				cursor: pointer;
				font-size: 18px;

				&:hover {
					background-color: #f7f7f7;
				}
			}
		}
	}

	.input {
		display: flex;
		position: relative;

		.el-button {
			margin-left: 10px;
			position: absolute;
			right: 10px;
			bottom: 10px;
		}
	}
}
</style>
