# Bento Public

A publicly accessible portal for clinical datasets, where users are able to see high-level statistics of the data 
available through predefined variables of interest and search the data using limited variables at a time. This portal 
allows users to gain a generic understanding of the data available (secure and firewalled) without the need to access 
it directly.


## Prerequisites:
- Node Package Manager


## Development

### Adding a new environment configuration variable

Environment variables are read on the server at request time and served to the client as JSON from
`/public/config.json`, which the page fetches before loading the app. A new variable must be registered in:

1. [`./src/js/types/publicConfig.ts`](./src/js/types/publicConfig.ts): adding a key to the `PublicConfig` type.
2. [`./src/server/publicConfig.ts`](./src/server/publicConfig.ts): mapping the environment variable to that key,
   including parsing and defaults.
3. [`./src/js/config.ts`](./src/js/config.ts): exporting it as a constant for the rest of the app.

### Translations in dev mode
Add your English to French translations in
`public/public/locales/fr/translation_fr.json` for them to appear on the website.


## Theming 

To customize the theme of a running instance of Bento Public, override the 
[`public/public/styles/instance.css`](./public/public/styles/instance.css) file with a custom stylesheet.

Overrides to [Ant Design's theming tokens](https://ant.design/docs/react/customize-theme#design-token) via CSS variable
and other Bento theming variables (see [`src/styles.css`](./src/styles.css)) should be done in the `.bento-theme` class,
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
[`public/public/assets`](./public/public/assets) directory.
