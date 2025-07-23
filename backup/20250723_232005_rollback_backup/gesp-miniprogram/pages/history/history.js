// pages/history/history.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    historyList: [],
    statistics: {
      totalQuestions: 0,
      correctCount: 0,
      wrongCount: 0,
      accuracy: 0
    },
    loading: false,
    isEmpty: false,
    currentTab: 0, // 0: 全部, 1: 正确, 2: 错误
    filteredList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadHistory();
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
    // 每次显示页面时刷新历史记录
    this.loadHistory();
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
    this.loadHistory();
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
   * 加载历史记录
   */
  loadHistory: function() {
    this.setData({
      loading: true
    });

    // 模拟历史记录数据，实际应该从云数据库获取
    const mockHistory = [
      {
        id: "history_001",
        questionId: "2024_12_01",
        question: "以下哪个是Python中正确的变量命名？",
        type: "choice",
        level: 1,
        userAnswer: "B",
        correctAnswer: "B",
        isCorrect: true,
        difficulty: 1,
        tags: ["变量命名", "基础语法"],
        answerTime: "2024-01-15 14:30:00",
        timeSpent: 45 // 秒
      },
      {
        id: "history_002",
        questionId: "2024_12_02",
        question: "Python中的列表是可变数据类型。",
        type: "judge",
        level: 2,
        userAnswer: "true",
        correctAnswer: "true",
        isCorrect: true,
        difficulty: 2,
        tags: ["数据类型", "列表"],
        answerTime: "2024-01-15 14:25:00",
        timeSpent: 30
      },
      {
        id: "history_003",
        questionId: "2024_12_03",
        question: "以下关于Python函数的描述，哪个是错误的？",
        type: "choice",
        level: 3,
        userAnswer: "A",
        correctAnswer: "C",
        isCorrect: false,
        difficulty: 3,
        tags: ["函数", "高级特性"],
        answerTime: "2024-01-15 14:20:00",
        timeSpent: 120
      },
      {
        id: "history_004",
        questionId: "2024_12_04",
        question: "Python中可以使用多重继承。",
        type: "judge",
        level: 4,
        userAnswer: "false",
        correctAnswer: "true",
        isCorrect: false,
        difficulty: 4,
        tags: ["面向对象", "继承"],
        answerTime: "2024-01-15 14:15:00",
        timeSpent: 90
      },
      {
        id: "history_005",
        questionId: "2024_12_05",
        question: "下列哪个不是Python的内置数据类型？",
        type: "choice",
        level: 2,
        userAnswer: "D",
        correctAnswer: "D",
        isCorrect: true,
        difficulty: 2,
        tags: ["数据类型", "基础知识"],
        answerTime: "2024-01-15 14:10:00",
        timeSpent: 60
      }
    ];

    // 模拟网络延迟
    setTimeout(() => {
      const statistics = this.calculateStatistics(mockHistory);
      
      this.setData({
        historyList: mockHistory,
        statistics: statistics,
        loading: false,
        isEmpty: mockHistory.length === 0
      });

      // 初始化筛选列表
      this.filterHistory();
    }, 500);
  },

  /**
   * 计算统计数据
   */
  calculateStatistics: function(historyList) {
    const totalQuestions = historyList.length;
    const correctCount = historyList.filter(item => item.isCorrect).length;
    const wrongCount = totalQuestions - correctCount;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return {
      totalQuestions,
      correctCount,
      wrongCount,
      accuracy
    };
  },

  /**
   * 切换标签页
   */
  onTabChange: function(e) {
    const currentTab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: currentTab
    });
    this.filterHistory();
  },

  /**
   * 筛选历史记录
   */
  filterHistory: function() {
    const { historyList, currentTab } = this.data;
    let filteredList = [];

    switch (currentTab) {
      case 0: // 全部
        filteredList = historyList;
        break;
      case 1: // 正确
        filteredList = historyList.filter(item => item.isCorrect);
        break;
      case 2: // 错误
        filteredList = historyList.filter(item => !item.isCorrect);
        break;
    }

    this.setData({
      filteredList: filteredList
    });
  },

  /**
   * 点击题目，跳转到详情页
   */
  onQuestionTap: function(e) {
    const questionId = e.currentTarget.dataset.questionId;
    wx.navigateTo({
      url: `/pages/question-detail/question-detail?id=${questionId}`
    });
  },

  /**
   * 清空历史记录
   */
  onClearHistory: function() {
    wx.showModal({
      title: '清空记录',
      content: '确定要清空所有刷题记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          this.clearAllHistory();
        }
      }
    });
  },

  /**
   * 执行清空操作
   */
  clearAllHistory: function() {
    // 这里应该调用云函数清空历史记录
    console.log('清空历史记录');

    this.setData({
      historyList: [],
      filteredList: [],
      statistics: {
        totalQuestions: 0,
        correctCount: 0,
        wrongCount: 0,
        accuracy: 0
      },
      isEmpty: true
    });

    util.showToast('已清空历史记录');
  },

  /**
   * 跳转到题库页面
   */
  goToBrowse: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  /**
   * 格式化时间显示
   */
  formatTime: function(seconds) {
    if (seconds < 60) {
      return `${seconds}秒`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}分${remainingSeconds}秒`;
    }
  }
})