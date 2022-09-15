<br/>

<h3 align="center">
    <p>Vite Plugin - Optimize CSS Modules</p>
</h3>

<h6 align="center">
    <p><a href="#how-does-it-work">Mangle classnames in production</a> - save up to 20% on css for free!</p>
</h6>

<p align="center">
  <a href="https://github.com/Simonwep/vite-plugin-optimize-css-modules/actions/workflows/ci.yml"><img
     alt="CI Status"
     src="https://github.com/Simonwep/vite-plugin-optimize-css-modules/actions/workflows/ci.yml/badge.svg"/></a>
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
