<template>
	<div>
		<h2>{{ id }}</h2>
		<div>
			<div v-for="(item, index) in msgList" :key="index">
				<span>{{ item.id }} 说: </span>
				<span>{{ item.msg }}</span>
			</div>
		</div>
		<div>
			<el-form @submit="send">
				<el-form-item>
					<el-input v-model="msg" />
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

import { ref } from "vue";
import io from "socket.io-client";
import { uuid } from "/@/cool/utils";
import { useBase } from "/$/base";
const { user } = useBase();

let msgList = ref<any[]>([]);
let msg = ref<string>("");
let id = ref<string>("");

console.log("user.info: ", user.info);

const socket = io(
	`http://localhost:7001/chat?userId=${user.info?.id}&type=${user.info?.id === 1 ? "service" : "user"}`
);

socket.on("data", (msg) => {
	console.log("服务端消息", msg);
	switch (msg.type) {
		case "connect":
			id.value = msg.data.id;
			msgList.value = msg.data.hisMsgList;

			ElMessage.success("连接成功");
			break;
		case "message":
			msgList.value.push(msg.data);
			break;
		default:
			break;
	}
});

function send(e) {
	socket.emit("sendMsg", { id: id.value, msg: msg.value });
	msgList.value.push({ id: "我", msg: msg.value });
	msg.value = "";
	e.preventDefault();
	return false;
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
</script>
