/// <reference types="vite/client" />

declare module 'onnxruntime-web' {
  const content: any;
  export default content;
  export const env: any;
}

declare module '@imgly/background-removal' {
  const content: any;
  export default content;
  export const removeBackground: any;
}
