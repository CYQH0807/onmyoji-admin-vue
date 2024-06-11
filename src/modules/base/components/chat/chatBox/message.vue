<template>
	<el-scrollbar class="list" ref="scrollbar" @scroll="handleScrollTop">
		<div ref="scrollDiv" class="list-content">
			<div class="list-item" v-for="(item, index) in list" :key="index">
				<div
					class="item"
					:class="{
						'is-right': item.sendUserId == currUserId
					}"
				>
					<div class="avatar">
						<cl-avatar :size="36" shape="square" src="https://avatars.githubusercontent.com/u/29754865?v=4" />
					</div>

					<div class="det">
						<div class="h">
							<span class="name">{{ item.sendUserName }}</span>
						</div>
						<div class="content">
							<!-- 文本 -->
							<div class="is-text" v-if="item.messageType == 'text'">
								<!-- <span>{{ item.message }}</span> -->
								<md-renderer :source="item.message"></md-renderer>
							</div>

							<!-- 图片 -->
							<div class="is-image" v-else-if="item.contentType == 1">
								<el-image :src="item.content.imageUrl" :initial-index="item._index" scroll-container=".chat-message .list" />
							</div>
							<div
								class="time"
								:class="{
									'is-right': item.sendUserId == currUserId
								}"
							>
								{{ item.messageTime }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</el-scrollbar>
</template>

<script setup lang="ts">
// 接收外部list参数
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useBase } from "/@/modules/base";
const emit = defineEmits(["refresh", "scroll"]);
const { user } = useBase();
const currUserId = computed(() => user?.info?.id);
import MdRenderer from "../../markdown-renderer/MdRenderer.vue";

const scrollDiv = ref();
const scrollbar = ref();
const props = defineProps<{
	list: any[];
}>();
/**
 * 滚动条距离最上面的高度
 */
const scrollTop = ref(0);

const scorll = ref(true);
const getMaxHeight = () => {
	return scrollDiv.value!.scrollHeight;
};

const handleScrollTop = ($event: any) => {
	scrollTop.value = $event.scrollTop;
	if (scrollDiv.value.scrollHeight - (scrollTop.value + scrollbar.value.wrapRef.offsetHeight) <= 30) {
		scorll.value = true;
	} else {
		scorll.value = false;
	}
	emit("scroll", { ...$event, scrollbar: scrollbar.value, scrollDiv: scrollDiv.value });
};

const handleScroll = () => {
	if (scrollbar.value) {
		// 内部高度小于外部高度 就需要出滚动条
		if (scrollbar.value.wrapRef.offsetHeight < scrollDiv.value.scrollHeight) {
			// 如果当前滚动条距离最下面的距离在 规定距离 滚动条就跟随
			if (scorll.value) {
				scrollbar.value.setScrollTop(getMaxHeight());
			}
		}
	}
};

function setScrollBottom() {
	// 将滚动条滚动到最下面
	scrollbar.value.setScrollTop(getMaxHeight());
}
onMounted(() => {
	handleScroll();
});

watch(
	() => props.list,
	() => {
		nextTick(() => {
			handleScroll();
		});
	},
	{ deep: true, immediate: true }
);

defineExpose({
	setScrollBottom
});
// console.log(getMaxHeight());

// 抛出方法,用于将scrollbar滚动到底部
// function name(params: type) {}
</script>

<style scoped lang="scss">
@keyframes slideDown {
	0% {
		clip-path: inset(100% 0% 0% 0%);
		transform: translateY(-100%);
	}

	100% {
		clip-path: inset(0% 0% 0% 0%);
		opacity: 1;
	}
}

.list {
	flex: 1;
	background-color: #f7f7f7;

	.list-content {
		.list-item {
			list-style: none;

			.date {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 40px;
				font-size: 12px;
			}

			.item {
				display: flex;
				padding: 10px;

				.avatar {
					margin-right: 10px;
				}

				.det {
					.h {
						display: flex;
						align-items: center;

						.name {
							font-size: 12px;
							color: #666;
						}
					}

					.content {
						display: flex;
						flex-direction: column;
						margin-top: 5px;
						position: relative;
						padding-bottom: 15px;

						&:hover {
							.time {
								animation: slideDown 0.7s ease-in-out;
								// 动画停留在最后一帧
								animation-fill-mode: forwards;
							}
						}

						.time {
							position: absolute;
							font-size: 12px;
							width: 120px;
							opacity: 0;
							bottom: -3px;
							left: 2px;
						}

						.is-right {
							right: 2px;
							left: auto;
						}

						.is-text {
							background-color: #fff;
							padding: 8px;
							border-radius: 0 6px 6px 6px;
							max-width: 400px;
							font-size: 14px;
						}

						.is-image {
							background-color: #fff;

							.el-image {
								display: block;
								min-height: 100px;
								max-width: 200px;
								border-radius: 4px;
							}
						}
					}
				}

				&.is-right {
					flex-direction: row-reverse;

					.avatar {
						margin-left: 10px;
						margin-right: 0;
					}

					.det {
						.h {
							justify-content: flex-end;
						}

						.content {
							.is-text {
								border-radius: 6px 0 6px 6px;
							}
						}
					}
				}
			}
		}
	}
}
</style>
