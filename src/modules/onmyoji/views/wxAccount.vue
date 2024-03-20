<!--
 * @Description: 生锈微信账号管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2024-03-20 17:15:24
 * @LastEditTime: 2024-03-20 17:16:02
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
