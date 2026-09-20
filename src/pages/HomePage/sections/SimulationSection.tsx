import { Boxes, BarChart3, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { SIMULATION_ITEMS } from '@/data/content';

const ICON_MAP: Record<string, typeof Boxes> = {
  Boxes,
  BarChart3,
  RefreshCcw,
};

export default function SimulationSection() {
  return (
    <section className="w-full py-16 md:py-20 bg-accent/20">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        {/* 标题 */}
        <div className="mb-12 text-center">
          <div className="mb-3 text-sm font-medium text-wheat">结构仿真验证</div>
          <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
            数字孪生 · 诊断验证闭环
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            不只是给出故障标签，更通过结构仿真验证诊断结论的物理合理性，让诊断结果可解释、可追溯
          </p>
          <div className="mx-auto mt-4 h-px w-12 bg-wheat" />
        </div>

        {/* 三卡片 */}
        <div className="grid gap-6 md:grid-cols-3">
          {SIMULATION_ITEMS.map((item, i) => {
            const Icon = ICON_MAP[item.icon] || Boxes;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
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
