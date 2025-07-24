// app.js
App({
  onLaunch: function () {
    console.log('GESP刷题小程序启动');

    // 初始化本地数据
    this.initLocalData();

    // 获取用户信息
    this.getWxUserInfo();

    // 检查更新
    this.checkUpdate();
  },

  // 初始化本地数据
  initLocalData: function () {
    // 初始化本地存储的用户数据
    const userData = wx.getStorageSync('userData') || {
      favoriteQuestions: [],
      answerHistory: [],
      userStats: {
        totalAnswered: 0,
        correctAnswered: 0,
        accuracy: 0
      }
    };
    this.globalData.userData = userData;
  },

  // 获取微信用户信息
  getWxUserInfo: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });
  },

  // 检查小程序更新
  checkUpdate: function () {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('是否有新版本：', res.hasUpdate);
    });

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showToast({
        title: '更新失败，请检查网络',
        icon: 'none'
      });
    });
  },

  // 全局数据
  globalData: {
    userInfo: null,
    isLoggedIn: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    theme: {
      primaryColor: '#4169E1',
      secondaryColor: '#87CEFA',
      backgroundColor: '#F8F8F8',
      textColor: '#333333',
      lightTextColor: '#999999'
    }
  }
});