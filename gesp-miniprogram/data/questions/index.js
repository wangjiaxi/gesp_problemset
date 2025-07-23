// data/questions/index.js
// 题目索引文件 - 自动生成，请勿手动修改

const questionIndex = {
  level_1: {
    choice: [
      '2025_06_01.json'
    ],
    judge: []
  },
  level_2: {
    choice: [],
    judge: []
  },
  level_3: {
    choice: [],
    judge: []
  },
  level_4: {
    choice: [],
    judge: []
  },
  level_5: {
    choice: [],
    judge: []
  },
  level_6: {
    choice: [],
    judge: []
  },
  level_7: {
    choice: [],
    judge: []
  },
  level_8: {
    choice: [],
    judge: []
  }
};

/**
 * 获取指定分类的题目文件列表
 * @param {number} level - 等级
 * @param {string} type - 题目类型
 * @returns {Array} - 文件名列表
 */
function getQuestionFiles(level, type) {
  const levelKey = `level_${level}`;
  if (questionIndex[levelKey] && questionIndex[levelKey][type]) {
    return questionIndex[levelKey][type];
  }
  return [];
}

/**
 * 检查是否有题目
 * @param {number} level - 等级
 * @param {string} type - 题目类型
 * @returns {boolean} - 是否有题目
 */
function hasQuestions(level, type) {
  return getQuestionFiles(level, type).length > 0;
}

/**
 * 获取题目数据
 * @param {number} level - 等级
 * @param {string} type - 题目类型
 * @returns {Array} - 题目数据数组
 */
function getQuestions(level, type) {
  const files = getQuestionFiles(level, type);
  const questions = [];
  
  files.forEach(fileName => {
    try {
      const questionData = require(`./level_${level}/${type}/${fileName}`);
      questions.push(questionData);
    } catch (error) {
      console.error(`加载题目文件失败: ${fileName}`, error);
    }
  });
  
  return questions;
}

module.exports = {
  questionIndex,
  getQuestionFiles,
  hasQuestions,
  getQuestions
};