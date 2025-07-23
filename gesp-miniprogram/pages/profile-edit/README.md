# 用户资料编辑页面功能说明

## 🎯 功能特性

### 1. 头像设置
- **点击头像**：弹出选择菜单
  - 使用微信头像：获取用户微信头像
  - 从相册选择：选择本地图片作为头像
- **头像预览**：点击头像可预览大图
- **本地存储**：头像仅保存在本地，不上传服务器

### 2. 昵称设置
- **点击昵称**：弹出选择菜单
  - 使用微信昵称：获取用户微信昵称
  - 自定义输入：手动输入个性化昵称
- **输入验证**：
  - 昵称不能为空
  - 昵称不能超过20个字符
- **本地存储**：昵称仅保存在本地

### 3. 隐私保护
- **本地存储**：所有用户信息仅在本地存储
- **不采集数据**：不会上传到服务器或进行数据采集
- **用户控制**：用户完全控制自己的头像和昵称信息

## 📱 页面结构

### 头像区域
- 头像显示和编辑
- 操作提示文字
- 支持预览功能

### 昵称区域
- 昵称显示和编辑
- 操作提示文字
- 输入验证反馈

### 预览区域
- 实时预览用户信息效果
- 模拟在其他页面的显示效果

### 隐私说明
- 明确的隐私保护说明
- 数据存储方式说明

### 操作按钮
- 重置信息功能
- 确认操作提示

## 🔧 技术实现

### 头像处理
```javascript
// 使用微信头像
wx.getUserProfile({
  desc: '用于完善用户资料',
  success: (res) => {
    // 获取微信头像URL
    const avatarUrl = res.userInfo.avatarUrl;
    // 保存到本地存储
    this.updateUserInfo({ avatarUrl });
  }
});

// 从相册选择
wx.chooseMedia({
  count: 1,
  mediaType: ['image'],
  sourceType: ['album'],
  success: (res) => {
    // 获取本地图片路径
    const tempFilePath = res.tempFiles[0].tempFilePath;
    // 保存到本地存储
    this.updateUserInfo({ avatarUrl: tempFilePath });
  }
});
```

### 昵称处理
```javascript
// 使用微信昵称
wx.getUserProfile({
  desc: '用于完善用户资料',
  success: (res) => {
    const nickName = res.userInfo.nickName;
    this.updateUserInfo({ nickName });
  }
});

// 自定义输入
wx.showModal({
  title: '设置昵称',
  editable: true,
  success: (res) => {
    if (res.confirm && res.content) {
      const nickName = res.content.trim();
      // 验证昵称格式
      if (this.validateNickName(nickName)) {
        this.updateUserInfo({ nickName });
      }
    }
  }
});
```

### 本地存储
```javascript
// 保存用户信息到本地
updateUserInfo: function(newUserInfo) {
  const util = require('../../utils/util.js');
  util.setStorage('localUserInfo', newUserInfo);
  
  // 更新页面数据
  this.setData({ userInfo: newUserInfo });
  
  // 通知其他页面更新
  const app = getApp();
  app.globalData.userInfo = newUserInfo;
}
```

## 🎨 用户体验

### 交互设计
- **直观操作**：点击即可编辑
- **清晰反馈**：操作结果即时显示
- **友好提示**：详细的操作说明
- **预览效果**：实时查看设置效果

### 视觉设计
- **简洁界面**：清晰的信息层次
- **一致风格**：与整体应用保持统一
- **响应式布局**：适配不同屏幕尺寸

## 🔒 隐私保护

### 数据处理原则
1. **本地优先**：所有数据仅在本地处理和存储
2. **用户控制**：用户完全控制自己的信息
3. **透明说明**：明确告知数据处理方式
4. **最小权限**：只获取必要的用户信息

### 存储方式
- 使用微信小程序本地存储API
- 数据存储在用户设备本地
- 不会上传到任何服务器
- 用户可随时清除数据

## 🚀 使用方法

### 从个人中心进入
```javascript
// 在个人中心页面添加编辑入口
wx.navigateTo({
  url: '/pages/profile-edit/profile-edit'
});
```

### 组件集成
```javascript
// 在用户信息组件中添加编辑功能
goToEditProfile: function() {
  wx.navigateTo({
    url: '/pages/profile-edit/profile-edit'
  });
}
```

## 📊 功能流程

### 头像设置流程
1. 用户点击头像
2. 显示选择菜单
3. 用户选择头像来源
4. 获取头像数据
5. 保存到本地存储
6. 更新页面显示

### 昵称设置流程
1. 用户点击昵称
2. 显示选择菜单
3. 用户选择昵称来源
4. 获取或输入昵称
5. 验证昵称格式
6. 保存到本地存储
7. 更新页面显示

## 🔮 扩展功能

### 可能的扩展
- **头像裁剪**：添加图片裁剪功能
- **头像滤镜**：提供头像美化选项
- **昵称建议**：智能昵称推荐
- **个性签名**：添加个人签名功能
- **主题设置**：个性化界面主题

### 技术优化
- **图片压缩**：优化头像文件大小
- **缓存管理**：智能清理过期数据
- **性能优化**：提升页面加载速度
- **错误处理**：完善异常情况处理

## 📝 注意事项

### 开发注意
1. **权限申请**：正确申请相册和用户信息权限
2. **错误处理**：处理用户拒绝授权的情况
3. **数据验证**：验证用户输入的合法性
4. **存储管理**：合理管理本地存储空间

### 用户体验
1. **操作引导**：提供清晰的操作指引
2. **反馈及时**：及时反馈操作结果
3. **错误提示**：友好的错误提示信息
4. **隐私说明**：明确的隐私保护说明

这个用户资料编辑系统完全符合隐私保护要求，所有数据仅在本地存储和显示，为用户提供了安全、便捷的个人信息管理功能。