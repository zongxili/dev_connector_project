# Dev Connector

## Overview

This project is owned by [Zongxi Li](https://www.linkedin.com/in/zongxi-li/) and has been developed  since December 2023.

This is a social network app includes authentication, profiles, and forum posts built by React, Node.js, Express, Redux, and MongoDB.

# Installation & Quick Start

Add a default.json file in config folder with the following:
```
  "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
  "jwtSecret": "secret",
  "githubToken": "<yoursecrectaccesstoken>"
```
Install server dependencies:
```
npm install
```
Install client dependencies
```
cd client
npm install
```
Run both Express & React from root
```
npm run dev
```
Build for production
```
cd client
npm run build
```
