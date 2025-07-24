// questions_data.js - 本地题目数据
module.exports = {
  // 题目数据
  questions: [
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
      "id": "2024_12_02",
      "year": 2024,
      "month": 12,
      "level": 1,
      "type": "judge",
      "question": "Python是一种编译型语言。",
      "options": [],
      "answer": "false",
      "explanation": "Python是一种解释型语言，不需要编译成机器码即可运行。",
      "difficulty": 1,
      "tags": [
        "语言特性",
        "基础概念"
      ]
    },
    {
      "id": "202506c1xz01",
      "year": 2025,
      "month": 6,
      "level": 1,
      "type": "choice",
      "question": "2025年4月19日在北京举行了一场颇为瞩目的人形机器人半程马拉松赛。比赛期间，跑动着的机器人会利用身上安装的多个传感器所反馈的数据来调整姿态、保持平衡等，那么这类传感器类似于计算机的( )。",
      "answer": "C",
      "explanation": "传感器用于收集外部信息并输入到系统中，类似于计算机的输入设备。",
      "difficulty": 1,
      "options": [
        {
          "key": "A",
          "value": "处理器"
        },
        {
          "key": "B",
          "value": "存储器"
        },
        {
          "key": "C",
          "value": "输入设备"
        },
        {
          "key": "D",
          "value": "输出设备"
        }
      ],
      "tags": ["计算机组成", "硬件概念"],
      "codeBlock": null,
      "images": []
    },
    // 添加更多测试题目
    {
      "id": "2024_12_03",
      "year": 2024,
      "month": 12,
      "level": 2,
      "type": "choice",
      "question": "在Python中，以下哪个数据类型是可变的？",
      "options": [
        {"key": "A", "value": "字符串(str)"},
        {"key": "B", "value": "元组(tuple)"},
        {"key": "C", "value": "列表(list)"},
        {"key": "D", "value": "整数(int)"}
      ],
      "answer": "C",
      "explanation": "列表(list)是可变数据类型，可以修改其内容。字符串、元组和整数都是不可变类型。",
      "difficulty": 1,
      "tags": ["数据类型", "可变性"]
    },
    {
      "id": "2024_12_04",
      "year": 2024,
      "month": 12,
      "level": 2,
      "type": "judge",
      "question": "Python中的字典是有序的数据结构。",
      "options": [],
      "answer": "true",
      "explanation": "从Python 3.7开始，字典保持插入顺序，是有序的数据结构。",
      "difficulty": 1,
      "tags": ["字典", "数据结构"]
    },
    {
      "id": "2024_12_05",
      "year": 2024,
      "month": 12,
      "level": 3,
      "type": "choice",
      "question": "以下哪个算法的时间复杂度是O(n²)？",
      "options": [
        {"key": "A", "value": "二分查找"},
        {"key": "B", "value": "冒泡排序"},
        {"key": "C", "value": "快速排序(最好情况)"},
        {"key": "D", "value": "线性查找"}
      ],
      "answer": "B",
      "explanation": "冒泡排序需要两层嵌套循环，时间复杂度为O(n²)。",
      "difficulty": 2,
      "tags": ["算法", "时间复杂度", "排序"]
    },
    {
      "id": "2024_12_06",
      "year": 2024,
      "month": 12,
      "level": 3,
      "type": "judge",
      "question": "递归算法一定比迭代算法效率高。",
      "options": [],
      "answer": "false",
      "explanation": "递归算法不一定比迭代算法效率高，递归可能存在重复计算和栈溢出的问题。",
      "difficulty": 2,
      "tags": ["递归", "算法效率"]
    }
  ],

  // 轮播图数据
  banners: [
    {
      "id": "banner_1",
      "image": "/images/banner1.jpg",
      "title": "GESP等级考试",
      "url": "/pages/coming-soon/coming-soon"
    },
    {
      "id": "banner_2", 
      "image": "/images/banner2.jpg",
      "title": "编程练习",
      "url": "/pages/coming-soon/coming-soon"
    }
  ],

  // 等级配置
  levels: [
    { id: 1, name: '一级', color: '#FF6B6B', description: '基础编程概念' },
    { id: 2, name: '二级', color: '#4ECDC4', description: '简单算法与数据结构' },
    { id: 3, name: '三级', color: '#45B7D1', description: '程序设计基础' },
    { id: 4, name: '四级', color: '#96CEB4', description: '算法设计与分析' },
    { id: 5, name: '五级', color: '#FFEAA7', description: '高级数据结构' },
    { id: 6, name: '六级', color: '#DDA0DD', description: '复杂算法应用' },
    { id: 7, name: '七级', color: '#98D8C8', description: '系统设计思维' },
    { id: 8, name: '八级', color: '#F7DC6F', description: '综合项目实践' }
  ]
};