// pages/question-detail/question-detail.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    levelId: '',
    levelName: '',
    typeId: '',
    typeName: '',
    year: '',
    month: '',
    currentQuestion: null,
    questionList: [],
    currentIndex: 0,
    totalCount: 0,
    userAnswers: {}, // 存储所有题目的答案
    answeredCount: 0, // 已答题数量
    loading: true,
    isExamMode: true, // 考试模式
    isSubmitted: false, // 是否已提交
    score: 0, // 总分
    wrongQuestions: [], // 错题列表
    maxScore: 0, // 满分
    isFavorited: false // 当前题目是否已收藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { levelId, levelName, typeId, typeName, year, month } = options;
    this.setData({
      levelId: levelId || '',
      levelName: decodeURIComponent(levelName || ''),
      typeId: typeId || '',
      typeName: decodeURIComponent(typeName || ''),
      year: parseInt(year) || 2024,
      month: parseInt(month) || 12
    });
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: `${this.data.levelName} ${this.data.typeName}`
    });

    // 加载题目数据
    this.loadQuestions();
  },
  
  /**
   * 根据ID加载题目
   */
  loadQuestionById: function(id) {
    // 模拟从所有题目中查找指定ID的题目
    const allQuestions = this.getAllQuestions();
    const question = allQuestions.find(q => q.id === id);
    
    if (question) {
      // 设置导航栏标题
      wx.setNavigationBarTitle({
        title: `题目详情`
      });
      
      this.setData({
        questionList: [question],
        totalCount: 1,
        currentQuestion: question,
        currentIndex: 0,
        loading: false,
        maxScore: question.score || 2,
        isExamMode: false // 非考试模式
      });
      
      // 检查收藏状态
      this.checkFavoriteStatus();
    } else {
      wx.showToast({
        title: '题目不存在',
        icon: 'error'
      });
      
      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },
  
  /**
   * 获取所有题目
   */
  getAllQuestions: function() {
    let allQuestions = [];
    
    // 遍历所有等级和类型，获取题目
    for (let level = 1; level <= 8; level++) {
      for (let type of ['choice', 'judge']) {
        // 生成模拟题目
        if (type === 'choice') {
          for (let i = 1; i <= 15; i++) {
            allQuestions.push({
              id: `${2024}_${12}_choice_${i.toString().padStart(2, '0')}`,
              questionNumber: i,
              question: `选择题第${i}题：以下代码的输出结果是什么？`,
              code: i % 3 === 0 ? "def calculate(x, y):\n    result = x * 2 + y\n    return result\n\nprint(calculate(3, 4))" : null,
              options: [
                {key: "A", value: `选项A_${i}`},
                {key: "B", value: `选项B_${i}`},
                {key: "C", value: `选项C_${i}`},
                {key: "D", value: `选项D_${i}`}
              ],
              answer: ["A", "B", "C", "D"][i % 4],
              explanation: `第${i}题的答案解析...`,
              type: "choice",
              score: 2,
              level: level
            });
          }
        } else {
          for (let i = 1; i <= 10; i++) {
            allQuestions.push({
              id: `${2024}_${12}_judge_${i.toString().padStart(2, '0')}`,
              questionNumber: i,
              question: `判断题第${i}题：Python是一种编译型语言。`,
              code: i % 2 === 0 ? "x = 5\ny = 5\nprint(x == y)" : null,
              answer: i % 2 === 0,
              explanation: `第${i}题的答案解析...`,
              type: "judge",
              score: 2,
              level: level
            });
          }
        }
      }
    }
    
    // 添加搜索页面中的模拟题目
    const mockSearchQuestions = [
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
        score: 2,
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
        score: 2,
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
        score: 2,
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
        score: 2,
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
        score: 2,
        tags: ["递归", "算法", "函数"]
      },
      {
        id: "2025_06_01",
        question: "2025年4月19日在北京举行了一场颇为瞩目的人形机器人半程马拉松赛。比赛期间，跑动着的机器人会利用身上安装的多个传感器所反馈的数据来调整姿态、保持平衡等，那么这类传感器类似于计算机的( )。",
        code: "",
        type: "choice",
        level: 1,
        score: 2,
        difficulty: 1,
        year: 2025,
        month: 6,
        explanation: "传感器用于收集外部环境数据，类似于计算机的输入设备。",
        tags: ["计算机组成", "输入设备"],
        options: [
          {
            "key": "A",
            "value": "处理器",
            "code": ""
          },
          {
            "key": "B",
            "value": "存储器",
            "code": ""
          },
          {
            "key": "C",
            "value": "输入设备",
            "code": ""
          },
          {
            "key": "D",
            "value": "输出设备",
            "code": ""
          }
        ],
        answer: "C"
      }
    ];
    
    return allQuestions.concat(mockSearchQuestions);
  },

  /**
   * 加载题目数据
   */
  loadQuestions: function() {
    // 这里应该从真题数据中加载，目前使用模拟数据
    const mockQuestions = this.getMockQuestions();
    const maxScore = mockQuestions.reduce((sum, q) => sum + q.score, 0);
    
    this.setData({
      questionList: mockQuestions,
      totalCount: mockQuestions.length,
      currentQuestion: mockQuestions[0] || null,
      maxScore: maxScore,
      loading: false
    });
    
    // 检查第一题的收藏状态
    this.checkFavoriteStatus();
  },

  /**
   * 获取模拟题目数据
   */
  getMockQuestions: function() {
    const { levelId, typeId, year, month } = this.data;
    const questions = [];
    
    if (typeId === 'choice') {
      // 生成15道选择题
      for (let i = 1; i <= 15; i++) {
        questions.push({
          id: `${year}_${month}_choice_${i.toString().padStart(2, '0')}`,
          questionNumber: i,
          question: `选择题第${i}题：以下代码的输出结果是什么？`,
          code: i % 3 === 0 ? "def calculate(x, y):\n    result = x * 2 + y\n    return result\n\nprint(calculate(3, 4))" : null,
          options: [
            {key: "A", value: `选项A_${i}`},
            {key: "B", value: `选项B_${i}`},
            {key: "C", value: `选项C_${i}`},
            {key: "D", value: `选项D_${i}`}
          ],
          answer: ["A", "B", "C", "D"][i % 4],
          explanation: `第${i}题的答案解析...`,
          type: "choice",
          score: 2
        });
      }
    } else {
      // 生成10道判断题
      for (let i = 1; i <= 10; i++) {
        questions.push({
          id: `${year}_${month}_judge_${i.toString().padStart(2, '0')}`,
          questionNumber: i,
          question: `判断题第${i}题：Python是一种编译型语言。`,
          code: i % 2 === 0 ? "x = 5\ny = 5\nprint(x == y)" : null,
          answer: i % 2 === 0,
          explanation: `第${i}题的答案解析...`,
          type: "judge",
          score: 2
        });
      }
    }
    
    return questions;
  },

  /**
   * 选择答案
   */
  selectAnswer: function(e) {
    if (this.data.isSubmitted) return;
    
    const answer = e.currentTarget.dataset.answer;
    const questionId = this.data.currentQuestion.id;
    const userAnswers = { ...this.data.userAnswers };
    userAnswers[questionId] = answer;
    
    this.setData({
      userAnswers: userAnswers,
      answeredCount: Object.keys(userAnswers).length
    });
  },

  /**
   * 判断题答案选择
   */
  selectJudgeAnswer: function(e) {
    if (this.data.isSubmitted) return;
    
    const answer = e.currentTarget.dataset.answer === 'true';
    const questionId = this.data.currentQuestion.id;
    const userAnswers = { ...this.data.userAnswers };
    userAnswers[questionId] = answer;
    
    this.setData({
      userAnswers: userAnswers,
      answeredCount: Object.keys(userAnswers).length
    });
  },

  /**
   * 下一题
   */
  nextQuestion: function() {
    const nextIndex = this.data.currentIndex + 1;
    if (nextIndex < this.data.questionList.length) {
      this.setData({
        currentIndex: nextIndex,
        currentQuestion: this.data.questionList[nextIndex]
      });
      // 检查新题目的收藏状态
      this.checkFavoriteStatus();
    }
  },

  /**
   * 上一题
   */
  prevQuestion: function() {
    const prevIndex = this.data.currentIndex - 1;
    if (prevIndex >= 0) {
      this.setData({
        currentIndex: prevIndex,
        currentQuestion: this.data.questionList[prevIndex]
      });
      // 检查新题目的收藏状态
      this.checkFavoriteStatus();
    }
  },

  /**
   * 检查当前题目的收藏状态
   */
  checkFavoriteStatus: function() {
    if (!this.data.currentQuestion) return;
    
    // 从本地存储获取收藏列表
    const favoriteList = wx.getStorageSync('favoriteQuestions') || [];
    const questionId = this.data.currentQuestion.id;
    const isFavorited = favoriteList.includes(questionId);
    
    this.setData({
      isFavorited: isFavorited
    });
  },

  /**
   * 提交答案
   */
  submitAnswers: function() {
    const { questionList, userAnswers } = this.data;
    
    // 检查是否所有题目都已作答
    const unansweredQuestions = questionList.filter(q => !(q.id in userAnswers));
    if (unansweredQuestions.length > 0) {
      wx.showModal({
        title: '提示',
        content: `还有${unansweredQuestions.length}道题目未作答，确定要提交吗？`,
        success: (res) => {
          if (res.confirm) {
            this.calculateScore();
          }
        }
      });
    } else {
      wx.showModal({
        title: '确认提交',
        content: '确定要提交答案吗？提交后将无法修改。',
        success: (res) => {
          if (res.confirm) {
            this.calculateScore();
          }
        }
      });
    }
  },

  /**
   * 计算分数
   */
  calculateScore: function() {
    const { questionList, userAnswers } = this.data;
    let score = 0;
    const wrongQuestions = [];
    
    questionList.forEach((question, index) => {
      const userAnswer = userAnswers[question.id];
      const isCorrect = userAnswer === question.answer;
      
      if (isCorrect) {
        score += question.score;
      } else {
        wrongQuestions.push({
          index: index + 1,
          question: question,
          userAnswer: userAnswer,
          correctAnswer: question.answer
        });
      }
    });
    
    this.setData({
      isSubmitted: true,
      score: score,
      wrongQuestions: wrongQuestions
    });
    
    // 跳转到结果页面
    wx.navigateTo({
      url: `/pages/exam-result/exam-result?score=${score}&maxScore=${this.data.maxScore}&wrongCount=${wrongQuestions.length}&totalCount=${this.data.totalCount}&levelName=${encodeURIComponent(this.data.levelName)}&typeName=${encodeURIComponent(this.data.typeName)}&year=${this.data.year}&month=${this.data.month}`
    });
  },

  /**
   * 查看错题详情
   */
  viewWrongQuestion: function(e) {
    const questionIndex = e.currentTarget.dataset.index - 1;
    wx.navigateTo({
      url: `/pages/question-review/question-review?questionIndex=${questionIndex}&levelId=${this.data.levelId}&levelName=${encodeURIComponent(this.data.levelName)}&typeId=${this.data.typeId}&typeName=${encodeURIComponent(this.data.typeName)}&year=${this.data.year}&month=${this.data.month}`
    });
  },

  /**
   * 切换收藏状态
   */
  toggleFavorite: function() {
    if (!this.data.currentQuestion) return;
    
    const questionId = this.data.currentQuestion.id;
    let favoriteList = wx.getStorageSync('favoriteQuestions') || [];
    let isFavorited = this.data.isFavorited;
    
    if (isFavorited) {
      // 取消收藏
      favoriteList = favoriteList.filter(id => id !== questionId);
      wx.showToast({
        title: '取消收藏',
        icon: 'success'
      });
    } else {
      // 添加收藏
      favoriteList.push(questionId);
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      });
    }
    
    // 保存到本地存储
    wx.setStorageSync('favoriteQuestions', favoriteList);
    
    // 更新状态
    this.setData({
      isFavorited: !isFavorited
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.loadQuestions();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 返回上一页
   */
  goBack: function() {
    wx.navigateBack();
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // 如果是从搜索结果页面跳转过来的单个题目
    if (this.data.totalCount === 1 && this.data.currentQuestion) {
      return {
        title: `GESP 刷题 - ${this.data.currentQuestion.question.substring(0, 20)}...`,
        path: `/pages/question-detail/question-detail?id=${this.data.currentQuestion.id}`
      };
    }
    
    // 正常考试模式
    return {
      title: `GESP ${this.data.levelName} ${this.data.typeName} 刷题`,
      path: `/pages/question-detail/question-detail?levelId=${this.data.levelId}&levelName=${encodeURIComponent(this.data.levelName)}&typeId=${this.data.typeId}&typeName=${encodeURIComponent(this.data.typeName)}&year=${this.data.year}&month=${this.data.month}`
    };
  }
})