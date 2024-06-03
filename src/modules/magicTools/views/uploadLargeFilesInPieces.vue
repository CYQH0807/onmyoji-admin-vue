<template>
	<div>
		<div>
			<div v-for="(item, index) in userList" :key="index">
				<span
					:class="[item.active ? 'acitve' : '', 'nickName']"
					@click="changeUser(item)"
					>{{ item.nickName }}</span
				>
			</div>
		</div>

		<h2>{{ connected ? "连接" : "断开" }} {{ roomId }}</h2>
		<h2>{{ errorMsg }}</h2>
		<div>
			<div v-for="(item, index) in msgList" :key="index">
				<span>{{ item.sendUserName }} 说: </span>
				<span>{{ item.message }}</span>
				<span>{{ item.sendTime }}</span>
			</div>
		</div>
		<div>
			<el-form @submit="send">
				<el-form-item>
					<el-input :disabled="!!!roomId" v-model="msg" />
					<el-button @click="send"> 发送</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts" name="magicTools-uploadLargeFilesInPieces" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { ElMessage, ElMessageBox } from "element-plus";

import { computed, onUnmounted, ref } from "vue";
import io from "socket.io-client";
import { uuid } from "/@/cool/utils";
import { useBase } from "/$/base";
const { user } = useBase();

let msgList = ref<any[]>([]);
let msg = ref<string>("");
let roomId = ref<string>("");
const connected = ref<boolean>(false);
const userList = ref<any[]>([]);
const errorMsg = ref("");

console.log("user.info: ", user.info);

// 是否是客服
const isService = computed(() => {
	return user.info?.id === 1;
});

const socket = io(
	`http://localhost:7001/chat?userId=${user.info?.id}&type=${user.info?.id === 1 ? "service" : "user"}`
);

socket.on("connect", () => {
	connected.value = true;
});

socket.on("disconnect", () => {
	connected.value = false;
});

socket.on("data", (msg) => {
	console.log("服务端消息", msg);
	switch (msg.messageType) {
		case "connect":
			roomId.value = msg.roomId;
			// msgList.value = msg.data.hisMsgList;

			ElMessage.success("连接成功");
			break;
		case "text":
			msgList.value.push(msg);
			break;
		default:
			break;
	}
});
// 连接成功
socket.on("connect-socket", (msg: any) => {
	console.log("connect-msg: ", msg);
	// roomId.value = msg.roomId;
	if (!isService.value) {
		roomId.value = msg.roomId;
	}

	ElMessage.success("连接成功");
});

// 有用户加入连接
socket.on("connect-user-add", (data) => {
	console.log("connect-user-add-msg: ", data);
	userList.value = data.data.map((item) => {
		return {
			...item,
			active: false
		};
	});
	ElMessage.success(data.message);
});

// 消息监听
socket.on("message", (msg: any) => {
	console.log("message-msg: ", msg);

	msgList.value.push(msg);
});

// 没有客服的等待
socket.on("no-service", (msg: any) => {
	console.log("wait-msg: ", msg);
	errorMsg.value = msg.message;
});

// 用户断开连接
socket.on("disconnect-user", (data: any) => {
	console.log("disconnect-user-msg: ", data);
	userList.value = data.data.map((item) => {
		return {
			...item,
			active: false
		};
	});
});

function send(e: { preventDefault: () => void }) {
	socket.emit("sendMsg", { userId: user.info?.id, msg: msg.value, roomId: roomId.value });
	// msgList.value.push({ id: "我", msg: msg.value });
	msg.value = "";
	e.preventDefault();
	return false;
}

function changeUser(item) {
	userList.value.forEach((item) => {
		item.active = false;
	});

	item.active = true;

	roomId.value = `room-${item.id}-${user.info?.id}`;
}

const { service } = useCool();

// cl-upsert
const Upsert = useUpsert({
	items: []
});

// cl-table
const Table = useTable({
	columns: []
});

// cl-crud
const Crud = useCrud(
	{
		service: service.demo.goods
	},
	(app) => {
		app.refresh();
	}
);

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

const urls = ref<string[]>([]);

// 页面销毁断开socket
onUnmounted(() => {
	socket.disconnect();
});
</script>
<style lang="scss" scoped>
.nickName {
	cursor: pointer;
}

.acitve {
	color: red;
}
</style>
