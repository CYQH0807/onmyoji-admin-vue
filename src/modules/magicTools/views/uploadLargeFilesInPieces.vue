<template>
	<div><cl-upload v-model="urls" /></div>
</template>

<script lang="ts" name="magicTools-uploadLargeFilesInPieces" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { ref } from "vue";

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
