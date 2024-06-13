<template>
	<el-config-provider :locale="zhCn">
		<bx-modal></bx-modal>
	</el-config-provider>
</template>

<script lang="ts" setup>
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import BxModal from "./components/modal.vue";
</script>
