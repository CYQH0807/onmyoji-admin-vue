<!--
 * @Description: 阴阳师任务列表
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2024-03-20 11:05:57
 * @LastEditTime: 2024-03-20 15:03:46
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

<script lang="tsx" name="菜单名称" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { useDict } from "/$/dict";
import { TaskStatus, TaskType } from "../enum";
import { msToTime } from "../utils";

const { dict } = useDict();

const { service } = useCool();

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			prop: "taskName",
			label: "任务名称",
			span: 12,
			required: true,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "taskDesc",
			label: "任务描述",
			span: 12,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "taskType",
			label: "任务类型",
			value: TaskType.COUNTDOWN,
			span: 12,
			component: {
				name: "cl-select",
				props: {
					options: dict.get("taskType")
				}
			}
		},
		{
			prop: "taskStatus",
			label: "任务状态",
			value: TaskStatus.ONGOING,
			span: 12,
			component: {
				name: "cl-select",
				props: {
					options: dict.get("taskStatus")
				}
			}
		},
		{
			prop: "delayTime",
			label: "延迟时间",
			value: 5000,
			span: 24,
			required: true,
			append: () => {
				return msToTime(Upsert?.value?.form.delayTime);
			},
			component: {
				name: "el-input-number",
				props: {
					controlsPosition: "right",
					min: 0,
					step: 1000
				}
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
			prop: "taskName",
			label: "任务名称",
			minWidth: 150
		},
		{
			prop: "taskDesc",
			label: "任务描述",
			showOverflowTooltip: true,
			minWidth: 150
		},
		{
			prop: "taskType",
			label: "任务类型",
			dict: dict.get("taskType"),
			minWidth: 150
		},
		{
			prop: "taskStatus",
			label: "任务状态",
			dict: dict.get("taskStatus"),
			minWidth: 150
		},
		{
			prop: "taskStartTime",
			label: "开始时间",
			minWidth: 150
		},
		{
			prop: "taskEndTime",
			label: "结束时间",
			minWidth: 150
		},
		{
			prop: "delayTime",
			label: "延迟时间(毫秒)",
			formatter: (row: any) => msToTime(row.delayTime),
			minWidth: 150
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.base.onmyoji.task
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
