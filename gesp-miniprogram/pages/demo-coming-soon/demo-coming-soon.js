// pages/demo-coming-soon/demo-coming-soon.js
const questionUtils = require('../../utils/questionUtils.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    testCategories: [
      { level: 1, type: 'choice', name: 'Level 1 选择题' },
      { level: 1, type: 'judge', name: 'Level 1 判断题' },
      { level: 2, type: 'choice', name: 'Level 2 选择题' },
      { level: 2, type: 'judge', name: 'Level 2 判断题' },
      { level: 3, type: 'choice', name: 'Level 3 选择题' },
      { level: 3, type: 'judge', name: 'Level 3 判断题' },
      { level: 4, type: 'choice', name: 'Level 4 选择题' },
      { level: 5, type: 'judge', name: 'Level 5 判断题' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 测试分类点击
   */
  onCategoryTap: function(e) {
    const { level, type } = e.currentTarget.dataset;
    
    // 使用工具函数导航
    questionUtils.navigateToQuestions(level, type, this);
  },

  /**
   * 直接跳转到敬请期待页面
   */
  goToComingSoon: function() {
    wx.navigateTo({
      url: '/pages/coming-soon/coming-soon?level=5&type=coding'
    });
  }
});