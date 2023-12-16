MS_STATUS=`mysql -h host.docker.internal -u root -P 13306 -pasd123!!!! -e "SHOW MASTER STATUS"`
CURRENT_LOG=`echo $MS_STATUS | awk '{print $6}'`
CURRENT_POS=`echo $MS_STATUS | awk '{print $7}'`

sql_set_master="CHANGE MASTER TO MASTER_HOST='mysql_master',MASTER_USER='puddingii',MASTER_PASSWORD='asd123!!!!',MASTER_LOG_FILE='$CURRENT_LOG',MASTER_LOG_POS=$CURRENT_POS; START SLAVE;"
mysql -u root -pasd123!!!! -e "$sql_set_master"
mysql -u root -pasd123!!!! -e 'SHOW SLAVE STATUS \G'
