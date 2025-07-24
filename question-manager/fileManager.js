// fileManager.js - 文件管理工具
class FileManager {
  constructor() {
    this.questionsFilePath = '../gesp-miniprogram/questions_data.js';
    this.questions = [];
    this.banners = [];
    this.levels = [];
  }

  // 从文件加载数据
  async loadDataFromFile() {
    try {
      // 这里使用文件选择器让用户选择questions_data.js文件
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.js';
      
      return new Promise((resolve, reject) => {
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (!file) {
            reject('未选择文件');
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              // 解析JS文件内容
              const content = event.target.result;
              const data = this.parseJSFile(content);
              
              this.questions = data.questions || [];
              this.banners = data.banners || [];
              this.levels = data.levels || [];
              
              resolve(data);
            } catch (error) {
              reject('文件解析失败: ' + error.message);
            }
          };
          
          reader.onerror = () => reject('文件读取失败');
          reader.readAsText(file);
        };
        
        input.click();
      });
    } catch (error) {
      throw new Error('加载文件失败: ' + error.message);
    }
  }

  // 解析JS文件内容
  parseJSFile(content) {
    try {
      // 提取module.exports的内容
      const match = content.match(/module\.exports\s*=\s*({[\s\S]*});?\s*$/);
      if (!match) {
        throw new Error('无效的JS文件格式');
      }

      // 使用Function构造器安全地执行代码
      const dataStr = match[1];
      const func = new Function('return ' + dataStr);
      return func();
    } catch (error) {
      throw new Error('JS文件解析失败: ' + error.message);
    }
  }

  // 生成JS文件内容
  generateJSFileContent() {
    const data = {
      questions: this.questions,
      banners: this.banners,
      levels: this.levels
    };

    return `// questions_data.js - 本地题目数据
module.exports = ${JSON.stringify(data, null, 2)};`;
  }

  // 导出数据到文件
  exportToFile() {
    try {
      const content = this.generateJSFileContent();
      const blob = new Blob([content], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'questions_data.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('导出失败:', error);
      return false;
    }
  }

  // 导出JSON格式（备份用）
  exportToJSON() {
    try {
      const data = {
        questions: this.questions,
        banners: this.banners,
        levels: this.levels,
        exportTime: new Date().toISOString()
      };
      
      const content = JSON.stringify(data, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `gesp_questions_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('JSON导出失败:', error);
      return false;
    }
  }

  // 从JSON导入数据
  async importFromJSON() {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      return new Promise((resolve, reject) => {
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (!file) {
            reject('未选择文件');
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const data = JSON.parse(event.target.result);
              
              this.questions = data.questions || [];
              this.banners = data.banners || [];
              this.levels = data.levels || [];
              
              resolve(data);
            } catch (error) {
              reject('JSON文件解析失败: ' + error.message);
            }
          };
          
          reader.onerror = () => reject('文件读取失败');
          reader.readAsText(file);
        };
        
        input.click();
      });
    } catch (error) {
      throw new Error('导入JSON失败: ' + error.message);
    }
  }

  // 添加题目
  addQuestion(question) {
    // 确保ID唯一
    if (this.questions.find(q => q.id === question.id)) {
      throw new Error('题目ID已存在');
    }
    
    this.questions.push(question);
    return true;
  }

  // 更新题目
  updateQuestion(questionId, updatedQuestion) {
    const index = this.questions.findIndex(q => q.id === questionId);
    if (index === -1) {
      throw new Error('题目不存在');
    }
    
    this.questions[index] = { ...updatedQuestion };
    return true;
  }

  // 删除题目
  deleteQuestion(questionId) {
    const index = this.questions.findIndex(q => q.id === questionId);
    if (index === -1) {
      throw new Error('题目不存在');
    }
    
    this.questions.splice(index, 1);
    return true;
  }

  // 获取所有题目
  getAllQuestions() {
    return this.questions;
  }

  // 筛选题目
  filterQuestions(filters) {
    let filtered = this.questions;
    
    if (filters.level && filters.level !== 'all') {
      filtered = filtered.filter(q => q.level === parseInt(filters.level));
    }
    
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(q => q.type === filters.type);
    }
    
    if (filters.search) {
      const keyword = filters.search.toLowerCase();
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(keyword) ||
        q.explanation.toLowerCase().includes(keyword) ||
        (q.tags && q.tags.some(tag => tag.toLowerCase().includes(keyword)))
      );
    }
    
    return filtered;
  }

  // 生成新的题目ID
  generateQuestionId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
    
    return `${year}_${month}_${day}_${time}`;
  }

  // 验证题目数据
  validateQuestion(question) {
    const errors = [];
    
    if (!question.id || question.id.trim() === '') {
      errors.push('题目ID不能为空');
    }
    
    if (!question.question || question.question.trim() === '') {
      errors.push('题目内容不能为空');
    }
    
    if (!question.level || question.level < 1 || question.level > 8) {
      errors.push('等级必须在1-8之间');
    }
    
    if (!['choice', 'judge'].includes(question.type)) {
      errors.push('题目类型必须是choice或judge');
    }
    
    if (question.type === 'choice') {
      if (!question.options || question.options.length < 2) {
        errors.push('选择题至少需要2个选项');
      }
    }
    
    if (!question.answer || question.answer.trim() === '') {
      errors.push('答案不能为空');
    }
    
    return errors;
  }
}

// 导出单例
window.fileManager = new FileManager();