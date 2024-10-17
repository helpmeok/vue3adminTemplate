<template>
  <div class=''>
    <base-form ref="baseFormRef" :formItems="formItems" :form="form"></base-form>
  </div>
</template>

<script setup name=''>
import { patternPhone, patternEmail } from "@/utils/validate";
const baseFormRef = ref(null);
const formData = reactive({
  formItems: {
    userName: {
      type: "input",
      label: "用户账号",
      span: 12,
      rule: [{ required: true }],
      inputAttrs: {},
    },
    password: {
      type: "password",
      label: "用户密码",
      span: 12,
      rule: [{ required: true }],
    },
    name: {
      type: "input",
      label: "用户姓名",
      span: 12,
      rule: [{ required: true }],
    },
    role: {
      type: "select",
      label: "角色",
      rule: [{ required: true }],
      enumsName: "EnumUserRole",
      optionLabelKey: "desc",
      optionValueKey: "name",
      span: 12,
    },
    productType: {
      type: "select",
      label: "产品线",
      span: 12,
      inputAttrs: {},
      enumsName: "EnumProductType",
      optionLabelKey: "desc",
      optionValueKey: "name",
      rule: [{ required: false }],
    },
    sex: {
      type: "select",
      label: "性别",
      span: 12,
      dictType: "SYS_SEX",
      rule: [{ required: true }],
    },
    status: {
      type: "select",
      label: "用户状态",
      span: 12,
      dictType: "SYS_STATUS",
      rule: [{ required: true }],
    },
    phone: {
      type: "input",
      label: "电话",
      span: 12,
      rule: [
        { required: false },
        {
          pattern: patternPhone(),
          message: "电话格式不正确",
          trigger: "blur",
        },
      ],
    },
    email: {
      type: "input",
      label: "邮箱地址",
      span: 24,
      rule: [
        { required: false },
        {
          pattern: patternEmail(),
          message: "邮箱地址格式不正确",
          trigger: "blur",
        },
      ],
    },
    contactAddress: {
      type: "input",
      label: "联系地址",
      span: 24,
    },
  },
  form: {},
});
const { formItems, form } = toRefs(formData);
const add = () => {
  form.value.id = "";
  formItems.value.userName.inputAttrs.disabled = false;
  formItems.value.password.isHide = false;
  formItems.value.email.span = 24;
};
const update = () => {
  formItems.value.userName.inputAttrs.disabled = true;
  formItems.value.password.isHide = true;
  formItems.value.email.span = 12;
};
watch(
  form.value,
  (val) => {
    if (val.role === "Admin") {
      formItems.value.productType.inputAttrs.disabled = true;
      formItems.value.productType.rule[0].required = false;
      form.value.productType = "";
    } else if (val.role === "ProductTypeAdmin") {
      formItems.value.productType.inputAttrs.disabled = false;
      formItems.value.productType.rule[0].required = true;
    } else {
      formItems.value.productType.rule[0].required = false;
      formItems.value.productType.inputAttrs.disabled = false;
      form.value.productType = "";
    }
  },
  { deep: true }
);
defineExpose({ formItems, form, baseFormRef, update, add });
</script>

<style lang='scss' scoped>
</style>