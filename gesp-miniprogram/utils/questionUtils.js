// utils/questionUtils.js

/**
 * 检查指定分类下是否有题目
 * @param {number} level - 等级 (1-8)
 * @param {string} type - 题目类型 ('choice' 或 'judge')
 * @returns {Promise<boolean>} - 是否有题目
 */
function checkQuestionsExist(level, type) {
  return new Promise((resolve) => {
    // 构建文件路径
    const basePath = `/data/questions/level_${level}/${type}/`;
    
    // 尝试读取目录下的文件
    wx.getFileSystemManager().readdir({
      dirPath: `${wx.env.USER_DATA_PATH}/../${basePath}`,
      success: (res) => {
        // 过滤出JSON文件
        const jsonFiles = res.files.filter(file => file.endsWith('.json'));
        resolve(jsonFiles.length > 0);
      },
      fail: () => {
        // 如果读取失败，尝试通过网络请求检查
        checkQuestionsViaRequest(level, type).then(resolve);
      }
    });
  });
}

/**
 * 通过网络请求检查题目是否存在（备用方案）
 * @param {number} level - 等级
 * @param {string} type - 题目类型
 * @returns {Promise<boolean>}
 */
function checkQuestionsViaRequest(level, type) {
  return new Promise((resolve) => {
    // 尝试请求一个可能存在的题目文件
    const testFiles = [
      `2024_12_01.json`,
      `2024_09_01.json`,
      `2024_06_01.json`,
      `2023_12_01.json`
    ];
    
    let checkedCount = 0;
    let hasQuestions = false;
    
    testFiles.forEach(filename => {
      wx.request({
        url: `/data/questions/level_${level}/${type}/${filename}`,
        method: 'GET',
        success: () => {
          hasQuestions = true;
          resolve(true);
        },
        fail: () => {
          checkedCount++;
          if (checkedCount === testFiles.length && !hasQuestions) {
            resolve(false);
          }
        }
      });
    });
    
    // 如果所有请求都失败，则认为没有题目
    setTimeout(() => {
      if (checkedCount === testFiles.length && !hasQuestions) {
        resolve(false);
      }
    }, 2000);
  });
}

/**
 * 获取指定分类下的所有题目
 * @param {number} level - 等级
 * @param {string} type - 题目类型
 * @returns {Promise<Array>} - 题目列表
 */
function getQuestionsByCategory(level, type) {
  return new Promise((resolve, reject) => {
    // 这里应该实现获取题目的逻辑
    // 目前返回模拟数据，实际应该从云数据库或本地文件获取
    
    const mockQuestions = getMockQuestions(level, type);
    
    if (mockQuestions.length > 0) {
      resolve(mockQuestions);
    } else {
      reject(new Error('No questions found'));
    }
  });
}

/**
 * 获取题目数据
 * @param {number} level - 等级
 * @param {string} type - 题目类型
 * @returns {Array} - 题目列表
 */
function getMockQuestions(level, type) {
  if (level === 1 && type === 'choice') {
    return [
  {
    "id": "2024_12_01",
    "year": 2024,
    "month": 12,
    "level": 1,
    "type": "choice",
    "question": "以下哪个是Python中正确的变量命名？",
    "options": [
      {
        "key": "A",
        "value": "2name"
      },
      {
        "key": "B",
        "value": "my_name"
      },
      {
        "key": "C",
        "value": "my-name"
      },
      {
        "key": "D",
        "value": "class"
      }
    ],
    "answer": "B",
    "explanation": "Python变量命名规则：只能包含字母、数字和下划线，不能以数字开头，不能使用关键字。选项B符合规则。",
    "difficulty": 1,
    "tags": [
      "变量命名",
      "基础语法"
    ]
  },
  {
    "question": "2025年4月19日在北京举行了一场颇为瞩目的人形机器人半程马拉松赛。比赛期间，跑动着的机器人会利用身上安装的多个传感器所反馈的数据来调整姿态、保持平衡等，那么这类传感器类似于计算机的( )。",
    "code": "",
    "type": "choice",
    "level": 1,
    "score": 2,
    "difficulty": 1,
    "year": 2025,
    "month": 6,
    "explanation": "",
    "tags": [],
    "options": [
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
    "answer": "C",
    "id": "2025_06_01"
  }
];
  }
  if (level === 1 && type === 'judge') {
    return [
  {
    "id": "2024_12_01_judge",
    "year": 2024,
    "month": 12,
    "level": 1,
    "type": "judge",
    "question": "Python中的变量在使用前必须先声明。",
    "answer": false,
    "explanation": "Python是动态类型语言，变量在使用前不需要声明，直接赋值即可创建变量。",
    "difficulty": 1,
    "tags": [
      "变量",
      "基础概念"
    ]
  }
];
  }
  if (level === 2 && type === 'choice') {
    return [
  {
    "id": "2024_12_02",
    "year": 2024,
    "month": 12,
    "level": 2,
    "type": "choice",
    "question": "以下代码的输出结果是什么？",
    "code": "def func(x):\n    if x > 0:\n        return x * 2\n    else:\n        return x + 1\n\nprint(func(-3))",
    "options": [
      {
        "key": "A",
        "value": "-6"
      },
      {
        "key": "B",
        "value": "-2"
      },
      {
        "key": "C",
        "value": "-1"
      },
      {
        "key": "D",
        "value": "0"
      }
    ],
    "answer": "B",
    "explanation": "当x=-3时，x < 0，所以执行else分支，返回x+1=-3+1=-2。",
    "difficulty": 2,
    "tags": [
      "函数",
      "条件语句",
      "代码分析"
    ]
  }
];
  }
  
  // 其他分类返回空数组
  return [];
}

/**
 * 获取分类显示名称
 * @param {number} level - 等级
 * @param {string} type - 题目类型
 * @returns {string} - 显示名称
 */
function getCategoryDisplayName(level, type) {
  const typeMap = {
    'choice': '选择题',
    'judge': '判断题',
    'coding': '编程题'
  };
  
  return `Level ${level} ${typeMap[type] || type}`;
}

/**
 * 导航到题目页面
 * @param {number} level - 等级
 * @param {string} type - 题目类型
 */
function navigateToQuestions(level, type) {
  wx.navigateTo({
    url: `/pages/question-time/question-time?level=${level}&type=${type}`
  });
}

module.exports = {
  checkQuestionsExist,
  getQuestionsByCategory,
  navigateToQuestions,
  getCategoryDisplayName,
  getMockQuestions
};