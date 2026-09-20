// 插件类型声明
export interface PluginInstance {
  id: string;
  name: string;
  description?: string;
  pluginKey: string;
}

export interface CapabilityConfig {
  id: string;
  name: string;
  type: 'plugin' | 'function';
}
