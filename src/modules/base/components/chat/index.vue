<template>
	<div class="chat flex h-full">
		<user-list v-if="socketStore.isService"></user-list>
		<chat-box></chat-box>
	</div>
</template>

<script setup lang="ts">
import { onUnmounted, onMounted } from "vue";
import chatBox from "./chatBox/index.vue";
import userList from "./userList.vue";
import { useStore } from "../../store";
const { socketStore } = useStore();

onMounted(() => {
	console.log("onMounted: ", socketStore);
	!socketStore.socket && socketStore.socketConnect();
});

onUnmounted(() => {
	socketStore.disconnect();
	console.log("onUnmounted");
});
</script>

<style scoped lang="scss">
.chat {
	border-image: linear-gradient(to right, red, blue);
	border-image-slice: 1;
}
</style>
