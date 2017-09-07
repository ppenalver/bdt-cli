#!/usr/bin/env bash
SLEEP_TIME=${SLEEP_TIME:=4}
TIMES=$((${TIMES:=20}))


/etc/bootstrap.sh -d &

RESULT=1
COUNTER=0
while [ "${COUNTER}" -lt "${TIMES}" ] && [ ${RESULT} -gt 0 ]; do
    /usr/local/hadoop-2.7.1/bin/hdfs dfs -put /hdfs_vol/meetup_parquet.parquet /user/root/
    RESULT=$?
    sleep ${SLEEP_TIME}
    let COUNTER=COUNTER+1
done

tail -f /dev/null
