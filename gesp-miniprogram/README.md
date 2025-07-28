# GESP刷题小程序 v2.0.0

> 专为GESP（全国青少年软件编程等级考试）打造的C++刷题练习小程序

## 🎯 版本2.0.0 新特性

### ✨ 完整刷题系统
- **考试场次选择**：支持2023-2025年各月份考试场次（3月、6月、9月、12月）
- **题型分类练习**：选择题和判断题分类练习
- **实时刷题体验**：流畅的答题界面，支持上一题/下一题导航
- **智能结果展示**：分数统计 + 红绿圆圈可视化答题结果

### 🛠️ 题目管理系统
- **JSON数据存储**：题目按 `{年份}{月份}C{等级}.json` 格式存储
- **可视化编辑器**：HTML题目编辑器，支持在线编辑和导出
- **分级管理**：支持1-8级题目分类管理
- **标签系统**：题目支持多标签分类

### 📱 用户体验优化
- **微信官方API**：使用最新的头像和昵称获取方式
- **响应式设计**：适配不同屏幕尺寸
- **流畅动画**：页面切换和交互动画优化
- **实时反馈**：操作状态实时提示

## 📁 项目结构

```
gesp-miniprogram/
├── admin/                    # 管理工具
│   └── question-editor.html # 题目编辑器
├── data/                     # 数据文件
│   ├── banners.js           # 轮播图数据
│   └── problems/            # 题目数据目录
│       ├── 202303C1.json    # 2023年3月一级题目
│       ├── 202303C2.json    # 2023年3月二级题目
│       └── ...
├── pages/                    # 页面文件
│   ├── index/               # 首页
│   ├── exam-sessions/       # 考试场次选择
│   ├── question-type/       # 题型选择
│   ├── practice/            # 刷题练习
│   ├── practice-result/     # 刷题结果
│   ├── profile-edit/        # 个人资料编辑
│   └── ...
├── utils/                   # 工具类
│   ├── problemManager.js   # 题目管理器
│   └── util.js             # 通用工具
└── ...
```

## 🚀 快速开始

### 1. 环境准备
- 微信开发者工具
- Node.js (可选，用于题目编辑器)

### 2. 导入项目
1. 下载项目代码
2. 在微信开发者工具中导入项目
3. 配置AppID（测试可使用测试号）

### 3. 题目管理
1. 打开 `admin/question-editor.html`
2. 选择考试场次和等级
3. 添加/编辑题目
4. 导出JSON文件到 `data/problems/` 目录

## 📊 数据格式

### 题目文件格式 (JSON)
```json
{
  "examInfo": {
    "year": 2023,
    "month": 3,
    "language": "C++",
    "level": 1,
    "examDate": "2023-03-18",
    "duration": 60,
    "totalQuestions": 15,
    "passingScore": 60
  },
  "questions": [
    {
      "id": "202303C1_01",
      "type": "choice",
      "question": "题目内容",
      "options": [
        {"key": "A", "value": "选项A"},
        {"key": "B", "value": "选项B"},
        {"key": "C", "value": "选项C"},
        {"key": "D", "value": "选项D"}
      ],
      "answer": "B",
      "explanation": "答案解析",
      "difficulty": 1,
      "tags": ["标签1", "标签2"],
      "points": 2
    }
  ]
}
```

## 🎮 使用流程

1. **选择等级** → 首页选择要练习的等级
2. **选择场次** → 选择具体的考试场次
3. **选择题型** → 选择选择题或判断题
4. **开始刷题** → 进入答题界面
5. **查看结果** → 完成后查看分数和详情

## 🔧 技术特性

- **原生小程序开发**：使用微信小程序原生框架
- **模块化设计**：页面和工具类分离，便于维护
- **数据驱动**：JSON配置驱动的题目系统
- **响应式布局**：适配不同设备屏幕
- **性能优化**：图片懒加载、数据缓存等优化

## 📈 版本历史

### v2.0.0 (2025-01-28)
- ✅ 完整刷题系统上线
- ✅ 题目编辑器工具
- ✅ 考试场次管理
- ✅ 微信官方API集成

### v1.0.0 (2024-12-XX)
- ✅ 基础框架搭建
- ✅ 题目展示功能
- ✅ 用户资料管理

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目地址：[GitHub](https://github.com/wangjiaxi/gesp_problemset)
- 问题反馈：[Issues](https://github.com/wangjiaxi/gesp_problemset/issues)

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！