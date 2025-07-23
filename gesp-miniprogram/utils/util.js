// utils/util.js

/**
 * 显示Toast提示
 * @param {string} title - 提示内容
 * @param {string} icon - 图标类型 ('success', 'error', 'loading', 'none')
 * @param {number} duration - 显示时长(ms)
 */
function showToast(title, icon = 'none', duration = 2000) {
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration
  });
}

/**
 * 显示加载提示
 * @param {string} title - 提示内容
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title: title,
    mask: true
  });
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @param {string} format - 格式字符串
 * @returns {string} - 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 格式化时间差
 * @param {number} seconds - 秒数
 * @returns {string} - 格式化后的时间字符串
 */
function formatDuration(seconds) {
  if (seconds < 60) {
    return `${seconds}秒`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}分${remainingSeconds}秒` : `${minutes}分钟`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}小时${minutes}分钟` : `${hours}小时`;
  }
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间(ms)
 * @returns {Function} - 防抖后的函数
 */
function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} delay - 延迟时间(ms)
 * @returns {Function} - 节流后的函数
 */
function throttle(func, delay = 300) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}

/**
 * 深拷贝对象
 * @param {any} obj - 要拷贝的对象
 * @returns {any} - 拷贝后的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * 生成随机字符串
 * @param {number} length - 字符串长度
 * @returns {string} - 随机字符串
 */
function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 检查是否为空值
 * @param {any} value - 要检查的值
 * @returns {boolean} - 是否为空
 */
function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string') {
    return value.trim() === '';
  }
  
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  return false;
}

/**
 * 存储数据到本地
 * @param {string} key - 存储键
 * @param {any} data - 要存储的数据
 */
function setStorage(key, data) {
  try {
    wx.setStorageSync(key, data);
  } catch (error) {
    console.error('存储数据失败:', error);
  }
}

/**
 * 从本地获取数据
 * @param {string} key - 存储键
 * @param {any} defaultValue - 默认值
 * @returns {any} - 获取的数据
 */
function getStorage(key, defaultValue = null) {
  try {
    return wx.getStorageSync(key) || defaultValue;
  } catch (error) {
    console.error('获取数据失败:', error);
    return defaultValue;
  }
}

/**
 * 删除本地存储数据
 * @param {string} key - 存储键
 */
function removeStorage(key) {
  try {
    wx.removeStorageSync(key);
  } catch (error) {
    console.error('删除数据失败:', error);
  }
}

module.exports = {
  showToast,
  showLoading,
  hideLoading,
  formatDate,
  formatDuration,
  debounce,
  throttle,
  deepClone,
  generateRandomString,
  isEmpty,
  setStorage,
  getStorage,
  removeStorage,
  navigateToQuestionDetail
};/**
 *
 导航到题目详情页
 * @param {string} id - 题目ID
 */
function navigateToQuestionDetail(id) {
  wx.navigateTo({
    url: `/pages/question-detail/question-detail?id=${id}`
  });
}