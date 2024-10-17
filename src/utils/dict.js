import useDictStore from '@/store/modules/dict'
import { getDicts } from '@/api/system/dict/data'
import { deduplicate } from '@/utils/ruoyi'
// 系统内置通用字典
const options = {
  SYS_BOOLEAN: [{ label: "是", value: true },
  { label: "否", value: false },]
}
/**
 * 获取字典数据
 */
export function useDict(...args) {

  const res = ref({});
  return (() => {
    args.forEach((dictType, index) => {
      res.value[dictType] = [];
      if (options[dictType]) {
        res.value[dictType] = options[dictType];
        useDictStore().setDict(dictType, res.value[dictType]);
      } else {
        const dicts = useDictStore().getDict(dictType);
        if (dicts) {
          res.value[dictType] = dicts;
        } else {
          getDicts(dictType).then(resp => {
            const arr = resp.data.filter(el => el.status == "0").map(p => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass, elTagClass: p.cssClass }));
            // 产品线材质优先级去重
            res.value[dictType] = deduplicate(arr, "label");
            useDictStore().setDict(dictType, res.value[dictType]);
          })
        }
      }
    })
    return toRefs(res.value);
  })()
}