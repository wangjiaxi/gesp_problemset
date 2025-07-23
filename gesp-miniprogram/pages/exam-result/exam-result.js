// pages/exam-result/exam-result.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    maxScore: 0,
    wrongCount: 0,
    totalCount: 0,
    levelName: '',
    typeName: '',
    year: '',
    month: '',
    wrongQuestions: [],
    answerDetails: [], // 答题详情
    passScore: 0, // 及格分数
    isPassed: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { score, maxScore, wrongCount, totalCount, levelName, typeName, year, month } = options;
    const scoreNum = parseInt(score) || 0;
    const maxScoreNum = parseInt(maxScore) || 0;
    const passScore = Math.ceil(maxScoreNum * 0.6); // 60%及格
    
    this.setData({
      score: scoreNum,
      maxScore: maxScoreNum,
      wrongCount: parseInt(wrongCount) || 0,
      totalCount: parseInt(totalCount) || 0,
      levelName: decodeURIComponent(levelName || ''),
      typeName: decodeURIComponent(typeName || ''),
      year: parseInt(year) || 2024,
      month: parseInt(month) || 12,
      passScore: passScore,
      isPassed: scoreNum >= passScore
    });
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: '考试结果'
    });
    
    // 生成答题详情
    this.generateAnswerDetails();
  },

  /**
   * 生成答题详情
   */
  generateAnswerDetails: function() {
    const answerDetails = [];
    const correctCount = this.data.totalCount - this.data.wrongCount;
    
    // 生成15题的答题情况（模拟数据）
    for (let i = 1; i <= this.data.totalCount; i++) {
      // 简单模拟：前correctCount题正确，后面的错误
      const isCorrect = i <= correctCount;
      answerDetails.push({
        questionNumber: i,
        isCorrect: isCorrect
      });
    }
    
    // 随机打乱顺序，让正确和错误的题目分布更真实
    for (let i = answerDetails.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answerDetails[i], answerDetails[j]] = [answerDetails[j], answerDetails[i]];
    }
    
    // 重新按题号排序
    answerDetails.sort((a, b) => a.questionNumber - b.questionNumber);
    
    this.setData({
      answerDetails: answerDetails
    });
  },

  /**
   * 查看题目详情
   */
  viewQuestionDetail: function(e) {
    const questionNumber = e.currentTarget.dataset.number;
    wx.navigateTo({
      url: `/pages/question-review/question-review?questionNumber=${questionNumber}&levelName=${encodeURIComponent(this.data.levelName)}&typeName=${encodeURIComponent(this.data.typeName)}&year=${this.data.year}&month=${this.data.month}`
    });
  },

  /**
   * 重新考试
   */
  retakeExam: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 返回首页
   */
  goHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
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
      title: `我在GESP ${this.data.levelName} ${this.data.typeName}中得了${this.data.score}分！`,
      path: '/pages/index/index'
    };
  }
});