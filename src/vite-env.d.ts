/// <reference types="vite/client" />

// GLB 模型文件模块声明
declare module '*.glb?url' {
  const src: string;
  export default src;
}

declare module '*.glb' {
  const src: string;
  export default src;
}

export {};
