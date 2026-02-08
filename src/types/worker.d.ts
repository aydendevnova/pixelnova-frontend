declare module "*.worker.js" {
  const content: new () => Worker;
  export default content;
}

// Add WebWorker types
declare type DedicatedWorkerGlobalScope = Worker & {
  postMessage: (message: any) => void;
  onmessage: ((event: MessageEvent) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  onmessageerror: ((event: MessageEvent) => void) | null;
};
