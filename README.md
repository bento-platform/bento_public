# Bento Public

A publicly accessible portal for clinical datasets, where users are able to see high-level statistics of the data available through predefined variables of interest and search the data using limitied variables at a time. This portal allows users to gain a generic understanding of the data available (secure and firewalled) without the need to access it directly. Initially, this portal facilitates the search in English language only, but the French language will be added at a later time.

## Prerequisites:
- Node Package Manager
- Go version >= 1.15

## Getting started:

First, run
```
    cp etc/example.client.env client.env
    cp etc/example.server.env server.env
```
and modify the contents according to your needs.

Next,
```
    export GO111MODULE=off
    
    npm install
    npm run gobuild
```