import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
const HomePage = lazy(() => import('@/pages/HomePage/HomePage'));
const ChatPage = lazy(() => import('@/pages/ChatPage/ChatPage'));
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';

export default function App() {
  return (
    <Suspense fallback={<div role="status" className="p-8 text-center text-muted-foreground">加载中 / Loading…</div>}>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="chat" element={<ChatPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </Suspense>
  );
}
