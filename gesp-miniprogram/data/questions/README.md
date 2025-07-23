# GESP 真题数据目录

## 目录结构

```
data/questions/
├── level_1/          # 一级题目
│   ├── choice/       # 选择题
│   └── judge/        # 判断题
├── level_2/          # 二级题目
│   ├── choice/
│   └── judge/
├── level_3/          # 三级题目
│   ├── choice/
│   └── judge/
├── level_4/          # 四级题目
│   ├── choice/
│   └── judge/
├── level_5/          # 五级题目
│   ├── choice/
│   └── judge/
├── level_6/          # 六级题目
│   ├── choice/
│   └── judge/
├── level_7/          # 七级题目
│   ├── choice/
│   └── judge/
└── level_8/          # 八级题目
    ├── choice/
    └── judge/
```

## 文件命名规则

每个题目文件按照以下格式命名：
`{year}_{month}_{question_number}.json`

例如：
- `2024_12_01.json` - 2024年12月第1题
- `2024_09_15.json` - 2024年9月第15题

## 题目数据格式

详细的格式说明和示例请查看：
- **格式指南**：`examples/FORMAT_GUIDE.md`
- **示例文件**：`examples/` 目录下的各种示例

### 快速参考

#### 选择题格式
```json
{
  "id": "2024_12_01",
  "year": 2024,
  "month": 12,
  "level": 1,
  "type": "choice",
  "question": "题目内容",
  "code": "代码内容（可选）",
  "options": [
    {"key": "A", "value": "选项A"},
    {"key": "B", "value": "选项B"},
    {"key": "C", "value": "选项C"},
    {"key": "D", "value": "选项D"}
  ],
  "answer": "A",
  "explanation": "答案解析",
  "difficulty": 1,
  "tags": ["标签1", "标签2"]
}
```

#### 判断题格式
```json
{
  "id": "2024_12_01_judge",
  "year": 2024,
  "month": 12,
  "level": 1,
  "type": "judge",
  "question": "题目内容",
  "code": "代码内容（可选）",
  "answer": true,
  "explanation": "答案解析",
  "difficulty": 1,
  "tags": ["标签1", "标签2"]
}
```

## 字段说明

- `id`: 题目唯一标识符
- `year`: 考试年份
- `month`: 考试月份
- `level`: 等级（1-8）
- `type`: 题目类型（choice/judge）
- `question`: 题目内容
- `code`: 代码内容（可选，如果题目包含代码）
- `options`: 选择题选项（仅选择题）
- `answer`: 正确答案
- `explanation`: 答案解析
- `difficulty`: 难度等级（1-5）
- `tags`: 题目标签