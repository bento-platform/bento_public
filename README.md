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

1. [`./create_config_prod.js`](./create_config_prod.js): mapping the environment variable to a config object entry for 
   production.
2. [`./webpack.config.js`](./webpack.config.js): setting a default value for the environment variable; used in Webpack development 
   builds.
3. [`./src/public/config.js`](./src/public/config.js): creating the shape of the global config object (using the config object entry key, 
   mapped to in 1.)
4. [`./src/js/config.ts`](./src/js/config.ts): loading from the global config object (production) via key or from the 
   environment variable directly, through Webpack replacement (development).

### Translations in dev mode
Add your English to French translations in `dist/public/locales/fr/translation_fr.json` for them to appear on the
website.


## Theming 

To customize the theme of a running instance of Bento Public, override the 
[`/(src|dist)/public/styles/instance.css`](./src/public/styles/instance.css) file with a custom stylesheet.

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
This license does not apply to the assets that are found under the [`src/public/assets`](./src/public/assets) directory.
