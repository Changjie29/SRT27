import { AlertTriangle, Brain, ScanLine } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import content, { pick } from '@/data/content';
import { useLang } from '@/hooks/useLang';

const ICON_MAP: Record<string, typeof AlertTriangle> = {
  AlertTriangle,
  Brain,
  ScanLine,
};

export default function PainPointsSection() {
  const lang = useLang();
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);
  return (
    <section id="painpoints" className="w-full py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        {/* 标题 */}
        <div className="mb-12 text-center">
          <div className="mb-3 text-sm font-medium text-wheat">{t('行业痛点', 'Industry Pain Points')}</div>
          <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
            {t('传统农机故障诊断面临的三大挑战', 'Three Challenges of Traditional Fault Diagnosis')}
          </h2>
          <div className="mx-auto mt-4 h-px w-12 bg-wheat" />
        </div>

        {/* 三痛点卡片 */}
        <div className="grid gap-6 md:grid-cols-3">
          {content.PAIN_POINTS.map((item, i) => {
            const Icon = ICON_MAP[item.icon] || AlertTriangle;
            return (
              <motion.div
                key={pick(item.title, lang)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full transition-all duration-300 hover:shadow-md hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">{pick(item.title, lang)}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{pick(item.desc, lang)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* 数据条 */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {content.PAIN_STATS.map((stat, i) => (
            <motion.div
              key={pick(stat.label, lang)}
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="space-y-2"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">{pick(stat.label, lang)}</span>
                <span className="font-serif text-2xl font-bold text-primary">
                  {stat.value}
                  <span className="text-base">%</span>
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-accent">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${stat.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.15 + 0.2, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
