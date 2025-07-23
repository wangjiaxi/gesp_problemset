// pages/question-type/question-type.js
const app = getApp();
const util = require('../../utils/util.js');
const questionUtils = require('../../utils/questionUtils.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    levelId: '',
    levelName: '',
    questionTypes: [
      {
        id: 'choice',
        name: '选择题',
        description: '单选题，从多个选项中选择正确答案',
        icon: '📝',
        color: '#4169E1'
      },
      {
        id: 'judge',
        name: '判断题',
        description: '判断题，判断题目描述是否正确',
        icon: '✓',
        color: '#52C41A'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { levelId, levelName } = options;
    this.setData({
      levelId: levelId || '',
      levelName: decodeURIComponent(levelName || '')
    });
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: this.data.levelName
    });

    // 更新题型数据，添加题目数量
    this.updateQuestionTypesWithCount();
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
      title: `GESP ${this.data.levelName} 刷题`,
      path: `/pages/question-type/question-type?levelId=${this.data.levelId}&levelName=${encodeURIComponent(this.data.levelName)}`
    };
  },

  /**
   * 更新题型数据，添加题目数量
   */
  updateQuestionTypesWithCount: function() {
    const level = parseInt(this.data.levelId);
    const updatedTypes = this.data.questionTypes.map(type => {
      const questions = questionUtils.getMockQuestions(level, type.id);
      return {
        ...type,
        questionCount: questions.length,
        hasQuestions: questions.length > 0
      };
    });

    this.setData({
      questionTypes: updatedTypes
    });
  },

  /**
   * 点击题型事件
   */
  onTypeTap: function (e) {
    const dataset = e.currentTarget.dataset;
    const typeId = dataset.id;
    const typeName = dataset.name;
    const level = parseInt(this.data.levelId);
    
    // 检查该分类下是否有题目
    const questions = questionUtils.getMockQuestions(level, typeId);
    
    if (questions.length > 0) {
      // 有题目，跳转到时间选择页面
      wx.navigateTo({
        url: `/pages/question-time/question-time?levelId=${this.data.levelId}&levelName=${encodeURIComponent(this.data.levelName)}&typeId=${typeId}&typeName=${encodeURIComponent(typeName)}`
      });
    } else {
      // 没有题目，跳转到敬请期待页面
      wx.navigateTo({
        url: `/pages/coming-soon/coming-soon?level=${level}&type=${typeId}`
      });
    }
  }
});