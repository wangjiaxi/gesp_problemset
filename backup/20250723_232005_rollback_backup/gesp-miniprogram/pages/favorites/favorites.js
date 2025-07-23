// pages/favorites/favorites.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    favoriteList: [],
    loading: false,
    isEmpty: false,
    editMode: false,
    selectedItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadFavorites();
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
    // 每次显示页面时刷新收藏列表
    this.loadFavorites();
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
    this.loadFavorites();
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
   * 加载收藏列表
   */
  loadFavorites: function() {
    this.setData({
      loading: true
    });

    // 模拟收藏数据，实际应该从云数据库获取
    const mockFavorites = [
      {
        id: "2024_12_01",
        type: "choice",
        level: 1,
        question: "以下哪个是Python中正确的变量命名？",
        options: [
          {"key": "A", "value": "2name"},
          {"key": "B", "value": "my_name"},
          {"key": "C", "value": "my-name"},
          {"key": "D", "value": "class"}
        ],
        answer: "B",
        difficulty: 1,
        tags: ["变量命名", "基础语法"],
        favoriteTime: "2024-01-15 10:30:00"
      },
      {
        id: "2024_12_02",
        type: "judge",
        level: 2,
        question: "Python中的列表是可变数据类型。",
        answer: "true",
        difficulty: 2,
        tags: ["数据类型", "列表"],
        favoriteTime: "2024-01-14 15:20:00"
      },
      {
        id: "2024_12_03",
        type: "choice",
        level: 3,
        question: "以下关于Python函数的描述，哪个是错误的？",
        options: [
          {"key": "A", "value": "函数可以有默认参数"},
          {"key": "B", "value": "函数可以返回多个值"},
          {"key": "C", "value": "函数必须有返回值"},
          {"key": "D", "value": "函数可以嵌套定义"}
        ],
        answer: "C",
        difficulty: 3,
        tags: ["函数", "高级特性"],
        favoriteTime: "2024-01-13 09:15:00"
      }
    ];

    // 模拟网络延迟
    setTimeout(() => {
      this.setData({
        favoriteList: mockFavorites,
        loading: false,
        isEmpty: mockFavorites.length === 0
      });
    }, 500);
  },

  /**
   * 点击题目，跳转到详情页
   */
  onQuestionTap: function(e) {
    const questionId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/question-detail/question-detail?id=${questionId}`
    });
  },

  /**
   * 切换编辑模式
   */
  toggleEditMode: function() {
    this.setData({
      editMode: !this.data.editMode,
      selectedItems: []
    });
  },

  /**
   * 选择/取消选择题目
   */
  onSelectItem: function(e) {
    const questionId = e.currentTarget.dataset.id;
    const selectedItems = [...this.data.selectedItems];
    const index = selectedItems.indexOf(questionId);
    
    if (index > -1) {
      selectedItems.splice(index, 1);
    } else {
      selectedItems.push(questionId);
    }
    
    this.setData({
      selectedItems: selectedItems
    });
  },

  /**
   * 全选/取消全选
   */
  onSelectAll: function() {
    const allSelected = this.data.selectedItems.length === this.data.favoriteList.length;
    
    if (allSelected) {
      this.setData({
        selectedItems: []
      });
    } else {
      this.setData({
        selectedItems: this.data.favoriteList.map(item => item.id)
      });
    }
  },

  /**
   * 删除选中的收藏
   */
  onDeleteSelected: function() {
    if (this.data.selectedItems.length === 0) {
      util.showToast('请选择要删除的题目');
      return;
    }

    wx.showModal({
      title: '确认删除',
      content: `确定要删除选中的${this.data.selectedItems.length}道题目吗？`,
      success: (res) => {
        if (res.confirm) {
          this.deleteSelectedFavorites();
        }
      }
    });
  },

  /**
   * 执行删除操作
   */
  deleteSelectedFavorites: function() {
    const selectedItems = this.data.selectedItems;
    const favoriteList = this.data.favoriteList.filter(item => 
      !selectedItems.includes(item.id)
    );

    // 这里应该调用云函数删除收藏
    console.log('删除收藏:', selectedItems);

    this.setData({
      favoriteList: favoriteList,
      selectedItems: [],
      editMode: false,
      isEmpty: favoriteList.length === 0
    });

    util.showToast('删除成功');
  },

  /**
   * 取消收藏单个题目
   */
  onUnfavorite: function(e) {
    const questionId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '取消收藏',
      content: '确定要取消收藏这道题目吗？',
      success: (res) => {
        if (res.confirm) {
          this.unfavoriteQuestion(questionId);
        }
      }
    });
  },

  /**
   * 执行取消收藏操作
   */
  unfavoriteQuestion: function(questionId) {
    const favoriteList = this.data.favoriteList.filter(item => item.id !== questionId);
    
    // 这里应该调用云函数取消收藏
    console.log('取消收藏:', questionId);

    this.setData({
      favoriteList: favoriteList,
      isEmpty: favoriteList.length === 0
    });

    util.showToast('已取消收藏');
  },

  /**
   * 获取题目类型显示文本
   */
  getTypeText: function(type) {
    const typeMap = {
      'choice': '选择题',
      'judge': '判断题',
      'coding': '编程题'
    };
    return typeMap[type] || '未知类型';
  },

  /**
   * 获取难度星级
   */
  getDifficultyStars: function(difficulty) {
    return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
  },

  /**
   * 跳转到题库页面
   */
  goToBrowse: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
})