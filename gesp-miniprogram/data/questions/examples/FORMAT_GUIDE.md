# GESP 题目格式指南

## 📁 文件位置
题目文件应放置在对应的目录中：
```
gesp-miniprogram/data/questions/
├── level_1/choice/    # Level 1 选择题
├── level_1/judge/     # Level 1 判断题
├── level_2/choice/    # Level 2 选择题
├── level_2/judge/     # Level 2 判断题
...
└── level_8/judge/     # Level 8 判断题
```

## 📝 文件命名规则
- 选择题：`{year}_{month}_{question_number}.json`
- 判断题：`{year}_{month}_{question_number}_judge.json`

示例：
- `2024_12_01.json` - 2024年12月第1题选择题
- `2024_12_01_judge.json` - 2024年12月第1题判断题

## 🔧 字段说明

### 必填字段
| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | string | 题目唯一标识符 | `"2024_12_01"` |
| `year` | number | 考试年份 | `2024` |
| `month` | number | 考试月份 | `12` |
| `level` | number | 等级（1-8） | `1` |
| `type` | string | 题目类型 | `"choice"` 或 `"judge"` |
| `question` | string | 题目内容 | `"以下哪个是正确的？"` |
| `answer` | string/boolean | 正确答案 | 选择题用`"A"`，判断题用`true`/`false` |
| `explanation` | string | 答案解析 | `"因为..."` |
| `difficulty` | number | 难度等级（1-5） | `1` |
| `tags` | array | 题目标签 | `["变量", "基础语法"]` |

### 选择题专用字段
| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `options` | array | 选项列表 | `[{"key": "A", "value": "选项A"}]` |

### 可选字段
| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `code` | string | 代码内容 | `"print('Hello')"` |

## 📋 格式示例

### 1. 基础选择题
```json
{
  "id": "2024_12_01",
  "year": 2024,
  "month": 12,
  "level": 1,
  "type": "choice",
  "question": "以下哪个是Python中正确的变量命名？",
  "options": [
    {"key": "A", "value": "2name"},
    {"key": "B", "value": "my_name"},
    {"key": "C", "value": "my-name"},
    {"key": "D", "value": "class"}
  ],
  "answer": "B",
  "explanation": "Python变量命名规则：只能包含字母、数字和下划线，不能以数字开头，不能使用关键字。选项B符合规则。",
  "difficulty": 1,
  "tags": ["变量命名", "基础语法"]
}
```

### 2. 基础判断题
```json
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
  "tags": ["变量", "基础概念"]
}
```

### 3. 包含代码的选择题
```json
{
  "id": "2024_12_02",
  "year": 2024,
  "month": 12,
  "level": 2,
  "type": "choice",
  "question": "以下代码的输出结果是什么？",
  "code": "def func(x):\n    if x > 0:\n        return x * 2\n    else:\n        return x + 1\n\nprint(func(-3))",
  "options": [
    {"key": "A", "value": "-6"},
    {"key": "B", "value": "-2"},
    {"key": "C", "value": "-1"},
    {"key": "D", "value": "0"}
  ],
  "answer": "B",
  "explanation": "当x=-3时，x < 0，所以执行else分支，返回x+1=-3+1=-2。",
  "difficulty": 2,
  "tags": ["函数", "条件语句", "代码分析"]
}
```

### 4. 包含代码的判断题
```json
{
  "id": "2024_12_03_judge",
  "year": 2024,
  "month": 12,
  "level": 3,
  "type": "judge",
  "question": "以下代码执行后，变量x的值为10。",
  "code": "x = 5\ny = x\ny = 10\nprint(x)",
  "answer": false,
  "explanation": "在Python中，整数是不可变对象。y = x 是将x的值赋给y，而不是创建引用。当y = 10时，只是改变了y的值，x仍然是5。",
  "difficulty": 3,
  "tags": ["变量赋值", "不可变对象", "引用"]
}
```

## ⚠️ 注意事项

### 代码格式
- 使用 `\n` 表示换行
- 保持代码的正确缩进
- 确保代码语法正确

### 选项格式
- 选择题必须包含 `options` 字段
- 每个选项包含 `key`（A、B、C、D）和 `value`（选项内容）
- 答案字段 `answer` 应对应选项的 `key`

### 答案格式
- 选择题：使用字符串，如 `"A"`、`"B"`、`"C"`、`"D"`
- 判断题：使用布尔值，`true` 或 `false`

### 标签建议
常用标签分类：
- **基础概念**：变量、数据类型、运算符
- **控制结构**：条件语句、循环、函数
- **数据结构**：列表、字典、元组、集合
- **面向对象**：类、对象、继承、多态
- **算法**：排序、查找、递归、动态规划
- **高级特性**：装饰器、生成器、异常处理

### 难度等级
- **1级**：基础概念和语法
- **2级**：简单的逻辑和计算
- **3级**：中等复杂度的程序理解
- **4级**：复杂的算法和数据结构
- **5级**：高级特性和综合应用

## 📂 示例文件
本目录包含以下示例文件：
- `choice-example.json` - 基础选择题示例
- `judge-example.json` - 基础判断题示例
- `choice-with-code-example.json` - 包含代码的选择题示例
- `judge-with-code-example.json` - 包含代码的判断题示例
- `advanced-choice-example.json` - 高级选择题示例
- `list-operation-example.json` - 列表操作题目示例

## 🔄 更新题目数据
添加新题目后，需要更新 `utils/questionUtils.js` 文件中的 `getMockQuestions()` 函数，添加对应的题目数据。