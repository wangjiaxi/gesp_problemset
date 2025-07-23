// pages/question-review/question-review.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    questionNumber: 1,
    levelName: '',
    typeName: '',
    year: '',
    month: '',
    question: null,
    userAnswer: null,
    correctAnswer: null,
    loading: true,
    isFavorited: false // 当前题目是否已收藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { questionNumber, levelName, typeName, year, month } = options;
    this.setData({
      questionNumber: parseInt(questionNumber) || 1,
      levelName: decodeURIComponent(levelName || ''),
      typeName: decodeURIComponent(typeName || ''),
      year: parseInt(year) || 2024,
      month: parseInt(month) || 12
    });
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: `第${this.data.questionNumber}题详情`
    });
    
    // 加载题目详情
    this.loadQuestionDetail();
  },

  /**
   * 加载题目详情
   */
  loadQuestionDetail: function() {
    // 模拟加载题目详情
    const mockQuestion = {
      id: `${this.data.year}_${this.data.month}_${this.data.questionNumber}`,
      question: `这是第${this.data.questionNumber}题的题目内容：以下代码的输出结果是什么？`,
      code: this.data.questionNumber % 2 === 0 ? "def calculate(x, y):\n    result = x * 2 + y\n    return result\n\nprint(calculate(3, 4))" : null,
      type: this.data.typeName === '选择题' ? 'choice' : 'judge',
      options: this.data.typeName === '选择题' ? [
        {key: "A", value: "选项A"},
        {key: "B", value: "选项B"},
        {key: "C", value: "选项C"},
        {key: "D", value: "选项D"}
      ] : null,
      answer: this.data.typeName === '选择题' ? "B" : true,
      explanation: `第${this.data.questionNumber}题的详细解析：这道题考查的是...`,
      userAnswer: this.data.typeName === '选择题' ? "A" : false // 模拟用户的错误答案
    };
    
    this.setData({
      question: mockQuestion,
      userAnswer: mockQuestion.userAnswer,
      correctAnswer: mockQuestion.answer,
      loading: false
    });
    
    // 检查收藏状态
    this.checkFavoriteStatus();
  },

  /**
   * 检查当前题目的收藏状态
   */
  checkFavoriteStatus: function() {
    if (!this.data.question) return;
    
    // 从本地存储获取收藏列表
    const favoriteList = wx.getStorageSync('favoriteQuestions') || [];
    const questionId = this.data.question.id;
    const isFavorited = favoriteList.includes(questionId);
    
    this.setData({
      isFavorited: isFavorited
    });
  },

  /**
   * 切换收藏状态
   */
  toggleFavorite: function() {
    if (!this.data.question) return;
    
    const questionId = this.data.question.id;
    let favoriteList = wx.getStorageSync('favoriteQuestions') || [];
    let isFavorited = this.data.isFavorited;
    
    if (isFavorited) {
      // 取消收藏
      favoriteList = favoriteList.filter(id => id !== questionId);
      wx.showToast({
        title: '取消收藏',
        icon: 'success'
      });
    } else {
      // 添加收藏
      favoriteList.push(questionId);
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      });
    }
    
    // 保存到本地存储
    wx.setStorageSync('favoriteQuestions', favoriteList);
    
    // 更新状态
    this.setData({
      isFavorited: !isFavorited
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.loadQuestionDetail();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: `GESP ${this.data.levelName} ${this.data.typeName} 第${this.data.questionNumber}题`,
      path: `/pages/question-review/question-review?questionNumber=${this.data.questionNumber}&levelName=${encodeURIComponent(this.data.levelName)}&typeName=${encodeURIComponent(this.data.typeName)}&year=${this.data.year}&month=${this.data.month}`
    };
  }
});