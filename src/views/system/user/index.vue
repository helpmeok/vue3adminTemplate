<template>
  <div class='app-container'>
    <base-table-search ref="baseTableSearchRef" :queryFormItems="queryFormItems" :queryParams="queryParams" @handleQuery="handleQuery" @resetQuery="resetQuery">
    </base-table-search>
    <div class="pb10">
      <el-button type="primary" icon="Plus" @click="addUserInfo">新增</el-button>
    </div>
    <base-table :columns="columns" :loading="loading" :data="tableData">
      <template #operations="{scope}">
        <el-button link type="primary" @click="editRow(scope.row)">
          编辑
        </el-button>
        <el-button link type="primary" @click="resetPwd(scope.row)">重置密码</el-button>
        <el-button link type="primary" @click="showPwd(scope.row)">显示密码</el-button>
        <el-button link type="primary" @click="delUserInfo(scope.row)">删除</el-button>
      </template>
    </base-table>
    <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
    <base-dialog :title="title" ref="baseDialogRef" size="medium" @confirm="confirm" @cancel="cancel">
      <user-form ref="userFormRef"></user-form>
    </base-dialog>
  </div>
</template>

<script setup>
import userForm from "./userForm.vue";
import useUser from "./useUser";
const { proxy } = getCurrentInstance();
const queryFormItems = reactive({
  name: { label: "姓名", type: "input" },
  userName: { label: "账号", type: "input" },
  status: {
    label: "状态",
    type: "select",
    dictType: "SYS_STATUS",
  },
});
const columns = reactive({
  name: { label: "姓名" },
  userName: { label: "账号" },
  role: {
    label: "角色",
    enumsName: "EnumUserRole",
    optionLabelKey: "desc",
    optionValueKey: "name",
  },
  status: {
    label: "状态",
    dictType: "SYS_STATUS",
  },
  operations: { label: "操作", slot: "operations", fixed: "right", width: 300 },
});
const {
  tableData,
  title,
  loading,
  total,
  queryParams,
  addUserInfo,
  handleQuery,
  resetQuery,
  editRow,
  resetPwd,
  showPwd,
  cancel,
  confirm,
  getList,
  delUserInfo,
} = useUser();

getList();
</script>

<style lang='scss' scoped>
</style>