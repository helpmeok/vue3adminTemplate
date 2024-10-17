<template>
  <div class="ml10">
    <div v-for="(item,index) in data" :key="index">
      <div class="mt10" v-if="item?.children !== undefined">
        <el-select v-model="item.rule" class="mr10" style="width:150px;">
          <el-option v-for="item in OPERAT_RULE" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <span>创建子条件：</span>
        <el-button type="primary" icon="Plus" @click="addCondition(item,index)">新增条件</el-button>
        <el-button type="warning" icon="Plus" @click="addSubCondition(item,index)">新增子条件</el-button>
        <el-button type="danger" icon="Delete" @click="delCondition(item,index)">删除子条件</el-button>
      </div>
      <div class="flex mt10 ml5" v-if="item?.children === undefined">
        <!-- <el-select v-model="item.name" class="mr10" style="width:150px;">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
        <el-input v-model="item.left" class="mr10" style="width:50px;"></el-input>
        <el-input v-model="item.name" class="mr10" style="width:150px;"></el-input>
        <el-select v-model="item.operator" class="mr10" style="width:150px;">
          <el-option v-for="item in OPERAT_SYMBOL" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input v-model="item.value" class="mr10" style="width:150px;"></el-input>
        <el-input v-model="item.right" class="mr10" style="width:50px;"></el-input>
        <el-select v-model="item.rule" v-if="(index+1)<data.length" class="mr10" style="width:150px;">
          <el-option v-for="item in OPERAT_RULE" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="danger" icon="Delete" @click="delCondition(item,index)">删除</el-button>
      </div>
      <conditionTree v-if="item?.children?.length" :data="item?.children"></conditionTree>
    </div>
  </div>
</template>

<script  setup name="conditionTree">
// 接收父组件传递的数据，递归时传递 children
import { getUuid } from "@/utils/ruoyi.js";
const { proxy } = getCurrentInstance();
const conditionItem = () => ({
  id: getUuid(),
  name: "",
  operator: "",
  value: "",
  rule: "",
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
      rule: "",
    },
  ],
});
const props = defineProps({
  data: {
    type: Array,
    defalut: () => [],
  },
  childrenKey: {
    type: String,
    defalut: () => "children",
  },
});
const { OPERAT_SYMBOL, OPERAT_RULE } = inject("useDict")(
  "OPERAT_SYMBOL",
  "OPERAT_RULE"
);

const addCondition = (item, index) => {
  item.children.push(JSON.parse(JSON.stringify(conditionItem())));
};
const addSubCondition = (item, index) => {
  item.children.push(JSON.parse(JSON.stringify(conditionSubItem())));
};
const delCondition = (item, index) => {
  props.data.splice(
    props.data.findIndex((el) => el.id === item.id),
    1
  );
};
</script>
