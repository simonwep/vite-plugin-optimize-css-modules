import {Plugin, UserConfig} from 'vite';
import {counter} from './counter';

export interface OptimizeCssModuleOptions {
  dictionary?: string;
  apply?: 'build' | 'serve';
}

export const optimizeCssModules = (options?: OptimizeCssModuleOptions): Plugin => {
  const next = counter(options?.dictionary);
  const map: Map<string, string> = new Map();

  return {
    name: 'optimize-css-modules',
    apply: options?.apply ?? 'build',
    config: (): UserConfig => ({
      css: {
        modules: {
          generateScopedName: (name: string, fileName: string) => {
            const key = fileName + name;

            let hash = map.get(key);
            if (!hash) {
              map.set(key, (hash = next()));
            }

            return hash!;
          }
        }
      }
    })
  };
};
