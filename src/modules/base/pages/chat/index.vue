<template>
	<chat-main></chat-main>
</template>

<script setup lang="ts">
import ChatMain from "../../components/chat/index.vue";
import { useRoute } from "vue-router";
import { useCool } from "/@/cool";
import { useStore } from "../../store";
const { socketStore, user } = useStore();
const { service } = useCool();
console.log("service: ", service);

const route = useRoute();
const {
	// params: { accessToken, id },
	query: { accessToken }
} = route as any;
console.log(accessToken);

service.base.chat.chat_message_log.getUserInfoByAccessToken({ userId: accessToken }).then((data) => {
	console.log("data: ", data);
	user.set(data);

	socketStore.socketConnect();
});

// 根据当前accessToken请求接口查询用户信息, 然后准备连接socketio
</script>

<style scoped></style>
