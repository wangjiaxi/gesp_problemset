// components/user-info/user-info.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object,
      value: null
    },
    hasUserInfo: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    localUserInfo: null,
    hasLocalUserInfo: false
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached: function() {
      this.loadLocalUserInfo();
    }
  },

  /**
   * 组件所在页面的生命周期
   */
  pageLifetimes: {
    show: function() {
      this.loadLocalUserInfo();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取用户信息
     */
    getUserInfo: function(e) {
      if (e.detail.userInfo) {
        // 触发父组件的事件
        this.triggerEvent('getuserinfo', {
          userInfo: e.detail.userInfo
        });
      }
    },

    /**
     * 微信登录
     */
    wxLogin: function() {
      const that = this;
      
      // 检查登录状态
      wx.checkSession({
        success: function() {
          // session_key 未过期，并且在本生命周期一直有效
          console.log('session有效');
        },
        fail: function() {
          // session_key 已经失效，需要重新执行登录流程
          that.doLogin();
        }
      });
    },

    /**
     * 执行登录流程
     */
    doLogin: function() {
      const that = this;
      
      wx.login({
        success: function(res) {
          if (res.code) {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            console.log('登录成功，code:', res.code);
            
            // 获取用户信息
            wx.getUserProfile({
              desc: '用于完善用户资料',
              success: function(userRes) {
                console.log('获取用户信息成功:', userRes);
                
                // 触发父组件的登录成功事件
                that.triggerEvent('loginSuccess', {
                  code: res.code,
                  userInfo: userRes.userInfo
                });
              },
              fail: function(err) {
                console.error('获取用户信息失败:', err);
                wx.showToast({
                  title: '获取用户信息失败',
                  icon: 'none'
                });
              }
            });
          } else {
            console.error('登录失败:', res.errMsg);
            wx.showToast({
              title: '登录失败',
              icon: 'none'
            });
          }
        },
        fail: function(err) {
          console.error('wx.login调用失败:', err);
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      });
    },

    /**
     * 加载本地用户信息
     */
    loadLocalUserInfo: function() {
      const util = require('../../utils/util.js');
      const localUserInfo = util.getStorage('localUserInfo', null);
      
      if (localUserInfo && localUserInfo.nickName && localUserInfo.avatarUrl) {
        this.setData({
          localUserInfo: localUserInfo,
          hasLocalUserInfo: true
        });
      } else {
        this.setData({
          localUserInfo: null,
          hasLocalUserInfo: false
        });
      }
    },

    /**
     * 跳转到编辑资料页面
     */
    goToEditProfile: function() {
      wx.navigateTo({
        url: '/pages/profile-edit/profile-edit'
      });
    }
  }
});