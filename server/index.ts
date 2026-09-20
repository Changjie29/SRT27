import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
// Node fetch 默认不走系统代理；若环境存在 HTTPS_PROXY 则让所有外部请求走代理
import { setGlobalDispatcher, ProxyAgent } from 'undici';

const _proxy = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY;
if (_proxy) {
  setGlobalDispatcher(new ProxyAgent(_proxy));
  console.log('[server] 已启用外部代理:', _proxy.replace(/:[^:@/]+@/, ':****@'));
}

// 从 server/.env 加载环境变量（无论从项目根还是 dist 目录启动都有效）
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

// ==================== 知识库加载（严格 RAG） ====================
// 启动时读取 server/knowledge/manual.md，作为回答的唯一事实依据
let KNOWLEDGE_BASE = '(知识库未加载)';
try {
  KNOWLEDGE_BASE = fs.readFileSync(
    path.resolve(process.cwd(), 'server/knowledge/manual.md'),
    'utf-8',
  );
  console.log(`[server] 知识库已加载: ${KNOWLEDGE_BASE.length} 字符`);
} catch (e) {
  console.warn('[server] 知识库文件未找到，将无约束模式运行:', (e as Error).message);
}

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// 健康检查
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// ==================== 对话接口 ====================
// 前端调用 /api/chat，后端转发至 LLM API（OpenAI 兼容格式）
// 优先 Gemini，不可达时自动回退 DeepSeek；API Key 仅存于服务端环境变量
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
const GEMINI_MODEL = 'gemini-3.6-flash';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-v4-flash';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 带超时的 fetch（Gemini 不可达时避免长时间挂起）
async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 25000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// 调用单个供应商，返回 OpenAI 兼容响应或 null（失败）
async function callProvider(
  apiUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
): Promise<{ status: number; data?: unknown; errText?: string } | null> {
  try {
    // 模型自述：让智能体知道自己运行的模型，被询问时如实回答
    const selfIntro = `\n\n【模型信息】你当前由 ${apiUrl.includes('deepseek') ? 'DeepSeek' : 'Gemini'} 提供支持，运行模型名称：${model}。当用户询问"你是什么模型/用的是什么模型/背后是哪个大模型"等问题时，请直接如实告知模型名称（"${model}"），不要含糊其辞或编造。`;
    const apiMessages: ChatMessage[] = messages.map((m, i) =>
      i === 0 && m.role === 'system' ? { ...m, content: m.content + selfIntro } : m,
    );
    if (!apiMessages.some((m) => m.role === 'system')) {
      apiMessages.unshift({ role: 'system', content: selfIntro.trim() });
    }

    const response = await fetchWithTimeout(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
        temperature: 0.3,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { status: response.status, errText: errText.slice(0, 300) };
    }
    const data = await response.json();
    return { status: 200, data };
  } catch {
    return null; // 连接失败 / 超时 → 交给回退逻辑
  }
}

app.post('/api/chat', async (req: Request, res: Response) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;

  const { messages } = req.body as { messages?: ChatMessage[] };

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages 参数缺失或格式错误' });
    return;
  }

  // 严格 RAG：把知识库 + 约束规则作为 system 前置注入
  const ragSystem: ChatMessage = {
    role: 'system',
    content: `你是面向农机装备的故障诊断智能体。你必须严格依据下方《农机故障诊断知识库》回答问题。

【硬性规则】
1. 只允许使用知识库中出现的信息；不得编造机型参数、维修数据、故障代码、零件号。
2. 若知识库中没有相关内容，必须直接回答："根据现有知识库，这部分资料不足，建议查阅该机型官方维修手册或联系售后。" 不要凭训练记忆猜测。
3. 涉及维修操作时，末尾必须附带安全提示（停机、泄压、高温冷却等）。
4. 用简洁、条理化的中文回答。

《农机故障诊断知识库》：
${KNOWLEDGE_BASE}`,
  };
  const fullMessages: ChatMessage[] = [ragSystem, ...messages];

  // 1) 优先 Gemini
  if (geminiKey) {
    const result = await callProvider(GEMINI_API_URL, geminiKey, GEMINI_MODEL, fullMessages);
    if (result && result.status === 200) {
      res.json(result.data);
      return;
    }
    if (result && result.status !== 200) {
      // Gemini 业务错误（如鉴权失败）也记录并尝试回退
      console.warn(`[chat] Gemini 请求失败(${result.status})，回退 DeepSeek:`, result.errText);
    } else {
      console.warn('[chat] Gemini 连接失败，回退 DeepSeek');
    }
  }

  // 2) 回退 DeepSeek
  if (deepseekKey) {
    const result = await callProvider(DEEPSEEK_API_URL, deepseekKey, DEEPSEEK_MODEL, fullMessages);
    if (result && result.status === 200) {
      res.json(result.data);
      return;
    }
    if (result && result.status !== 200) {
      res.status(result.status).json({
        error: 'LLM API 请求失败（Gemini 与 DeepSeek）',
        detail: result.errText,
      });
      return;
    }
  }

  res.status(502).json({
    error: 'LLM API 不可用',
    message: 'Gemini 与 DeepSeek 均无法连接，请检查服务端 API Key 配置',
  });
});

// ==================== 3D 模型接口 ====================
// 提供 GLB 模型文件（开发时也可直接访问 public/models/tractor.glb）
app.get('/api/model/tractor', (_req: Request, res: Response) => {
  const modelPath = path.resolve(process.cwd(), 'public/models/tractor.glb');
  res.sendFile(modelPath, (err) => {
    if (err) {
      res.status(404).json({ error: '模型文件不存在' });
    }
  });
});

// 仅在直接运行时监听（由 dev.mjs / dist-server 入口启动）
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[server] running on http://localhost:${PORT}`);
  });
}

export default app;
