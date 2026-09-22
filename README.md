# 司农智机 · SRT27

面向农业机械装备的智能故障诊断 Agent。基于本地 Markdown 知识库 + 大语言模型，为拖拉机、联合收割机等农机提供结构化的故障原因分析、排查步骤与安全维修建议。

> 当前版本为**本地知识库 + LLM 对话**的轻量方案，未接入传感器/麦克风/视觉/CAN 总线。多模态感知、结构仿真、数字孪生等能力均为规划方向。

## 技术栈

- **前端**：React 19 + Vite + TypeScript + Tailwind CSS + React Router + React Three Fiber
- **后端**：Node.js + Express + tsx（ESM）
- **LLM**：Gemini（`gemini-3.6-flash`）/ DeepSeek（`deepseek-v4-flash`），OpenAI 兼容协议
- **知识库**：本地 Markdown，按 `## ` 切块 + 关键词重叠打分，零向量库
- **3D**：Three.js / React Three Fiber，程序化 RoomEnvironment 光照，零 HDR 网络请求

## 快速开始

### 环境要求

- Node.js ≥ 20
- npm ≥ 10

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key

编辑 `server/.env`（**该文件永不提交到 Git**，已在 `.gitignore` 中排除）：

```env
# Gemini（有代理环境优先使用；OAuth token 或 API key）
GEMINI_API_KEY=AQ.Ab8RN6...

# DeepSeek（无代理环境优先使用；sk- 开头）
DEEPSEEK_API_KEY=sk-...

# 服务端口（默认 8787）
PORT=8787

# 可选：代理（写在这里也能被识别；服务启动时先加载本文件再读代理变量）
# HTTPS_PROXY=http://127.0.0.1:7890
# HTTP_PROXY=http://127.0.0.1:7890
```

> 两个 key 都配最稳：后端按网络环境自动选主选，失败自动回退。只配一个也能跑。
> 服务启动顺序：先加载 `server/.env`，再读取 `HTTPS_PROXY/https_proxy/HTTP_PROXY/http_proxy` 决定走 Gemini 还是 DeepSeek。

### 3. 启动开发服务

```bash
npm run dev
```

- 前端：http://localhost:5173
- 后端：http://localhost:8787
- 健康检查：http://localhost:8787/api/health

### 4. 类型检查 / Lint / 构建

```bash
npm run typecheck   # 前端 tsc
npm run lint        # eslint
npm run build       # 先 build:client 再 build:server
```

## LLM 选择策略

后端 `server/llm/router.ts` 按当前网络环境自动选 provider：

| 环境 | 主选 | 回退 |
| --- | --- | --- |
| 检测到 `HTTPS_PROXY` / `https_proxy` / `HTTP_PROXY` / `http_proxy` | Gemini | DeepSeek |
| 无代理变量 | DeepSeek | Gemini |

- 主选未配置时自动交换。
- 主选抛网络/超时/服务端错误时自动回退次选。
- 鉴权错误（401/403）也会尝试另一个，方便排查 key 问题。
- 所有 LLM 失败时，前端统一显示「智能诊断服务暂时无法连接，请稍后重试。」，不暴露 ECONNRESET/ETIMEDOUT 等技术细节。
- 20 秒超时。

## RAG 工作流

1. 启动时扫描 `server/knowledge/` 下所有 `.md` 文件（跳过 `00_说明/`），按 `## ` 二级标题切块。
2. 用户提问时，对用户问题做中文 2-gram + 英文 token 化，与每块做关键词重叠打分，标题命中权重 ×3。
3. 取 top-6 片段（单块超 1200 字符截断），拼入后端独占的 system prompt。
4. system prompt 硬性要求：
   - 禁止编造压力/温度/电压/扭矩/故障码/零件号/油液型号等参数；
   - 资料不足时输出【当前资料不足】并主动追问机型/工况/伴随现象；
   - 结构化输出：【故障现象】【初步判断】【可能原因】【建议排查】【知识依据】【安全提醒】；
   - 用户用什么语言问，就用什么语言答。
5. 前端只发 user/assistant 历史（截最近 20 轮），不发 system message——system prompt 由后端独占。

## 知识库目录

```
server/knowledge/
├── 00_说明/              # 目录约定与维护说明（不参与检索）
├── 01_通用原理/          # 发动机/冷却/润滑/液压/电气/传动/制动/转向
├── 02_农机类型/          # 拖拉机/收割机/插秧机/植保机...
├── 03_新能源农机/        # 电动/混动农机
├── 04_智能农机/          # 无人化/自动驾驶
├── 05_故障代码/          # 各品牌故障码表
├── 06_品牌资料/          # 东方红/雷沃/中联/久保田/约翰迪尔...
├── 07_具体型号/          # 具体型号维修手册
└── 99_待整理/            # 未分类资料
```

未来接入 PDF/Word/Excel/TXT 时，在 `server/knowledge/retriever.ts` 之上增加解析层即可，接口保持 `chunks: { text, source, heading }[]`。

## 目录结构

```
SRT27/
├── src/                          # React 前端
│   ├── components/
│   │   ├── TractorViewer.tsx     # 3D 查看器（R3F + OrbitControls）
│   │   ├── TractorModel.tsx      # GLB 加载与资源释放
│   │   └── ui/                   # shadcn/ui 基础组件
│   ├── pages/
│   │   ├── HomePage/             # 首页（Hero/痛点/多模态/架构/仿真/路线/场景/CTA）
│   │   ├── ChatPage/             # 对话页（含农机类型/品牌/型号可选选择器）
│   │   └── NotFoundPage/
│   ├── data/content.ts           # 全部页面文案（中英双语）
│   ├── hooks/                    # useLang / use-mobile / use-theme
│   └── lib/
├── server/
│   ├── index.ts                  # Express 路由 + 安全中间件 + 限流
│   ├── dev.ts                    # 开发入口（tsx watch）
│   ├── llm/                      # LLM Provider 层
│   │   ├── types.ts              # Provider/ChatResult/ProviderError 接口
│   │   ├── http.ts               # fetchWithTimeout + detectProxy
│   │   ├── openai-compatible.ts  # 通用 OpenAI 兼容 provider 工厂
│   │   ├── gemini.ts             # Gemini provider
│   │   ├── deepseek.ts           # DeepSeek provider
│   │   └── router.ts             # 按代理选 primary + fallback 单例
│   ├── knowledge/                # 知识库 + 轻量检索器
│   │   ├── retriever.ts          # 扫描/切块/打分/top-K
│   │   ├── systemPrompt.ts       # buildSystemPrompt（后端独占）
│   │   └── 00_说明/ 01_通用原理/ ...
│   └── .env                      # 本地环境变量（不提交）
├── public/models/tractor.glb     # 3D 模型（/api/model/tractor）
├── scripts/                      # dev.mjs / build.sh
├── package.json
├── tsconfig.app.json             # 前端
├── tsconfig.server.json          # 后端
└── eslint.config.mjs
```

## API

### `GET /api/health`

```json
{ "ok": true, "timestamp": "...", "knowledge": { "chunks": 9 } }
```

### `POST /api/chat`

请求体（前端只发 user/assistant；system 由后端拼）：

```json
{
  "messages": [
    { "role": "user", "content": "拖拉机水温过高怎么办？" }
  ],
  "machineType": "拖拉机",
  "brand": "",
  "model": ""
}
```

响应（OpenAI 兼容 + 附加字段）：

```json
{
  "choices": [{ "message": { "role": "assistant", "content": "..." } }],
  "model": "deepseek-v4-flash",
  "provider": "deepseek",
  "fellBack": false,
  "knowledgeChunks": 2
}
```

失败时统一返回 HTTP 502：

```json
{ "error": "智能诊断服务暂时无法连接，请稍后重试。", "code": "llm_unavailable" }
```

## 安全

- API Key 仅存于 `server/.env`，前端/构建产物/Git 均不出现。
- CORS 白名单仅允许本地开发源；生产可按需扩展。
- 所有外部 LLM 请求经 `undici` 的 `ProxyAgent` 走系统代理。
- `/api/chat` 每 IP 每分钟 30 次限流。
- 错误日志只打印 provider 名与错误类别，绝不打印 key。
- Markdown 渲染使用 `react-markdown`（默认不执行 HTML/JS）。

## 当前已实现 vs 规划中

**已实现**

- 本地 Markdown 知识库 + 关键词检索 RAG
- Gemini / DeepSeek 双 Provider，按代理自动选择 + 失败回退
- 后端独占 system prompt，强制结构化输出与禁止编造参数
- 可交互 3D 拖拉机模型（拖拽/缩放/自转/恢复视角）
- 中英双语界面、跟随系统的明暗主题
- 对话历史本地持久化、Markdown 渲染、快捷提问
- 农机类型/品牌/型号可选选择器，用于增强检索
- CORS 白名单、安全头、限流、优雅退出、错误脱敏

**规划中（首页已明确标注）**

- 振动/声学/视觉/CAN 总线多模态信号接入
- 有限元模态/应力仿真验证
- 数字孪生诊断-验证闭环
- 真实 PDF/Word/Excel 维修手册解析入库
- 向量检索（当前为关键词重叠，资料量上来后再升级）

## 同步部署

- 本地工程目录：`/Users/zhaichangjie/DoubaoWork/SRT网站/农机诊断平台/`
- Git 仓库：`/Users/zhaichangjie/myself/NJAU/SRT-27/SRT27/`
- GitHub：https://github.com/Changjie29/SRT27
- 同步脚本：`/Users/zhaichangjie/DoubaoWork/SRT网站/sync.sh`（rsync 排除 `.env`，再 git add/commit/push）

---

© 2026 司农智机 SRT27 · 南京农业大学
