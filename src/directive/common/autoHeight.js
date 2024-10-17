/**
 * fixTableHeight
 * 动态根据页面高度设置table的高度
 */
export default {
  // mounted为指令钩子函数，el 是指令绑定的DOM元素，binding 包含了绑定的值和表达式
  mounted(el, binding) {
    if (!binding?.value.isAutoHeight) {
      return
    }
    // 定义windowChange函数用于处理窗口大小变化时的逻辑
    el.windowChange = () => {
      // 以下使用过渡动画，但是页面刷新的时候动画不生效
      // // 获取绑定值，如果绑定值不存在，则默认为0，用于指定底部高度的偏移量
      let bottomHeight = binding?.value.bottomHeight || 0;
      // 以防止多个事件处理程序同时运行
      el.timer && clearTimeout(el.timer);
      // 300毫秒后执行元素高度的调整
      el.timer = setTimeout(() => {
        el.style.transition = 'height 0.3s';
        // window.innerHeight 获取视口的高度
        // el.getBoundingClientRect().top 获取元素顶部到视口顶部的距离
        el.style.height = `${window.innerHeight - el.getBoundingClientRect().top - bottomHeight
          }px`;
        // 用于在过渡效果完成后移除过渡样式
        setTimeout(() => {
          el.style.transition = '';
        }, 334);
      }, 300);
    };
    el.windowChange(); // 初始化元素的高度
    window.addEventListener('resize', el.windowChange); //在窗口resize调用函数
  },
  // 指令绑定的元素从DOM中移除之前被调用
  beforeUnmount(el) {
    window.removeEventListener('resize', el.windowChange);
    clearTimeout(el.timer);
    delete el.timer;
    delete el.windowChange;
  },
};
