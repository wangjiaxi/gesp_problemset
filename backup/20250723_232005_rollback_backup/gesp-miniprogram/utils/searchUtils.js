// utils/searchUtils.js

/**
 * 搜索工具函数
 */

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间(ms)
 * @returns {Function} - 防抖后的函数
 */
function debounce(func, delay = 200) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * 高亮搜索关键词
 * @param {string} text - 原文本
 * @param {string} keyword - 搜索关键词
 * @returns {string} - 高亮后的文本
 */
function highlightKeyword(text, keyword) {
  if (!keyword || !text) {
    return text;
  }
  
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

/**
 * 搜索题目
 * @param {Array} questions - 题目数组
 * @param {string} keyword - 搜索关键词
 * @returns {Array} - 搜索结果
 */
function searchQuestions(questions, keyword) {
  if (!keyword || keyword.trim().length === 0) {
    return [];
  }

  const searchTerm = keyword.toLowerCase().trim();
  
  return questions.filter(question => {
    // 搜索题目内容
    const questionText = question.question.toLowerCase();
    if (questionText.includes(searchTerm)) {
      return true;
    }

    // 搜索代码内容
    if (question.code && question.code.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // 搜索解析内容
    if (question.explanation && question.explanation.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // 搜索标签
    if (question.tags && question.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm)
    )) {
      return true;
    }

    // 搜索选项内容（仅选择题）
    if (question.options && question.options.some(option => 
      option.value.toLowerCase().includes(searchTerm)
    )) {
      return true;
    }

    return false;
  });
}

/**
 * 按相关性排序搜索结果
 * @param {Array} results - 搜索结果
 * @param {string} keyword - 搜索关键词
 * @returns {Array} - 排序后的结果
 */
function sortByRelevance(results, keyword) {
  if (!keyword || results.length === 0) {
    return results;
  }

  const searchTerm = keyword.toLowerCase();

  return results.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // 题目标题匹配得分更高
    if (a.question.toLowerCase().includes(searchTerm)) {
      scoreA += 10;
    }
    if (b.question.toLowerCase().includes(searchTerm)) {
      scoreB += 10;
    }

    // 标签匹配得分
    if (a.tags && a.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
      scoreA += 5;
    }
    if (b.tags && b.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
      scoreB += 5;
    }

    // 代码匹配得分
    if (a.code && a.code.toLowerCase().includes(searchTerm)) {
      scoreA += 3;
    }
    if (b.code && b.code.toLowerCase().includes(searchTerm)) {
      scoreB += 3;
    }

    // 解析匹配得分
    if (a.explanation && a.explanation.toLowerCase().includes(searchTerm)) {
      scoreA += 2;
    }
    if (b.explanation && b.explanation.toLowerCase().includes(searchTerm)) {
      scoreB += 2;
    }

    // 难度低的题目排前面（相同得分情况下）
    if (scoreA === scoreB) {
      return a.difficulty - b.difficulty;
    }

    return scoreB - scoreA;
  });
}

/**
 * 获取搜索建议
 * @param {string} keyword - 搜索关键词
 * @param {Array} allKeywords - 所有可能的关键词
 * @returns {Array} - 搜索建议
 */
function getSearchSuggestions(keyword, allKeywords) {
  if (!keyword || keyword.length < 2) {
    return [];
  }

  const searchTerm = keyword.toLowerCase();
  
  return allKeywords
    .filter(item => item.toLowerCase().includes(searchTerm))
    .slice(0, 5); // 最多返回5个建议
}

/**
 * 格式化搜索历史
 * @param {Array} history - 搜索历史
 * @param {string} newKeyword - 新的搜索关键词
 * @param {number} maxLength - 最大历史记录数量
 * @returns {Array} - 格式化后的历史记录
 */
function formatSearchHistory(history, newKeyword, maxLength = 10) {
  if (!newKeyword || newKeyword.trim().length === 0) {
    return history;
  }

  const keyword = newKeyword.trim();
  let newHistory = [...history];

  // 移除重复项
  newHistory = newHistory.filter(item => item !== keyword);

  // 添加到开头
  newHistory.unshift(keyword);

  // 限制数量
  if (newHistory.length > maxLength) {
    newHistory = newHistory.slice(0, maxLength);
  }

  return newHistory;
}

/**
 * 获取热门搜索关键词
 * @returns {Array} - 热门搜索关键词
 */
function getHotSearchKeywords() {
  return [
    'Python', '变量', '函数', '列表', '字典', 
    '循环', '条件语句', '数据类型', '算法', '递归',
    '面向对象', '类', '继承', '多态', '异常处理',
    '文件操作', '正则表达式', '模块', '包', '装饰器'
  ];
}

/**
 * 统计搜索结果
 * @param {Array} results - 搜索结果
 * @returns {Object} - 统计信息
 */
function getSearchStats(results) {
  const stats = {
    total: results.length,
    byLevel: {},
    byType: {},
    byDifficulty: {}
  };

  results.forEach(item => {
    // 按等级统计
    const level = `Level ${item.level}`;
    stats.byLevel[level] = (stats.byLevel[level] || 0) + 1;

    // 按类型统计
    const type = item.type === 'choice' ? '选择题' : '判断题';
    stats.byType[type] = (stats.byType[type] || 0) + 1;

    // 按难度统计
    const difficulty = `${item.difficulty}星`;
    stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1;
  });

  return stats;
}

/**
 * 验证搜索关键词
 * @param {string} keyword - 搜索关键词
 * @returns {Object} - 验证结果
 */
function validateSearchKeyword(keyword) {
  const result = {
    isValid: true,
    message: '',
    suggestion: ''
  };

  if (!keyword || keyword.trim().length === 0) {
    result.isValid = false;
    result.message = '请输入搜索关键词';
    return result;
  }

  if (keyword.trim().length < 2) {
    result.isValid = false;
    result.message = '搜索关键词至少需要2个字符';
    return result;
  }

  if (keyword.length > 50) {
    result.isValid = false;
    result.message = '搜索关键词不能超过50个字符';
    return result;
  }

  // 检查是否包含特殊字符
  const specialChars = /[<>'"&]/;
  if (specialChars.test(keyword)) {
    result.isValid = false;
    result.message = '搜索关键词不能包含特殊字符';
    return result;
  }

  return result;
}

module.exports = {
  debounce,
  highlightKeyword,
  searchQuestions,
  sortByRelevance,
  getSearchSuggestions,
  formatSearchHistory,
  getHotSearchKeywords,
  getSearchStats,
  validateSearchKeyword
};