<template>
  <div class="base-table-search">
    <el-form :model="queryParams" :rules="rules" ref="queryForm" v-bind="{inline: true,   ...$attrs}" v-on="$attrs">
      <template v-for="(item, name) of newQueryFormItems" :key="name">
        <el-form-item :label="item.label" :prop="name" v-if="!item.isHide">
          <slot :scope="item" :name="name">
            <!-- 输入框 -->
            <template v-if="item.type==='input'">
              <el-input style="width:160px;" v-model="queryParams[name]" v-bind="{placeholder: setPlaceholderTextFn(item.type),...item.inputAttrs}" />
            </template>
            <!-- 选择框 -->
            <template v-if="item.type==='select'">
              <el-select style="width:160px;" v-model="queryParams[name]" @change="getSelectChange(name)"
                         v-bind="{ clearable: true, filterable: true, placeholder: setPlaceholderTextFn(item.type),...item.inputAttrs}">
                <el-option v-for="(obj,index) in item.options" :key="index" :label="obj[item.optionLabelKey || 'label']"
                           :value="obj[item.optionValueKey || 'value']" />
              </el-select>
            </template>
            <!-- 日期选择框 -->
            <template
                      v-if="['year', 'month', 'date', 'dates','months', 'years', 'week', 'datetime', 'datetimerange', 'daterange', 'monthrange'].includes(item.type)">
              <el-date-picker v-model="queryParams[name]" v-bind="{clearable: true, type: item.type, ...setDatePickerOptionsFn(item.type), ...item.inputAttrs}">
              </el-date-picker>
            </template>
            <!-- 级联选择器 -->
            <template v-if="item.type==='cascader'">
              <el-cascader style="width:160px;" :popper-class="item.popperTooltip ? 'cascader-popper-tooltip' : ''" :options="item.options"
                           v-model="queryParams[name]"
                           v-bind="{clearable: true, filterable: true, placeholder: setPlaceholderTextFn(item.type), ...item.inputAttrs}">
                <template v-if="item.popperTooltip" #default="{ data }">
                  <el-tooltip :disabled="data.label.length < 12" effect="dark" :content="data.label" placement="top">
                    <span>{{ data.label }}</span>
                  </el-tooltip>
                </template>
              </el-cascader>
            </template>
            <!-- 单选框 -->
            <template v-if="item.type === 'radio'">
              <el-radio-group v-model="queryParams[name]" v-bind="{...item.inputAttrs}">
                <el-radio v-for="(obj,index) in item.options" :key="index" :label="obj[item.optionLabelKey || 'label']">{{subItem.label}}</el-radio>
              </el-radio-group>
            </template>
          </slot>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">查询</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="BaseTableSearch">
import { setDatePickerOptions, setPlaceholderText } from "@/utils/index";
import { setDataOptions } from "@/utils/componentUtils";
const props = defineProps({
  queryFormItems: { type: Object, default: () => {} },
  queryParams: { type: Object, default: () => {} },
});
const { proxy } = getCurrentInstance();
// 获取字典
const newQueryFormItems = computed(() => {
  const queryFormItemsCopy = props.queryFormItems;
  let data = queryFormItemsCopy;
  Object.keys(data).forEach((key) => {
    data[key].options = setDataOptions(data[key]);
  });
  return data;
});
// 表单规则校验
const rules = computed(() => {
  const queryFormItemsCopy = props.queryFormItems;
  let rules = {};
  Object.keys(queryFormItemsCopy).forEach((key) => {
    if (queryFormItemsCopy[key].rule) {
      queryFormItemsCopy[key].rule[0].message =
        setPlaceholderText(queryFormItemsCopy[key].type) +
        queryFormItemsCopy[key].label;
      rules[key] = queryFormItemsCopy[key].rule;
    }
  });
  return rules;
});
const setDatePickerOptionsFn = (type) => setDatePickerOptions(type);
const setPlaceholderTextFn = (type) => setPlaceholderText(type);
const emit = defineEmits(["handleQuery", "resetQuery", "getQuerySelectChange"]);
const getSelectChange = (name) => {
  emit("getQuerySelectChange", name);
};
const handleQuery = () => {
  proxy.$refs["queryForm"].validate((valid) => {
    if (valid) {
      emit("handleQuery", props.queryParams);
    }
  });
};
const resetQuery = () => {
  proxy.resetForm("queryForm");
  emit("resetQuery", props.queryParams);
};
</script>

<style lang="scss" scoped>
.base-table-search {
  :deep(.el-form--inline .el-form-item) {
    margin-right: 12px;
  }
}
</style>

<style lang="scss">
.cascader-popper-tooltip {
  .el-cascader-node__label {
    max-width: 180px;
  }
}
</style>
