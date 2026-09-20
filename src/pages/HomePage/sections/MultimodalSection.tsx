import { Activity, Volume2, Camera, Gauge, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MULTIMODAL_SIGNALS } from '@/data/content';

const ICON_MAP: Record<string, typeof Activity> = {
  Activity,
  Volume2,
  Camera,
  Gauge,
};

export default function MultimodalSection() {
  return (
    <section id="multimodal" className="w-full py-16 md:py-20 bg-accent/30">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        {/* 标题 */}
        <div className="mb-12 text-center">
          <div className="mb-3 text-sm font-medium text-wheat">多模态方案</div>
          <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
            四类感知信号 · 融合诊断
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            通过多模态特征融合，突破单一信号局限，大幅提升复杂工况下故障识别的准确率与鲁棒性
          </p>
          <div className="mx-auto mt-4 h-px w-12 bg-wheat" />
        </div>

        {/* 四卡片 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {MULTIMODAL_SIGNALS.map((signal, i) => {
            const Icon = ICON_MAP[signal.icon] || Activity;
            const wheat = signal.name === '声音信号' || signal.name === '运行参数';
            const color = wheat ? 'text-wheat' : 'text-primary';
            const bg = wheat ? 'bg-wheat/10' : 'bg-primary/10';
            return (
              <motion.div
                key={signal.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="group h-full transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-md ${bg} ${color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">{signal.name}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{signal.desc}</p>
                    <div className="flex items-center gap-1.5 border-t border-border/50 pt-3 text-xs text-primary">
                      <Zap className="h-3.5 w-3.5" />
                      {signal.value}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* 融合价值说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 rounded-xl border border-border/60 bg-card p-6 text-center shadow-sm md:p-8"
        >
          <div className="mb-3 text-sm font-medium text-wheat">融合诊断价值</div>
          <p className="font-serif text-lg font-semibold text-foreground md:text-xl">
            四类信号互为补充、交叉验证，诊断准确率较单模态提升 35% 以上
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            注意力机制自适应加权不同模态的贡献度，结合图卷积网络捕捉部件间时空依赖关系，
            实现对复杂耦合故障的精准定位与机理分析。
          </p>
        </motion.div>
      </div>
    </section>
  );
}
