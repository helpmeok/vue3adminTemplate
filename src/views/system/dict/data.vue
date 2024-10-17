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
import useDictStore from "@/store/modules/dict";
import useUserStore from "@/store/modules/user";
import { listType, getType } from "@/api/system/dict/type";
import {
  listData,
  getData,
  delData,
  addData,
  updateData,
} from "@/api/system/dict/data";
const { proxy } = getCurrentInstance();
import auth from "@/plugins/auth";
const router = useRouter();
const route = useRoute();
const isDictBase = route.name === "DictBaseData";
const fieldName = isDictBase ? "字典" : "材质";
const title = ref("");
const loading = ref(false);
const total = ref(0);
const tableData = ref([]);
const defaultDictType = ref("");
const typeOptions = ref([]);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
  productType: useUserStore().productType,
});
const queryFormItems = reactive({
  productType: {
    label: "产品线",
    type: "select",
    enumsName: "EnumProductType",
    optionLabelKey: "desc",
    optionValueKey: "name",
    inputAttrs: {
      disabled: !auth.hasRole("Admin"),
    },
    isHide: auth.hasRole("Admin") && isDictBase,
  },
  dictType: {
    label: fieldName + "名称",
    type: "select",
    options: [],
    optionLabelKey: "dictName",
    optionValueKey: "dictType",
    rule: [{ required: true }],
  },
  dictLabel: { label: fieldName + "标签", type: "input" },
  status: { label: "状态", type: "select", dictType: "SYS_STATUS" },
});
const columns = reactive({
  productType: {
    label: "产品线",
    enumsName: "EnumProductType",
    optionLabelKey: "desc",
    optionValueKey: "name",
    isHide: auth.hasRole("Admin") && isDictBase,
  },
  modules: {
    label: "模块",
    isHide: isDictBase,
  },
  dictLabel: { label: fieldName + "标签" },
  dictValue: { label: fieldName + "键值" },
  dictSort: { label: fieldName + "排序" },
  status: { label: "状态", dictType: "SYS_STATUS" },
  remark: { label: "备注" },
  createdDate: { label: "创建时间", width: 180 },
  operations: { label: "操作", slot: "operations", fixed: "right", width: 200 },
});
const formData = reactive({
  formItems: {
    productType: {
      isHide: isDictBase,
      type: "select",
      label: "产品线",
      span: 12,
      options: [],
      enumsName: "EnumProductType",
      optionLabelKey: "desc",
      optionValueKey: "name",
      rule: [{ required: true }],
      inputAttrs: {
        disabled: !auth.hasRole("Admin"),
      },
    },
    modulesArr: {
      label: "模块",
      dictType: "SYS_CATEGORY",
      isHide: isDictBase,
      type: "select",
      span: 12,
      inputAttrs: {
        multiple: true,
      },
      options: [],
    },
    dictLabel: {
      type: "input",
      label: fieldName + "标签",
      span: 24,
      rule: [{ required: true }],
    },
    dictValue: {
      type: "input",
      label: fieldName + "键值",
      span: 24,
      rule: [{ required: true }],
    },
    dictSort: {
      type: "number",
      label: fieldName + "排序",
      span: 12,
      rule: [{ required: true }],
    },
    status: {
      label: "状态",
      type: "radio",
      span: 12,
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
    modulesArr: [],
    productType: useUserStore().productType,
  },
});
const { formItems, form } = toRefs(formData);
const handleQuery = () => {
  queryParams.pageIndex = 1;
  getList();
};
const resetQuery = () => {
  queryParams.dictType = defaultDictType.value;
  handleQuery();
};
const add = () => {
  title.value = "新增" + fieldName + "数据";
  proxy.$refs["baseDialogRef"].open();
  form.value.id = "";
};
const editRow = (row) => {
  title.value = "编辑" + fieldName + "数据";
  proxy.$refs["baseDialogRef"].open();
  proxy.$refs["baseDialogRef"].isLoading(true);
  nextTick(() => {
    getData(row.id)
      .then((res) => {
        proxy.setFormData(formItems.value, form.value, res.data);
        form.value.modulesArr = res.data.modules
          ? res.data.modules.split(",")
          : [];
      })
      .finally(() => {
        proxy.$refs["baseDialogRef"].isLoading(false);
      });
  });
};
const delRow = (row) => {
  proxy.$modal.confirm("确认删除？").then(function () {
    delData({ ids: row.id.toString() }).then((res) => {
      proxy.$modal.msgSuccess("删除成功");
      useDictStore().cleanDict();
      getList();
    });
  });
};
const confirm = () => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      form.value.dictType = queryParams.dictType;
      form.value.isDefault = "N";
      form.value.modules = form.value.modulesArr.join(",");
      if (form.value.id) {
        updateData(form.value).then((res) => {
          useDictStore().cleanDict();
          proxy.$modal.msgSuccess("编辑成功");
          proxy.$refs["baseDialogRef"].close();
          getList();
        });
      } else {
        addData(form.value).then((res) => {
          useDictStore().cleanDict();
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
  listData(queryParams)
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const getTypes = (dictId) => {
  getType(dictId).then((response) => {
    queryParams.dictType = response.data.dictType;
    defaultDictType.value = response.data.dictType;
    getList();
  });
};
getTypes(route.params && route.params.dictId);
const getTypeList = () => {
  listType({
    pageIndex: 1,
    pageSize: 100,
    isSystem: isDictBase ? "Y" : "N",
  }).then((response) => {
    queryFormItems.dictType.options = response.data.items;
  });
};
getTypeList();
</script>

<style lang='scss' scoped>
</style>