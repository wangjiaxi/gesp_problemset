// pages/search-result/search-result.js
const util = require('../../utils/util.js');
const questionUtils = require('../../utils/questionUtils.js');
const searchUtils = require('../../utils/searchUtils.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    searchResults: [],
    filteredResults: [],
    isLoading: false,
    isLoadingMore: false,
    hasMore: false,
    pageSize: 10,
    currentPage: 1,
    filterType: 'all',
    searchStats: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取搜索关键词
    if (options.keyword) {
      const keyword = decodeURIComponent(options.keyword);
      this.setData({
        searchValue: keyword
      });
      this.performSearch(keyword);
    }
  },

  /**
   * 执行搜索
   */
  performSearch: function (keyword) {
    if (!keyword || keyword.trim().length === 0) {
      return;
    }

    this.setData({
      isLoading: true,
      currentPage: 1
    });

    // 模拟搜索延迟
    setTimeout(() => {
      const results = this.searchQuestions(keyword);
      const stats = searchUtils.getSearchStats(results);

      this.setData({
        searchResults: results,
        filteredResults: this.getPagedResults(results, 1),
        searchStats: stats,
        isLoading: false,
        hasMore: results.length > this.data.pageSize
      });
    }, 300);
  },

  /**
   * 搜索题目
   */
  searchQuestions: function (keyword) {
    // 验证搜索关键词
    const validation = searchUtils.validateSearchKeyword(keyword);
    if (!validation.isValid) {
      util.showToast(validation.message);
      return [];
    }

    // 获取所有题目数据
    const allQuestions = this.getAllQuestions();

    // 使用搜索工具函数进行搜索
    const results = searchUtils.searchQuestions(allQuestions, keyword);

    // 按相关性排序
    return searchUtils.sortByRelevance(results, keyword);
  },

  /**
   * 获取所有题目数据
   */
  getAllQuestions: function () {
    let allQuestions = [];

    // 遍历所有等级和类型，获取题目
    for (let level = 1; level <= 8; level++) {
      ['choice', 'judge'].forEach(type => {
        const questions = questionUtils.getMockQuestions(level, type);
        allQuestions = allQuestions.concat(questions);
      });
    }

    // 添加一些模拟的搜索数据
    const mockQuestions = [
      {
        id: "search_001",
        level: 1,
        type: "choice",
        question: "Python中哪个关键字用于定义函数？",
        options: [
          { "key": "A", "value": "function" },
          { "key": "B", "value": "def" },
          { "key": "C", "value": "define" },
          { "key": "D", "value": "func" }
        ],
        answer: "B",
        explanation: "Python使用def关键字来定义函数。",
        difficulty: 1,
        tags: ["函数", "关键字", "基础语法"]
      },
      {
        id: "search_002",
        level: 2,
        type: "judge",
        question: "Python中的列表是可变数据类型。",
        answer: true,
        explanation: "Python中的列表(list)是可变数据类型，可以修改其内容。",
        difficulty: 2,
        tags: ["列表", "数据类型", "可变性"]
      },
      {
        id: "search_003",
        level: 2,
        type: "choice",
        question: "以下哪个方法可以向列表末尾添加元素？",
        options: [
          { "key": "A", "value": "add()" },
          { "key": "B", "value": "append()" },
          { "key": "C", "value": "insert()" },
          { "key": "D", "value": "push()" }
        ],
        answer: "B",
        explanation: "append()方法用于向列表末尾添加一个元素。",
        difficulty: 2,
        tags: ["列表", "方法", "append"]
      },
      {
        id: "search_004",
        level: 3,
        type: "choice",
        question: "Python中字典的特点是什么？",
        options: [
          { "key": "A", "value": "有序且可变" },
          { "key": "B", "value": "无序且不可变" },
          { "key": "C", "value": "有序且不可变" },
          { "key": "D", "value": "键值对存储" }
        ],
        answer: "D",
        explanation: "字典是以键值对形式存储数据的数据结构。",
        difficulty: 3,
        tags: ["字典", "键值对", "数据结构"]
      },
      {
        id: "search_005",
        level: 3,
        type: "choice",
        question: "以下哪个是正确的递归函数特征？",
        code: "def factorial(n):\n    if n <= 1:\n        return 1\n    else:\n        return n * factorial(n-1)",
        options: [
          { "key": "A", "value": "有基础情况" },
          { "key": "B", "value": "调用自身" },
          { "key": "C", "value": "参数递减" },
          { "key": "D", "value": "以上都是" }
        ],
        answer: "D",
        explanation: "递归函数需要有基础情况、调用自身、参数向基础情况递进。",
        difficulty: 4,
        tags: ["递归", "算法", "函数"]
      }
    ];

    return allQuestions.concat(mockQuestions);
  },

  /**
   * 获取分页结果
   */
  getPagedResults: function (results, page) {
    const { pageSize, filterType } = this.data;
    
    // 先根据筛选条件过滤
    let filtered = results;
    if (filterType !== 'all') {
      filtered = results.filter(item => item.type === filterType);
    }
    
    // 然后分页
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return filtered.slice(0, end);
  },

  /**
   * 加载更多结果
   */
  loadMore: function () {
    if (!this.data.hasMore) return;
    
    const nextPage = this.data.currentPage + 1;
    
    this.setData({
      isLoadingMore: true
    });
    
    // 模拟加载延迟
    setTimeout(() => {
      const newResults = this.getPagedResults(this.data.searchResults, nextPage);
      
      this.setData({
        filteredResults: newResults,
        currentPage: nextPage,
        isLoadingMore: false,
        hasMore: newResults.length < this.data.searchResults.length
      });
    }, 300);
  },

  /**
   * 筛选结果
   */
  onFilterTap: function (e) {
    const filterType = e.currentTarget.dataset.type;
    
    this.setData({
      filterType: filterType,
      currentPage: 1
    });
    
    const filtered = this.getPagedResults(this.data.searchResults, 1);
    
    this.setData({
      filteredResults: filtered,
      hasMore: filtered.length < this.data.searchResults.length
    });
  },

  /**
   * 搜索输入框输入事件
   */
  onSearchInput: function (e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  /**
   * 点击搜索按钮
   */
  onSearchTap: function () {
    const keyword = this.data.searchValue.trim();
    if (keyword.length === 0) {
      util.showToast('请输入搜索关键词');
      return;
    }

    this.performSearch(keyword);
    
    // 保存到搜索历史
    const history = util.getStorage('searchHistory', []);
    const newHistory = searchUtils.formatSearchHistory(history, keyword, 10);
    util.setStorage('searchHistory', newHistory);
  },

  /**
   * 清空搜索框
   */
  onClearInput: function () {
    this.setData({
      searchValue: ''
    });
  },

  /**
   * 点击题目项
   */
  onQuestionTap: function (e) {
    const questionId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/question-detail/question-detail?id=${questionId}`
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    if (this.data.searchValue) {
      this.performSearch(this.data.searchValue);
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.isLoadingMore) {
      this.loadMore();
    }
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