# 微博情感分析助手 (Weibo Sentiment Analysis Assistant)

基于 React + Node.js + 豆包 AI (Doubao) + Supabase 打造的 fullstack 情感分析工具。

## 功能特点
- **AI 驱动**：使用豆包 (Doubao-seed-2-0-pro) 模型进行语义分析。
- **数据持久化**：集成 Supabase 存储分析结果。
- **Mac Web 体验**：精致的毛玻璃效果与响应式设计。

## 快速开始

### 1. 准备工作
- 在 Supabase 创建项目并执行 `/server` 下的 SQL 初始化脚本。
- 获取火山引擎 (Ark) 的 API Key 和 Model ID。

### 2. 环境配置
在根目录创建 `.env.local` 并在其中填入：
```env
ARK_API_KEY=你的API_KEY
ARK_MODEL_ID=你的模型ID
SUPABASE_URL=你的Supabase地址
SUPABASE_KEY=你的Supabase密钥
```

### 3. 安装与运行
```bash
# 安装依赖
npm install
cd server && npm install && cd ..

# 启动后端 (端口 7777)
node server/index.js

# 启动前端
npm run dev
```

## 部署建议
- **前端**：建议部署至 Vercel。
- **后端**：建议部署至 Railway 或 Zeabur。
- **数据库**：使用 Supabase。
