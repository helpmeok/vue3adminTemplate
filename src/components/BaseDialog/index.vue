<template>
  <div class="base-dialog-container">
    <el-dialog :title="title" v-model="visible" align-center draggable :modal-append-to-body="false" :close-on-click-modal="false" :width="sizeToWidth(size)"
               v-bind="$attrs" v-on="$attrs">
      <template #header="{ close }">
        <div class="base-dialog-header">
          <div class="header-title">{{title}}</div>
          <div class="flex flex-r-center">
            <svg-icon class="mr20" style="cursor: pointer;" :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="toggleFull" />
            <el-icon class="ml10" style="color: black;" @click="close">
            </el-icon>
          </div>
        </div>
      </template>
      <div class="base-dialog-content" ref="baseDialogContentRef" v-loading="loading"
           :style="{ 'max-height': sizeToHeight(size) ,height:isFullscreen?contentHeight:'auto'}">
        <slot />
      </div>
      <template v-if="!hideFooter" #footer>
        <div v-if="isSoltFooter">
          <slot name="footer" />
        </div>
        <div class="dialog-footer" v-else>
          <el-button type="primary" @click="confirm">{{ confirmText }}</el-button>
          <el-button @click="close">{{ cancelText }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="BaseDialog">
const props = defineProps({
  title: String,
  // 尺寸：large、medium、small、mini
  size: { type: String, default: () => "medium" },
  // 是否隐藏底部btn
  hideFooter: { type: Boolean, default: () => false },
  // 底部是否自定义插槽
  isSoltFooter: { type: Boolean, default: () => false },
  confirmText: { type: String, default: () => "保存" },
  cancelText: { type: String, default: () => "取消" },
});
const { proxy } = getCurrentInstance();
const emit = defineEmits(["confirm", "cancel"]);
const visible = ref(false);
const loading = ref(false);
const isFullscreen = ref(false);
const contentHeight = ref("");
watch(visible, (val) => {
  if (!val) {
    close();
  }
});
const handleResize = () => {
  if (isFullscreen.value) {
    contentHeight.value = `${window.innerHeight - 130}px`;
  }
};
watch(isFullscreen, (val) => {
  if (val) {
    handleResize();
  }
});
onMounted(() => {
  window.addEventListener("resize", handleResize);
});
const close = () => {
  emit("cancel");
  visible.value = false;
};
const confirm = () => {
  emit("confirm");
};
const sizeToWidth = (size) => {
  if (isFullscreen.value) return "100%";
  if (size === "large") return "72%";
  if (size === "medium") return "52%";
  if (size === "small") return "38%";
  if (size === "mini") return "24%";
};
const sizeToHeight = (size) => {
  if (isFullscreen.value) return "100vh";
  if (size === "large") return "70vh";
  if (size === "medium") return "50vh";
  if (size === "small") return "30vh";
  if (size === "mini") return "20vh";
};
// 打开dialog的函数
const open = () => {
  visible.value = true;
};
const isLoading = (val) => {
  loading.value = val;
};

const toggleFull = () => {
  isFullscreen.value = !isFullscreen.value;
};
defineExpose({ close, open, confirm, isLoading });
</script>

<style lang="scss" scoped>
.base-dialog-container {
  .base-dialog-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .header-title {
      font-size: 16px;
      font-weight: bold;
    }
  }
  :deep(.el-dialog__headerbtn) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px; /* 修改图标大小 */
    .el-icon svg {
      color: black;
    }
  }
  .dialog-footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :deep(.el-dialog) {
    // margin: 0;
    padding: 0;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    .el-dialog__header {
      padding: 10px 15px;
      position: relative;
      border: none;
      box-shadow: 0px 2px 6px 0px rgba(126, 126, 126, 0.08);
      .el-dialog__title {
        font-size: 16px;
        font-weight: bold;
      }
      .el-dialog__headerbtn {
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .el-dialog__body {
      padding: 0;
      position: relative;
      margin: 0;
      .base-dialog-content {
        overflow-y: auto;
        overflow-x: hidden;
        padding: 15px;
      }
    }
    .el-dialog__footer {
      padding: 10px 15px;
      box-shadow: 0px -2px 6px 0px rgba(126, 126, 126, 0.08);
    }
  }
}
</style>
