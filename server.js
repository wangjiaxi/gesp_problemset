const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'question-manager')));

// 保存轮播图配置的路由
app.post('/save-carousel-config', (req, res) => {
    try {
        // 确保小程序的carousel目录存在
        const carouselDir = path.join(__dirname, 'gesp-miniprogram', 'data', 'carousel');
        if (!fs.existsSync(carouselDir)) {
            fs.mkdirSync(carouselDir, { recursive: true });
        }

        // 配置文件路径
        const configPath = path.join(carouselDir, 'carousel_config.json');

        // 写入配置文件
        fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));

        res.status(200).send('轮播图配置已成功保存到小程序目录');
    } catch (error) {
        console.error('保存轮播图配置时出错:', error);
        res.status(500).send('保存轮播图配置失败: ' + error.message);
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`后台管理界面: http://localhost:${PORT}`);
});