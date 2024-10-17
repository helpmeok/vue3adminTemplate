<template>
  <div :class="{ 'hidden': hidden }" class="pagination-container table-footer">
    <div class="select-title" v-if="showSelect">
      已选中{{ selectionLength }}条数据
    </div>
    <el-pagination :background="background" v-model:current-page="currentPage" v-model:page-size="pageSize" :layout="layout" :page-sizes="pageSizes"
                   :pager-count="pagerCount" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script setup>
import { scrollTo } from "@/utils/scroll-to";

const props = defineProps({
  selectionLength: {
    type: Number,
    default: 0,
  },
  showSelect: {
    type: Boolean,
    default: false,
  },
  total: {
    required: true,
    type: Number,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 20,
  },
  pageSizes: {
    type: Array,
    default() {
      return [15, 30, 50, 100, 200];
    },
  },
  // 移动端页码按钮的数量端默认值5
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7,
  },
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
  },
  background: {
    type: Boolean,
    default: true,
  },
  autoScroll: {
    type: Boolean,
    default: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits();
const currentPage = computed({
  get() {
    return props.page;
  },
  set(val) {
    emit("update:page", val);
  },
});
const pageSize = computed({
  get() {
    return props.limit;
  },
  set(val) {
    emit("update:limit", val);
  },
});
function handleSizeChange(val) {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1;
  }
  emit("pagination", { page: currentPage.value, limit: val });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
}
function handleCurrentChange(val) {
  emit("pagination", { page: val, limit: pageSize.value });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
}
</script>

<style lang="scss" scoped>
.table-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 0;
  height: 52px;
  box-sizing: border-box;
  .select-title {
    color: #303133;
    font-weight: 600;
    line-height: 32px;
  }
  .el-pagination {
    padding: 0;
    flex: 1;
    text-align: right;
  }
}
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>