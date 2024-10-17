<template>
  <div class='app-container'>
    <base-table-search ref="baseTableSearchRef" :queryFormItems="queryFormItems" :queryParams="queryParams" @handleQuery="handleQuery" @resetQuery="resetQuery">
    </base-table-search>
    <div class="pb10">
      <el-button type="primary" icon="Plus" @click="add">新增</el-button>
    </div>
    <base-table ref="baseTableRef" :columns="columns" :loading="loading" :data="tableData">
      <template #operations="{scope}">
        <el-button link type="primary" @click="editRow(scope.row)">
          编辑
        </el-button>
        <el-button link type="primary" :disabled="scope.row.enabled" @click="activeEnabled(scope.row)">启用</el-button>
        <el-button link type="primary" :disabled="!scope.row.enabled" @click="activeEnabled(scope.row)">禁用</el-button>
        <el-button link type="primary" @click="setFolw(scope.row)">
          配置规则
        </el-button>
      </template>
    </base-table>
    <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
    <base-dialog :title="title" ref="baseDialogRef" size="medium" @confirm="confirm" @cancel="cancel">
      <base-form ref="baseFormRef" :formItems="formItems" :form="form" @getFormSelectChange="getFormSelectChange"></base-form>
    </base-dialog>
  </div>
</template>

<script setup name='WorkflowManage'>
import {
  addPriceFlow,
  updatePriceFlow,
  listPriceFlow,
  getPriceFlow,
  activePriceFlow,
  getFlowType,
} from "@/api/system/workflowManage";
import useUserStore from "@/store/modules/user";
import auth from "@/plugins/auth";
const { proxy } = getCurrentInstance();
const router = useRouter();
const title = ref("");
const loading = ref(false);
const total = ref(0);
const tableData = ref([]);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
  productTypeId: useUserStore().productType,
});
const queryFormItems = reactive({
  productTypeId: {
    label: "产品线",
    type: "select",
    enumsName: "EnumProductType",
    optionLabelKey: "desc",
    optionValueKey: "name",
    inputAttrs: {
      disabled: !auth.hasRole("Admin"),
    },
  },
  flowName: { label: "流程名称", type: "input" },
  enabled: {
    label: "是否启用",
    type: "select",
    dictType: "SYS_BOOLEAN",
  },
});
const columns = reactive({
  flowName: { label: "流程名称" },
  productTypeId: {
    label: "产品线",
    enumsName: "EnumProductType",
    optionLabelKey: "desc",
    optionValueKey: "name",
  },
  flowType: {
    label: "引擎类型",
  },
  enabled: { label: "是否启用", dictType: "SYS_BOOLEAN" },
  updatedUserName: { label: "操作人" },
  updatedDate: { label: "操作时间", width: 180 },
  operations: { label: "操作", slot: "operations", fixed: "right", width: 230 },
});
const formData = reactive({
  formItems: {
    flowName: {
      type: "input",
      label: "流程名称",
      span: 12,
      options: [],
      rule: [{ required: true }],
    },
    productTypeId: {
      type: "select",
      label: "产品线",
      span: 12,
      options: [],
      enumsName: "EnumProductType",
      optionLabelKey: "desc",
      optionValueKey: "name",
      rule: [{ required: true }],
      inputAttrs: {},
    },
    flowType: {
      label: "引擎类型",
      type: "select",
      span: 12,
      options: [],
      optionLabelKey: "desc",
      optionValueKey: "name",
      inputAttrs: {},
      rule: [{ required: true }],
    },
  },
  form: {
    productTypeId: useUserStore().productType,
  },
});
const { formItems, form } = toRefs(formData);

const getFormSelectChange = (name) => {
  if (name === "productTypeId") {
    form.value.flowType = "";
  }
};
const getFlowTypeOptions = (productTypeId) => {
  if (productTypeId) {
    getFlowType({ productTypeId }).then((res) => {
      formItems.value.flowType.options = res.data;
    });
  } else {
    form.value.flowType = "";
    formItems.value.flowType.options = [];
  }
};
watch(
  form.value,
  (val) => {
    getFlowTypeOptions(val.productTypeId);
  },
  { deep: true, immediate: true }
);
const handleQuery = () => {
  proxy.$refs["baseTableRef"].clearTableSelection();
  queryParams.pageIndex = 1;
  getList();
};
const resetQuery = () => {
  handleQuery();
};
const add = () => {
  title.value = "新增计价流程";
  proxy.$refs["baseDialogRef"].open();
  form.value.id = "";
  formItems.value.productTypeId.inputAttrs.disabled = !auth.hasRole("Admin");
  formItems.value.flowType.inputAttrs.disabled = false;
};
const editRow = (row) => {
  title.value = "编辑计价流程";
  proxy.$refs["baseDialogRef"].open();
  proxy.$refs["baseDialogRef"].isLoading(true);
  nextTick(() => {
    formItems.value.productTypeId.inputAttrs.disabled = true;
    formItems.value.flowType.inputAttrs.disabled = true;
    getPriceFlow({ id: row.id })
      .then((res) => {
        proxy.setFormData(formItems.value, form.value, res.data);
      })
      .finally(() => {
        proxy.$refs["baseDialogRef"].isLoading(false);
      });
  });
};
const activeEnabled = (row) => {
  activePriceFlow({ id: row.id, enabled: !row.enabled }).then((res) => {
    proxy.$modal.msgSuccess("操作成功");
    getList();
  });
};
const setFolw = (row) => {
  router.push({ path: "/calcPrice/workflow-step/index/" + row.id });
};
const confirm = () => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      if (form.value.id) {
        updatePriceFlow(form.value).then((res) => {
          proxy.$modal.msgSuccess("编辑成功");
          proxy.$refs["baseDialogRef"].close();
          getList();
        });
      } else {
        addPriceFlow(form.value).then((res) => {
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
};
const getList = () => {
  loading.value = true;
  listPriceFlow(queryParams)
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
getList();
</script>

<style lang='scss' scoped>
</style>