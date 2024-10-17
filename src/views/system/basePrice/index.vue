<template>
  <div class='app-container'>
    <base-table-search ref="baseTableSearchRef" :queryFormItems="queryFormItems" :queryParams="queryParams" @handleQuery="handleQuery" @resetQuery="resetQuery">
    </base-table-search>
    <div class="pb10 flex">
      <el-button type="primary" icon="Plus" @click="add">新增</el-button>
      <file-upload style="margin:0 12px 0 12px;" ref="fileUploadRef" apiUrl="/api/BasePrice/ImportBasePrice" :fileType="['xls','xlsx','csv']" btnText="导入"
                   :apiData="{}" :limit="1" @uploadedSuccessfully="uploadedSuccessfully"></file-upload>
      <el-button type="warning" icon="Download" @click="exportFile" plain>导出</el-button>
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
    <base-dialog :title="title" ref="baseDialogRef" size="large" @confirm="confirm" @cancel="cancel">
      <base-form ref="baseFormRef" :formItems="formItems" :form="form" @getFormSelectChange="getFormSelectChange" labelWidth="125px"></base-form>
    </base-dialog>
  </div>
</template>

<script setup name='BasePrice'>
import {
  addBasePrice,
  updateBasePrice,
  listBasePrice,
  getBasePrice,
  delBasePrice,
} from "@/api/system/basePrice";
import { getDicts } from "@/api/system/dict/data";
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
  产品线: useUserStore().productType,
  模块: "",
  modules: [],
});
const queryFormItems = reactive({
  渠道: { label: "渠道", type: "input" },
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
  计价方式: { label: "计价方式", type: "select", dictType: "SYS_ PRICING" },
  modules: {
    label: "模块",
    type: "select",
    dictType: "SYS_CATEGORY",
    inputAttrs: { multiple: true, "collapse-tags": true },
  },
  风格系列: { label: "风格系列", type: "input" },
});
const columns = reactive({
  渠道: { label: "渠道" },
  产品线: {
    label: "产品线",
    enumsName: "EnumProductType",
    optionLabelKey: "desc",
    optionValueKey: "name",
  },
  计价方式: { label: "计价方式" },
  计价条件: { label: "计价条件", showTooltip: true, width: 200 },
  模块: { label: "模块", dictType: "SYS_CATEGORY" },
  风格系列: { label: "风格系列" },
  产品型号: { label: "产品型号" },
  柜体颜色: { label: "柜体颜色" },
  面板颜色: { label: "面板颜色" },
  面板造型: { label: "面板造型" },
  拉手五金: { label: "拉手五金", dictType: "拉手五金" },
  台面边型: { label: "台面边型" },
  宽度: { label: "宽度" },
  是否挖孔: { label: "是否挖孔", dictType: "SYS_YESORNO" },
  // 挡水条造型: { label: "挡水条造型" },
  岩板花色等级: { label: "岩板花色等级", dictType: "岩板花色等级" },
  最小计价尺寸: { label: "最小计价尺寸" },
  出厂价: { label: "出厂价" },
  出厂总价加收: { label: "出厂总价加收" },
  批发价: { label: "批发价" },
  批发总价加收: { label: "批发总价加收" },
  销售牌价: { label: "销售牌价" },
  销售总牌价加收: { label: "销售总牌价加收" },
  备注: { label: "备注" },
  updatedUserName: { label: "操作人" },
  updatedDate: { label: "操作时间", width: 180 },
  operations: { label: "操作", slot: "operations", fixed: "right", width: 120 },
});
const formData = reactive({
  formItems: {
    渠道: {
      label: "渠道",
      type: "select",
      rule: [{ required: true }],
      dictType: "SYS_CHANNEL",
      isOption: true,
      span: 8,
    },
    产品线: {
      label: "产品线",
      type: "select",
      rule: [{ required: true }],
      enumsName: "EnumProductType",
      optionLabelKey: "desc",
      optionValueKey: "name",
      span: 8,
      inputAttrs: {
        disabled: !auth.hasRole("Admin"),
      },
    },
    计价方式: {
      label: "计价方式",
      type: "select",
      rule: [{ required: true }],
      dictType: "SYS_ PRICING",
      span: 8,
    },
    // 计价条件: {
    //   label: "计价条件",
    //   type: "input",
    //   rule: [{ required: true }],
    //   span: 8,
    // },
    模块: {
      label: "模块",
      type: "select",
      rule: [{ required: true }],
      span: 8,
      isOption: true,
      dictType: "SYS_CATEGORY",
    },
    风格系列: {
      label: "风格系列",
      type: "input",
      span: 8,
      isOption: true,
    },
    产品型号: { label: "产品型号", type: "input", span: 8, isOption: true },
    柜体颜色Arr: {
      label: "柜体颜色",
      type: "select",
      span: 8,
      dictType: "柜体颜色",
      inputAttrs: {
        multiple: true,
      },
      isOption: true,
    },
    面板颜色Arr: {
      label: "面板颜色",
      type: "select",
      span: 8,
      dictType: "面板颜色",
      inputAttrs: {
        multiple: true,
      },
      isOption: true,
    },
    面板造型Arr: {
      label: "面板造型",
      type: "select",
      span: 8,
      inputAttrs: {
        multiple: true,
      },
      isOption: true,
    },
    拉手五金: {
      label: "拉手五金",
      type: "select",
      span: 8,
      dictType: "拉手五金",
      isOption: true,
    },
    台面边型: { label: "台面边型", type: "input", span: 8, isOption: true },
    宽度: {
      label: "宽度",
      type: "number",
      span: 8,
      isOption: true,
    },
    是否挖孔: {
      label: "是否挖孔",
      type: "select",
      span: 8,
      dictType: "SYS_YESORNO",
      isOption: true,
    },
    // 挡水条造型: { label: "挡水条造型", type: "input", span: 8, isOption: true },
    岩板花色等级: {
      label: "岩板花色等级",
      type: "select",
      span: 8,
      dictType: "岩板花色等级",
      isOption: true,
    },
    最小计价尺寸: {
      label: "最小计价尺寸",
      type: "number",
      span: 8,
    },
    出厂价: {
      label: "出厂价",
      type: "number",
      rule: [{ required: true }],
      span: 8,
    },
    出厂总价加收: {
      label: "出厂总价加收",
      type: "number",
      rule: [{ required: true }],
      span: 8,
    },
    批发价: {
      label: "批发价",
      type: "number",
      rule: [{ required: true }],
      span: 8,
    },
    批发总价加收: {
      label: "批发总价加收",
      type: "number",
      rule: [{ required: true }],
      span: 8,
    },
    销售牌价: {
      label: "销售牌价",
      type: "number",
      rule: [{ required: true }],
      span: 8,
    },
    销售总牌价加收: {
      label: "销售总牌价加收",
      type: "number",
      rule: [{ required: true }],
      span: 8,
    },
    备注: { label: "备注", type: "input", span: 8 },
  },
  form: {
    柜体颜色Arr: [],
    面板颜色Arr: [],
    面板造型Arr: [],
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
  title.value = "新增基础计价";
  proxy.$refs["baseDialogRef"].open();
  form.value.id = "";
};
const getMultipleSelection = (val) => {
  multipleSelection.value = val;
};
const getFormSelectChange = (name) => {
  if (name === "模块") {
    form.value.面板造型Arr = [];
    form.value.面板造型 = "";
    formItems.value.面板造型Arr.options = [];
    if (form.value[name]) {
      getDicts("面板造型", { modules: form.value[name] }).then((res) => {
        formItems.value.面板造型Arr.options = res.data
          .filter((el) => el.status == "0")
          .map((p) => ({ label: p.dictLabel, value: p.dictValue }));
      });
    }
  }
};
const uploadedSuccessfully = () => {
  resetQuery();
  proxy.$refs["fileUploadRef"].clearFileList();
};
const exportFile = () => {
  proxy.exportFileDown(
    "/api/BasePrice/ExportBasePrice",
    exportQueryParams.value,
    proxy.creatFileName("基础计价")
  );
};
const editRow = (row) => {
  title.value = "编辑基础计价";
  proxy.$refs["baseDialogRef"].open();
  proxy.$refs["baseDialogRef"].isLoading(true);
  nextTick(() => {
    getBasePrice({ id: row.id })
      .then((res) => {
        proxy.setFormData(formItems.value, form.value, res.data);
        form.value.柜体颜色Arr = res.data.柜体颜色
          ? res.data.柜体颜色.split(",")
          : [];
        form.value.面板颜色Arr = res.data.面板颜色
          ? res.data.面板颜色.split(",")
          : [];
        form.value.面板造型Arr = res.data.面板造型
          ? res.data.面板造型.split(",")
          : [];
      })
      .finally(() => {
        proxy.$refs["baseDialogRef"].isLoading(false);
      });
  });
};
const delRow = (row) => {
  proxy.$modal.confirm("确认删除？").then(function () {
    delBasePrice({ ids: row.id }).then((res) => {
      proxy.$modal.msgSuccess("删除成功");
      getList();
    });
  });
};
const delBatch = () => {
  proxy.$modal.confirm("确认删除所有选中数据？").then(function () {
    delBasePrice({
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
      let arr = [];
      Object.keys(formItems.value).forEach((key) => {
        if (formItems.value[key]?.isOption) {
          if (
            form.value[key] ||
            form.value[key] === 0 ||
            form.value[key] === false
          ) {
            arr.push(key);
          }
        }
      });
      form.value.计价条件 = arr.join("+");
      form.value.柜体颜色 = form.value.柜体颜色Arr.join(",");
      form.value.面板颜色 = form.value.面板颜色Arr.join(",");
      form.value.面板造型 = form.value.面板造型Arr.join(",");
      if (form.value.id) {
        updateBasePrice(form.value).then((res) => {
          proxy.$modal.msgSuccess("编辑成功");
          proxy.$refs["baseDialogRef"].close();
          getList();
        });
      } else {
        addBasePrice(form.value).then((res) => {
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
  queryParams.模块 = queryParams.modules.join(",");
  exportQueryParams.value = { ...queryParams };
  listBasePrice(queryParams)
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