import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useBase } from "../../base";
import { Socket, io } from "socket.io-client";
import { ElMessage } from "element-plus";

import { useMitt } from "/@/cool/hook/mitt";

export const useSocketStore = defineStore("chat-socket", () => {
	const mitt = useMitt();
	const connected = ref(false);
	const roomId = ref("");
	const { user } = useBase();
	const currChatUser = ref({});
	let socket: Socket | null = null;

	const isService = computed(() => {
		return user.info?.id === 1;
	});

	function socketConnect() {
		if (!socket) {
			socket = io(`http://10.25.231.163:7001/chat?userId=${user.info?.id}&type=${user.info?.id === 1 ? "service" : "user"}`, {});

			socket.on("connect", () => {
				connected.value = true;
			});

			socket.on("disconnect", () => {
				connected.value = false;
			});

			// socket连接成功
			socket.on("connect-socket", (msg: any) => {
				if (!isService.value) {
					roomId.value = msg.roomId;
				} else {
					mitt.emit("connect-user-add", msg);
				}
				ElMessage.success("连接成功");
			});

			// 当前没有客服,等待客服事件
			socket.on("no-service", (msg: any) => {
				console.log("no-service: ", msg);
				mitt.emit("no-service", msg);
			});
			// 用户连接
			socket.on("connect-user-add", (data) => {
				console.log("connect-user-add-msg: ", data);
				mitt.emit("connect-user-add", data);
			});
			// 有客服连接
			socket.on("connect-service-add", (data) => {
				console.log("connect-service-add-msg: ", data);
				roomId.value = data.roomId;
				mitt.emit("connect-service-add", data);
			});

			socket.on("message", (data) => {
				console.log("message: ", data);
				mitt.emit("message", data);
			});

			// 有用户断开 disconnect-user
			socket.on("disconnect-user", (data) => {
				console.log("disconnect-user: ", data);
				mitt.emit("disconnect-user", data);
			});
		} else {
			socket.open();
		}
		if (!isService.value) {
			currChatUser.value = {
				...user.info,
				nickName: "系统客服"
			};
		}
	}

	const sendMessage = (message) => {
		if (roomId.value) {
			socket?.emit("sendMsg", { userId: user.info?.id, msg: message, roomId: roomId.value });
		} else {
			console.error("roomId为空");
		}
	};

	function disconnect() {
		if (socket) {
			socket.close();
			console.log("socket: ", socket);
		}
	}
	return { connected, isService, roomId, sendMessage, user, disconnect, socketConnect, currChatUser };
});
