# 司农智机 · 农机装备多模态故障诊断智能体

面向农机装备的多模态故障诊断智能体网站，融合振动、声音、视觉与运行参数四类感知信号，结合大语言模型智能体与结构仿真验证闭环，为拖拉机、联合收割机等农机装备提供故障诊断与维修决策服务。

## 功能特性

- **首页展示**：8 大内容区块（Hero 主视觉 / 行业痛点 / 多模态方案 / 智能体架构 / 结构仿真验证 / 技术路线 / 应用场景 / 行动号召）
- **3D 交互模型**：主视觉内置 David Brown 25D 拖拉机 3D 模型，支持鼠标拖拽旋转、滚轮缩放，模型自动自转（拖动时暂停，松手 3 秒后恢复）
- **智能体对话**：独立对话页面，输入故障现象即可获得专业诊断分析与维修建议（Markdown 渲染、快捷提问、历史记录本地保存、一键清空）
- **后端代理**：对话请求由 Node.js 服务端代理转发至 DeepSeek API，API Key 仅存于服务端，前端不暴露

## 快速开始

### 环境要求

- Node.js ≥ 20
- npm ≥ 10

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 DeepSeek API Key

编辑 `server/.env`：

```env
# DeepSeek API Key（从 platform.deepseek.com 获取）
DEEPSEEK_API_KEY=sk-你的key

# 服务端口（默认 8787）
PORT=8787
```

> 前端页面不包含任何密钥，API Key 仅通过服务端环境变量读取。

### 3. 启动开发服务

```bash
npm run dev
```

- 前端页面：http://localhost:5173
- 后端 API：http://localhost:8787（`/api/health` 健康检查、`/api/chat` 对话接口）

### 4. 生产构建

```bash
npm run build
```

构建产物输出到 `dist/`，服务端编译到 `dist-server/`。

## 目录结构

```
农机诊断平台源码/
├── src/                          # 前端源码
│   ├── components/
│   │   ├── Layout.tsx            # 全局布局（导航栏 + 路由出口）
│   │   ├── TractorViewer.tsx     # 3D 查看器（程序化环境光、自转控制）
│   │   ├── TractorModel.tsx      # 3D 模型加载与清理（GLB）
│   │   └── ui/                   # UI 基础组件
│   ├── pages/
│   │   ├── HomePage/             # 首页（8 大区块）
│   │   ├── ChatPage/             # 智能体对话页
│   │   └── NotFoundPage/         # 404 页
│   ├── data/content.ts           # 全部页面文案与系统提示词
│   ├── hooks/use-mobile.ts
│   └── lib/                      # 工具函数
├── server/                       # 后端（Express + DeepSeek 代理）
│   ├── index.ts                  # API 服务（/api/health、/api/chat）
│   ├── dev.ts                    # 后端开发入口
│   └── .env                      # 环境变量（DeepSeek Key）
├── public/models/tractor.glb     # 3D 模型（原版）
├── src/components/tractor-transformed.glb  # 3D 模型（构建打包用）
└── scripts/                      # 开发/构建脚本
```

## 3D 模型说明

- 模型文件：`david_brown_25d_tractor.glb`（David Brown 25D 拖拉机，约 7.37 MB）
- 前端通过 `import ...?url` 引用，构建时由 Vite 打包进 `dist/assets/`
- 模型含 Sketchfab 导出的非标准节点（如 SVG 扩展），加载时自动清理，避免渲染报错
- 环境光照使用 three.js 内置 RoomEnvironment 程序化生成，不依赖外部 HDR 贴图，离线可用

## 对话接口

前端请求 `POST /api/chat`：

```json
{
  "messages": [
    { "role": "system", "content": "你是农机故障诊断专家..." },
    { "role": "user", "content": "拖拉机液压提升器无力，什么原因？" }
  ]
}
```

服务端转发至 DeepSeek API（模型 `deepseek-v4-flash`，temperature 0.3），返回 OpenAI 格式响应：

```json
{
  "choices": [{ "message": { "role": "assistant", "content": "..." } }]
}
```

## 常见问题

**Q: 对话页提示「对话服务暂不可用」？**
A: 请确认：1) `server/.env` 中已配置有效的 `DEEPSEEK_API_KEY`；2) 后端服务已启动（`npm run dev` 后访问 http://localhost:8787/api/health 应返回 `{"ok":true}`）。

**Q: 首页 3D 模型不显示？**
A: 请使用支持 WebGL 的现代浏览器（Chrome / Edge / Safari 15+）。页面在 WebGL 不可用时会自动降级为静态提示。

**Q: 如何换一个 3D 模型？**
A: 将新模型（GLB 格式）替换 `src/components/tractor-transformed.glb` 与 `public/models/tractor.glb`，并在 `src/components/TractorModel.tsx` 中保持引用不变即可。

---

© 2026 司农智机 · 农机故障诊断智能体 · 数据仅供演示参考
