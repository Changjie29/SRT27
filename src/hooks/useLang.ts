import { useSyncExternalStore } from 'react';
import type { Lang } from '@/data/content';

const STORAGE_KEY = 'srt-lang';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  // 自定义事件：同标签内切换语言时也能触发
  window.addEventListener('srt-lang-changed', callback as EventListener);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('srt-lang-changed', callback as EventListener);
  };
}

function getSnapshot(): Lang {
  return (localStorage.getItem(STORAGE_KEY) as Lang) || 'zh';
}

/** 读取当前语言（zh / en），切换时自动重渲染 */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getSnapshot, () => 'zh');
}

/** 切换语言并通知所有订阅者 */
export function setLang(lang: Lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  window.dispatchEvent(new Event('srt-lang-changed'));
}
