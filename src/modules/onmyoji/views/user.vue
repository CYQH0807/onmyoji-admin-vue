<!--
 * @Description: 阴阳师账号管理 onmyoji_user
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2024-03-19 23:31:58
 * @LastEditTime: 2024-03-20 13:05:30
-->
<template>
	<cl-crud ref="Crud">
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

const { service } = useCool();

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			prop: "userId",
			label: "账号",
			span: 12,
			required: true,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "username",
			label: "用户名",
			span: 12,
			required: true,
			component: {
				name: "el-input"
			}
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{
			type: "selection",
			width: 60
		},
		{
			prop: "userId",
			label: "账号",
			minWidth: 150
		},
		{
			prop: "username",
			label: "用户名",
			minWidth: 120
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.base.onmyoji.user
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
