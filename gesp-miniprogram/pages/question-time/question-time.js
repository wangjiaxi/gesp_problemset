// pages/question-time/question-time.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    levelId: '',
    levelName: '',
    typeId: '',
    typeName: '',
    timeOptions: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { levelId, levelName, typeId, typeName } = options;
    this.setData({
      levelId: levelId || '',
      levelName: decodeURIComponent(levelName || ''),
      typeId: typeId || '',
      typeName: decodeURIComponent(typeName || '')
    });
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: `选择考试场次`
    });

    // 生成时间选项
    this.generateTimeOptions();
  },

  /**
   * 生成时间选项（2023年3月到2025年6月）
   */
  generateTimeOptions: function () {
    const dataManager = require('../../utils/dataManager.js');
    const timeOptions = [];
    const startYear = 2023;
    const startMonth = 3;
    const endYear = 2025;
    const endMonth = 6;

    for (let year = startYear; year <= endYear; year++) {
      let monthStart = (year === startYear) ? startMonth : 1;
      let monthEnd = (year === endYear) ? endMonth : 12;
      
      for (let month = monthStart; month <= monthEnd; month++) {
        // 只包含3月、6月、9月、12月（GESP考试月份）
        if ([3, 6, 9, 12].includes(month)) {
          // 获取实际题目数量
          const questions = dataManager.getQuestionsByLevelAndType(parseInt(this.data.levelId), this.data.typeId);
          const questionsForTime = questions.filter(q => q.year === year && q.month === month);
          const count = questionsForTime.length;
          
          // 只显示有题目的时间选项
          if (count > 0) {
            timeOptions.push({
              id: `${year}_${month.toString().padStart(2, '0')}`,
              year: year,
              month: month,
              displayText: `${year}年${month}月`,
              count: count
            });
          }
        }
      }
    }

    // 如果没有按时间分类的题目，显示所有题目作为一个选项
    if (timeOptions.length === 0) {
      const allQuestions = dataManager.getQuestionsByLevelAndType(parseInt(this.data.levelId), this.data.typeId);
      if (allQuestions.length > 0) {
        timeOptions.push({
          id: 'all',
          year: 0,
          month: 0,
          displayText: '全部题目',
          count: allQuestions.length
        });
      }
    }

    this.setData({
      timeOptions: timeOptions.reverse() // 最新的在前面
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `GESP ${this.data.levelName} ${this.data.typeName}`,
      path: `/pages/question-time/question-time?levelId=${this.data.levelId}&levelName=${encodeURIComponent(this.data.levelName)}&typeId=${this.data.typeId}&typeName=${encodeURIComponent(this.data.typeName)}`
    };
  },

  /**
   * 点击时间选项事件
   */
  onTimeTap: function (e) {
    const dataset = e.currentTarget.dataset;
    const timeId = dataset.id;
    const year = dataset.year;
    const month = dataset.month;
    
    // 跳转到刷题页面
    wx.navigateTo({
      url: `/pages/question-detail/question-detail?levelId=${this.data.levelId}&levelName=${encodeURIComponent(this.data.levelName)}&typeId=${this.data.typeId}&typeName=${encodeURIComponent(this.data.typeName)}&year=${year}&month=${month}`
    });
  }
});