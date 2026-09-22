/**
 * 带超时的 fetch（Node 18+ 原生 fetch）
 * 用于避免 provider 网络异常时长时间挂起。
 */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = 25_000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('timeout');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 从环境变量里检测是否配置了出站代理。
 * 不发起真实网络请求，只看变量是否存在——由 router 决定优先级，
 * 真实失败仍走 fallback。
 */
export function detectProxy(): { present: boolean; url: string | null } {
  const url =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy ||
    null;
  return { present: Boolean(url), url };
}
