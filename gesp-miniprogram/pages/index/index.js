// pages/index/index.js
const app = getApp();
const util = require('../../utils/util.js');
const bannersData = require('../../data/banners.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    levels: [
      {
        id: 'level_1',
        name: '一级',
        color: '#FF6B6B',
        description: 'GESP一级认证'
      },
      {
        id: 'level_2',
        name: '二级',
        color: '#4ECDC4',
        description: 'GESP二级认证'
      },
      {
        id: 'level_3',
        name: '三级',
        color: '#45B7D1',
        description: 'GESP三级认证'
      },
      {
        id: 'level_4',
        name: '四级',
        color: '#96CEB4',
        description: 'GESP四级认证'
      },
      {
        id: 'level_5',
        name: '五级',
        color: '#FFEAA7',
        description: 'GESP五级认证'
      },
      {
        id: 'level_6',
        name: '六级',
        color: '#DDA0DD',
        description: 'GESP六级认证'
      },
      {
        id: 'level_7',
        name: '七级',
        color: '#74B9FF',
        description: 'GESP七级认证'
      },
      {
        id: 'level_8',
        name: '八级',
        color: '#FD79A8',
        description: 'GESP八级认证'
      }
    ],
    banners: [
      {
        id: 1,
        image: '../../images/banner-java.png',
        url: '/pages/question-detail/question-detail?id=1001'
      }
    ],
    searchValue: '',
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('页面加载开始');
    // 获取题库分类数据
    this.getCategories();
    console.log('数据加载完成', this.data);
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
    // 刷新题库分类数据
    this.getCategories();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 加载更多题库分类（如果有分页）
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'GESP考试刷题小程序',
      path: '/pages/index/index'
    };
  },

  /**
   * 获取等级数据
   */
  getCategories: function () {
    // 从轮播图数据文件获取数据
    const banners = bannersData.getBanners();
    const config = bannersData.getConfig();
    
    // 等级数据
    const levels = [
      { id: 'level_1', name: '一级', color: '#FF6B6B', description: 'GESP一级认证' },
      { id: 'level_2', name: '二级', color: '#4ECDC4', description: 'GESP二级认证' },
      { id: 'level_3', name: '三级', color: '#45B7D1', description: 'GESP三级认证' },
      { id: 'level_4', name: '四级', color: '#96CEB4', description: 'GESP四级认证' },
      { id: 'level_5', name: '五级', color: '#FFEAA7', description: 'GESP五级认证' },
      { id: 'level_6', name: '六级', color: '#DDA0DD', description: 'GESP六级认证' },
      { id: 'level_7', name: '七级', color: '#74B9FF', description: 'GESP七级认证' },
      { id: 'level_8', name: '八级', color: '#FD79A8', description: 'GESP八级认证' }
    ];
    
    this.setData({
      loading: false,
      levels: levels,
      banners: banners,
      carouselInterval: config.interval,
      carouselDuration: config.duration,
      carouselCircular: config.circular,
      carouselIndicatorDots: config.indicatorDots,
      carouselIndicatorColor: config.indicatorColor,
      carouselIndicatorActiveColor: config.indicatorActiveColor
    });
  },

  /**
   * 搜索框点击事件
   */
  onSearchTap: function() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  /**
   * 搜索框输入事件
   */
  onSearchInput: function (e) {
    // 直接跳转到搜索页面
    this.onSearchTap();
  },

  /**
   * 搜索框确认事件
   */
  onSearchConfirm: function (e) {
    // 直接跳转到搜索页面
    this.onSearchTap();
  },

  /**
   * 点击等级事件
   */
  onLevelTap: function (e) {
    const dataset = e.currentTarget.dataset;
    const levelId = dataset.id;
    const levelName = dataset.name;
    
    // 跳转到考试场次选择页面
    wx.navigateTo({
      url: `/pages/exam-sessions/exam-sessions?levelId=${levelId}&levelName=${encodeURIComponent(levelName)}`
    });
  },

  /**
   * 点击轮播图事件
   */
  onBannerTap: function (e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({
        url
      });
    }
  }
});