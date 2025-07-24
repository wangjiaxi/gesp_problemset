// pages/search/search.js
const util = require('../../utils/util.js');
const dataManager = require('../../utils/dataManager.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        searchValue: '',
        searchResults: [],
        searchHistory: [],
        hotSearches: ['Python', 'JavaScript', '算法', '数据结构', '编程基础', '循环', '函数', '变量', '数组', '字符串'].slice(0, 10),
        isSearching: false,
        hasSearched: false,
        showHistory: true,
        searchTimer: null,
        searchStats: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 加载搜索历史
        this.loadSearchHistory();

        // 如果有传入的搜索关键词，直接搜索
        if (options.keyword) {
            const keyword = decodeURIComponent(options.keyword);
            this.setData({
                searchValue: keyword
            });
            this.performSearch(keyword, false); // 不记录历史
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // 每次显示页面时重新加载搜索历史
        this.loadSearchHistory();
    },

    /**
     * 搜索输入框输入事件
     */
    onSearchInput: function (e) {
        const value = e.detail.value;
        this.setData({
            searchValue: value,
            showHistory: value.length === 0
        });

        // 清除之前的定时器
        if (this.data.searchTimer) {
            clearTimeout(this.data.searchTimer);
        }

        // 如果输入为空，清空搜索结果
        if (value.length === 0) {
            this.setData({
                searchResults: [],
                hasSearched: false
            });
            return;
        }

        // 设置新的定时器，0.2秒后执行搜索
        const timer = setTimeout(() => {
            this.performSearch(value, false); // 实时搜索不记录历史
        }, 200);

        this.setData({
            searchTimer: timer
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

        // 点击搜索按钮才记录历史
        this.performSearch(keyword, true);
    },

    /**
     * 执行搜索
     */
    performSearch: function (keyword, saveHistory = false) {
        if (!keyword || keyword.trim().length === 0) {
            return;
        }

        this.setData({
            isSearching: true
        });

        // 模拟搜索延迟
        setTimeout(() => {
            const results = this.searchQuestions(keyword);
            const stats = { total: results.length, types: this.getResultTypes(results) };

            this.setData({
                searchResults: results,
                searchStats: stats,
                isSearching: false,
                hasSearched: true,
                showHistory: false
            });

            // 如果需要保存历史记录
            if (saveHistory) {
                this.saveSearchHistory(keyword);
            }
        }, 300);
    },

    /**
     * 搜索题目
     */
    searchQuestions: function (keyword) {
        // 验证搜索关键词
        if (!keyword || keyword.trim().length < 1) {
            util.showToast('请输入搜索关键词');
            return [];
        }

        // 使用 dataManager 搜索
        return dataManager.searchQuestions(keyword.trim());
    },

    /**
     * 获取搜索结果统计
     */
    getResultTypes: function(results) {
        const types = {};
        results.forEach(item => {
            const type = item.type === 'choice' ? '选择题' : '判断题';
            types[type] = (types[type] || 0) + 1;
        });
        return types;
    },

    /**
     * 格式化搜索历史
     */
    formatSearchHistory: function(history, keyword, maxLength) {
        const newHistory = [keyword, ...history.filter(item => item !== keyword)];
        return newHistory.slice(0, maxLength);
    },

    /**
     * 获取所有题目数据
     */
    getAllQuestions: function () {
        let allQuestions = [];

        // 遍历所有等级和类型，获取题目
        for (let level = 1; level <= 8; level++) {
            ['choice', 'judge'].forEach(type => {
                const questions = dataManager.getQuestionsByLevelAndType(level, type);
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
     * 加载搜索历史
     */
    loadSearchHistory: function () {
        const history = util.getStorage('searchHistory', []);
        this.setData({
            searchHistory: history
        });
    },

    /**
     * 保存搜索历史
     */
    saveSearchHistory: function (keyword) {
        const newHistory = this.formatSearchHistory(this.data.searchHistory, keyword, 10);

        // 保存到本地存储
        util.setStorage('searchHistory', newHistory);

        // 更新页面数据
        this.setData({
            searchHistory: newHistory
        });
    },

    /**
     * 点击历史搜索项
     */
    onHistoryTap: function (e) {
        const keyword = e.currentTarget.dataset.keyword;
        this.setData({
            searchValue: keyword
        });
        this.performSearch(keyword, true); // 点击历史记录也记录历史
    },

    /**
     * 点击热门搜索项
     */
    onHotSearchTap: function (e) {
        const keyword = e.currentTarget.dataset.keyword;
        this.setData({
            searchValue: keyword
        });
        this.performSearch(keyword, true); // 点击热门搜索记录历史
    },

    /**
     * 清空搜索历史
     */
    onClearHistory: function () {
        wx.showModal({
            title: '清空搜索历史',
            content: '确定要清空所有搜索历史吗？',
            success: (res) => {
                if (res.confirm) {
                    util.removeStorage('searchHistory');
                    this.setData({
                        searchHistory: []
                    });
                    util.showToast('已清空搜索历史');
                }
            }
        });
    },

    /**
     * 删除单个历史记录
     */
    onDeleteHistory: function (e) {
        const keyword = e.currentTarget.dataset.keyword;
        let history = this.data.searchHistory;
        history = history.filter(item => item !== keyword);

        util.setStorage('searchHistory', history);
        this.setData({
            searchHistory: history
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
     * 清空搜索框
     */
    onClearInput: function () {
        this.setData({
            searchValue: '',
            searchResults: [],
            hasSearched: false,
            showHistory: true
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
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