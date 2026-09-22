import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TractorViewer from '@/components/TractorViewer';
import content, { pick } from '@/data/content';
import { useLang } from '@/hooks/useLang';

export default function HeroSection() {
  const navigate = useNavigate();
  const lang = useLang();
  const h = content.HERO;

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
              {pick(h.eyebrow, lang)}
            </div>

            <h1
              className={
                lang === 'zh'
                  ? 'font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl'
                  : 'font-serif text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl'
              }
            >
              {pick(h.title1, lang)}{' '}
              <span className="text-primary">{pick(h.titleHighlight, lang)}</span>
              <br className="hidden sm:block" />
              {pick(h.title2, lang)}
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {pick(h.desc, lang)}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button size="lg" onClick={() => navigate('/chat')} className="gap-2">
                {pick(h.ctaPrimary, lang)}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => scrollToSection('multimodal')}
                className="gap-2"
              >
                {pick(h.ctaSecondary, lang)}
              </Button>
            </div>

            {/* 技术指标 */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
              {h.stats.map((stat) => (
                <div key={pick(stat.label, lang)}>
                  <div className="font-serif text-2xl font-bold text-primary md:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{pick(stat.label, lang)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧 3D 模型 */}
          <div className="relative shrink-0 lg:min-w-0">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-wheat/10 blur-2xl" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-sm">
              <TractorViewer />
            </div>
            <div className="mt-3 text-center text-xs text-muted-foreground/70">
              {lang === 'zh' ? '拖动旋转查看 · 滚轮缩放' : 'Drag to rotate · Scroll to zoom'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
