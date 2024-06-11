<template>
	<chat-main></chat-main>
</template>

<script setup lang="ts">
import ChatMain from "/@/modules/base/components/chat/index.vue";
import { useStore } from "/@/modules/base/store";
const { socketStore } = useStore();
socketStore.socketConnect();
// 根据当前accessToken请求接口查询用户信息, 然后准备连接socketio
</script>

<style scoped></style>
