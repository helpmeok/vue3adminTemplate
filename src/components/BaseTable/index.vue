<template>
  <!-- 通过v-bind="$attrs" v-on="$attrs"，把父组件传的属性全部绑定到子组件上，保证了api和el-table一致 -->
  <div class="base-table-container">
    <el-table ref="baseTableRef" style="width: 100%" element-loading-text="拼命加载中" v-autoHeight="{bottomHeight,isAutoHeight}" v-loading="loading"
              @selection-change="handleSelectionChange" :row-key="rowKey" v-bind="$attrs" v-on="$attrs">
      <template #empty>
        <el-empty description="无数据" :image-size="66" v-if="!loading" />
      </template>
      <el-table-column v-if="showSelect" type="selection" width="55" align="center" reserve-selection :selectable="selectable" />
      <el-table-column v-if="showIndex" type="index" align="center" width="60" label="序号" />
      <template v-for="(item,prop) of newColumns">
        <el-table-column v-if="item && !item.isHide" :key="prop" :show-overflow-tooltip="item.showTooltip"
                         :min-width="item.label.length>3?item.label.length*25+'px':'100px'" v-bind="{align:'center',...item}">
          <template #header>
            <span :class="[item.required?'required-text':'']">
              {{item.label}}
            </span>
          </template>
          <template #default="scope">
            <slot v-if="item.slot" :scope="scope" :name="item.slot"></slot>
            <span v-else>
              <div v-if="prop==='updatedUserName'">
                {{scope.row[prop] || scope.row.createdUserName || '-'}}
              </div>
              <div v-else-if="prop==='updatedDate'">
                {{scope.row[prop] || scope.row.createdDate  || '-'}}
              </div>
              <dict-tag v-else-if="item?.options?.length || item.dictType || item.enumsName" :options="item.options" :optionLabelKey="item.optionLabelKey"
                        :optionValueKey="item.optionValueKey" :value="scope.row[prop]"></dict-tag>
              <span v-else>{{ colStrEmptyFn(scope.row[prop]) }}</span>
            </span>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script setup name="BaseTable">
import { colStrEmpty } from "@/utils/ruoyi";
import { setDataOptions } from "@/utils/componentUtils";
const { proxy } = getCurrentInstance();
const colStrEmptyFn = (val) => colStrEmpty(val);
const props = defineProps({
  columns: { type: Object, default: () => {} },
  // 行数据的 Key,用来优化 Table 的渲染, 在使用reserve-selection功能与显示树形数据时，该属性是必填的。
  rowKey: { type: String, default: () => "id" },
  // 是否自适应高度
  isAutoHeight: { type: Boolean, default: () => true },
  // 加载状态
  loading: { type: Boolean, default: () => false },
  // 表格距离底部的高度
  bottomHeight: { type: Number, default: () => 70 },
  // 是否展示索引
  showIndex: { type: Boolean, default: () => true },
  // 是否展示选择框
  showSelect: { type: Boolean, default: () => false },
});
const emit = defineEmits(["getMultipleSelection"]);

const selectable = (row) => {
  return row.selectable === false ? false : true;
};
const handleSelectionChange = (val) => {
  emit("getMultipleSelection", val);
};
const clearTableSelection = () => {
  proxy.$refs["baseTableRef"].clearSelection();
};
defineExpose({ clearTableSelection });
const newColumns = computed(() => {
  const columnsCopy = props.columns;
  let data = columnsCopy;
  Object.keys(data).forEach((key) => {
    data[key].options = setDataOptions(data[key]);
  });
  return data;
});
</script>
<style lang="scss" scoped>
.base-table-container {
  :deep(.el-scrollbar__view, .el-table__body) {
    height: 100%;
  }
}
</style>