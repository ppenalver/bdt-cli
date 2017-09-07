#!/usr/bin/env bash


echo "Selenium service: "
# export HOST_IP=172.19.0.238
export SELENIUM_VERSION=3.0
export SELENIUM_MINOR_VERSION=${SELENIUM_VERSION}.1
export SELENIUM_PORT=4444
export RUN_PATH=$(pwd)
export OUT_PATH=${RUN_PATH}
export SELENIUM_PID=`cat ${RUN_PATH}/selenium.pid 2> /dev/null`
export BROWSER_PID=`cat ${RUN_PATH}/browser.pid 2> /dev/null`
export SELENIUM_PATH=${RUN_PATH}/selenium-server-standalone.jar
export BROWSER_PATH=${RUN_PATH}/chromedriver
export CHROMEDRIVER_VERSION=2.27

function check_services () {
  SELENIUM_ST=""
  BROWSER_ST=""
  if [[ "$SELENIUM_PID" != "" ]] && [[ -e /proc/${SELENIUM_PID} ]]; then
    export SELENIUM_ST=true
  fi
  if [[ "$BROWSER_PID" != "" ]] && [[ -e /proc/${BROWSER_PID} ]]; then
    export BROWSER_ST=true
  fi
}

function download_executables () {
    SELENIUM_URL="http://selenium-release.storage.googleapis.com/${SELENIUM_VERSION}/selenium-server-standalone-${SELENIUM_MINOR_VERSION}.jar"
    CHROMEDRIVER_URL="https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip"


    if [[ ! -f "$SELENIUM_PATH" ]]; then
       echo "Download selenium"
       curl ${SELENIUM_URL} > ${SELENIUM_PATH}
       chmod +x ${SELENIUM_PATH}
    fi
    if [[ ! -f "$BROWSER_PATH" ]]; then
       echo "Download Browser"
       cd ${RUN_PATH};wget -qO- ${CHROMEDRIVER_URL} | jar xvf /dev/stdin
       chmod +x ${BROWSER_PATH}

    fi
}


check_services

function main () {
  case $1 in
    start)
      download_executables
      if [[ "$HOST_IP" == "" ]]; then
        echo -n "Enter your public IP [ENTER]: "
          read HOST_IP
      fi
      if [[ ${SELENIUM_ST} == "" ]]; then
        echo "Starting Selenium"
        nohup java -jar ${RUN_PATH}/selenium-server-standalone.jar -host ${HOST_IP} -role hub >> ${OUT_PATH}/selenium.log 2>&1&
        SELENIUM_PID=$!
        echo -n ${SELENIUM_PID} > ${RUN_PATH}/selenium.pid
        echo "Selenium started on 4444, Log on ${OUT_PATH}/selenium.log and sout.log (PID=$SELENIUM_PID). Waiting 3 Sec."
        sleep 3
      else
        echo "ERROR: Selenium is running on 4444"
      fi
      if [[ ${BROWSER_ST} == "" ]]; then
        echo "Starting Browser"
        nohup java -jar -Dwebdriver.chrome.driver=chromedriver ${RUN_PATH}/selenium-server-standalone.jar \
                   -host ${HOST_IP} -role node -hub http://${HOST_IP}:${SELENIUM_PORT}/grid/register \
                   -browser browserName=chrome,version=Atest >> ${OUT_PATH}/browser.log 2>&1&
        BROWSER_PID=$!
        echo -n ${BROWSER_PID} > ${RUN_PATH}/browser.pid
        echo "Browser started Log on ${OUT_PATH}/browser.log (PID=$BROWSER_PID)"
      else
        echo "ERROR: Browser is running"
      fi
    ;;
    stop)
      if [[ ${SELENIUM_ST} == "" ]]; then
        echo "ERROR: Selenium is not running"
      else
        echo "Stoping Selenium (PID=$SELENIUM_PID)"
        kill ${SELENIUM_PID}
      fi
      if [[ ${BROWSER_ST} == "" ]]; then
        echo "ERROR: Browser is not running"
      else
        echo "Stoping Browser (PID=$BROWSER_PID)"
        kill ${BROWSER_PID}
        echo "Browser stoped. Waiting 2 Sec."
        sleep 2
      fi
    ;;
    force-stop)
      echo "Trying to stop the service without forcing"
      main stop
      echo "Waiting 2 Sec. (normal stop)"
      sleep 2
      check_services
      if [[ ${BROWSER_ST} == "" ]]; then
        echo "INFO: Browser is not running"
      else
        echo "Stoping Browser (PID=${BROWSER_PID})"
        kill -9 ${BROWSER_PID}
        echo "Browser stoped."
      fi

      if [[ ${SELENIUM_ST} == "" ]]; then
        echo "INFO: Selenium is not running"
      else
        echo "Stoping Selenium (PID=$SELENIUM_PID)"
        kill -9 ${SELENIUM_PID}
      fi
    ;;
    force-download)
      echo "Removing old executables"
      rm -f ${SELENIUM_PATH}
      rm -f ${BROWSER_PATH}
      download_executables
    ;;
    status)
      if [[ ${SELENIUM_ST} == "" ]]; then
        echo "Selenium is not running"
      else
        echo "Selenium is running on 4444 (PID=$SELENIUM_PID)"
      fi
      if [[ ${BROWSER_ST} == "" ]]; then
        echo "Browser is not running"
      else
        echo "Browser is running (PID=$BROWSER_PID)"
      fi
    ;;
    *)
      echo "Usage: $0 (start|stop|force-stop|status|force-download|help)"
    ;;
  esac
}

main $1
