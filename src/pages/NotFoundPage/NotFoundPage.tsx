import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center">
        <div className="font-serif text-7xl font-bold text-primary/30">404</div>
        <h1 className="mt-4 font-serif text-2xl font-bold text-foreground">页面未找到</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <Button asChild className="mt-6 gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </Button>
      </div>
    </div>
  );
}
