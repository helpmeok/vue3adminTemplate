<template>
  <div class='app-container'>
    <base-table-search ref="baseTableSearchRef" :queryFormItems="queryFormItems" :queryParams="queryParams" @handleQuery="handleQuery" @resetQuery="resetQuery">
    </base-table-search>
    <div class="pb10 flex">
      <el-button type="primary" icon="Plus" @click="add">新增</el-button>
      <file-upload style="margin:0 12px 0 12px;" ref="fileUploadRef" apiUrl="/api/ProductSize/ImportProductSize" :fileType="['xls','xlsx','csv']" btnText="导入"
                   :apiData="{}" :limit="1" @uploadedSuccessfully="uploadedSuccessfully"></file-upload>
      <el-button type="warning" icon="Download" plain @click="exportFile">导出</el-button>
      <el-button type="danger" icon="Delete" :disabled="!multipleSelection.length" @click="delBatch()">批量删除</el-button>
    </div>
    <base-table ref="baseTableRef" :columns="columns" :loading="loading" :data="tableData" showSelect @getMultipleSelection="getMultipleSelection">
      <template #operations="{scope}">
        <el-button link type="primary" @click="editRow(scope.row)">
          编辑
        </el-button>
        <el-button link type="primary" @click="delRow(scope.row)">删除</el-button>
      </template>
    </base-table>
    <pagination :total="total" v-model:page="queryParams.pageIndex" showSelect :selectionLength="multipleSelection.length" v-model:limit="queryParams.pageSize"
                @pagination="getList" />
    <base-dialog :title="title" ref="baseDialogRef" size="medium" @confirm="confirm" @cancel="cancel">
      <base-form ref="baseFormRef" :formItems="formItems" :form="form">
        <template #固定宽度>
          <el-input v-model="form.固定宽度">
            <template #append>多值用 / 隔开</template>
          </el-input>
        </template>
        <template #固定高度>
          <el-input v-model="form.固定高度">
            <template #append>多值用 / 隔开</template>
          </el-input>
        </template>
        <template #固定深度>
          <el-input v-model="form.固定深度">
            <template #append>多值用 / 隔开</template>
          </el-input>
        </template>
      </base-form>
    </base-dialog>
  </div>
</template>

<script setup name='ProductSizeSet'>
import {
  addProductSize,
  updateProductSize,
  listProductSize,
  getProductSize,
  delProductSize,
} from "@/api/system/productSizeSet";
const { proxy } = getCurrentInstance();
import useUserStore from "@/store/modules/user";
import auth from "@/plugins/auth";
const title = ref("");
const loading = ref(false);
const total = ref(0);
const tableData = ref([]);
const multipleSelection = ref([]);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
  产品线: useUserStore().productType,
});
const queryFormItems = reactive({
  产品线: {
    label: "产品线",
    type: "select",
    enumsName: "EnumProductType",
    optionLabelKey: "desc",
    optionValueKey: "name",
    inputAttrs: {
      disabled: !auth.hasRole("Admin"),
    },
  },
  模块: { label: "模块", type: "select", dictType: "SYS_CATEGORY" },
  风格系列: { label: "风格系列", type: "input" },
});
const columns = reactive({
  产品线: {
    label: "产品线",
    enumsName: "EnumProductType",
    optionLabelKey: "desc",
    optionValueKey: "name",
  },
  模块: { label: "模块" },
  风格系列: { label: "风格系列" },
  进制宽: { label: "进制宽" },
  进制高: { label: "进制高" },
  进制深: { label: "进制深" },
  固定宽度: { label: "固定宽度" },
  固定高度: { label: "固定高度" },
  固定深度: { label: "固定深度" },
  最小宽度: { label: "最小宽度" },
  最大宽度: { label: "最大宽度" },
  最小高度: { label: "最小高度" },
  最大高度: { label: "最大高度" },
  最小深度: { label: "最小深度" },
  最大深度: { label: "最大深度" },
  极限宽: { label: "极限宽" },
  极限高: { label: "极限高" },
  极限深: { label: "极限深" },
  updatedUserName: { label: "操作人" },
  updatedDate: { label: "操作时间", width: 180 },
  operations: { label: "操作", slot: "operations", fixed: "right", width: 120 },
});
const formData = reactive({
  formItems: {
    产品线: {
      type: "select",
      label: "产品线",
      enumsName: "EnumProductType",
      optionLabelKey: "desc",
      optionValueKey: "name",
      span: 12,
      options: [],
      rule: [{ required: true }],
      inputAttrs: {
        disabled: !auth.hasRole("Admin"),
      },
    },
    模块: {
      type: "select",
      label: "模块",
      span: 12,
      options: [],
      dictType: "SYS_CATEGORY",
      rule: [{ required: true }],
    },
    风格系列: {
      type: "input",
      label: "风格系列",
      span: 12,
      options: [],
      rule: [{ required: true }],
    },
    进制宽: {
      type: "number",
      label: "进制宽",
      span: 12,
    },
    进制高: {
      type: "number",
      label: "进制高",
      span: 12,
    },
    进制深: {
      type: "number",
      label: "进制深",
      span: 12,
    },
    固定宽度: {
      type: "input",
      label: "固定宽度",
      span: 24,
    },
    最小宽度: {
      type: "number",
      label: "最小宽度",
      span: 12,
    },
    最大宽度: {
      type: "number",
      label: "最大宽度",
      span: 12,
    },
    固定高度: {
      type: "input",
      label: "固定高度",
      span: 24,
    },
    最小高度: {
      type: "number",
      label: "最小高度",
      span: 12,
    },
    最大高度: {
      type: "number",
      label: "最大高度",
      span: 12,
    },
    固定深度: {
      type: "input",
      label: "固定深度",
      span: 24,
    },
    最小深度: {
      type: "number",
      label: "最小深度",
      span: 12,
    },
    最大深度: {
      type: "number",
      label: "最大深度",
      span: 12,
    },
    极限宽: {
      type: "number",
      label: "极限宽",
      span: 12,
    },
    极限高: {
      type: "number",
      label: "极限高",
      span: 12,
    },
    极限深: {
      type: "number",
      label: "极限深",
      span: 12,
    },
  },
  form: {
    产品线: useUserStore().productType,
  },
});
const { formItems, form } = toRefs(formData);
const exportQueryParams = ref({});
const handleQuery = () => {
  proxy.$refs["baseTableRef"].clearTableSelection();
  queryParams.pageIndex = 1;
  getList();
};
const resetQuery = () => {
  handleQuery();
};
const add = () => {
  title.value = "新增产品尺寸";
  proxy.$refs["baseDialogRef"].open();
  form.value.id = "";
};
const getMultipleSelection = (val) => {
  multipleSelection.value = val;
};
const uploadedSuccessfully = () => {
  resetQuery();
  proxy.$refs["fileUploadRef"].clearFileList();
};
const exportFile = () => {
  proxy.exportFileDown(
    "/api/ProductSize/ExportProductSize",
    exportQueryParams.value,
    proxy.creatFileName("产品尺寸")
  );
};
const editRow = (row) => {
  title.value = "编辑产品尺寸";
  proxy.$refs["baseDialogRef"].open();
  proxy.$refs["baseDialogRef"].isLoading(true);
  nextTick(() => {
    getProductSize({ id: row.id })
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
    delProductSize({ ids: row.id }).then((res) => {
      proxy.$modal.msgSuccess("删除成功");
      getList();
    });
  });
};
const delBatch = () => {
  proxy.$modal.confirm("确认删除所有选中数据？").then(function () {
    delProductSize({
      ids: multipleSelection.value.map((el) => el.id).join(","),
    }).then((res) => {
      proxy.$modal.msgSuccess("删除成功");
      handleQuery();
    });
  });
};
const confirm = () => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      if (form.value.id) {
        updateProductSize(form.value).then((res) => {
          proxy.$modal.msgSuccess("编辑成功");
          proxy.$refs["baseDialogRef"].close();
          getList();
        });
      } else {
        addProductSize(form.value).then((res) => {
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
  exportQueryParams.value = { ...queryParams };
  listProductSize(queryParams)
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