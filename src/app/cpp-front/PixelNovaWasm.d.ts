declare module '/CppWasm.js' {
  import type { CppWasmModule } from './types';

  interface CreateModuleOptions {
    locateFile?: (path: string) => string;
  }

  export function createCppWasmModule(options?: CreateModuleOptions): Promise<CppWasmModule>;
} 