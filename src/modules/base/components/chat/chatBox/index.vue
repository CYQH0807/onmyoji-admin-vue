<template>
	<div class="flex-column flex-1">
		<div class="flex justify-between pt-2 pb-2">
			<div class="ml-2">
				<span>{{ chatUserInfo.nickName }}</span>
				<span v-if="!errorMsg" class="ml-2">({{ socketStore.roomId || "-" }})</span>
				<span v-else>{{ errorMsg }}</span>
			</div>
			<div v-if="!socketStore.isService" class="mr-2">
				<span class="c-emerald" v-if="socketStore.connected">在线</span>
				<span v-else class="c-red">离线</span>
			</div>
		</div>

		<!-- 消息列表 -->
		<chat-message ref="chatMessageRef" :list="list" :errorMsg="errorMsg" />

		<!-- 底部 -->
		<chat-footer @sendMsg="sendMsg" :errorMsg="errorMsg"></chat-footer>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import chatFooter from "./footer.vue";
import chatMessage from "./message.vue";
import { useStore } from "../../../store";
import { useCool } from "/@/cool";
const { socketStore } = useStore();
const errorMsg = ref("");
const chatMessageRef = ref();
const chatUserInfo: any = computed(() => socketStore.currChatUser);
const { service, mitt } = useCool();
console.log("service: ", service);

function sendMsg(msg) {
	console.log("msg: ", msg);
}
mitt.on("no-service", (msg) => {
	errorMsg.value = msg.message;
});
mitt.on("connect-service-add", (msg) => {
	errorMsg.value = "";
});

mitt.on("message", (msg) => {
	if (msg.roomId === socketStore.roomId) {
		list.value.push(msg);
		console.log("list.value: ", list.value);
		nextTick(() => {
			chatMessageRef.value.setScrollBottom();
		});
	}
});

watch(
	chatUserInfo,
	(val) => {
		console.log("val: ", val);
		if (val.id) {
			// 获取聊天记录
			getMsgLogByUserId(val.id).then((data) => {
				list.value = data || [];
			});
		}
	},
	{
		immediate: true
	}
);

async function getMsgLogByUserId(userId) {
	return await service.base.chat.chat_message_log.getMsgLogByUserId({ userId });
}

// 聊天记录列表
const list = ref<any[]>([]);
</script>

<style scoped lang="scss">
.flex-column {
	display: flex;
	flex-direction: column;
	height: 100%;
}
</style>
