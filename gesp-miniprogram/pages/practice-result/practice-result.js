// pages/practice-result/practice-result.js
Page({
  data: {
    sessionId: '',
    levelId: '',
    levelName: '',
    sessionName: '',
    language: 'C++',
    typeId: '',
    typeName: '',
    score: 0,
    maxScore: 0,
    correctCount: 0,
    totalCount: 0,
    results: [],
    resultGrid: []
  },

  onLoad: function (options) {
    const { 
      sessionId, levelId, levelName, sessionName, language, 
      typeId, typeName, score, maxScore, correctCount, totalCount, results 
    } = options;
    
    this.setData({
      sessionId: sessionId || '',
      levelId: levelId || '',
      levelName: decodeURIComponent(levelName || ''),
      sessionName: decodeURIComponent(sessionName || ''),
      language: language || 'C++',
      typeId: typeId || '',
      typeName: decodeURIComponent(typeName || ''),
      score: parseInt(score) || 0,
      maxScore: parseInt(maxScore) || 0,
      correctCount: parseInt(correctCount) || 0,
      totalCount: parseInt(totalCount) || 0,
      results: JSON.parse(decodeURIComponent(results || '[]'))
    });

    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: '刷题结果'
    });

    // 生成结果网格
    this.generateResultGrid();
  },

  // 生成结果网格
  generateResultGrid: function() {
    const { results, typeId } = this.data;
    const grid = [];
    
    // 根据题型确定网格布局
    const cols = typeId === 'choice' ? 5 : 5; // 选择题5列，判断题也5列
    
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      grid.push({
        index: i,
        questionIndex: result.questionIndex,
        isCorrect: result.isCorrect,
        questionId: result.questionId
      });
    }
    
    this.setData({
      resultGrid: grid
    });
  },

  // 点击结果圆圈
  onResultTap: function(e) {
    const index = e.currentTarget.dataset.index;
    const result = this.data.results[index];
    
    if (result) {
      // 跳转到题目详情页面
      wx.navigateTo({
        url: `/pages/question-detail/question-detail?sessionId=${this.data.sessionId}&levelId=${this.data.levelId}&language=${this.data.language}&questionId=${result.questionId}&userAnswer=${result.userAnswer}&showResult=true`
      });
    }
  },

  // 重新练习
  onRetry: function() {
    wx.redirectTo({
      url: `/pages/practice/practice?sessionId=${this.data.sessionId}&levelId=${this.data.levelId}&levelName=${encodeURIComponent(this.data.levelName)}&sessionName=${encodeURIComponent(this.data.sessionName)}&language=${this.data.language}&typeId=${this.data.typeId}&typeName=${encodeURIComponent(this.data.typeName)}`
    });
  },

  // 返回题型选择
  onBackToTypes: function() {
    wx.navigateBack({
      delta: 2
    });
  },

  // 返回首页
  onBackToHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});