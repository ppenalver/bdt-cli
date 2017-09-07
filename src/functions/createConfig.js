const dotenv = require('dotenv');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');

let config = dotenv.config();

var self = (module.exports = {
   saveConfig(parameters) {
      return new Promise((resolve, reject) => {
         config = Object.assign({}, parameters, config);

         let file = path.join(process.cwd(), '.env');

         if (fs.existsSync(file)) {
            fs.unlinkSync(file);
         }

         fs.writeFile(file, self.parseConfig(config), err => {
            if (err) {
               reject(err);
            } else {
               resolve(true);
            }
         });
      });
   },
   parseConfig(config) {
      let string = '';

      Object.keys(config).forEach(key => {
         if (key != 'parsed' && key != 'error')
            string += `${key.toUpperCase()} = ${config[key]}\n`;
      });

      return string;
   }
});
