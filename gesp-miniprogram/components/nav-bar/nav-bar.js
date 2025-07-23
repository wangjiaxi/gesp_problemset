// components/nav-bar/nav-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      type: String,
      value: 'index'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabs: [
      {
        key: 'index',
        text: '题库',
        icon: '../../images/icon-question-bank.png',
        iconActive: '../../images/icon-question-bank-active.png',
        url: '/pages/index/index'
      },
      {
        key: 'profile',
        text: '我的',
        icon: '../../images/icon-profile.png',
        iconActive: '../../images/icon-profile-active.png',
        url: '/pages/profile/profile'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 切换标签页
     */
    switchTab: function(e) {
      const key = e.currentTarget.dataset.key;
      const url = e.currentTarget.dataset.url;
      
      if (key === this.data.active) {
        return;
      }
      
      // 由于移除了原生tabBar，使用redirectTo而不是switchTab
      wx.redirectTo({
        url: url
      });
    }
  }
});