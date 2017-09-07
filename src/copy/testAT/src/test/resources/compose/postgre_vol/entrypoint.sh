#!/usr/bin/env bash
./app-entrypoint.sh nami start --foreground postgresql &

SLEEP_TIME=${SLEEP_TIME:=4}
TIMES=$((${TIMES:=20}))
if [[ "$POSTGRESQL_PASSWORD" == "" ]]; then
    PSW="-w"
else
    PSW="-W ${POSTGRESQL_PASSWORD}"
fi
AA=${AA:="-w"}
RESULT=1
COUNTER=0
while [ "${COUNTER}" -lt "${TIMES}" ] && [ ${RESULT} -gt 0 ]; do
    pg_restore -c -U ${POSTGRESQL_USER} -d ${POSTGRESQL_DATABASE} ${PSW} -v /postgre_vol/dvdrental.tar
    RESULT=$?
    sleep ${SLEEP_TIME}
    let COUNTER=COUNTER+1
done


tail -f /dev/null
