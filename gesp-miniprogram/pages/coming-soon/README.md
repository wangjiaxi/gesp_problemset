# 敬请期待页面使用说明

## 功能介绍

敬请期待页面是一个通用的占位页面，用于在某个题目分类下暂时没有题目时显示给用户，提供友好的用户体验。

## 页面特性

- 🎨 **美观的UI设计**：渐变背景、动画效果、浮动装饰元素
- 📱 **响应式布局**：适配不同屏幕尺寸
- 🔄 **动态内容**：根据传入参数显示对应的分类信息
- 🏠 **便捷导航**：提供回到首页和返回上页的按钮
- 💬 **用户反馈**：提供联系我们的入口

## 使用方法

### 1. 直接跳转

```javascript
wx.navigateTo({
  url: '/pages/coming-soon/coming-soon?level=3&type=choice'
});
```

### 2. 使用工具函数（推荐）

```javascript
const questionUtils = require('../../utils/questionUtils.js');

// 自动检查题目是否存在，决定跳转到题目页面还是敬请期待页面
questionUtils.navigateToQuestions(level, type, this);
```

### 3. 在现有页面中集成

```javascript
// 检查题目是否存在
const questions = questionUtils.getMockQuestions(level, type);

if (questions.length > 0) {
  // 有题目，跳转到题目页面
  wx.navigateTo({
    url: '/pages/question-detail/question-detail?...'
  });
} else {
  // 没有题目，跳转到敬请期待页面
  wx.navigateTo({
    url: `/pages/coming-soon/coming-soon?level=${level}&type=${type}`
  });
}
```

## 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| level | number | 否 | 题目等级（1-8） |
| type | string | 否 | 题目类型（choice/judge/coding） |

## 页面元素

### 主要内容区域
- **图标区域**：主图标（🚧）+ 子图标动画（📚✏️💡）
- **文字内容**：标题、副标题、分类信息、描述文字
- **进度指示**：动画进度条 + 状态文字

### 操作按钮区域
- **回到首页**：使用 `wx.switchTab` 跳转到首页
- **返回上页**：使用 `wx.navigateBack` 返回上一页
- **联系我们**：显示联系方式弹窗

### 装饰元素
- 浮动的装饰图标（📖🎯⭐🔥）
- 渐变背景色
- 各种动画效果

## 动画效果

1. **bounce动画**：主图标上下弹跳
2. **float动画**：子图标浮动效果
3. **progress动画**：进度条动态填充
4. **floatAround动画**：装饰元素环绕移动

## 自定义配置

### 修改样式
编辑 `coming-soon.wxss` 文件：
- 修改背景渐变色
- 调整动画参数
- 更改字体大小和颜色

### 修改内容
编辑 `coming-soon.js` 文件：
- 修改默认文案
- 添加新的操作按钮
- 自定义分类名称映射

### 添加新功能
- 在 `coming-soon.wxml` 中添加新的UI元素
- 在 `coming-soon.js` 中添加对应的事件处理函数

## 最佳实践

1. **统一使用工具函数**：使用 `questionUtils.navigateToQuestions()` 确保逻辑一致
2. **合理设置参数**：传入正确的 level 和 type 参数以显示准确信息
3. **用户体验优化**：在题目加载前先检查是否存在，避免用户进入空页面
4. **及时更新**：当添加新题目后，及时更新 `questionUtils.js` 中的逻辑

## 演示页面

访问 `/pages/demo-coming-soon/demo-coming-soon` 查看功能演示。

## 相关文件

- `pages/coming-soon/coming-soon.js` - 页面逻辑
- `pages/coming-soon/coming-soon.wxml` - 页面结构
- `pages/coming-soon/coming-soon.wxss` - 页面样式
- `pages/coming-soon/coming-soon.json` - 页面配置
- `utils/questionUtils.js` - 题目工具函数
- `utils/util.js` - 通用工具函数