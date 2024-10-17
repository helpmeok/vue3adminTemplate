<template>
  <div class="app-container h-full w-full">
    定制价格中心，欢迎您！
    <!-- <el-row :gutter="24">
      <el-col :span="16" style="height: calc(100vh - 120px);overflow: auto;">
        <el-select v-model="value" @change="submit" style="width: 240px">
          <el-option v-for="item in OPERAT_RULE" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button class="ml10" type="primary" @click="submit">提交</el-button>
        <el-button class="ml10" type="primary" @click="createdExpression">生成</el-button>
        <el-input class="ml10" v-model="expression" style="width:800px;" type="textarea" />
        <div class="mt10">
          <span>创建条件：</span>
          <el-button type="primary" icon="Plus" @click="addCondition">新增条件</el-button>
          <el-button type="warning" icon="Plus" @click="addSubCondition">新增子条件</el-button>
        </div>
        <condition-tree :data="dataArr"></condition-tree>
      </el-col>
      <el-col :span="8">
        <json-viewer boxed copyable expanded style="height: calc(100vh - 120px);overflow: auto;width:95%;" :expand-depth="Infinity" theme="my-json-theme"
                     :value="jsonData"></json-viewer>
      </el-col>
    </el-row> -->
  </div>
</template>

<script setup name="Index">
import conditionTree from "./conditionTree.vue";
import { getUuid } from "@/utils/ruoyi.js";
const { proxy } = getCurrentInstance();
const conditionItem = () => ({
  id: getUuid(),
  left: "",
  name: "",
  operator: "",
  value: "",
  rule: "",
  right: "",
});
const conditionSubItem = () => ({
  id: getUuid(),
  rule: "",
  children: [
    {
      id: getUuid(),
      name: "",
      operator: "",
      value: "",
    },
  ],
});
const value = ref("");
const expression = ref("");
const { OPERAT_RULE } = inject("useDict")("OPERAT_RULE");

const dataArr = ref([]);
const jsonData = ref({});
watch(
  dataArr,
  (value) => {
    submit();
  },
  { deep: true }
);
const addCondition = () => {
  dataArr.value.push(JSON.parse(JSON.stringify(conditionItem())));
};
const addSubCondition = () => {
  dataArr.value.push(JSON.parse(JSON.stringify(conditionSubItem())));
};
const submit = () => {
  // 强制更新数据
  jsonData.value = {};
  setTimeout(() => {
    jsonData.value = {
      rule: value.value,
      children: dataArr.value,
    };
  });
};
const expressionStr = ref("");
const filterChildren = (arr, rule) => {
  arr.map((item) => {
    if (item.children && item.children.length) {
      filterChildren(item.children, item.rule);
    } else {
      expressionStr.value += `${item.left}${item.name} ${item.operator} ${
        item.value
      }${item.right} ${item.rule || ""} `;
    }
  });
  console.log(expressionStr.value);
};
const createdExpression = () => {
  expressionStr.value = "";
  filterChildren(jsonData.value.children, jsonData.value.rule);
  expression.value = expressionStr.value;
  // const expressionArr = jsonData.value.children.map(
  //   (item) => `(${item.name} ${item.operator} ${item.value})`
  // );
  // expression.value = expressionArr.join(` ${jsonData.value.rule} `);
};
</script>

<style scoped lang="scss">
.app-container {
  :deep(.jv-my-json-theme) {
    background: #fff;
    white-space: nowrap;
    color: #525252;
    font-size: 14px;
    font-family: Consolas, Menlo, Courier, monospace;
    .jv-ellipsis {
      color: #999;
      background-color: #eee;
      display: inline-block;
      line-height: 0.9;
      font-size: 0.9em;
      padding: 0px 4px 2px 4px;
      border-radius: 3px;
      vertical-align: 2px;
      cursor: pointer;
      user-select: none;
    }
    .jv-button {
      color: #49b3ff;
    }
    .jv-key {
      color: #111111;
    }
    .jv-item {
      &.jv-array {
        color: #111111;
      }
      &.jv-boolean {
        color: #fc1e70;
      }
      &.jv-function {
        color: #067bca;
      }
      &.jv-number {
        color: #fc1e70;
      }
      &.jv-number-float {
        color: #fc1e70;
      }
      &.jv-number-integer {
        color: #fc1e70;
      }
      &.jv-object {
        color: #111111;
      }
      &.jv-undefined {
        color: #e08331;
      }
      &.jv-string {
        color: #42b983;
        word-break: break-word;
        white-space: normal;
      }
    }
    .jv-more {
      display: none;
    }
    .jv-code {
      .jv-toggle {
        &:before {
          padding: 0px 2px;
          border-radius: 2px;
        }
        &:hover {
          &:before {
            background: #eee;
          }
        }
      }
    }
  }
}
</style>