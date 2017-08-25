const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

module.exports = {
   createFolder: name => {
      let directory = path.join(process.cwd(), name);

      return new Promise((resolve, reject) => {
         ensureExists(directory, err => {
            if (err) {
               reject(false);
            } else {
               resolve(true);
            }
         });
      });
   },
   ensureExists: name => {
      let directory = path.join(process.cwd(), name);

      return new Promise((resolve, reject) => {
         fs.exists(directory, err => {
            if (err) {
               reject(false);
            } else {
               resolve(true);
            }
         });
      });
   }
};

function ensureExists(path, mask, cb) {
   if (typeof mask == 'function') {
      cb = mask;
      mask = 0777;
   }
   fs.mkdir(path, mask, function(err) {
      if (err) {
         cb(err);
      } else cb(null);
   });
}
