<br/>

<h3 align="center">
    <p>Vite Plugin - Optimize CSS Modules</p>
</h3>

<h6 align="center">
    <p><a href="#how-does-it-work">Mangle classnames in production</a> - save up to 30% on css and 90% of build time for free!</p>
</h6>

<p align="center">
  <a href="https://github.com/Simonwep/vite-plugin-optimize-css-modules/actions/workflows/main.yml"><img
     alt="CI Status"
     src="https://github.com/Simonwep/vite-plugin-optimize-css-modules/actions/workflows/main.yml/badge.svg"/></a>
  <a href="https://www.npmjs.com/package/vite-plugin-optimize-css-modules"><img
     alt="Install count"
     src="https://img.shields.io/npm/dm/vite-plugin-optimize-css-modules.svg"></a>
  <img alt="Current version"
       src="https://img.shields.io/github/tag/Simonwep/vite-plugin-optimize-css-modules.svg?color=3498DB&label=version">
  <a href="https://github.com/sponsors/Simonwep"><img
     alt="Support me"
     src="https://img.shields.io/badge/github-support-3498DB.svg"></a>
</p>

### Setup

This plugin requires [vite](https://vitejs.dev/) of v3 or greater.
It only makes sense to use if you're using [css modules](https://vitejs.dev/config/shared-options.html#css-modules).

```sh
$ npm install --save-dev vite-plugin-optimize-css-modules
```

In your [`vite.config.ts`](https://vitejs.dev/config/#configuring-vite) simply add the plugin:

```ts
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        optimizeCssModules()
    ]
})
```

And that's it. When running `vite build` your generated CSS should be significantly smaller.

### Benchmarks

Benchmarks are done against [bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/) and [materialize.css](https://materializecss.com/getting-started.html) assuming all the classes are used as css modules.
The benchmark code is located in the [benchmarks](./benchmarks) directory.

Run them by building the plugin via `npm run build` and then running `npm run benchmarks`.
The results below are from a MacBook Air M2 with node v22.8.0.

| Input                                                                            | Build Time                            | Gzip Size                                | Brotli Size                             |
|----------------------------------------------------------------------------------|---------------------------------------|------------------------------------------|-----------------------------------------|
| [bootstrap-5.0.2.module.css](benchmarks/fixtures/bootstrap-5.0.2.module.css)     | 525ms (_**-94.06%**_ / _**-8311ms**_) | 21.3 kB (_**-26.53%**_ / _**-7.69 kB**_) | 21.3 kB (_**-27.54%**_ / _**-6 kB**_)   |
| [materialize-1.0.0.module.css](benchmarks/fixtures/materialize-1.0.0.module.css) | 572ms (_**-92.59%**_ / _**-7156ms**_) | 20.1 kB (_**-19.70%**_ / _**-4.93 kB**_) | 20.1 kB (_**-21.33%**_ / _**-4.3 kB**_) |


### How does it work?

By default, when using css modules, you end up with hashes or other long class-names in your bundled css files:

```css
@keyframes _close-card_pzatx_1 {
    /* ...css */
}

._card_pzatx_32 {
    /* ...css */
}

._back_pzatx_49 ._content_pzatx_70 ._close_pzatx_74 {
    /* ...css */
}
```

By using this module, the smalles possible classname will be used for each "id":

```css
@keyframes a {
    /* ...css */
}

.v {
    /* ...css */
}

.c .s .w {
    /* ...css */
}
```
