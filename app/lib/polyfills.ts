/**
 * Polyfill for Promise.withResolvers for Node.js versions < 20.13.0
 * This ensures compatibility with react-pdftotext which uses this method internally
 */

// Check if Promise.withResolvers is not available and add polyfill
if (!Promise.withResolvers) {
  Promise.withResolvers = function<T>() {
    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason?: any) => void;
    
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    
    return { promise, resolve: resolve!, reject: reject! };
  };
}

export {};
