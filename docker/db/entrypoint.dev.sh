#!/bin/bash

sql_slave_user='GRANT REPLICATION SLAVE ON *.* TO "puddingii"@"%"; FLUSH PRIVILEGES;'

docker exec mysql_master sh -c "mysql -u root -pasd123!!!! -e '$sql_slave_user'"

MS_STATUS=`docker exec mysql_master sh -c 'mysql -u root -pasd123!!!! -e "SHOW MASTER STATUS"'`
CURRENT_LOG=`echo $MS_STATUS | awk '{print $6}'`
CURRENT_POS=`echo $MS_STATUS | awk '{print $7}'`

sql_set_master="CHANGE MASTER TO MASTER_HOST='mysql_master',MASTER_USER='puddingii',MASTER_PASSWORD='asd123!!!!',MASTER_LOG_FILE='$CURRENT_LOG',MASTER_LOG_POS=$CURRENT_POS; START SLAVE;"
start_slave_cmd='mysql -u root -pasd123!!!! -e "'
start_slave_cmd+="$sql_set_master"
start_slave_cmd+='"'
docker exec mysql_slave_1 sh -c "$start_slave_cmd"
docker exec mysql_slave_1 sh -c "mysql -u root -pasd123!!!! -e 'SHOW SLAVE STATUS \G'"


