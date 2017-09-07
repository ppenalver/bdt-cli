const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const colors = require('colors');

const appDir = process.cwd();

var self = (module.exports = {
   checkEnv: () => {
      if (fs.existsSync(path.join(appDir, '.env'))) {
         return true;
      } else {
         console.log(
            'The configuration file does not exist. Initialize the configuration with the bdt init command'
               .red
         );
      }
   }
});
