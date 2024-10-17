const useEnumStore = defineStore(
  'enum',
  {
    state: () => ({
      enum: new Array(),
      finishEnums: new Array(),
    }),
    actions: {
      setfinishEnums(_key) {
        if (!this.finishEnums.includes(_key)) {
          this.finishEnums.push(_key)
        }
      },
      // 获取枚举
      getEnum(_key) {
        if (_key == null && _key == "") {
          return null;
        }
        try {
          for (let i = 0; i < this.enum.length; i++) {
            if (this.enum[i].key == _key) {
              return this.enum[i].value;
            }
          }
        } catch (e) {
          return null;
        }
      },
      // 设置枚举
      setEnum(_key, value) {
        if (_key !== null && _key !== "") {
          this.enum.push({
            key: _key,
            value: value
          });
        }
      },
      // 删除枚举
      removeEnum(_key) {
        var bln = false;
        try {
          for (let i = 0; i < this.enum.length; i++) {
            if (this.enum[i].key == _key) {
              this.enum.splice(i, 1);
              return true;
            }
          }
        } catch (e) {
          bln = false;
        }
        return bln;
      },
      // 清空枚举
      cleanEnum() {
        this.enum = new Array();
        this.finishEnums = new Array();
      },
      // 初始枚举
      initEnum() {
      }
    }
  })

export default useEnumStore
