// utils/dataManager.js - 本地数据管理工具
const questionsData = require('../questions_data.js');

class DataManager {
  constructor() {
    this.questions = questionsData.questions || [];
    this.banners = questionsData.banners || [];
    this.levels = questionsData.levels || this.getDefaultLevels();
  }

  // 获取默认等级配置
  getDefaultLevels() {
    return [
      { id: 1, name: '一级', color: '#FF6B6B', description: '基础编程概念' },
      { id: 2, name: '二级', color: '#4ECDC4', description: '简单算法与数据结构' },
      { id: 3, name: '三级', color: '#45B7D1', description: '程序设计基础' },
      { id: 4, name: '四级', color: '#96CEB4', description: '算法设计与分析' },
      { id: 5, name: '五级', color: '#FFEAA7', description: '高级数据结构' },
      { id: 6, name: '六级', color: '#DDA0DD', description: '复杂算法应用' },
      { id: 7, name: '七级', color: '#98D8C8', description: '系统设计思维' },
      { id: 8, name: '八级', color: '#F7DC6F', description: '综合项目实践' }
    ];
  }

  // 获取所有题目
  getAllQuestions() {
    return this.questions;
  }

  // 根据等级获取题目
  getQuestionsByLevel(level) {
    return this.questions.filter(q => q.level === level);
  }

  // 根据类型获取题目
  getQuestionsByType(type) {
    return this.questions.filter(q => q.type === type);
  }

  // 根据等级和类型获取题目
  getQuestionsByLevelAndType(level, type) {
    return this.questions.filter(q => q.level === level && q.type === type);
  }

  // 搜索题目
  searchQuestions(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return this.questions.filter(q => 
      q.question.toLowerCase().includes(lowerKeyword) ||
      q.explanation.toLowerCase().includes(lowerKeyword) ||
      (q.tags && q.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)))
    );
  }

  // 获取轮播图数据
  getBanners() {
    return this.banners;
  }

  // 获取等级配置
  getLevels() {
    return this.levels;
  }

  // 根据ID获取题目
  getQuestionById(id) {
    return this.questions.find(q => q.id === id);
  }

  // 获取随机题目
  getRandomQuestions(level, type, count = 10) {
    let targetQuestions = this.questions;
    
    if (level && level !== 'all') {
      targetQuestions = targetQuestions.filter(q => q.level === parseInt(level));
    }
    
    if (type && type !== 'all') {
      targetQuestions = targetQuestions.filter(q => q.type === type);
    }

    // 随机打乱并取指定数量
    const shuffled = targetQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // 保存用户答题记录
  saveAnswerRecord(questionId, userAnswer, isCorrect, timeSpent) {
    const app = getApp();
    const userData = app.globalData.userData;
    
    const record = {
      questionId,
      userAnswer,
      isCorrect,
      timeSpent,
      timestamp: new Date().getTime()
    };
    
    userData.answerHistory.push(record);
    userData.userStats.totalAnswered++;
    if (isCorrect) {
      userData.userStats.correctAnswered++;
    }
    userData.userStats.accuracy = (userData.userStats.correctAnswered / userData.userStats.totalAnswered * 100).toFixed(1);
    
    // 保存到本地存储
    wx.setStorageSync('userData', userData);
    app.globalData.userData = userData;
  }

  // 添加收藏题目
  addFavoriteQuestion(questionId) {
    const app = getApp();
    const userData = app.globalData.userData;
    
    if (!userData.favoriteQuestions.includes(questionId)) {
      userData.favoriteQuestions.push(questionId);
      wx.setStorageSync('userData', userData);
      app.globalData.userData = userData;
      return true;
    }
    return false;
  }

  // 移除收藏题目
  removeFavoriteQuestion(questionId) {
    const app = getApp();
    const userData = app.globalData.userData;
    
    const index = userData.favoriteQuestions.indexOf(questionId);
    if (index > -1) {
      userData.favoriteQuestions.splice(index, 1);
      wx.setStorageSync('userData', userData);
      app.globalData.userData = userData;
      return true;
    }
    return false;
  }

  // 获取收藏的题目
  getFavoriteQuestions() {
    const app = getApp();
    const favoriteIds = app.globalData.userData.favoriteQuestions;
    return this.questions.filter(q => favoriteIds.includes(q.id));
  }

  // 获取答题历史
  getAnswerHistory() {
    const app = getApp();
    return app.globalData.userData.answerHistory;
  }

  // 获取用户统计数据
  getUserStats() {
    const app = getApp();
    return app.globalData.userData.userStats;
  }
}

module.exports = new DataManager();