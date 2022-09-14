import {Plugin, UserConfig} from 'vite';
import {createCounter} from './createCounter';

export interface OptimizeCssModuleOptions {
    dictionary?: string;
}

export const optimizeCssModules = (options?: OptimizeCssModuleOptions): Plugin => {
    const next = createCounter(options?.dictionary);
    const map: Map<string, string> = new Map();

    return {
        name: 'optimize-css-modules',
        apply: 'build',
        config: (): UserConfig => ({
            css: {
                modules: {
                    generateScopedName: (name: string, fileName: string) => {
                        const key = `${fileName} ${name}`;

                        let hash = map.get(key);
                        if (!hash) {
                            map.set(key, (hash = next()));
                        }

                        return hash;
                    }
                }
            }
        })
    };
};
