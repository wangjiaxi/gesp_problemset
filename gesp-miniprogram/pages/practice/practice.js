// pages/practice/practice.js
const problemManager = require('../../utils/problemManager.js');

Page({
  data: {
    sessionId: '',
    levelId: '',
    levelName: '',
    sessionName: '',
    language: 'C++',
    typeId: '',
    typeName: '',
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    userAnswers: {},
    progress: 0,
    showSubmitButton: false
  },

  onLoad: function (options) {
    const { sessionId, levelId, levelName, sessionName, language, typeId, typeName } = options;
    
    this.setData({
      sessionId: sessionId || '',
      levelId: levelId || '',
      levelName: decodeURIComponent(levelName || ''),
      sessionName: decodeURIComponent(sessionName || ''),
      language: language || 'C++',
      typeId: typeId || '',
      typeName: decodeURIComponent(typeName || '')
    });

    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: `${this.data.sessionName} - ${this.data.typeName}`
    });

    // 加载题目
    this.loadQuestions();
  },

  // 加载题目
  loadQuestions: function() {
    const { sessionId, language, levelId, typeId } = this.data;
    const level = parseInt(levelId);
    
    const questions = problemManager.getQuestionsBySessionAndType(sessionId, language, level, typeId);
    
    if (questions.length === 0) {
      wx.showModal({
        title: '提示',
        content: '题目录入中，请稍候',
        showCancel: false,
        confirmText: '返回',
        success: () => {
          wx.navigateBack();
        }
      });
      return;
    }

    this.setData({
      questions: questions,
      currentQuestion: questions[0],
      progress: 1 / questions.length * 100
    });
  },

  // 选择答案
  onAnswerSelect: function(e) {
    const answer = e.currentTarget.dataset.answer;
    const questionId = this.data.currentQuestion.id;
    
    this.setData({
      [`userAnswers.${questionId}`]: answer
    });
  },

  // 上一题
  onPrevQuestion: function() {
    if (this.data.currentIndex > 0) {
      const newIndex = this.data.currentIndex - 1;
      this.setData({
        currentIndex: newIndex,
        currentQuestion: this.data.questions[newIndex],
        progress: (newIndex + 1) / this.data.questions.length * 100,
        showSubmitButton: false
      });
    }
  },

  // 下一题
  onNextQuestion: function() {
    const { currentIndex, questions } = this.data;
    
    if (currentIndex < questions.length - 1) {
      const newIndex = currentIndex + 1;
      const isLastQuestion = newIndex === questions.length - 1;
      
      this.setData({
        currentIndex: newIndex,
        currentQuestion: questions[newIndex],
        progress: (newIndex + 1) / questions.length * 100,
        showSubmitButton: isLastQuestion
      });
    }
  },

  // 提交答案
  onSubmit: function() {
    wx.showModal({
      title: '确认提交',
      content: '确定要提交答案吗？提交后将无法修改。',
      confirmColor: '#4169E1',
      success: (res) => {
        if (res.confirm) {
          this.calculateResult();
        }
      }
    });
  },

  // 计算结果
  calculateResult: function() {
    const { questions, userAnswers, typeId } = this.data;
    let correctCount = 0;
    const results = [];

    questions.forEach((question, index) => {
      const userAnswer = userAnswers[question.id];
      const isCorrect = userAnswer === question.answer;
      
      if (isCorrect) {
        correctCount++;
      }

      results.push({
        questionIndex: index,
        questionId: question.id,
        question: question.question,
        userAnswer: userAnswer,
        correctAnswer: question.answer,
        isCorrect: isCorrect,
        explanation: question.explanation
      });
    });

    const totalQuestions = questions.length;
    const score = correctCount * 2; // 每题2分
    const maxScore = totalQuestions * 2;

    // 跳转到结果页面
    wx.redirectTo({
      url: `/pages/practice-result/practice-result?sessionId=${this.data.sessionId}&levelId=${this.data.levelId}&levelName=${encodeURIComponent(this.data.levelName)}&sessionName=${encodeURIComponent(this.data.sessionName)}&language=${this.data.language}&typeId=${typeId}&typeName=${encodeURIComponent(this.data.typeName)}&score=${score}&maxScore=${maxScore}&correctCount=${correctCount}&totalCount=${totalQuestions}&results=${encodeURIComponent(JSON.stringify(results))}`
    });
  },

  // 获取用户选择的答案
  getUserAnswer: function(questionId) {
    return this.data.userAnswers[questionId] || '';
  }
});