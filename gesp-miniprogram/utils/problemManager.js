// utils/problemManager.js - 题目管理工具
class ProblemManager {
  constructor() {
    this.problemCache = new Map(); // 缓存已加载的题目文件
  }

  // 根据年份、月份、语言、等级获取题目文件
  getProblemFile(year, month, language, level) {
    const fileKey = `${year}${month.toString().padStart(2, '0')}${language.charAt(0)}${level}`;
    console.log(`尝试加载题目文件: ${fileKey}.json`);
    
    // 如果已缓存，直接返回
    if (this.problemCache.has(fileKey)) {
      console.log(`从缓存获取题目文件: ${fileKey}`);
      return this.problemCache.get(fileKey);
    }

    try {
      // 直接require JSON文件
      const problemData = require(`../data/problems/${fileKey}.json`);
      console.log(`成功加载题目文件: ${fileKey}.json, 题目数量: ${problemData.questions ? problemData.questions.length : 0}`);
      this.problemCache.set(fileKey, problemData);
      return problemData;
    } catch (error) {
      console.log(`题目文件 ${fileKey}.json 不存在:`, error);
      return null;
    }
  }

  // 根据sessionId、语言、等级、题型获取题目
  getQuestionsBySessionAndType(sessionId, language, level, type) {
    const year = parseInt(sessionId.substring(0, 4));
    const month = parseInt(sessionId.substring(4, 6));
    
    const problemData = this.getProblemFile(year, month, language, level);
    if (!problemData || !problemData.questions) {
      return [];
    }

    // 根据题型筛选
    return problemData.questions.filter(q => q.type === type);
  }

  // 获取题目数量统计
  getQuestionCountByType(sessionId, language, level, type) {
    const questions = this.getQuestionsBySessionAndType(sessionId, language, level, type);
    console.log(`getQuestionCountByType - sessionId: ${sessionId}, language: ${language}, level: ${level}, type: ${type}, count: ${questions.length}`);
    return questions.length;
  }

  // 获取所有题型的题目数量
  getAllTypesCounts(sessionId, language, level) {
    const year = parseInt(sessionId.substring(0, 4));
    const month = parseInt(sessionId.substring(4, 6));
    
    const problemData = this.getProblemFile(year, month, language, level);
    if (!problemData || !problemData.questions) {
      return {
        choice: 0,
        judge: 0,
        total: 0
      };
    }

    const questions = problemData.questions;
    const choiceCount = questions.filter(q => q.type === 'choice').length;
    const judgeCount = questions.filter(q => q.type === 'judge').length;

    return {
      choice: choiceCount,
      judge: judgeCount,
      total: questions.length
    };
  }

  // 根据ID获取单个题目
  getQuestionById(sessionId, language, level, questionId) {
    const year = parseInt(sessionId.substring(0, 4));
    const month = parseInt(sessionId.substring(4, 6));
    
    const problemData = this.getProblemFile(year, month, language, level);
    if (!problemData || !problemData.questions) {
      return null;
    }

    return problemData.questions.find(q => q.id === questionId);
  }

  // 获取考试信息
  getExamInfo(sessionId, language, level) {
    const year = parseInt(sessionId.substring(0, 4));
    const month = parseInt(sessionId.substring(4, 6));
    
    const problemData = this.getProblemFile(year, month, language, level);
    return problemData ? problemData.examInfo : null;
  }

  // 获取随机题目
  getRandomQuestions(sessionId, language, level, type, count = 10) {
    const questions = this.getQuestionsBySessionAndType(sessionId, language, level, type);
    
    if (questions.length === 0) {
      return [];
    }

    // 随机打乱并取指定数量
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
  }
}

module.exports = new ProblemManager();