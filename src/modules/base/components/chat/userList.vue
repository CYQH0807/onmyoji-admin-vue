<template>
	<div class="user-list border-r-blue b-r b-r-solid">
		<div class="text-center">用户列表</div>

		<div :class="[item.active ? 'acitve' : '']" class="p-2 b-solid b-1 m-2 cursor-pointer" v-for="(item, index) in userList" :key="index" @click="changeUser(item)">
			<span :class="['nickName']">{{ item.nickName }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref } from "vue";
const { user } = useBase();
const userList = ref<any[]>([]);
import { useStore } from "../../store";
import { useBase } from "/@/modules/base";
import { useCool } from "/@/cool";
const { socketStore } = useStore();
const { mitt } = useCool();

mitt.on("connect-user-add", (data) => {
	userList.value = data.data?.map((item) => {
		return {
			...item,
			active: false
		};
	});
	ElMessage.success(data.message);
});

mitt.on("disconnect-user", (data) => {
	// 根据断开的用户id,判断当前
	// 查找当前正在聊天的用户
	let currUser = userList.value.find((item) => item.active);
	if (currUser && currUser.id === data.disconnectUser.id) {
		socketStore.roomId = "";
		socketStore.currChatUser = {};
	}

	userList.value = data.data.map((item) => {
		return {
			...item,
			active: false
		};
	});
});

function changeUser(item) {
	userList.value.forEach((item) => {
		item.active = false;
	});
	item.active = true;
	socketStore.currChatUser = item;
	socketStore.roomId = `room-${item.id}-${user.info?.id}`;
}
</script>

<style lang="scss" scoped>
.user-list {
	width: 20%;
	max-width: 200px;
	// border-right: 1px solid red;
}

.nickName {
	cursor: pointer;
}

.acitve {
	border-color: cadetblue;
}
</style>
