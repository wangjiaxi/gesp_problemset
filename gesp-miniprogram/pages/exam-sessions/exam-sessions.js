// pages/exam-sessions/exam-sessions.js
Page({
  data: {
    levelId: '',
    levelName: '',
    examSessions: []
  },

  onLoad: function (options) {
    const { levelId, levelName } = options;
    this.setData({
      levelId: levelId || '',
      levelName: decodeURIComponent(levelName || '')
    });
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: `${this.data.levelName} - 选择考试场次`
    });

    // 生成考试场次列表
    this.generateExamSessions();
  },

  // 生成考试场次列表
  generateExamSessions: function() {
    const sessions = [];
    const startYear = 2023;
    const endYear = 2025;
    const endMonth = 12; // 改为12月结束
    
    // GESP考试在每年的3月、6月、9月、12月举行
    const examMonths = [3, 6, 9, 12];
    
    for (let year = startYear; year <= endYear; year++) {
      for (let month of examMonths) {
        // 如果是结束年份，只生成到指定月份
        if (year === endYear && month > endMonth) {
          break;
        }
        
        // 如果是开始年份，从3月开始
        if (year === startYear && month < 3) {
          continue;
        }
        
        const sessionId = `${year}${month.toString().padStart(2, '0')}`;
        const monthName = `${month}月`;
        
        sessions.push({
          id: sessionId,
          year: year,
          month: month,
          displayName: `${year}年${monthName}`,
          date: `${year}-${month.toString().padStart(2, '0')}-15`, // 假设考试日期为每月15日
          status: this.getSessionStatus(year, month),
          languages: ['C++'] // 支持的编程语言
        });
      }
    }
    
    this.setData({
      examSessions: sessions
    });
  },

  // 获取考试场次状态
  getSessionStatus: function(year, month) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return 'completed'; // 已结束
    } else if (year === currentYear && month === currentMonth) {
      return 'ongoing'; // 进行中
    } else {
      return 'upcoming'; // 即将开始
    }
  },

  // 点击考试场次
  onSessionTap: function(e) {
    const session = e.currentTarget.dataset.session;
    const levelId = this.data.levelId.replace('level_', ''); // 移除level_前缀
    
    // 直接跳转到题型选择页面（只有C++，不需要语言选择）
    wx.navigateTo({
      url: `/pages/question-type/question-type?sessionId=${session.id}&levelId=${levelId}&levelName=${encodeURIComponent(this.data.levelName)}&sessionName=${encodeURIComponent(session.displayName)}&language=C++`
    });
  },

  // 获取状态显示文本
  getStatusText: function(status) {
    switch(status) {
      case 'completed': return '已结束';
      case 'ongoing': return '进行中';
      case 'upcoming': return '即将开始';
      default: return '';
    }
  },

  // 获取状态颜色
  getStatusColor: function(status) {
    switch(status) {
      case 'completed': return '#52C41A';
      case 'ongoing': return '#1890FF';
      case 'upcoming': return '#FAAD14';
      default: return '#999999';
    }
  }
});