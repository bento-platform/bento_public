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
