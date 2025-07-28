// data/banners.js - 轮播图数据管理
module.exports = {
    // 轮播图数据
    banners: [
        {
            "id": "banner_1",
            "image": "/images/banner1.jpg",
            "title": "GESP等级考试",
            "subtitle": "专业编程能力认证",
            "url": "/pages/coming-soon/coming-soon"
        },
        {
            "id": "banner_2",
            "image": "/images/banner2.jpg",
            "title": "编程练习",
            "subtitle": "提升编程技能",
            "url": "/pages/coming-soon/coming-soon"
        },
        {
            "id": "banner_3",
            "image": "/images/banner3.jpg",
            "title": "算法训练",
            "subtitle": "掌握核心算法",
            "url": "/pages/coming-soon/coming-soon"
        }
    ],

    // 轮播图配置
    config: {
        interval: 3000,           // 自动切换时间间隔(ms)
        duration: 500,            // 滑动动画时长(ms)
        circular: true,           // 是否采用衔接滑动
        indicatorDots: true,      // 是否显示面板指示点
        indicatorColor: 'rgba(255, 255, 255, 0.6)',        // 指示点颜色
        indicatorActiveColor: '#FFFFFF',                     // 当前选中的指示点颜色
        autoplay: true,           // 是否自动切换
        vertical: false           // 滑动方向是否为纵向
    },

    // 获取轮播图数据
    getBanners() {
        return this.banners;
    },

    // 获取轮播图配置
    getConfig() {
        return this.config;
    },

    // 根据ID获取轮播图
    getBannerById(id) {
        return this.banners.find(banner => banner.id === id);
    },

    // 添加轮播图
    addBanner(banner) {
        this.banners.push(banner);
    },

    // 更新轮播图
    updateBanner(id, updatedBanner) {
        const index = this.banners.findIndex(banner => banner.id === id);
        if (index !== -1) {
            this.banners[index] = { ...this.banners[index], ...updatedBanner };
            return true;
        }
        return false;
    },

    // 删除轮播图
    removeBanner(id) {
        const index = this.banners.findIndex(banner => banner.id === id);
        if (index !== -1) {
            this.banners.splice(index, 1);
            return true;
        }
        return false;
    }
};