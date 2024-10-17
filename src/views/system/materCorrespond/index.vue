<template>
  <div class='app-container'>
    <base-table-search ref="baseTableSearchRef" :queryFormItems="queryFormItems" :queryParams="queryParams" @handleQuery="handleQuery" @resetQuery="resetQuery">
    </base-table-search>
    <div class="pb10 flex">
      <el-button type="primary" icon="Plus" @click="add">新增</el-button>
      <file-upload style="margin:0 12px 0 12px;" ref="fileUploadRef" apiUrl="/api/Material/ImportMarerial" :fileType="['xls','xlsx','csv']" btnText="导入"
                   :apiData="{}" :limit="1" @uploadedSuccessfully="uploadedSuccessfully"></file-upload>
      <el-button type="warning" icon="Download" plain @click="exportFile">导出</el-button>
      <el-button type="danger" icon="Delete" :disabled="!multipleSelection.length" @click="delBatch">批量删除</el-button>
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
      <base-form ref="baseFormRef" :formItems="formItems" :form="form"></base-form>
    </base-dialog>
  </div>
</template>

<script setup name='MaterCorrespond'>
import {
  addMaterial,
  updateMaterial,
  listMaterial,
  getMaterial,
  delMaterial,
} from "@/api/system/materCorrespond";
import useUserStore from "@/store/modules/user";
import auth from "@/plugins/auth";
const { proxy } = getCurrentInstance();
const title = ref("");
const loading = ref(false);
const total = ref(0);
const tableData = ref([]);
const multipleSelection = ref([]);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
  ProductType: useUserStore().productType,
});
const queryFormItems = reactive({
  ProductType: {
    label: "产品线",
    type: "select",
    enumsName: "EnumProductType",
    optionLabelKey: "desc",
    optionValueKey: "name",
    inputAttrs: {
      disabled: !auth.hasRole("Admin"),
    },
  },
  materialType: {
    label: "材质类型",
    type: "select",
    dictType: "SYS_MATERIALTYPE",
  },
  parameterCode: { label: "参数代码", type: "input" },
  materialColour: { label: "材质/颜色", type: "input" },
  parameter: { label: "参数值", type: "input" },
});
const columns = reactive({
  productType: {
    label: "产品线",
    enumsName: "EnumProductType",
    optionLabelKey: "desc",
    optionValueKey: "name",
  },
  materialType: { label: "材质类型", dictType: "SYS_MATERIALTYPE" },
  materialColour: { label: "材质/颜色" },
  parameter: { label: "参数值" },
  parameterCode: { label: "参数代码", showTooltip: true, width: 200 },
  updatedUserName: { label: "操作人" },
  updatedDate: { label: "操作时间", width: 180 },
  operations: { label: "操作", slot: "operations", fixed: "right", width: 120 },
});
const formData = reactive({
  formItems: {
    productType: {
      type: "select",
      label: "产品线",
      enumsName: "EnumProductType",
      optionLabelKey: "desc",
      optionValueKey: "name",
      span: 12,
      options: [],
      rule: [{ required: true }],
    },
    materialType: {
      type: "select",
      label: "材质类型",
      dictType: "SYS_MATERIALTYPE",
      span: 12,
      options: [],
      rule: [{ required: true }],
    },
    materialColour: {
      type: "input",
      label: "材质/颜色",
      span: 12,
      rule: [{ required: true }],
    },
    parameter: {
      type: "input",
      label: "参数值",
      span: 12,
      rule: [{ required: true }],
    },
    parameterCode: {
      type: "input",
      label: "参数代码",
      span: 12,
      rule: [{ required: true }],
    },
  },
  form: {
    productType: useUserStore().productType,
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
  title.value = "新增材质对应表";
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
    "/api/Material/ExportMaterial",
    exportQueryParams.value,
    proxy.creatFileName("材质对应")
  );
};
const editRow = (row) => {
  title.value = "编辑材质对应表";
  proxy.$refs["baseDialogRef"].open();
  proxy.$refs["baseDialogRef"].isLoading(true);
  nextTick(() => {
    getMaterial({ id: row.id })
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
    delMaterial({ ids: row.id }).then((res) => {
      proxy.$modal.msgSuccess("删除成功");
      getList();
    });
  });
};
const delBatch = () => {
  proxy.$modal.confirm("确认删除所有选中数据？").then(function () {
    delMaterial({
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
        updateMaterial(form.value).then((res) => {
          proxy.$modal.msgSuccess("编辑成功");
          proxy.$refs["baseDialogRef"].close();
          getList();
        });
      } else {
        addMaterial(form.value).then((res) => {
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
  listMaterial(queryParams)
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