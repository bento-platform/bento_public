# Bento Public

A publicly accessible portal for clinical datasets, where users are able to see high-level statistics of the data 
available through predefined variables of interest and search the data using limited variables at a time. This portal 
allows users to gain a generic understanding of the data available (secure and firewalled) without the need to access 
it directly. Initially, this portal facilitates the search in English language only, but the French language will be 
added at a later time.

## Prerequisites:
- Node Package Manager
- Go version >= 1.19

## Getting started:

First, run
```bash
cp etc/example.server.env server.env
```
and modify the contents according to your needs.

If needed, install the relevant Go dependencies:

```bash
go mod download
```

Finally, install the NPM dependencies and run the build process:
```bash
npm install
npm run gobuild
```

## Translations in dev mode
Add your English to French translations in `www/public/locales/fr/translation_fr.json` for them to appear on the website.
