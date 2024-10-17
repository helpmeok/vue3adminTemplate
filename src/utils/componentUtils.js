import useDictStore from '@/store/modules/dict'
import useEnumStore from '@/store/modules/enum'
import { useDict } from '@/utils/dict'
import { useEnum } from '@/utils/enum'
import { setDictValNum } from '@/utils/ruoyi'
export function setDataOptions(item) {
  let res;
  if (item.dictType) {
    const dictType = item.dictType;
    if (!useDictStore().finishDicts.includes(dictType)) {
      const options = useDict(dictType)[dictType];
      const isSetDictValNum = item.isSetDictValNum;
      useDictStore().setfinishDicts(dictType);
      res = isSetDictValNum ? setDictValNum(options.value) : options.value;
    } else {
      res = useDictStore().getDict(dictType);
    }
  } else if (item.enumsName) {
    const enumsName = item.enumsName;
    if (!useEnumStore().finishEnums.includes(enumsName)) {
      const options = useEnum(enumsName)[enumsName];
      useEnumStore().setfinishEnums(enumsName);
      res = options.value;
    } else {
      res = useEnumStore().getEnum(enumsName);
    }
  } else {
    res = item?.options;
  }
  return res;
}