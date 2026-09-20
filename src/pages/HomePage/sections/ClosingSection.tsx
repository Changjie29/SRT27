import { ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CLOSING_CTA, FOOTER_REFERENCES } from '@/data/content';

export default function ClosingSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full pt-16 pb-0 md:pt-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        {/* CTA 区 */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 p-8 text-center md:p-12">
          {/* 装饰网格 */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-grid-paper" />
          </div>

          <div className="relative">
            <h2 className="font-serif text-2xl font-bold text-primary-foreground md:text-3xl">
              {CLOSING_CTA.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/80 md:text-base">
              {CLOSING_CTA.desc}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/chat')}
                className="gap-2 text-primary"
              >
                {CLOSING_CTA.buttonText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="mt-16 w-full border-t border-border/60 bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
                    <circle cx="7" cy="16" r="3" />
                    <circle cx="17" cy="16" r="3" />
                    <path d="M4 16V10l8-4 8 4v6" />
                    <path d="M12 6v10" />
                  </svg>
                </div>
                <span className="font-serif text-lg font-bold text-foreground">司农智机</span>
              </div>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                面向农机装备的多模态故障诊断智能体，融合感知信号、大语言模型与结构仿真，
                为农业生产提供专业、可靠、可解释的故障诊断服务。
              </p>
            </div>

            <div>
              <h4 className="mb-3 font-serif text-sm font-semibold text-foreground">参考来源</h4>
              <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {FOOTER_REFERENCES.map((ref) => (
                  <li key={ref.name}>
                    <a
                      href={ref.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                    >
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      {ref.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border/50 pt-6 text-xs text-muted-foreground/70 md:flex-row">
            <div>© 2026 司农智机 · 农机故障诊断智能体</div>
            <div>所有数据仅供演示参考 · 实际诊断请结合专业技术人员判断</div>
          </div>
        </div>
      </footer>
    </section>
  );
}
