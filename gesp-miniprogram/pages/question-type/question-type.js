// pages/question-type/question-type.js
const problemManager = require('../../utils/problemManager.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    levelId: '',
    levelName: '',
    sessionId: '',
    sessionName: '',
    language: 'C++',
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
    const { levelId, levelName, sessionId, sessionName, language } = options;
    this.setData({
      levelId: levelId || '',
      levelName: decodeURIComponent(levelName || ''),
      sessionId: sessionId || '',
      sessionName: decodeURIComponent(sessionName || ''),
      language: language || 'C++'
    });
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: `${this.data.sessionName} - ${this.data.levelName}`
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
      title: `GESP ${this.data.levelName} 刷题`,
      path: `/pages/question-type/question-type?levelId=${this.data.levelId}&levelName=${encodeURIComponent(this.data.levelName)}`
    };
  },



  /**
   * 点击题型事件
   */
  onTypeTap: function (e) {
    const dataset = e.currentTarget.dataset;
    const typeId = dataset.id;
    const typeName = dataset.name;
    const { sessionId, language, levelId } = this.data;
    const level = parseInt(levelId);
    
    // 显示加载中提示
    wx.showLoading({
      title: '正在加载题目...',
    });
    
    // 检查该分类下是否有题目
    const questionCount = problemManager.getQuestionCountByType(sessionId, language, level, typeId);
    
    setTimeout(() => {
      wx.hideLoading();
      
      if (questionCount > 0) {
        // 有题目，直接跳转到刷题界面
        wx.navigateTo({
          url: `/pages/practice/practice?sessionId=${sessionId}&levelId=${levelId}&levelName=${encodeURIComponent(this.data.levelName)}&sessionName=${encodeURIComponent(this.data.sessionName)}&language=${language}&typeId=${typeId}&typeName=${encodeURIComponent(typeName)}`
        });
      } else {
        // 没有题目，弹窗提示
        wx.showModal({
          title: '提示',
          content: '题目录入中，请稍候',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#4169E1'
        });
      }
    }, 300);
  }
});