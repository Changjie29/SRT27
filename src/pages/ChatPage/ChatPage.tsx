import { useState, useRef, useEffect, useCallback, type FormEvent, type KeyboardEvent } from 'react';
import { Send, Trash2, Loader2, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import content, { pick, CHAT_SYSTEM_PROMPT } from '@/data/content';
import { useLang } from '@/hooks/useLang';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'error' | 'loading';
  content: string;
  model?: string;
}

const STORAGE_KEY = '__app_agri_chat_history';

function generateId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function ChatPage() {
  const lang = useLang();
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 从 localStorage 加载历史
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // 忽略读取错误
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // 忽略写入错误
    }
  }, [messages]);

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 进入页面自动聚焦输入框
  useEffect(() => {
    const timer = window.setTimeout(() => textareaRef.current?.focus(), 100);
    return () => window.clearTimeout(timer);
  }, []);

  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    // 添加用户消息
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
    };

    // 添加加载占位
    const loadingMsg: ChatMessage = {
      id: generateId(),
      role: 'loading',
      content: '',
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 构建 messages 数组（系统提示词 + 历史对话 + 当前用户消息）
      const historyForApi = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      const apiMessages = [
        { role: 'system', content: CHAT_SYSTEM_PROMPT[lang] },
        ...historyForApi,
        { role: 'user', content: trimmed },
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content || t('抱歉，未能获取有效回复，请稍后重试。', 'Sorry, no valid reply. Please try again.');
      const modelName = (data?.model as string) || '';

      // 记录当前模型（供顶部标识与消息标注）
      if (modelName) {
        setCurrentModel(modelName);
      }

      // 替换 loading 为真实回复
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMsg.id
            ? { ...m, role: 'assistant' as const, content: reply, model: modelName || undefined }
            : m,
        ),
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      // 替换 loading 为错误消息
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMsg.id
            ? { ...m, role: 'error' as const, content: t(`抱歉，对话服务暂时不可用，请稍后重试。\n${errorMsg}`, `Sorry, chat service is temporarily unavailable.\n${errorMsg}`) }
            : m,
        ),
      );
      toast.error(t('对话服务暂不可用', 'Chat service unavailable'));
    } finally {
      setIsLoading(false);
      // 聚焦输入框
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [messages, isLoading]);

  // 表单提交
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage],
  );

  // 键盘快捷键
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [input, sendMessage],
  );

  // 快捷提问
  const handleQuickQuestion = useCallback(
    (question: string) => {
      sendMessage(question);
    },
    [sendMessage],
  );

  // 清空对话
  const handleClear = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    toast.success(t('对话已清空', 'Chat cleared'));
  }, [t]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between border-b border-border/60 bg-card/50 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">司农智机 · {t('故障诊断', 'Diagnosis')}</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {t('多模态智能体 · 专业农机诊断', 'Multimodal agent · expert diagnosis')}
              {currentModel && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-accent/60 px-1.5 py-0.5 text-[11px] text-foreground">
                  <Sparkles className="h-3 w-3 text-primary" />
                  {currentModel}
                </span>
              )}
            </div>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Trash2 className="h-4 w-4" />
              {t('清空对话', 'Clear chat')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('确认清空对话？', 'Clear all messages?')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('清空后当前所有对话记录将被删除，且无法恢复。', 'All current messages will be deleted and cannot be recovered.')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('取消', 'Cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleClear}>{t('确认清空', 'Clear')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
          {/* 空状态 / 欢迎态 */}
          {isEmpty && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-7 w-7" />
              </div>
              <h2 className="font-serif text-xl font-bold text-foreground">{pick(content.CHAT_WELCOME.title, lang)}</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">{pick(content.CHAT_WELCOME.desc, lang)}</p>

              {/* 快捷提问按钮 */}
              <div className="mt-8 w-full">
                <div className="mb-3 text-xs font-medium text-wheat">{t('您可以这样问', 'Try asking')}</div>
                <div className="grid gap-2 md:grid-cols-2">
                  {content.CHAT_QUICK_QUESTIONS.map((q) => (
                    <button
                      key={pick(q, lang)}
                      onClick={() => handleQuickQuestion(pick(q, lang))}
                      disabled={isLoading}
                      className="rounded-md border border-border/60 bg-card p-3 text-left text-sm text-foreground transition-all hover:border-primary/40 hover:bg-accent/50 hover:text-primary disabled:opacity-50"
                    >
                      {pick(q, lang)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 消息列表 */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role !== 'user' && (
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:max-w-[75%] ${
                  msg.role === 'user'
                    ? 'rounded-tr-sm bg-primary text-primary-foreground'
                    : msg.role === 'error'
                    ? 'rounded-tl-sm border border-destructive/30 bg-destructive/5 text-destructive'
                    : msg.role === 'loading'
                    ? 'rounded-tl-sm border border-border/60 bg-card text-muted-foreground'
                    : 'rounded-tl-sm border border-border/60 bg-card text-foreground'
                }`}
              >
                {msg.role === 'loading' ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t('正在思考...', 'Thinking...')}</span>
                  </div>
                ) : msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    {msg.role === 'assistant' && msg.model && (
                      <div className="mt-1.5 text-right text-[11px] text-muted-foreground/70">
                        {t('模型', 'Model')}: {msg.model}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="ml-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/80 text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区 */}
      <div className="border-t border-border/60 bg-card/50 px-4 py-4 md:px-6">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('描述您遇到的农机故障现象...', 'Describe the fault symptom...')}
              className="min-h-[60px] resize-none"
              rows={2}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="shrink-0"
              aria-label={t('发送', 'Send')}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {t('按 Enter 发送，Shift + Enter 换行', 'Enter to send, Shift+Enter for newline')}
          </div>
        </form>
      </div>
    </div>
  );
}
