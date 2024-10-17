<template>
  <div class='app-container'>
    <el-row :gutter="20">
      <el-col :span="3" v-loading="pageLoading" style="border-right: 1px solid #f1f1f1;">
        <div class="left-box">
          <div class="flow-name">
            {{flowData.flowName}}
          </div>
          <div class="steps-box">
            <el-steps direction="vertical" process-status="finish" :space="60" :active="active">
              <el-step style="cursor: pointer;" v-for="(item,index) in flowData.steps" :status="item.status || ''" @click="changeStep(index)" :title="item.name"
                       :key="item.name" />
            </el-steps>
          </div>
        </div>
      </el-col>
      <el-col :span="21">
        <price-rule ref="priceRuleRef" :flowData="flowData" :stepName="stepName"></price-rule>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { getPriceFlow } from "@/api/system/workflowManage";
import priceRule from "./priceRule.vue";
const { proxy } = getCurrentInstance();
const route = useRoute();
const flowData = ref({
  steps: [],
  flowName: "",
});
const active = ref(1);
const stepName = ref("");
const pageLoading = ref(false);
const getStep = (flowId) => {
  pageLoading.value = true;
  getPriceFlow({ id: flowId })
    .then((res) => {
      res.data.steps = res.data.steps.map((item, index) => {
        return { ...item, status: index ? "process" : "" };
      });
      res.data.steps = [
        {
          name: "流程初始化",
          status: "wait",
        },
        ...res.data.steps,
        {
          name: "数据持久化",
          status: "wait",
        },
      ];
      flowData.value = res.data;
      stepName.value = res.data.steps[active.value].name;
      nextTick(() => {
        proxy.$refs["priceRuleRef"].getRuleTypesOptions();
        proxy.$refs["priceRuleRef"].resetQuery();
      });
    })
    .finally(() => {
      pageLoading.value = false;
    });
};
const changeStep = (index) => {
  if (index > 0 && index < flowData.value.steps.length - 1) {
    active.value = index;
    flowData.value.steps.map((item, index) => {
      if (index > 0 && index < flowData.value.steps.length - 1) {
        item.status = "process";
      }
    });
    flowData.value.steps[index].status = "finish";
    stepName.value = flowData.value.steps[index].name;
    nextTick(() => {
      proxy.$refs["priceRuleRef"].getRuleTypesOptions();
      proxy.$refs["priceRuleRef"].resetQuery();
    });
  }
};
getStep(route.params && route.params.flowId);
</script>

<style lang='scss' scoped>
.app-container {
  .left-box {
    height: calc(100vh - 110px);
    box-sizing: border-box;
    overflow: auto;
    .flow-name {
      padding: 10px;
      font-weight: 500;
    }
    .steps-box {
      :deep(.is-process) {
        font-size: 16px;
        font-weight: 400;
      }
      :deep(.is-finish) {
        font-size: 18px;
      }
    }
  }
}
</style>