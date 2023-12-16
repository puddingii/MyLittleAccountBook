#!/bin/bash

sql_slave_user='GRANT REPLICATION SLAVE ON *.* TO "puddingii"@"%"; FLUSH PRIVILEGES;'

mysql -u root -pasd123!!!! -e "$sql_slave_user"