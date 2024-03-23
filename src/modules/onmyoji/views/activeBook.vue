<template>
	<cl-view-group ref="ViewGroup">
		<template #item-name="{ item }"> {{ item.activeName }} - {{ item.activeDesc }} </template>

		<template #right>
			<cl-crud ref="Crud">
				<cl-row>
					<!-- 刷新按钮 -->
					<cl-refresh-btn />
					<!-- 新增按钮 -->
					<cl-add-btn />
					<!-- 批量删除 -->
					<cl-multi-delete-btn />
					<cl-flex1 />
					<!-- 关键字搜索 -->
					<cl-search-key placeholder="搜索名称" />
				</cl-row>

				<cl-row>
					<!-- 数据表格 -->
					<cl-table ref="Table" row-key="id" @row-click="onRowClick">
						<template #slot-btn="{ scope }">
							<el-button
								text
								bg
								type="success"
								v-permission="service.dict.info.permission.add"
								@click="append(scope.row)"
							>
								新增
							</el-button>
						</template>
					</cl-table>
				</cl-row>

				<cl-row>
					<cl-flex1 />
				</cl-row>

				<!-- 新增、编辑 -->
				<cl-upsert ref="Upsert">
					<template #slot-value="{ scope }">
						<div class="form-value">
							<el-input
								v-model="scope.value"
								placeholder="请填写值"
								clearable
								type="textarea"
								:rows="4"
							/>

							<div class="op">
								// eslint-disable-next-line prettier/prettier
								<cl-upload-space
									text="使用文件"
									:limit="1"
									@confirm="onFileConfirm"
								/>
							</div>
						</div>
					</template>
				</cl-upsert>
			</cl-crud>
		</template>
	</cl-view-group>
</template>

<script lang="ts" name="dict-list" setup>
import { setFocus, useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { computed, ref } from "vue";
import { deepTree } from "/@/cool/utils";
import { cloneDeep } from "lodash-es";
import { useDict } from "../../dict";
import { useViewGroup } from "/@/plugins/view";

const { service } = useCool();
console.log("service: ", service);
const { dict } = useDict();

const { ViewGroup } = useViewGroup({
	label: "类型",
	title: "字典列表",
	service: service.base.onmyoji.active,
	onSelect(item) {
		refresh({
			activeId: item.activeId,
			page: 1
		});
	},
	onEdit() {
		return {
			width: "500px",
			props: {
				// labelWidth: "60px"
			},
			items: [
				{
					label: "名称",
					prop: "activeName",
					component: {
						name: "el-input",
						props: {
							maxlength: 20
						}
					},
					required: true
				},
				{
					label: "描述",
					prop: "activeDesc",
					component: {
						name: "el-input",
						props: {
							maxlength: 20
						}
					},
					required: true
				},
				{
					label: "开始时间",
					prop: "activeBeginDate",
					component: {
						name: "el-date-picker",
						placeholder: "请选择开始时间"
					},
					required: true
				},
				{
					label: "结束时间",
					prop: "activeEndDate",
					component: {
						name: "el-date-picker",
						placeholder: "请选择结束时间"
					},
					required: true
				}
			]
		};
	}
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: "600px"
	},
	props: {
		labelWidth: "100px"
	},
	items: [
		{
			label: "上级节点",
			prop: "parentId",
			component: {
				name: "el-tree-select",
				props: {
					data: computed(() => {
						const data = cloneDeep(Table.value?.data);

						function deep(d: any, f: boolean) {
							if (d.id && d.id == Upsert.value?.getForm("id")) {
								f = true;
							}

							if (f) {
								d.disabled = true;
							}

							if (d.children) {
								d.children.forEach((e: any) => {
									deep(e, f);
								});
							}
						}

						deep({ children: data }, false);

						return data;
					}),
					props: {
						label: "name",
						value: "id",
						children: "children",
						disabled: "disabled"
					},
					clearable: true,
					filterable: true,
					"default-expand-all": true,
					"check-strictly": true
				}
			}
		},
		{
			label: "名称",
			prop: "name",
			required: true,
			component: { name: "el-input" }
		},
		{
			label: "值",
			prop: "value",
			component: { name: "slot-value" }
		},
		{
			label: "排序",
			prop: "orderNum",
			value: 1,
			component: { name: "el-input-number", props: { min: 1 } }
		},
		{
			label: "备注",
			prop: "remark",
			component: { name: "el-input", props: { type: "textarea", rows: 4 } }
		}
	],
	onSubmit(data, { next }) {
		next({
			...data,
			typeId: ViewGroup.value?.selected?.id
		});
	},
	plugins: [setFocus("name")]
});

// 表格基础列
let columns: List<ClTable.Column<any>> = [
	{
		type: "selection"
	},
	{
		label: "账号",
		prop: "userId",
		align: "left",
		minWidth: 200,
		formatter: (row) => {
			return `${row.username}(${row.userId})`;
		}
	}
];

// cl-table
const Table = useTable({
	contextMenu: [
		"refresh",
		(row) => {
			return {
				label: "新增",
				hidden: !service.dict.info._permission?.add,
				callback(done) {
					append(row);
					done();
				}
			};
		},
		"edit",
		"delete",
		"order-asc",
		"order-desc"
	],
	columns: columns
});

// cl-crud
const Crud = useCrud({
	service: service.base.onmyoji.activeBooks
	// onRefresh(params, { render }) {
	// 	service.base.onmyoji.activeBooks
	// 		.list({
	// 			...params,
	// 			page: undefined,
	// 			size: undefined
	// 		})
	// 		.then((res) => {
	// 			// 渲染数据
	// 			render(deepTree(res, params.sort));
	// 		});
	// }
});

// 刷新
async function refresh(params?: any) {
	// 先请求活动项的内容
	let list = await service.base.onmyoji.activeItem.list({
		activeId: params.activeId
	});
	// 根据活动项构建动态表格列

	let cur_columns = cloneDeep(columns);
	list.forEach((item) => {
		cur_columns.push({
			label: item.activeItemName,
			prop: `prop${item.activeItemId}`,
			minWidth: 200
		});
	});
	cur_columns.push({
		type: "op",
		width: 250,
		buttons: ["slot-btn", "edit", "delete"]
	});

	if (Table.value) {
		Table.value.columns = cur_columns as any;
	}

	Crud.value?.refresh(params);
}

// 行点击展开
function onRowClick(row: any, column: any) {
	if (column?.property && row.children) {
		Table.value?.toggleRowExpansion(row);
	}
}

// 追加子集
function append(row: any) {
	Crud.value?.rowAppend({
		parentId: row.id,
		orderNum: 1
	});
}

// 文件选择
function onFileConfirm(selection: any[]) {
	Upsert.value?.setForm("value", selection[0]?.url);
}
</script>

<style lang="scss" scoped>
.form-value {
	.op {
		margin-top: 10px;
	}
}
</style>
