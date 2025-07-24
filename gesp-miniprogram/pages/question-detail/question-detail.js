// pages/question-detail/question-detail.js
const app = getApp();
const util = require('../../utils/util.js');
const dataManager = require('../../utils/dataManager.js');

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
      levelId: parseInt(levelId) || 1,
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
    // 从所有题目中查找指定ID的题目
    const question = dataManager.getQuestionById(id);
    
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
        maxScore: 2,
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
    // 使用 dataManager 获取所有题目
    return dataManager.getAllQuestions();
  },

  /**
   * 加载题目数据
   */
  loadQuestions: function() {
    const { levelId, typeId, year, month } = this.data;
    
    // 从 dataManager 获取真实题目数据
    let questions = dataManager.getQuestionsByLevelAndType(levelId, typeId);
    
    // 如果指定了年月，进一步筛选
    if (year && month) {
      questions = questions.filter(q => q.year === year && q.month === month);
    }
    
    // 如果没有找到指定年月的题目，使用该等级和类型的所有题目
    if (questions.length === 0) {
      questions = dataManager.getQuestionsByLevelAndType(levelId, typeId);
    }
    
    // 如果还是没有题目，显示提示
    if (questions.length === 0) {
      wx.showToast({
        title: '暂无题目',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }
    
    // 为题目添加分数（选择题2分，判断题2分）
    const questionsWithScore = questions.map((q, index) => ({
      ...q,
      questionNumber: index + 1,
      score: 2
    }));
    
    const maxScore = questionsWithScore.length * 2;
    
    this.setData({
      questionList: questionsWithScore,
      totalCount: questionsWithScore.length,
      currentQuestion: questionsWithScore[0] || null,
      maxScore: maxScore,
      loading: false
    });
    
    // 检查第一题的收藏状态
    this.checkFavoriteStatus();
  },

  /**
   * 更新答题统计
   */
  updateAnswerStats: function() {
    const userAnswers = this.data.userAnswers;
    this.setData({
      answeredCount: Object.keys(userAnswers).length
    });
  },

  /**
   * 选择答案
   */
  selectAnswer: function(e) {
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
   * 上一题
   */
  prevQuestion: function() {
    const currentIndex = this.data.currentIndex;
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      this.setData({
        currentIndex: newIndex,
        currentQuestion: this.data.questionList[newIndex]
      });
      this.checkFavoriteStatus();
    }
  },

  /**
   * 下一题
   */
  nextQuestion: function() {
    const currentIndex = this.data.currentIndex;
    if (currentIndex < this.data.totalCount - 1) {
      const newIndex = currentIndex + 1;
      this.setData({
        currentIndex: newIndex,
        currentQuestion: this.data.questionList[newIndex]
      });
      this.checkFavoriteStatus();
    }
  },

  /**
   * 检查收藏状态
   */
  checkFavoriteStatus: function() {
    const app = getApp();
    const userData = app.globalData.userData;
    const questionId = this.data.currentQuestion?.id;
    const isFavorited = userData.favoriteQuestions.includes(questionId);
    
    this.setData({
      isFavorited: isFavorited
    });
  },

  /**
   * 切换收藏状态
   */
  toggleFavorite: function() {
    const questionId = this.data.currentQuestion.id;
    const isFavorited = this.data.isFavorited;
    
    if (isFavorited) {
      // 取消收藏
      const success = dataManager.removeFavoriteQuestion(questionId);
      if (success) {
        wx.showToast({
          title: '已取消收藏',
          icon: 'success'
        });
      }
    } else {
      // 添加收藏
      const success = dataManager.addFavoriteQuestion(questionId);
      if (success) {
        wx.showToast({
          title: '已添加收藏',
          icon: 'success'
        });
      }
    }
    
    this.setData({
      isFavorited: !isFavorited
    });
  },

  /**
   * 提交答案
   */
  submitAnswers: function() {
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
          ...question,
          userAnswer: userAnswer,
          questionIndex: index
        });
      }
      
      // 保存答题记录
      dataManager.saveAnswerRecord(question.id, userAnswer, isCorrect, 0);
    });
    
    this.setData({
      score: score,
      wrongQuestions: wrongQuestions,
      isSubmitted: true
    });
    
    // 跳转到结果页面
    wx.redirectTo({
      url: `/pages/exam-result/exam-result?score=${score}&maxScore=${this.data.maxScore}&wrongCount=${wrongQuestions.length}&totalCount=${this.data.totalCount}&levelName=${encodeURIComponent(this.data.levelName)}&typeName=${encodeURIComponent(this.data.typeName)}&year=${this.data.year}&month=${this.data.month}`
    });
  },

  /**
   * 查看题目解析
   */
  viewQuestionReview: function() {
    const questionIndex = this.data.currentIndex;
    wx.navigateTo({
      url: `/pages/question-review/question-review?questionIndex=${questionIndex}&levelId=${this.data.levelId}&levelName=${encodeURIComponent(this.data.levelName)}&typeId=${this.data.typeId}&typeName=${encodeURIComponent(this.data.typeName)}&year=${this.data.year}&month=${this.data.month}`
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
    return {
      title: `GESP ${this.data.levelName} ${this.data.typeName}`,
      path: `/pages/question-detail/question-detail?levelId=${this.data.levelId}&levelName=${encodeURIComponent(this.data.levelName)}&typeId=${this.data.typeId}&typeName=${encodeURIComponent(this.data.typeName)}&year=${this.data.year}&month=${this.data.month}`
    };
  }
});