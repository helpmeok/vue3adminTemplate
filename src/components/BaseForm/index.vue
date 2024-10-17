<template>
  <el-form :model="form" :rules="rules" :validate-on-rule-change="false" ref="elFormRef" class="base-form" :class="{'disabled-form': isPreview }"
           v-bind="{inline: true,'hide-required-asterisk':true, 'label-width': labelWidth, 'label-position': 'right', 'scroll-to-error':true, disabled: isPreview,'label-suffix':labelSuffix, ...$attrs}"
           v-on="$attrs">
    <el-row class="base-form-row" type="flex">
      <template v-for="(item,name) of newFormItems">
        <el-col v-if="!item.isHide" :span="item.span ? item.span : 8" :key="name">
          <template v-if="item.isTitleBar">
            <template v-if="$slots[name]">
              <slot :name="name"></slot>
            </template>
            <div v-else class="base-form-title">{{item.label}}</div>
          </template>
          <el-form-item v-else class="base-form-item" :prop="name" v-bind="{...item}">
            <template #label v-if="item.label">
              <template v-if="item.labelSlotName">
                <slot :name="item.labelSlotName"></slot>
              </template>
              <template v-else>
                <el-tooltip effect="dark" :disabled="!item.showLabelTip" :content="item.label" placement="top">
                  <div :class="['ellipsis',item.rule&&item.rule[0].required?'required-text':'',item.dangerText?'text-danger':'']"
                       :style="{'width':labelWidth,'text-align':labelAlign}">
                    {{item.label}}{{labelSuffix}}
                  </div>
                </el-tooltip>
              </template>
            </template>
            <!-- 使用具名插槽 -->
            <template v-if="$slots[name]">
              <slot :name="name"></slot>
            </template>
            <div v-else class="base-form-item-input">
              <template v-if="item.type === 'text'">
                <div :style="item.textStyle || {}" :class="[item.dangerText?'text-danger':'']">{{item.text}}</div>
              </template>
              <!-- 普通输入框 -->
              <el-input v-else-if="item.type === 'input'" v-model="newForm[name]"
                        v-bind="{clearable: true, placeholder: setPlaceholderText(item.type), ...item.inputAttrs}"></el-input>
              <!-- 密码框 -->
              <el-input v-else-if="item.type === 'password'" v-model="newForm[name]" type="password" auto-complete="off"
                        v-bind="{clearable: true,  placeholder: setPlaceholderText(item.type), ...item.inputAttrs}"></el-input>
              <!-- 数字输入框 -->
              <el-input-number v-else-if="item.type === 'number'" v-model="newForm[name]" style="width:100%;" @keydown="onFormatInputLimit"
                               v-bind="{clearable: true, min: 0, placeholder: setPlaceholderText(item.type), 'controls-position': 'right', ...item.inputAttrs}"></el-input-number>
              <!-- 多行文本输入框 -->
              <el-input v-else-if="item.type === 'textarea'" v-model="newForm[name]"
                        v-bind="{type: 'textarea', rows: 3, clearable: true, placeholder: setPlaceholderText(item.type), 'show-word-limit': true,  ...item.inputAttrs}"></el-input>
              <!-- 下拉选择框 -->
              <el-select v-else-if="item.type === 'select'" v-model="newForm[name]" @change="getSelectChange(name)"
                         v-bind="{filterable: true, clearable: true, placeholder: setPlaceholderText(item.type), ...item.inputAttrs}">
                <el-option v-for="subItem in item.options" :key="subItem.value" :label="subItem[item.optionLabelKey || 'label']"
                           :value="subItem[item.optionValueKey || 'value']">
                </el-option>
              </el-select>
              <!-- 级联选择框 -->
              <el-cascader style="width:100%;" :popper-class="item.popperTooltip ? 'cascader-popper-tooltip' : ''" v-else-if="item.type === 'cascader'"
                           v-model="newForm[name]" :options="item.options" @change="handleCascaderChange($event,item,name)"
                           v-bind="{clearable: true, filterable: true, placeholder: setPlaceholderText(item.type), ...item.inputAttrs}">
                <template v-if="item.popperTooltip" #default="{ data }">
                  <el-tooltip :disabled="data.label.length < 12" effect="dark" :content="data.label" placement="top">
                    <span>{{ data.label }}</span>
                  </el-tooltip>
                </template>
              </el-cascader>
              <!-- 日期选择框 -->
              <el-date-picker v-else-if="['year', 'month', 'date', 'dates', 'months', 'years', 'week', 'datetime', 'datetimerange', 'daterange', 'monthrange'].includes(item.type)"
                              v-model="newForm[name]" v-bind="{clearable: true, type: item.type, ...setDatePickerOptions(item.type), ...item.inputAttrs}">
              </el-date-picker>
              <!-- 单选框 -->
              <el-radio-group v-else-if="item.type === 'radio'" v-model="newForm[name]" v-bind="{...item.inputAttrs}">
                <el-radio v-for="(subItem,index) in item.options" :key="index"
                          :value="subItem[item.optionValueKey || 'value']">{{subItem[item.optionLabelKey || 'label']}}</el-radio>
              </el-radio-group>
              <!-- 多选框 -->
              <el-checkbox-group v-else-if="item.type === 'checkbox'" v-model="newForm[name]" v-bind="{...item.inputAttrs}">
                <el-checkbox v-for="(subItem,index) in item.options" :key="index" :label="subItem.value">{{subItem.label}}</el-checkbox>
              </el-checkbox-group>
              <!-- 开关 -->
              <el-switch v-else-if="item.type === 'switch'" v-model="newForm[name]"
                         v-bind="{'active-value': 1, 'inactive-value': 0, ...item.inputAttrs}"></el-switch>
              <!-- 滑块 -->
              <el-slider v-else-if="item.type === 'slider'" v-model="newForm[name]" v-bind="{...item.inputAttrs}"></el-slider>
              <!-- 提示框 -->
              <el-tooltip v-if="item.tooltip" effect="dark" :content="item.tooltip" placement="top">
                <i class="el-icon-question tooltip-position"></i>
              </el-tooltip>
            </div>
          </el-form-item>
        </el-col>
      </template>
      <div class="flex flex-r-center w-full" v-if="isFooter">
        <el-button type="primary" @click="confirm">{{ confirmText }}</el-button>
        <el-button @click="close">{{ cancelText }}</el-button>
      </div>
    </el-row>
  </el-form>
</template>
<script setup name="BaseForm">
import { setDatePickerOptions, setPlaceholderText } from "@/utils/index";
import cache from "@/plugins/cache";
import { setDataOptions } from "@/utils/componentUtils";
const { proxy } = getCurrentInstance();
const props = defineProps({
  form: { type: Object, default: () => {} },
  formItems: { type: Object, default: () => {} },
  // 是否查看状态
  isPreview: { type: Boolean, default: false },
  labelWidth: { type: String, default: () => "110px" },
  labelAlign: { type: String, default: () => "right" },
  labelSuffix: { type: String, default: () => ":" },
  isFooter: { type: Boolean, default: () => false },
  confirmText: { type: String, default: () => "保存" },
  cancelText: { type: String, default: () => "取消" },
});
const newForm = computed(() => {
  return props.form;
});
watch(
  () => props.form,
  (val) => {
    if (val.province) {
      let provinceList = cache.local.getJSON("region-tree-data");
      props.formItems.city.options =
        provinceList.find((el) => el.code === val.province)?.children || [];
    }
    if (val.city) {
      let cityList = props.formItems.city.options;
      props.formItems.town.options =
        cityList.find((el) => el.code === val.city)?.children || [];
    }
  },
  { deep: true }
);
// 表单规则校验
const rules = computed(() => {
  const formItemsCopy = props.formItems;
  let rules = {};
  Object.keys(formItemsCopy).forEach((key) => {
    if (formItemsCopy[key].rule) {
      formItemsCopy[key].rule[0].message =
        setPlaceholderText(formItemsCopy[key].type) + formItemsCopy[key].label;
      rules[key] = formItemsCopy[key].rule;
    }
  });
  return rules;
});
const newFormItems = computed(() => {
  const formItemsCopy = props.formItems;
  let data = formItemsCopy;
  Object.keys(data).forEach((key) => {
    data[key].options = setDataOptions(data[key]);
  });
  if (data.province) {
    data.province.options = cache.local.getJSON("region-tree-data");
  }
  return data;
});

const setDatePickerOptionsFn = (type) => setDatePickerOptions(type);
const setPlaceholderTextFn = (type) => {
  if (this.isPreview) return;
  return setPlaceholderText(type);
};
const validate = (fn) => {
  proxy.$refs["elFormRef"].validate((valid) => fn(valid));
};
const resetForm = () => {
  proxy.resetForm("elFormRef");
};
const emit = defineEmits(["confirm", "cancel", "getFormSelectChange"]);
const close = () => {
  emit("cancel");
};
const confirm = () => {
  proxy.$refs["elFormRef"].validate((valid) => {
    emit("confirm", valid);
  });
};
const onFormatInputLimit = (event) => {
  if (event.key === "e") {
    event.returnValue = false;
    return false;
  }
  return true;
};
const getSelectChange = (name) => {
  if (name === "province") {
    let provinceList = props.formItems.province.options;
    props.formItems.town.options = [];
    props.form.city = "";
    props.form.town = "";
    if (props.form[name]) {
      props.formItems.city.options =
        provinceList.find((el) => el.code === props.form[name])?.children || [];
    } else {
      props.formItems.city.options = [];
    }
  }
  if (name === "city") {
    let cityList = props.formItems.city.options;
    props.form.town = "";
    if (props.form[name]) {
      props.formItems.town.options =
        cityList.find((el) => el.code === props.form[name])?.children || [];
    } else {
      props.formItems.town.options = [];
    }
  }
  emit("getFormSelectChange", name);
};
const handleCascaderChange = (val, item, key) => {
  // disabledChild 选择父级 禁用子集 省市区三级
  if (!item?.inputAttrs.disabledChild) return;
  if (val && val.length) {
    const value = item.inputAttrs.props.value || "value";
    val.map((o) => {
      const currentVal = o[o.length - 1];
      item.options.map((el) => {
        if (currentVal === el[value]) {
          newForm.value[key] = newForm.value[key].filter(
            (i) => !(i.indexOf(currentVal) > -1 && i.length > 1)
          );
        }
        el.children.map((sub) => {
          sub.disabled = el[value] === currentVal;
          if (currentVal === sub[value]) {
            newForm.value[key] = newForm.value[key].filter(
              (i) => !(i.indexOf(currentVal) > -1 && i.length > 2)
            );
          }
          sub.children.map((child) => {
            child.disabled =
              el[value] === currentVal || sub[value] === currentVal;
          });
        });
      });
    });
  } else {
    item.options = cache.local.getJSON("region-tree-data");
  }
};
defineExpose({ validate, resetForm });
</script>
<style lang="scss" scoped>
.base-form {
  &.disabled-form {
    :deep(.is-disabled) {
      input {
        background: transparent;
        border: none;
        color: #333;
        font-size: 14px;
        cursor: text;
        padding: 0;
      }
      .el-input__suffix,
      .el-input-number__decrease,
      .el-input-number__increase {
        display: none;
      }
    }
  }
  .base-form-row {
    width: 100%;
    flex-wrap: wrap;
    &.base-form-row-inside {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      border: 1px solid #ebeef5;
      margin: 0 10px;
    }
  }

  .base-form-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    width: 100%;
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 5px;
  }
  .base-form-item {
    display: flex;
    margin: 8px 10px 8px 0;

    .base-form-item-input {
      display: flex;
      align-items: center;
      width: 100%;
    }
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
