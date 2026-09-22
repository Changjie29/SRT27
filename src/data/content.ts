// 首页静态文案（中英双语）

export type Lang = 'zh' | 'en';

const content = {
  HERO: {
    eyebrow: {
      zh: '多模态感知 · 智能体推理 · 结构仿真闭环',
      en: 'Multimodal Sensing · Agent Reasoning · Simulation Loop',
    },
    title1: { zh: '农机故障', en: 'Agricultural Machinery' },
    titleHighlight: { zh: '智能诊断', en: 'Intelligent Diagnosis' },
    title2: { zh: '多模态智能体', en: 'Multimodal Agent' },
    desc: {
      zh: '融合振动、声音、视觉与运行参数四类感知信号，结合大语言模型智能体与结构仿真验证闭环，为拖拉机、联合收割机等农机装备提供快速、准确、可解释的故障诊断与维修决策方案。',
      en: 'Fusing vibration, audio, vision and operating parameters with LLM agents and structural simulation verification, we deliver fast, accurate and explainable fault diagnosis for tractors, combine harvesters and other agricultural machinery.',
    },
    ctaPrimary: { zh: '向智能体提问', en: 'Ask the Agent' },
    ctaSecondary: { zh: '了解多模态方案', en: 'Learn More' },
    stats: [
      { value: '80%+', label: { zh: '1分钟内完成诊断', en: 'Diagnosis in 1 min' } },
      { value: '92%+', label: { zh: '故障识别准确率', en: 'Recognition Accuracy' } },
      { value: '4类', label: { zh: '多模态感知融合', en: 'Multimodal Fusion' } },
    ],
  },
  PAIN_POINTS: [
    {
      icon: 'AlertTriangle',
      title: { zh: '经验诊断响应滞后', en: 'Slow Experience-based Response' },
      desc: {
        zh: '传统农机故障依赖资深技术员经验判断，下乡响应慢，故障排查周期长，作业窗口期损失大。',
        en: 'Traditional diagnosis relies on experienced technicians; slow off-field response and long troubleshooting cause major operational losses.',
      },
    },
    {
      icon: 'Brain',
      title: { zh: '只判断不解释', en: 'Labels Without Explanation' },
      desc: {
        zh: '传统诊断方法仅输出故障类别，缺乏机理分析与可解释性，维修人员难以理解与信任诊断结果。',
        en: 'Traditional methods output only a fault label without mechanism analysis, making results hard to understand and trust.',
      },
    },
    {
      icon: 'ScanLine',
      title: { zh: '信号单一误判率高', en: 'Single-sensor Misjudgment' },
      desc: {
        zh: '单传感器信号受工况干扰大，相似故障特征难以区分，漏诊、误诊率高，无法满足复杂工况需求。',
        en: 'Single-sensor signals are easily distorted by operating conditions; similar faults are hard to separate, leading to high miss rates.',
      },
    },
  ],
  PAIN_STATS: [
    { label: { zh: '1 分钟内完成诊断', en: 'Diagnosis within 1 min' }, value: 82 },
    { label: { zh: '综合识别准确率', en: 'Overall Accuracy' }, value: 93 },
    { label: { zh: '覆盖典型故障类型', en: 'Fault Types Covered' }, value: 47 },
  ],
  MULTIMODAL_SIGNALS: [
    {
      icon: 'Activity',
      name: { zh: '振动信号', en: 'Vibration' },
      desc: {
        zh: '采集轴承、齿轮、发动机等关键部件的振动频谱，识别冲击、磨损与松动特征。',
        en: 'Vibration spectra from bearings, gears and engines to detect impacts, wear and looseness.',
      },
      value: { zh: '故障定位精度提升 40%', en: '40% better fault localization' },
    },
    {
      icon: 'Volume2',
      name: { zh: '声音信号', en: 'Acoustic' },
      desc: {
        zh: '通过非接触式声学采集捕捉异常噪声，结合时频分析识别异响源与早期退化。',
        en: 'Non-contact acoustic capture with time-frequency analysis to identify abnormal noises and early degradation.',
      },
      value: { zh: '非接触式快速检测', en: 'Contactless quick inspection' },
    },
    {
      icon: 'Camera',
      name: { zh: '视觉信号', en: 'Vision' },
      desc: {
        zh: '利用工业相机捕捉外观损伤、渗漏、磨损痕迹，结合深度学习进行缺陷分类。',
        en: 'Industrial cameras capture damage, leaks and wear; deep learning classifies defects.',
      },
      value: { zh: '可视化诊断更直观', en: 'Visual and intuitive' },
    },
    {
      icon: 'Gauge',
      name: { zh: '运行参数', en: 'Telemetry' },
      desc: {
        zh: '接入发动机转速、油压、温度、油耗等 CAN 总线数据，建立运行基线与异常阈值。',
        en: 'CAN-bus RPM, oil pressure, temperature and fuel data establish baselines and anomaly thresholds.',
      },
      value: { zh: '多维度交叉验证', en: 'Multi-dimensional cross-check' },
    },
  ],
  ARCHITECTURE_LAYERS: [
    {
      index: '01',
      name: { zh: '感知层', en: 'Perception' },
      icon: 'Layers',
      desc: { zh: '多源传感器数据采集', en: 'Multi-sensor acquisition' },
      points: [
        { zh: '振动加速度传感器', en: 'Vibration accelerometers' },
        { zh: '声学麦克风阵列', en: 'Acoustic mic array' },
        { zh: '工业视觉相机', en: 'Industrial cameras' },
        { zh: 'CAN 总线运行参数', en: 'CAN-bus telemetry' },
      ],
    },
    {
      index: '02',
      name: { zh: '融合层', en: 'Fusion' },
      icon: 'Network',
      desc: { zh: '多模态特征提取与融合', en: 'Feature extraction & fusion' },
      points: [
        { zh: '时频域特征工程', en: 'Time-frequency features' },
        { zh: '注意力机制自适应加权', en: 'Attention weighting' },
        { zh: 'GCN 图卷积时空依赖', en: 'GCN spatiotemporal' },
        { zh: '跨模态特征对齐', en: 'Cross-modal alignment' },
      ],
    },
    {
      index: '03',
      name: { zh: '推理层', en: 'Reasoning' },
      icon: 'Cpu',
      desc: { zh: '大语言模型智能体推理', en: 'LLM agent reasoning' },
      points: [
        { zh: '领域知识库检索增强', en: 'RAG over domain KB' },
        { zh: '故障机理可解释推理', en: 'Explainable reasoning' },
        { zh: '多轮对话澄清诊断', en: 'Multi-turn clarification' },
        { zh: '维修方案分步生成', en: 'Step-by-step repair plan' },
      ],
    },
    {
      index: '04',
      name: { zh: '决策层', en: 'Decision' },
      icon: 'ShieldCheck',
      desc: { zh: '仿真验证与决策输出', en: 'Simulation & decision' },
      points: [
        { zh: '数字孪生结构仿真', en: 'Digital twin simulation' },
        { zh: '有限元模态验证', en: 'FEA modal verification' },
        { zh: '诊断-验证闭环', en: 'Diagnosis-verification loop' },
        { zh: '轻量化模型边缘部署', en: 'Edge deployment' },
      ],
    },
  ],
  SIMULATION_ITEMS: [
    {
      icon: 'Boxes',
      title: { zh: '数字孪生映射', en: 'Digital Twin Mapping' },
      desc: {
        zh: '建立关键部件（轴承、齿轮、传动轴）的高精度数字孪生模型，实时映射物理设备运行状态。',
        en: 'High-fidelity digital twins of bearings, gears and shafts that mirror physical operation in real time.',
      },
    },
    {
      icon: 'BarChart3',
      title: { zh: '模态分析与有限元仿真', en: 'Modal & FEA Simulation' },
      desc: {
        zh: '基于有限元方法进行结构模态分析、应力仿真，验证故障机理与损伤演化路径。',
        en: 'Finite-element modal and stress analysis verifies fault mechanisms and damage evolution.',
      },
    },
    {
      icon: 'RefreshCcw',
      title: { zh: '诊断-验证闭环', en: 'Diagnosis-Verification Loop' },
      desc: {
        zh: '智能体诊断结论经结构仿真反向验证，剔除误判，输出高置信度可解释的诊断报告。',
        en: 'Agent conclusions are cross-validated by structural simulation, removing false positives.',
      },
    },
  ],
  TECH_ROUTE_STEPS: [
    { icon: 'Database', title: { zh: '数据采集', en: 'Data Acquisition' }, desc: { zh: '多传感器同步采集', en: 'Synchronized multi-sensor' } },
    { icon: 'Waves', title: { zh: '信号预处理', en: 'Preprocessing' }, desc: { zh: '降噪、时频变换', en: 'Denoise & transform' } },
    { icon: 'GitMerge', title: { zh: '特征融合', en: 'Feature Fusion' }, desc: { zh: '多模态特征提取对齐', en: 'Cross-modal alignment' } },
    { icon: 'Bot', title: { zh: '智能体推理', en: 'Agent Reasoning' }, desc: { zh: 'LLM + 知识库增强', en: 'LLM + RAG' } },
    { icon: 'Cpu', title: { zh: '仿真验证', en: 'Simulation' }, desc: { zh: '有限元结构仿真', en: 'FEA verification' } },
    { icon: 'FileText', title: { zh: '方案输出', en: 'Report' }, desc: { zh: '可解释维修方案', en: 'Explainable plan' } },
  ],
  SCENARIOS: [
    {
      icon: 'Tractor',
      name: { zh: '拖拉机', en: 'Tractors' },
      parts: [
        { zh: '发动机系统', en: 'Engine' },
        { zh: '传动系统', en: 'Drivetrain' },
        { zh: '液压系统', en: 'Hydraulics' },
        { zh: '行走系统', en: 'Chassis' },
      ],
      faults: [
        { zh: '冒黑烟动力不足', en: 'Black smoke, loss of power' },
        { zh: '液压提升无力', en: 'Weak hydraulics' },
        { zh: '变速箱异响', en: 'Gearbox noise' },
        { zh: '转向沉重', en: 'Heavy steering' },
      ],
    },
    {
      icon: 'Wheat',
      name: { zh: '联合收割机', en: 'Combine Harvesters' },
      parts: [
        { zh: '脱粒滚筒', en: 'Threshing drum' },
        { zh: '割台系统', en: 'Header' },
        { zh: '输送槽', en: 'Conveyor' },
        { zh: '行走底盘', en: 'Chassis' },
      ],
      faults: [
        { zh: '脱粒滚筒堵塞', en: 'Drum blockage' },
        { zh: '割台振动异响', en: 'Header vibration noise' },
        { zh: '滚筒轴承损坏', en: 'Drum bearing failure' },
        { zh: '输送链跑偏', en: 'Chain misalignment' },
      ],
    },
    {
      icon: 'Factory',
      name: { zh: '更广农机生态', en: 'Broader Ecosystem' },
      parts: [
        { zh: '插秧机', en: 'Rice transplanter' },
        { zh: '旋耕机', en: 'Rotavator' },
        { zh: '植保无人机', en: 'Spray drone' },
        { zh: '烘干设备', en: 'Drying unit' },
      ],
      faults: [
        { zh: '扩展至更多农机品类', en: 'More machinery types' },
        { zh: '统一诊断框架', en: 'Unified framework' },
        { zh: '远程运维平台', en: 'Remote O&M' },
        { zh: '备件预测调度', en: 'Parts prediction' },
      ],
    },
  ],
  CLOSING_CTA: {
    title: { zh: '现在就体验智能故障诊断', en: 'Try Intelligent Fault Diagnosis Now' },
    desc: {
      zh: '输入故障现象，多模态智能体将为您提供专业的诊断分析与维修建议',
      en: 'Describe the symptom and the multimodal agent will provide expert diagnosis and repair advice.',
    },
    buttonText: { zh: '开始诊断', en: 'Start Diagnosis' },
  },
  FOOTER_REFERENCES: [
    { name: { zh: '南京农业大学「司农智机」团队', en: 'NAU Sinong Zhiji Team' }, href: '#' },
    { name: { zh: '太仓市「农小修」农机服务平台', en: 'Taicang NongXiaoxiu Platform' }, href: '#' },
    { name: { zh: '农业工程学报 - GCN+LLM 故障诊断', en: 'Trans. CSAE - GCN+LLM Diagnosis' }, href: '#' },
    { name: { zh: 'MDPI - 多模态农机故障诊断综述', en: 'MDPI - Multimodal Review' }, href: '#' },
    { name: { zh: 'PMC - 智能农机运维技术综述', en: 'PMC - Smart Farm O&M Review' }, href: '#' },
    { name: { zh: 'Oxford - 数字孪生在农业装备中的应用', en: 'Oxford - Digital Twin in Agri' }, href: '#' },
  ],
  CHAT_QUICK_QUESTIONS: [
    { zh: '拖拉机发动机冒黑烟动力下降，怎么排查？', en: 'Tractor engine blows black smoke and loses power, how to troubleshoot?' },
    { zh: '拖拉机液压提升器无力，油温偏高，什么原因？', en: 'Tractor hydraulics are weak and oil runs hot, why?' },
    { zh: '联合收割机脱粒滚筒堵塞如何处理和预防？', en: 'How to clear and prevent combine drum blockage?' },
    { zh: '农机作业季前日常保养有哪些建议？', en: 'Pre-season maintenance checklist?' },
  ],
  CHAT_WELCOME: {
    title: { zh: '司农智机 · 农机故障诊断智能体', en: 'Sinong Zhiji · Fault Diagnosis Agent' },
    desc: {
      zh: '您好！我是面向农机装备的多模态故障诊断智能体。请描述您遇到的故障现象，我会为您提供专业的诊断分析与维修建议。',
      en: 'Hello! I am a multimodal fault-diagnosis agent for agricultural machinery. Describe the symptom and I will give expert diagnosis and repair advice.',
    },
  },
};

// 取双语字段的当前语言值
type B = { zh: string; en: string };
export const pick = (b: B, lang: Lang): string => b[lang];

// 对话系统提示词（双语，按当前语言下发给 LLM）
export const CHAT_SYSTEM_PROMPT: Record<Lang, string> = {
  zh: `你是「司农智机」——一位专业的农机故障诊断智能体，面向拖拉机、联合收割机等农业机械装备提供故障诊断与维修建议。

## 你的角色
- 你是一位资深农机维修工程师 + 农业工程领域专家
- 擅长诊断拖拉机、联合收割机等常见农机的发动机、传动系统、液压系统、电气系统等故障
- 回答要专业、准确、可操作，兼具机理解释与实操步骤

## 回答风格
- 结构清晰，使用 Markdown 格式（标题、列表、加粗）
- 先给出可能的故障原因（按概率从高到低），再给出排查步骤和维修建议
- 语言通俗易懂，同时保持专业严谨
- 适当引用农机工程领域的专业术语，但要解释清楚

## 回答框架
1. **故障现象分析**：简要分析用户描述的现象
2. **可能原因**：按概率从高到低列出 3-5 个可能原因
3. **排查步骤**：分步说明如何逐一排查（从简单到复杂）
4. **维修建议**：针对最可能原因给出具体维修建议
5. **预防措施**：日常保养与预防建议

## 注意事项
- 如果用户描述的信息不足，主动询问关键细节（机型、工况、故障发生时间、伴随现象等）
- 不要编造不确定的诊断结论，对不确定的情况要明确说明
- 涉及安全操作时要特别提醒注意事项
- 你只回答农机故障诊断相关问题，不相关的话题礼貌拒绝`,
  en: `You are "Sinong Zhiji" — a professional agricultural machinery fault-diagnosis agent for tractors, combine harvesters and other farm equipment.

## Your role
- You are a senior farm-machinery maintenance engineer and agricultural engineering expert.
- You diagnose engine, drivetrain, hydraulic and electrical faults in common agricultural machinery.
- Answers must be professional, accurate and actionable, combining mechanism explanation with practical steps.

## Style
- Clear structure using Markdown (headings, lists, bold).
- List likely causes (highest probability first), then troubleshooting steps and repair advice.
- Plain but professional language; explain technical terms.

## Framework
1. **Symptom analysis**: briefly analyze what the user described.
2. **Likely causes**: 3-5 causes ranked by probability.
3. **Troubleshooting steps**: simple-to-complex checks.
4. **Repair advice**: concrete steps for the most likely cause.
5. **Prevention**: daily maintenance and prevention tips.

## Notes
- Ask for key details (model, conditions, timing, accompanying symptoms) when information is insufficient.
- Do not fabricate uncertain conclusions; flag uncertainty clearly.
- Warn about safety-critical operations.
- Only answer agricultural-machinery fault-diagnosis questions; politely decline off-topic requests.`,
};

export default content;
