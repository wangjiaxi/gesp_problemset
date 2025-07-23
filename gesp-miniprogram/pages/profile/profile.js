// pages/profile/profile.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    favoriteCount: 0,
    historyCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      });
    }

    // 获取收藏和历史记录数量
    this.getFavoriteCount();
    this.getHistoryCount();
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
    // 每次显示页面时更新收藏和历史记录数量
    this.getFavoriteCount();
    this.getHistoryCount();
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
    // 刷新用户数据
    this.getFavoriteCount();
    this.getHistoryCount();
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
      title: 'GESP考试刷题小程序',
      path: '/pages/index/index'
    };
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
    }
  },

  /**
   * 登录成功回调
   */
  onLoginSuccess: function(e) {
    const { code, userInfo } = e.detail;
    
    // 保存用户信息到全局数据
    app.globalData.userInfo = userInfo;
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    });

    // 这里可以调用云函数保存用户信息到数据库
    this.saveUserToCloud(code, userInfo);
    
    wx.showToast({
      title: '登录成功',
      icon: 'success'
    });
  },

  /**
   * 保存用户信息到云端
   */
  saveUserToCloud: function(code, userInfo) {
    // 这里应该调用云函数保存用户信息
    // 目前只是模拟保存过程
    console.log('保存用户信息到云端:', { code, userInfo });
    
    // 模拟云函数调用
    // wx.cloud.callFunction({
    //   name: 'login',
    //   data: {
    //     code: code,
    //     userInfo: userInfo
    //   },
    //   success: res => {
    //     console.log('用户信息保存成功:', res);
    //   },
    //   fail: err => {
    //     console.error('用户信息保存失败:', err);
    //   }
    // });
  },

  /**
   * 获取收藏数量
   */
  getFavoriteCount: function () {
    // 这里可以调用云函数获取真实数据
    // 目前使用模拟数据
    this.setData({
      favoriteCount: 28
    });
  },

  /**
   * 获取历史记录数量
   */
  getHistoryCount: function () {
    // 这里可以调用云函数获取真实数据
    // 目前使用模拟数据
    this.setData({
      historyCount: 156
    });
  },

  /**
   * 跳转到收藏页面
   */
  navigateToFavorites: function () {
    if (!this.data.hasUserInfo) {
      util.showToast('请先登录');
      return;
    }
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    });
  },

  /**
   * 跳转到历史记录页面
   */
  navigateToHistory: function () {
    if (!this.data.hasUserInfo) {
      util.showToast('请先登录');
      return;
    }
    wx.navigateTo({
      url: '/pages/history/history'
    });
  }
});