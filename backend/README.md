# My Little Account Book Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Price](https://img.shields.io/badge/price-FREE-0098f7.svg)]

Document: <https://stormy-lighter-fb5.notion.site/Backend-Document-7fa0a98680c54e7f839f8c72152761ec?pvs=4>

나의 작은 가계부 백엔드
가계부를 그룹 혹은 개별로 관리할 수 있으며, 상황에 따라 여러 가계부를 생성하여 사용할 수 있는 가계부 입니다.

## Before start

Development 환경으로 시작할 시, .env.local 파일이 필요합니다. 필요한 ENV 변수는 docker/web/README.md 를 참고하세요

## Getting started

Clone from GitHub

```bash
git clone https://github.com/puddingii/MyLittleAccountBook.git
cd backend
yarn
yarn start
```

## Technology stack

- Express Server
- Socket.io
- Docker
- Typescript
- Using DB (Mysql, Redis)
- Test framework(Mocha.js, Grafana K6, Clinic.js)
