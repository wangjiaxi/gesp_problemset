// pages/coming-soon/coming-soon.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    level: '',
    type: '',
    categoryName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { level, type } = options;
    
    // 设置页面数据
    this.setData({
      level: level || '',
      type: type || '',
      categoryName: this.getCategoryName(level, type)
    });

    // 动态设置导航栏标题
    if (this.data.categoryName) {
      wx.setNavigationBarTitle({
        title: this.data.categoryName
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: 'GESP考试刷题小程序',
      path: '/pages/index/index'
    };
  },

  /**
   * 获取分类名称
   */
  getCategoryName: function(level, type) {
    let categoryName = '';
    
    if (level) {
      categoryName += `Level ${level}`;
    }
    
    if (type) {
      const typeMap = {
        'choice': '选择题',
        'judge': '判断题',
        'coding': '编程题'
      };
      categoryName += ` ${typeMap[type] || type}`;
    }
    
    return categoryName || '题目分类';
  },

  /**
   * 回到首页
   */
  goToHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});