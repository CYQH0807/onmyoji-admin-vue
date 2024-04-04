<template>
	<cl-crud class="activeItemCrud" ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" name="菜单名称" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { ElMessage, ElMessageBox } from "element-plus";
import { useCool } from "/@/cool";
import { useDict } from "/$/dict";
import { toRefs } from "vue";

const { dict } = useDict();
//获取props的属性
const props = defineProps({
	activeId: {
		type: String,
		default: ""
	}
});
const { activeId } = toRefs(props);
console.log("activeId: ", activeId);

const { service } = useCool();

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: "活动项",
			prop: "activeItemName",
			required: true,
			component: { name: "el-input" }
		},
		{
			label: "活动项描述",
			prop: "activeItemDesc",
			required: true,
			component: { name: "el-input" }
		},
		{
			label: "活动项类型",
			prop: "activeItemType",
			required: true,
			component: {
				name: "cl-select",
				props: {
					options: dict.get("activeItemType")
				}
			}
		}
	],
	onSubmit(data, { next }) {
		data.activeId = activeId.value;
		next({
			...data
		});
	}
});

// cl-table
const Table = useTable({
	columns: [
		{
			type: "selection"
		},
		{
			label: "活动项",
			prop: "activeItemName",
			align: "left",
			minWidth: 200
		},
		{
			label: "活动项描述",
			prop: "activeItemDesc",
			align: "left",
			minWidth: 200
		},
		{
			label: "活动项类型",
			prop: "activeItemType",
			align: "left",
			dict: dict.get("activeItemType"),
			minWidth: 200
		},
		{
			type: "op",
			buttons: [
				"edit",
				{
					label: "删除",
					type: "danger",
					onClick({ scope }) {
						// 活动项数量不能为0,当最后一条删除的时候, 提示不能删除
						if (Table?.value?.data?.length === 1) {
							ElMessage.error("活动项数量不能为0");
							return;
						}
						ElMessageBox.confirm("是否要删除该活动项", "提示", {
							type: "warning"
						})
							.then(() => {
								return service.base.onmyoji.activeItem.delete({ ids: [scope.row] });
							})
							.then(() => {
								refresh();
							});
					}
				}
			]
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.base.onmyoji.activeItem,
		onRefresh(params, { render }) {
			service.base.onmyoji.activeItem
				.list({
					activeId: activeId.value
				})
				.then((res) => {
					// 渲染数据
					render(res);
				});
		}
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
.activeItemCrud {
	height: 300px;
}
</style>
