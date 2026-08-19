# Bento Public

A publicly accessible portal for clinical datasets, where users are able to see high-level statistics of the data 
available through predefined variables of interest and search the data using limited variables at a time. This portal 
allows users to gain a generic understanding of the data available (secure and firewalled) without the need to access 
it directly.


## Prerequisites:
- Node Package Manager


## Development

### Adding a new environment configuration variable

Any new environment / configuration variable must be registered in several places:

1. [`./next-app/src/app/public/config.js/route.ts`](./next-app/src/app/public/config.js/route.ts):
   mapping the environment variable to a config object entry, read live at request time.
2. [`./next-app/next.config.ts`](./next-app/next.config.ts): setting a build-time default value for the
   environment variable, used as a fallback in local `next dev`.
3. [`./next-app/src/js/config.ts`](./next-app/src/js/config.ts): loading from the global config object
   (via key from 1.) or from the environment variable directly (via key from 2., as a fallback).

### Translations in dev mode
Add your English to French translations in
`next-app/public/public/locales/fr/translation_fr.json` for them to appear on the website.


## Theming 

To customize the theme of a running instance of Bento Public, override the 
[`next-app/public/public/styles/instance.css`](./next-app/public/public/styles/instance.css) file with a custom stylesheet.

Overrides to [Ant Design's theming tokens](https://ant.design/docs/react/customize-theme#design-token) via CSS variable
and other Bento theming variables (see [`next-app/src/styles.css`](./next-app/src/styles.css)) should be done in the `.bento-theme` class,
e.g.:

```css
.bento-theme {
    --ant-font-family: "Futura", sans-serif;
}
```

**Note:** DO NOT override the `--ant-color-primary` design token, since then Ant is unable to calculate shading 
variations of the primary colour correctly.


## LICENSE

The code in this repository is licensed under the terms of the [GNU Lesser General Public License v3](./LICENSE) and is 
&copy; the Canadian Centre for Computational Genomics, McGill University.
This license does not apply to the assets that are found under the
[`next-app/public/public/assets`](./next-app/public/public/assets) directory.
