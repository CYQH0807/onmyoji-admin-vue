<template>
	<div class="content">
		<cl-view-group ref="ViewGroup">
			<template #item-name="{ item }">
				{{ item.activeName }} - {{ item.activeDesc }}
			</template>

			<template #right>
				<cl-crud ref="Crud">
					<cl-row>
						<!-- 刷新按钮 -->
						<cl-refresh-btn />

						<el-button type="primary" @click="activeItemDialogVisible = true"
							>编辑活动项</el-button
						>

						<cl-flex1 />
						<!-- 关键字搜索 -->
						<cl-search-key placeholder="搜索账号" />
					</cl-row>

					<cl-row>
						<!-- 数据表格 -->
						<cl-table ref="Table" row-key="id">
							<template
								v-for="(item, index) in curItemList"
								:key="index"
								#[`column-prop${item.activeItemId}`]="{ scope }"
							>
								<component
									:is="item.activeItemType"
									v-model="scope.row[`prop${item.activeItemId}`]"
									true-value="1"
									false-value="0"
									@change="(val) => componentChange(val, item, scope.row)"
								/>
								<!-- type:{{ item.activeItemType }}

								具体值: {{ scope.row[`prop${item.activeItemId}`] }} -->
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

		<cl-dialog
			title="活动项"
			width="80%"
			v-model="activeItemDialogVisible"
			:before-close="beforeClose"
		>
			<onmyoji-active-item :activeId="curActiveId"></onmyoji-active-item>
		</cl-dialog>
	</div>
</template>

<script lang="ts" name="dict-list" setup>
import { setFocus, useCrud, useTable, useUpsert, useForm } from "@cool-vue/crud";
import onmyojiActiveItem from "./activeItem.vue";
import { useCool } from "/@/cool";
import { Ref, computed, ref } from "vue";
import { deepTree } from "/@/cool/utils";
import { cloneDeep } from "lodash-es";
import { useDict } from "../../dict";
import { useViewGroup } from "/@/plugins/view";

let curItemList: Ref<Eps.BaseOnmyojiActiveItemEntity[]> = ref([]);
let curActiveId = ref("");
const activeItemDialogVisible = ref(false);

const { service } = useCool();
console.log("service: ", service);
const { dict } = useDict();

const { ViewGroup } = useViewGroup({
	label: "类型",
	title: "记录",
	service: service.base.onmyoji.active,
	onSelect(item) {
		item.name = item.activeName;
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
});

async function componentChange(val: any, item: any, row: any) {
	await service.base.onmyoji.acitveUserItem.updateUserItem({
		activeItemId: item.activeItemId,
		userId: row.userId,
		activeId: row.activeId,
		value: val
	});
}

function beforeClose(done) {
	// 弹窗关闭前,刷新表格
	refresh({
		activeId: curActiveId.value
	}).then(() => {
		done();
	});
}

// 刷新
async function refresh(params?: any) {
	console.log("params: ", params);
	// 先请求活动项的内容
	curItemList.value = await service.base.onmyoji.activeItem.list({
		activeId: params.activeId
	});
	console.log(curItemList.value);
	curActiveId.value = params.activeId;

	// 根据活动项构建动态表格列
	let cur_columns = cloneDeep(columns);
	curItemList.value.forEach((item) => {
		cur_columns.push({
			label: item.activeItemName,
			prop: `prop${item.activeItemId}`,
			minWidth: 200
		});
	});
	cur_columns.push({
		type: "op",
		width: 80,
		buttons: ["edit"]
	});

	if (Table.value) {
		Table.value.columns = cur_columns as any;
	}

	// 根据活动项,构建编辑活动框

	Crud.value?.refresh(params);
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

.content {
	height: 100%;
}
</style>
