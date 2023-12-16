# Database replication in docker container

## 실행 전 체크리스트

- 사용하고 있던 컨테이너 종료 및 이미지 삭제

  ```bash
  docker-compose -f docker-compose.dev.yml down
  ```

- 삭제를 원하지 않는 경우, yml파일의 Container 이름 및 이미지 이름 변경
- Mac os를 사용하는 경우, platform 설정이 필요
  - platform: linux/x86_64
  https://velog.io/@ch4570/MySQL-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EB%B6%84%EC%82%B0-%EC%B2%98%EB%A6%AC%EB%A5%BC-%EC%9C%84%ED%95%9C-Master-Slave-%EC%9D%B4%EC%A4%91%ED%99%94%EB%A5%BC-%EA%B5%AC%EC%84%B1%ED%95%98%EB%8B%A4MySQL-Replication-%EC%84%A4%EC%A0%95%EA%B3%BC-%EA%B5%AC%EC%84%B1

## Environment

- 기본 비밀번호로 모든 데이터베이스에는 `asd123!!!!`로 설정되어 있음.
- 만약 별도로 설정이 필요하다면 바꿔야하는 부분
  - cache/config/redis.dev.conf

    ```yaml
    # 비밀번호 설정
    requirepass

    # 만약 docker-compose의 network설정을 바꾼다면 변경 필요
    bind
    ```

  - docker-compose.dev.yml

    ```yml
    - MYSQL_ROOT_PASSWORD=Root 패스워드
    - MYSQL_USER= User 이름
    - MYSQL_DATABASE=Database 이름
    - MYSQL_PASSWORD= User 패스워드
    ```

  - 위의 docker-compose에서 변경 시, `entrypoint.dev.sh`에서 매칭해야할 목록

      ```yml
      - environment
      - container_name
      ```

## Development 환경에서 실행순서

``` bash
cd docker/db
docker-compose -f docker-compose.dev.yml up -d
bash entrypoint.dev.sh
```

## 실행 후 체크리스트

- Slave에서 `SHOW SLAVE STATUS`를 사용하여 Replication 확인
  - Slave_IO_Running: Yes
  - Slave_SQL_Running: Yes
  - Master_Host: master 호스트
  - Master_User: master 유저
  - Master_Port: master 포트
- Master DB에서 Create/Update/Delete 작업 시, Slave에 재대로 연동되는지 확인
