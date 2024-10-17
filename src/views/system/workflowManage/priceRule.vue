<template>
  <div class='app-container'>
    <base-table-search ref="baseTableSearchRef" :queryFormItems="queryFormItems" :queryParams="queryParams" @handleQuery="handleQuery" @resetQuery="resetQuery">
    </base-table-search>
    <div class="pb10">
      <el-button type="primary" icon="Plus" @click="add">新增</el-button>
    </div>
    <base-table :columns="columns" :loading="loading" :data="tableData">
      <template #operations="{scope}">
        <el-button link type="primary" @click="editRow(scope.row)">
          编辑
        </el-button>
        <el-button link type="primary" :disabled="scope.row.enabled" @click="activeEnabled(scope.row)">启用</el-button>
        <el-button link type="primary" :disabled="!scope.row.enabled" @click="activeEnabled(scope.row)">禁用</el-button>
        <!-- <el-button link type="primary" @click="delRow(scope.row)">删除</el-button> -->
      </template>
    </base-table>
    <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
    <base-dialog :title="title" ref="baseDialogRef" size="large" @confirm="confirm" @cancel="cancel">
      <base-form ref="baseFormRef" :formItems="formItems" :form="form">
        <template #condition>
          <el-autocomplete type="textarea" v-model="form.condition" :fetch-suggestions="((str,cb) => {querySearchAsync(str,cb,'condition')})"
                           placeholder="请输入内容" highlight-first-item @keydown="handleKeydown" @select="((item) => {handleSelect(item,'condition')})">
          </el-autocomplete>
        </template>
        <template #factoryFormula>
          <el-autocomplete type="textarea" v-model="form.factoryFormula" :fetch-suggestions="((str,cb) => {querySearchAsync(str,cb,'factoryFormula')})"
                           placeholder="请输入内容" highlight-first-item @keydown="handleKeydown" @select="((item) => {handleSelect(item,'factoryFormula')})">
          </el-autocomplete>
        </template>
        <template #wholesaleFormula>
          <el-autocomplete type="textarea" v-model="form.wholesaleFormula" :fetch-suggestions="((str,cb) => {querySearchAsync(str,cb,'wholesaleFormula')})"
                           placeholder="请输入内容" highlight-first-item @keydown="handleKeydown" @select="((item) => {handleSelect(item,'wholesaleFormula')})">
          </el-autocomplete>
        </template>
        <template #tagFormula>
          <el-autocomplete type="textarea" v-model="form.tagFormula" :fetch-suggestions="((str,cb) => {querySearchAsync(str,cb,'tagFormula')})"
                           placeholder="请输入内容" highlight-first-item @keydown="handleKeydown" @select="((item) => {handleSelect(item,'tagFormula')})">
          </el-autocomplete>
        </template>
      </base-form>
    </base-dialog>
  </div>
</template>

<script setup>
import {
  addPriceRule,
  updatePriceRule,
  listPriceRule,
  getPriceRule,
  activePriceRule,
  delPriceRule,
  getRuleTypes,
} from "@/api/system/priceRule";
import { getDicts } from "@/api/system/dict/data";
const props = defineProps({
  flowData: { type: Object, default: () => {} },
  stepName: { type: String, default: () => "" },
});
const { proxy } = getCurrentInstance();
const title = ref("");
const loading = ref(false);
const total = ref(0);
const tableData = ref([]);
const SYS_VAR = ref([]);
const SYS_OP = ref([]);
const SYS_BASE = ref([]);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
});
const queryFormItems = reactive({
  ruleName: { label: "规则名称", type: "input" },
  ruleType: {
    label: "规则类型",
    type: "select",
    options: [],
    optionLabelKey: "desc",
    optionValueKey: "value",
  },
  enabled: {
    label: "是否启用",
    type: "select",
    dictType: "SYS_BOOLEAN",
  },
});
const columns = reactive({
  ruleName: { label: "规则名称", width: 200, showTooltip: true },
  ruleType: {
    label: "规则类型",
    options: [],
    optionLabelKey: "desc",
    optionValueKey: "value",
  },
  condition: { label: "条件表达式", showTooltip: true },
  factoryFormula: { label: "出厂价公式", showTooltip: true },
  wholesaleFormula: { label: "批发价公式", showTooltip: true },
  tagFormula: { label: "售价公式", showTooltip: true },
  enabled: { label: "是否启用", dictType: "SYS_BOOLEAN" },
  sort: { label: "排序" },
  updatedUserName: { label: "操作人" },
  updatedDate: { label: "操作时间", width: 180 },
  operations: { label: "操作", slot: "operations", fixed: "right", width: 120 },
});
const formData = reactive({
  formItems: {
    ruleName: {
      label: "规则名称",
      type: "input",
      span: 12,
      rule: [{ required: true }],
    },
    ruleType: {
      label: "规则类型",
      type: "select",
      span: 12,
      optionLabelKey: "desc",
      optionValueKey: "value",
      options: [],
      rule: [{ required: true }],
    },
    condition: {
      label: "条件表达式",
      type: "textarea",
      span: 12,
      rule: [{ required: true }],
    },
    factoryFormula: {
      label: "出厂价公式",
      type: "textarea",
      span: 12,
      rule: [{ required: true }],
    },
    wholesaleFormula: {
      label: "批发价公式",
      type: "textarea",
      span: 12,
      rule: [{ required: true }],
    },
    tagFormula: {
      label: "售价公式",
      type: "textarea",
      span: 12,
      rule: [{ required: true }],
    },
    sort: {
      type: "number",
      label: "排序",
      span: 12,
      inputAttrs: {
        min: 1,
      },
      rule: [{ required: true }],
    },
    tip: {
      type: "text",
      label: "注意",
      text: "表达式输入框中写“var.” “base.” “op.” 即可选择模版",
      span: 12,
      dangerText: true,
    },
    enabled: {
      isHide: true,
      type: "select",
      label: "是否启用",
      span: 12,
      options: [],
      dictType: "SYS_BOOLEAN",
      rule: [{ required: true }],
    },
  },
  form: {},
});
const { formItems, form } = toRefs(formData);
const handleQuery = () => {
  queryParams.pageIndex = 1;
  getList();
};
const resetQuery = () => {
  Object.keys(queryFormItems).forEach((key) => {
    queryParams[key] = "";
  });
  handleQuery();
};
const add = () => {
  getRuleTypesOptions();
  title.value = "新增规则";
  proxy.$refs["baseDialogRef"].open();
  form.value.id = "";
  form.value.enabled = false;
};
const editRow = (row) => {
  getRuleTypesOptions();
  title.value = "编辑规则";
  proxy.$refs["baseDialogRef"].open();
  proxy.$refs["baseDialogRef"].isLoading(true);
  nextTick(() => {
    getPriceRule({ id: row.id })
      .then((res) => {
        proxy.setFormData(formItems.value, form.value, res.data);
      })
      .finally(() => {
        proxy.$refs["baseDialogRef"].isLoading(false);
      });
  });
};
const delRow = (row) => {
  proxy.$modal.confirm("确认删除？").then(function () {
    delPriceRule(row.id).then((res) => {
      proxy.$modal.msgSuccess("删除成功");
      getList();
    });
  });
};
const activeEnabled = (row) => {
  activePriceRule(row.id).then((res) => {
    proxy.$modal.msgSuccess("操作成功");
    getList();
  });
};
const replaceSymbol = (str) => {
  if (!str) return "";
  return str
    .replace(/”/g, '"')
    .replace(/“/g, '"')
    .replace(/，/g, ",")
    .replace(/。/g, ".")
    .replace(/？/g, "?")
    .replace(/【/g, "[")
    .replace(/】/g, "]")
    .replace(/（/g, "(")
    .replace(/）/g, ")")
    .replace(/；/g, ";");
};
const oldAutoInput = ref("");
const strArr = reactive(["var", "base", "op"]);
const resultsSelect = ref([]);
const handleSelect = (item, key) => {
  const numArr = strArr.map((el) => {
    return oldAutoInput.value.toLowerCase().lastIndexOf(el);
  });
  const max = Math.max(...numArr);
  const str = strArr[numArr.indexOf(max)];
  if (oldAutoInput.value.toLowerCase().lastIndexOf(str) > -1) {
    form.value[key] =
      oldAutoInput.value.substring(
        0,
        oldAutoInput.value.toLowerCase().lastIndexOf(str)
      ) + item.value.split("：")[0];
  }
};
const handleKeydown = (event) => {
  // 如果按下的是回车键，则阻止事件默认行为
  if (event.key === "Enter") {
    event.preventDefault();
  }
};
const querySearchAsync = (queryString, cb, key) => {
  oldAutoInput.value = form.value[key];
  let prefix = "";
  let suffix = "";
  if (queryString.toLowerCase().lastIndexOf(".") > -1) {
    const lastIndex = queryString.toLowerCase().lastIndexOf(".");
    prefix = queryString.substring(lastIndex - 5, lastIndex).toLowerCase();
    suffix = queryString
      .substring(lastIndex, queryString.length)
      .substring(1)
      .toLowerCase();
  }
  if (prefix.lastIndexOf("var") > -1) {
    resultsSelect.value = SYS_VAR.value
      .filter((el) => (el.value + el.remark).toLowerCase().indexOf(suffix) > -1)
      .map((item) => {
        return {
          value: item.value + "：" + item.remark,
        };
      });
  } else if (prefix.lastIndexOf("base") > -1) {
    resultsSelect.value = SYS_BASE.value
      .filter((el) => (el.value + el.remark).toLowerCase().indexOf(suffix) > -1)
      .map((item) => {
        return {
          value: item.value + "：" + item.remark,
        };
      });
  } else if (prefix.lastIndexOf("op") > -1) {
    resultsSelect.value = SYS_OP.value
      .filter((el) => (el.value + el.remark).toLowerCase().indexOf(suffix) > -1)
      .map((item) => {
        return {
          value: item.value + "：" + item.remark,
        };
      });
  } else {
    resultsSelect.value = [];
  }
  cb(resultsSelect.value);
};
const confirm = () => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      form.value.workflowId = props.flowData.id;
      form.value.condition = replaceSymbol(form.value.condition);
      form.value.factoryFormula = replaceSymbol(form.value.factoryFormula);
      form.value.wholesaleFormula = replaceSymbol(form.value.wholesaleFormula);
      form.value.tagFormula = replaceSymbol(form.value.tagFormula);
      if (form.value.id) {
        updatePriceRule(form.value).then((res) => {
          proxy.$modal.msgSuccess("编辑成功");
          proxy.$refs["baseDialogRef"].close();
          getList();
        });
      } else {
        addPriceRule(form.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功");
          proxy.$refs["baseDialogRef"].close();
          getList();
        });
      }
    }
  });
};
const cancel = () => {
  proxy.$refs["baseFormRef"].resetForm();
  oldAutoInput.value = "";
};
const getList = () => {
  loading.value = true;
  listPriceRule({
    flowId: props.flowData.id,
    flowType: props.flowData.flowType,
    stepName: props.stepName,
    ...queryParams,
  })
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const getRuleTypesOptions = () => {
  getRuleTypes({
    flowType: props.flowData.flowType,
    stepName: props.stepName,
  }).then((res) => {
    formItems.value.ruleType.options = res.data;
    columns.ruleType.options = res.data;
    queryFormItems.ruleType.options = res.data;
  });
};
const getDictsOptions = () => {
  getDicts("SYS_VAR").then((res) => {
    SYS_VAR.value = res.data
      .filter((el) => el.status == "0")
      .map((p) => ({
        label: p.dictLabel,
        value: p.dictValue,
        remark: p.remark,
      }));
  });
  getDicts("SYS_OP").then((res) => {
    SYS_OP.value = res.data
      .filter((el) => el.status == "0")
      .map((p) => ({
        label: p.dictLabel,
        value: p.dictValue,
        remark: p.remark,
      }));
  });
  getDicts("SYS_BASE").then((res) => {
    SYS_BASE.value = res.data
      .filter((el) => el.status == "0")
      .map((p) => ({
        label: p.dictLabel,
        value: p.dictValue,
        remark: p.remark,
      }));
  });
};
getDictsOptions();
defineExpose({ getRuleTypesOptions, getList, resetQuery });
</script>

<style lang='scss' scoped>
</style>