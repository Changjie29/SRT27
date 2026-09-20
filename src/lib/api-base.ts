// 本地版 API 基础封装（原生 fetch 实现）
// 页面通过 vite dev 的 /api 代理访问后端服务（默认 http://localhost:8787）

export const api = {
  get: (url: string) =>
    fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    }),
  post: (url: string, data: unknown) =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
};

export default api;
