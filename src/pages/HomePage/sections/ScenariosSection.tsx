import { Tractor, Wheat, Factory } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { SCENARIOS } from '@/data/content';

const ICON_MAP: Record<string, typeof Tractor> = {
  Tractor,
  Wheat,
  Factory,
};

export default function ScenariosSection() {
  return (
    <section id="scenarios" className="w-full py-16 md:py-20 bg-accent/20">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        {/* 标题 */}
        <div className="mb-12 text-center">
          <div className="mb-3 text-sm font-medium text-wheat">应用场景</div>
          <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
            覆盖主要农机品类与关键故障
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            从拖拉机到联合收割机，再到更广的农机装备生态，提供一致的诊断体验
          </p>
          <div className="mx-auto mt-4 h-px w-12 bg-wheat" />
        </div>

        {/* 三卡片 */}
        <div className="grid gap-6 md:grid-cols-3">
          {SCENARIOS.map((scenario, i) => {
            const Icon = ICON_MAP[scenario.icon] || Tractor;
            return (
              <motion.div
                key={scenario.name}
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
                    <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">{scenario.name}</h3>

                    <div className="mb-4">
                      <div className="mb-2 text-xs font-medium text-wheat">重点监测部件</div>
                      <div className="flex flex-wrap gap-1.5">
                        {scenario.parts.map((p) => (
                          <span
                            key={p}
                            className="rounded-md bg-accent px-2 py-1 text-xs text-foreground"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-xs font-medium text-wheat">典型故障</div>
                      <ul className="space-y-1.5">
                        {scenario.faults.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
