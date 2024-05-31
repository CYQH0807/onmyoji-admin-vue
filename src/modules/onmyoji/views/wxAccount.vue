<!--
 * @Description: 生锈微信账号管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2024-03-20 17:15:24
 * @LastEditTime: 2024-05-08 15:09:09
-->
<template>
	<cl-crud ref="Crud">
		<cl-row>
			<el-image class="qrCodeImg" :src="qrCodeUrl">
				<template #error>
					<div class="image-slot">加载失败</div>
				</template>
			</el-image>
			<el-button type="primary" @click="refreshUrl">刷新</el-button>
		</cl-row>

		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" name="菜单名称" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { ref } from "vue";

const { service } = useCool();
console.log("service: ", service);

let qrCodeUrl = ref("");

service.base.sys.weChatyBot.getQrCode().then((res) => {
	if (res !== "error") {
		qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?data=${res}&size=100x100`;
	}
});

function refreshUrl() {
	console.log("刷新");

	service.base.sys.weChatyBot.refreshQrCode().then((res) => {
		if (res !== "error") {
			qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?data=${res}&size=100x100`;
		}
	});
}

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
</script>

<style lang="scss" scoped>
.qrCodeImg {
	width: 100px;
	height: 100px;
	margin-right: 20px;
}
.image-slot {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100px;
	width: 100px;
	background-color: #f0f0f0;
	color: #909399;
	font-size: 12px;
	border-radius: 4px;
	margin-right: 20px;
}
</style>
