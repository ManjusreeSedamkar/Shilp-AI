/**
 * Ambient module declarations for packages that don't resolve types
 * correctly under TypeScript "bundler" moduleResolution.
 *
 * These type stubs are minimal — they only suppress TS errors
 * without interfering with the actual runtime types provided by each package.
 */

// onnxruntime-web: exports don't align with bundler resolution
// The library works at runtime; we just suppress the type error here.
declare module 'onnxruntime-web' {
  // Re-export the known env shape used in imageStudio.ts
  const env: {
    wasm: {
      numThreads: number;
      [key: string]: any;
    };
    [key: string]: any;
  };
  export { env };
  export * from 'onnxruntime-web/types';
}
