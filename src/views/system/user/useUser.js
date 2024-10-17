import {
  addUser,
  updateUser,
  listUser,
  getUser,
  showUserPwd,
  updateUserPwd,
  delUser
} from "@/api/system/user";
export default function () {
  const title = ref("");
  const loading = ref(false);
  const total = ref(0);
  const tableData = ref([]);
  const queryParams = reactive({
    pageIndex: 1,
    pageSize: 15,
  });
  const handleQuery = () => {
    queryParams.pageIndex = 1;
    getList();
  };
  const resetQuery = () => {
    handleQuery();
  };
  const { proxy } = getCurrentInstance();
  const addUserInfo = (row) => {
    title.value = "新增用户";
    proxy.$refs["baseDialogRef"].open();
    nextTick(() => {
      proxy.$refs["userFormRef"].add();
    });
  };
  const editRow = (row) => {
    title.value = "编辑用户";
    proxy.$refs["baseDialogRef"].open();
    proxy.$refs["baseDialogRef"].isLoading(true);
    nextTick(() => {
      proxy.$refs["userFormRef"].update();
      getUser({ id: row.id })
        .then((res) => {
          proxy.setFormData(
            proxy.$refs["userFormRef"].formItems,
            proxy.$refs["userFormRef"].form,
            res.data
          );
        })
        .finally(() => {
          proxy.$refs["baseDialogRef"].isLoading(false);
        });
    });
  };
  // 重置密码
  const resetPwd = (row) => {
    proxy.$modal.confirm("确定将密码重置为000000？").then(() => {
      updateUserPwd({ id: row.id, password: "000000" }).then((res) => {
        proxy.$modal.msgSuccess("重置成功");
      });
    });
  };
  // 显示密码
  const showPwd = (row) => {
    showUserPwd({ id: row.id }).then((res) => {
      proxy.$alert(res.data, "用户密码");
    });
  };
  // 删除人员
  const delUserInfo = (row) => {
    proxy.$modal.confirm("确认删除？").then(function () {
      delUser(row.id).then((res) => {
        proxy.$modal.msgSuccess("删除成功");
        getList();
      });
    });

  };
  const getList = () => {
    loading.value = true;
    listUser(queryParams)
      .then((res) => {
        tableData.value = res.data.items;
        total.value = res.data.total;
      })
      .finally(() => {
        loading.value = false;
      });
  };
  const cancel = () => {
    proxy.$refs["userFormRef"].baseFormRef.resetForm();
  };
  const confirm = () => {
    proxy.$refs["userFormRef"].baseFormRef.validate((valid) => {
      if (valid) {
        if (proxy.$refs["userFormRef"].form.id) {
          updateUser(proxy.$refs["userFormRef"].form).then((res) => {
            proxy.$modal.msgSuccess("编辑成功");
            proxy.$refs["baseDialogRef"].close();
            getList();
          });
        } else {
          addUser(proxy.$refs["userFormRef"].form).then((res) => {
            proxy.$modal.msgSuccess("新增成功");
            proxy.$refs["baseDialogRef"].close();
            getList();
          });
        }
      }
    });
  };
  // 向外部提供东西
  return { tableData, title, loading, total, queryParams, handleQuery, resetQuery, showPwd, addUserInfo, delUserInfo, editRow, resetPwd, cancel, confirm, getList }
}