<template>
  <div class='app-container'>
    <base-table-search ref="baseTableSearchRef" :queryFormItems="queryFormItems" :queryParams="queryParams" @handleQuery="handleQuery" @resetQuery="resetQuery">
    </base-table-search>
    <div class="pb10">
      <el-button type="primary" icon="Plus" @click="add">新增</el-button>
      <el-button type="danger" plain icon="Refresh" @click="handleRefreshCache">刷新缓存</el-button>
    </div>
    <base-table ref="baseTableRef" :columns="columns" :loading="loading" :data="tableData">
      <template #operations="{scope}">
        <el-button link type="primary" @click="editRow(scope.row)">
          编辑
        </el-button>
        <el-button link type="primary" @click="setData(scope.row)">
          配置数据
        </el-button>
        <el-button link type="primary" @click="delRow(scope.row)">
          删除
        </el-button>
      </template>
    </base-table>
    <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
    <base-dialog :title="title" ref="baseDialogRef" size="small" @confirm="confirm" @cancel="cancel">
      <base-form ref="baseFormRef" :formItems="formItems" :form="form"></base-form>
    </base-dialog>
  </div>
</template>

<script setup>
import {
  listType,
  getType,
  delType,
  addType,
  updateType,
} from "@/api/system/dict/type";
import useDictStore from "@/store/modules/dict";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const isDictBase = route.name === "DictBase";
const fieldName = isDictBase ? "字典" : "材质";
const title = ref("");
const loading = ref(false);
const total = ref(0);
const tableData = ref([]);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
  isSystem: isDictBase ? "Y" : "N",
});
const queryFormItems = reactive({
  dictName: { label: fieldName + "名称", type: "input" },
  dictType: { label: fieldName + "类型", type: "input" },
  status: { label: "状态", type: "select", dictType: "SYS_STATUS" },
});
const columns = reactive({
  dictName: { label: fieldName + "名称" },
  dictType: { label: fieldName + "类型" },
  status: { label: "状态", dictType: "SYS_STATUS" },
  remark: { label: "备注" },
  createdDate: { label: "创建时间", width: 180 },
  operations: { label: "操作", slot: "operations", fixed: "right", width: 200 },
});
const formData = reactive({
  formItems: {
    dictName: {
      type: "input",
      label: fieldName + "名称",
      span: 24,
      rule: [{ required: true }],
    },
    dictType: {
      type: "input",
      label: fieldName + "类型",
      span: 24,
      rule: [{ required: true }],
    },
    status: {
      label: "状态",
      type: "radio",
      span: 24,
      options: [],
      dictType: "SYS_STATUS",
      rule: [{ required: true }],
    },
    remark: {
      label: "备注",
      type: "textarea",
      span: 24,
    },
  },
  form: {
    status: "0",
    isSystem: isDictBase ? "Y" : "N",
  },
});
const { formItems, form } = toRefs(formData);
const handleQuery = () => {
  queryParams.pageIndex = 1;
  getList();
};
const resetQuery = () => {
  handleQuery();
};
const add = () => {
  title.value = "新增" + fieldName;
  proxy.$refs["baseDialogRef"].open();
  form.value.id = "";
};
const editRow = (row) => {
  title.value = "编辑" + fieldName;
  proxy.$refs["baseDialogRef"].open();
  proxy.$refs["baseDialogRef"].isLoading(true);
  nextTick(() => {
    getType(row.id)
      .then((res) => {
        proxy.setFormData(formItems.value, form.value, res.data);
      })
      .finally(() => {
        proxy.$refs["baseDialogRef"].isLoading(false);
      });
  });
};
const setData = (row) => {
  router.push({
    path: `/system/${route.name}-data/index/${row.id}`,
  });
};
const delRow = (row) => {
  proxy.$modal.confirm("确认删除？").then(function () {
    delType({ ids: row.id.toString() }).then((res) => {
      proxy.$modal.msgSuccess("删除成功");
      getList();
    });
  });
};
const confirm = () => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      if (form.value.id) {
        updateType(form.value).then((res) => {
          proxy.$modal.msgSuccess("编辑成功");
          proxy.$refs["baseDialogRef"].close();
          getList();
        });
      } else {
        addType(form.value).then((res) => {
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
  listType(queryParams)
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleRefreshCache = () => {
  proxy.$modal.msgSuccess("刷新成功");
  useDictStore().cleanDict();
};
getList();
</script>

<style lang='scss' scoped>
</style>