const { exec } = require('child_process');
const Promise = require('bluebird');
const path = require('path');
const ip = require('ip');

const FOLDERNAME = process.env.FOLDERNAME || '';

const directoryBase = path.join(process.cwd(), FOLDERNAME);
const directory = path.join(directoryBase, 'src/test/resources');

var self = (module.exports = {
   executeSelenium: () => {
      return new Promise((resolve, reject) => {
         process.env.HOST_IP = ip.address();

         let seleniumStop = exec(
            './selenium_service.sh stop',
            { cwd: directory },
            err => {}
         );

         seleniumStop.on('close', data => {
            let selenium = exec(
               './selenium_service.sh start',
               { cwd: directory },
               err => {
                  if (err) {
                     reject(err);
                  }

                  resolve(true);
               }
            );

            selenium.stdout.on('data', data => console.log(data));
         });
      });
   },
   executeTest: testName => {
      return new Promise((resolve, reject) => {
         let test = exec(
            `mvn clean verify -DHOST=${process.env.HOST_TEST} -DPORT=${process
               .env.PORT_TEST} -Dit.test=${process.env
               .GROUPID}.${testName}IT -DSELENIUM_GRID=${ip.address()}:4444`,
            { cwd: directoryBase },
            err => {
               if (err) {
                  reject(err);
               }

               resolve(true);
            }
         );

         test.stdout.on('data', data => console.log(data));
      });
   },
   executeAllTest: () => {
      return new Promise((resolve, reject) => {
         let test = exec(
            `mvn clean verify -DHOST=${process.env.HOST_TEST} -DPORT=${process
               .env
               .PORT_TEST} -Dgroups=basic -DSELENIUM_GRID=${ip.address()}:4444`,
            { cwd: directoryBase },
            err => {
               if (err) {
                  reject(err);
               }

               resolve(true);
            }
         );

         test.stdout.on('data', data => console.log(data));
      });
   }
});
