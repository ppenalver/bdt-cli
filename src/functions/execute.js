const { exec } = require('child_process');
const Promise = require('bluebird');
const path = require('path');
const ip = require('ip');

const directoryBase = path.join(process.cwd(), process.env.FOLDERNAME);

const directory = path.join(directoryBase, 'src/test/resources');

var self = (module.exports = {
   executeSelenium: () => {
      return new Promise((resolve, reject) => {
         process.env.HOST_IP = ip.address();

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
   },
   executeTest: testName => {
      return new Promise((resolve, reject) => {
         let test = exec(
            `mvn verify -DDICTIONARY_HOST=${ip.address()} -DDICTIONARY_PORT=8043 -Dit.test=${process
               .env
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
   }
});
