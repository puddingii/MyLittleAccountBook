# My Little Account Book

일반적인 가계부이며, 그룹 단위로 가계부를 관리할 수 있는 사이트
<https://puddingii.xyz>

## Local Settings

Frontend, Backend를 각각 로컬에서 실행시키는 경우 frontend, backend 폴더의 README.md를 참고

## Production settings

Github-actions와 self-hosted runner를 사용한 CI/CD Pipeline

- frontend, backend 폴더의 root에 있는 Dockerfile을 기반으로 Server에 배포
- DB 세팅의 경우 docker/db/README.md를 참고

front, back은 Nginx를 사용하여 로드밸런싱

## Site

아키텍처 및 시행착오 등의 설명은 아래의 노션 링크를 참고해주시길 바랍니다.
Notion: <https://stormy-lighter-fb5.notion.site/Project-e79d8ae08d544d07b29984653ed35e56?pvs=4>
