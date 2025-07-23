// pages/profile-edit/profile-edit.js
const util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: ''
    },
    defaultAvatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiNGNUY1RjUiLz4KPHN2ZyB4PSIyNSIgeT0iMjAiIHdpZHRoPSI1MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjQ0NDQ0NDIj4KPHA+dGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0QzE0IDUuMSAxMy4xIDYgMTIgNkMxMC45IDYgMTAgNS4xIDEwIDRDMTAgMi45IDEwLjkgMiAxMiAyWk0yMSAxOVYyMEgzVjE5QzMgMTYuMzMgOC4zMyAxNiAxMiAxNkMxNS42NyAxNiAyMSAxNi4zMyAyMSAxOVpNMTIgOEMxNS4zMSA4IDE4IDEwLjY5IDE4IDE0VjE2SDZWMTRDNiAxMC42OSA4LjY5IDggMTIgOFoiLz4KPC9zdmc+Cjwvc3ZnPgo='
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadUserInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadUserInfo();
  },

  /**
   * 加载用户信息
   */
  loadUserInfo: function() {
    const userInfo = util.getStorage('localUserInfo', {
      avatarUrl: this.data.defaultAvatar,
      nickName: '未设置昵称'
    });
    
    this.setData({
      userInfo: userInfo
    });
  },

  /**
   * 点击头像
   */
  onAvatarTap: function() {
    wx.showActionSheet({
      itemList: ['使用微信头像', '从相册选择'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 使用微信头像
          this.useWechatAvatar();
        } else if (res.tapIndex === 1) {
          // 从相册选择
          this.chooseFromAlbum();
        }
      }
    });
  },

  /**
   * 使用微信头像
   */
  useWechatAvatar: function() {
    // 获取微信用户信息
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const newUserInfo = {
          ...this.data.userInfo,
          avatarUrl: res.userInfo.avatarUrl
        };
        
        this.updateUserInfo(newUserInfo);
        util.showToast('头像更新成功', 'success');
      },
      fail: (err) => {
        console.error('获取微信头像失败:', err);
        util.showToast('获取微信头像失败');
      }
    });
  },

  /**
   * 从相册选择头像
   */
  chooseFromAlbum: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      maxDuration: 30,
      camera: 'back',
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        
        // 这里可以添加图片压缩和裁剪逻辑
        const newUserInfo = {
          ...this.data.userInfo,
          avatarUrl: tempFilePath
        };
        
        this.updateUserInfo(newUserInfo);
        util.showToast('头像更新成功', 'success');
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        if (err.errMsg !== 'chooseMedia:fail cancel') {
          util.showToast('选择图片失败');
        }
      }
    });
  },

  /**
   * 点击昵称
   */
  onNickNameTap: function() {
    wx.showActionSheet({
      itemList: ['使用微信昵称', '自定义输入'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 使用微信昵称
          this.useWechatNickName();
        } else if (res.tapIndex === 1) {
          // 自定义输入
          this.inputCustomNickName();
        }
      }
    });
  },

  /**
   * 使用微信昵称
   */
  useWechatNickName: function() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const newUserInfo = {
          ...this.data.userInfo,
          nickName: res.userInfo.nickName
        };
        
        this.updateUserInfo(newUserInfo);
        util.showToast('昵称更新成功', 'success');
      },
      fail: (err) => {
        console.error('获取微信昵称失败:', err);
        util.showToast('获取微信昵称失败');
      }
    });
  },

  /**
   * 自定义输入昵称
   */
  inputCustomNickName: function() {
    wx.showModal({
      title: '设置昵称',
      placeholderText: '请输入昵称',
      editable: true,
      content: this.data.userInfo.nickName === '未设置昵称' ? '' : this.data.userInfo.nickName,
      success: (res) => {
        if (res.confirm && res.content) {
          const nickName = res.content.trim();
          
          if (nickName.length === 0) {
            util.showToast('昵称不能为空');
            return;
          }
          
          if (nickName.length > 20) {
            util.showToast('昵称不能超过20个字符');
            return;
          }
          
          const newUserInfo = {
            ...this.data.userInfo,
            nickName: nickName
          };
          
          this.updateUserInfo(newUserInfo);
          util.showToast('昵称更新成功', 'success');
        }
      }
    });
  },

  /**
   * 更新用户信息
   */
  updateUserInfo: function(newUserInfo) {
    // 只保存到本地存储，不上传到服务器
    util.setStorage('localUserInfo', newUserInfo);
    
    this.setData({
      userInfo: newUserInfo
    });

    // 通知其他页面用户信息已更新
    const app = getApp();
    if (app.globalData) {
      app.globalData.userInfo = newUserInfo;
    }
  },

  /**
   * 重置用户信息
   */
  onResetTap: function() {
    wx.showModal({
      title: '重置确认',
      content: '确定要重置头像和昵称吗？',
      success: (res) => {
        if (res.confirm) {
          const defaultUserInfo = {
            avatarUrl: this.data.defaultAvatar,
            nickName: '未设置昵称'
          };
          
          this.updateUserInfo(defaultUserInfo);
          util.showToast('已重置', 'success');
        }
      }
    });
  },

  /**
   * 预览头像
   */
  onPreviewAvatar: function() {
    if (this.data.userInfo.avatarUrl && this.data.userInfo.avatarUrl !== this.data.defaultAvatar) {
      wx.previewImage({
        urls: [this.data.userInfo.avatarUrl],
        current: this.data.userInfo.avatarUrl
      });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadUserInfo();
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: 'GESP考试刷题小程序',
      path: '/pages/index/index'
    };
  }
});