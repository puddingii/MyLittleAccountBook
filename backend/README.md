# My Little Account Book Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![Test Status](https://camo.githubusercontent.com/0d53f97d09db4773b1b131adb28ad4b64b59aed6a6243bb52571e7161736f14e/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f74657374732d3336382532307061737365642d73756363657373) [![Coverage Status](https://coveralls.io/repos/github/puddingii/MyLittleAccountBook/badge.svg)](https://coveralls.io/github/puddingii/MyLittleAccountBook)

Document: <https://stormy-lighter-fb5.notion.site/Backend-Document-7fa0a98680c54e7f839f8c72152761ec?pvs=4>

## Before start

Development 환경으로 시작할 시 .env.local 파일이 필요합니다. 필요한 ENV 변수는 docker/web/README.md 를 참고하세요

## Getting started

```bash
git clone https://github.com/puddingii/MyLittleAccountBook.git
cd backend

# Install dependencies
yarn

# Development start
yarn dev:start
# Production start
yarn start
```

## Technology stack

- Typescript
- Express Server
- Socket.io
- Docker
- Using DB (Mysql, Redis)
- Test framework(Mocha.js, Grafana K6, Clinic.js)
