# Database replication in docker container

## 실행 전 체크리스트

- 사용하고 있던 컨테이너 종료 및 이미지 삭제
- 삭제를 원하지 않는 경우, yml파일의 Container 이름 및 이미지 이름 변경
- Mac os를 사용하는 경우, platform 설정이 필요
  - platform: linux/x86_64
	https://velog.io/@ch4570/MySQL-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EB%B6%84%EC%82%B0-%EC%B2%98%EB%A6%AC%EB%A5%BC-%EC%9C%84%ED%95%9C-Master-Slave-%EC%9D%B4%EC%A4%91%ED%99%94%EB%A5%BC-%EA%B5%AC%EC%84%B1%ED%95%98%EB%8B%A4MySQL-Replication-%EC%84%A4%EC%A0%95%EA%B3%BC-%EA%B5%AC%EC%84%B1

## 실행순서

1. cd docker/db
2. docker-compose -f docker-compose.yml up -d
3. bash entrypoint.sh

## 실행 후 체크리스트

- 결과 창으로 이러한 설정 값이 나왔는지 확인
  - Slave_IO_Running: Yes
  - Slave_SQL_Running: Yes
- Master DB에서 Create/Update/Delete 작업 시, Slave에 재대로 연동되는지 확인
