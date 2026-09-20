import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TractorViewer from '@/components/TractorViewer';
import { HERO_CONTENT } from '@/data/content';

export default function HeroSection() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-grid-paper pt-16 pb-12 md:pt-24 md:pb-20">
      {/* 装饰渐变 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* 左侧文案 */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-wheat/30 bg-wheat/10 px-3 py-1 text-xs font-medium text-wheat-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              {HERO_CONTENT.eyebrow}
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              {HERO_CONTENT.title1}
              <span className="text-primary">{HERO_CONTENT.titleHighlight}</span>
              <br />
              {HERO_CONTENT.title2}
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {HERO_CONTENT.desc}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button size="lg" onClick={() => navigate('/chat')} className="gap-2">
                {HERO_CONTENT.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => scrollToSection('multimodal')}
                className="gap-2"
              >
                {HERO_CONTENT.ctaSecondary}
              </Button>
            </div>

            {/* 技术指标 */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
              {HERO_CONTENT.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-2xl font-bold text-primary md:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧 3D 模型 */}
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-wheat/10 blur-2xl" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-sm">
              <TractorViewer />
            </div>
            <div className="mt-3 text-center text-xs text-muted-foreground/70">
              拖动旋转查看 · 滚轮缩放
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
