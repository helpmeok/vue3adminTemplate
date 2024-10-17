<template>
  <div class='app-container'>
    <base-table-search ref="baseTableSearchRef" :queryFormItems="queryFormItems" :queryParams="queryParams" @getQuerySelectChange="getQuerySelectChange"
                       @handleQuery="handleQuery" @resetQuery="resetQuery">
    </base-table-search>
    <base-table ref="baseTableRef" :columns="columns" :loading="loading" :data="tableData">
    </base-table>
    <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script setup name='PriceLog'>
import { listPriceLog } from "@/api/system/priceLog";
import { getFlowType, getFlowSteps } from "@/api/system/workflowManage";
const { proxy } = getCurrentInstance();
import useUserStore from "@/store/modules/user";
import auth from "@/plugins/auth";
const loading = ref(false);
const total = ref(0);
const tableData = ref([]);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
  productTypeId: useUserStore().productType,
  createdDate: [
    proxy.moment().format("YYYY-MM-DD") + " 00:00:00",
    proxy.moment().format("YYYY-MM-DD") + " 23:59:59",
  ],
});
const queryFormItems = reactive({
  productItemId: {
    label: "产品UUID",
    type: "input",
  },
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
  flowType: {
    label: "引擎类型",
    type: "select",
    optionLabelKey: "desc",
    optionValueKey: "name",
  },
  flowStep: {
    label: "步骤名称",
    type: "select",
    optionLabelKey: "desc",
    optionValueKey: "name",
  },
  module: {
    label: "模块",
    type: "select",
    dictType: "SYS_CATEGORY",
  },
  c2fUserName: {
    label: "c2f用户名",
    type: "input",
  },
  projectId: {
    label: "设计方案Id",
    type: "input",
  },
  logLevel: {
    label: "日志类型",
    type: "select",
    dictType: "SYS_LOGTYPE",
  },
  createdDate: {
    label: "记录时间",
    type: "datetimerange",
    rule: [{ required: true }],
  },
});
const columns = reactive({
  productTypeId: {
    label: "产品线",
    enumsName: "EnumProductType",
    optionLabelKey: "desc",
    optionValueKey: "name",
  },
  flowStep: { label: "步骤名称" },
  ruleOutput: { label: "规则输出", width: 300 },
  logLevel: { label: "日志类型", dictType: "SYS_LOGTYPE" },
  module: { label: "模块", dictType: "SYS_CATEGORY" },
  logText: { label: "描述信息", width: 200 },
  c2fUserName: { label: "c2f用户名" },
  projectId: { label: "设计方案Id" },
  createdDate: { label: "记录时间", width: 180 },
});
const getQuerySelectChange = (name) => {
  if (name === "productTypeId") {
    if (queryParams.productTypeId) {
      getFlowType({ productTypeId: queryParams.productTypeId }).then((res) => {
        queryFormItems.flowType.options = res.data;
      });
    } else {
      queryFormItems.flowType.options = [];
      queryFormItems.flowStep.options = [];
    }
    queryParams.flowType = "";
    queryParams.flowStep = "";
  }
  if (name === "flowType") {
    if (queryParams.flowType) {
      getFlowSteps({ flowType: queryParams.flowType }).then((res) => {
        queryFormItems.flowStep.options = res.data;
      });
    } else {
      queryFormItems.flowStep.options = [];
    }
    queryParams.flowStep = "";
  }
};
const handleQuery = () => {
  queryParams.pageIndex = 1;
  getList();
};
const resetQuery = () => {
  handleQuery();
};
const cancel = () => {
  proxy.$refs["baseFormRef"].resetForm();
};
const getList = () => {
  loading.value = true;
  listPriceLog(
    proxy.addDateRange(
      queryParams,
      queryParams.createdDate,
      "createdDateStart",
      "createdDateEnd"
    )
  )
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
getList();
getQuerySelectChange("productTypeId");
</script>

<style lang='scss' scoped>
</style>