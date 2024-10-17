import useEnumStore from '@/store/modules/enum'
import { getEnums } from "@/api/common";

/**
 * 获取枚举数据
 */
export function useEnum(...args) {
  const res = ref({});
  return (() => {
    args.forEach((enumsName, index) => {
      res.value[enumsName] = [];
      const enums = useEnumStore().getEnum(enumsName);
      if (enums) {
        res.value[enumsName] = enums;
      } else {
        getEnums({ name: enumsName }).then(resp => {
          res.value[enumsName] = resp.data;
          useEnumStore().setEnum(enumsName, res.value[enumsName]);
        })
      }
    })
    return toRefs(res.value);
  })()
}