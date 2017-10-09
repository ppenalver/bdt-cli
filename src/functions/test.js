const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const config = require('dotenv').config();
const inquirer = require('inquirer');
const execute = require('./execute');
const colors = require('colors');

const templateJava = require('../templates/test.java');
const templateFeature = require('../templates/test.feature');

const folderName = process.env.FOLDERNAME || '';
const folderRepository = process.env.REPOSITORY || '';

const appDir = process.cwd();

const directoryJava = path.join(
   appDir,
   folderName,
   'src/test/java/com/stratio/at/',
   folderRepository
);

const directoryFeature = path.join(
   appDir,
   folderName,
   'src/test/resources/features/',
   folderRepository
);

var createFolder = function() {
   if (!fs.existsSync(directoryJava)) {
      fs.mkdirSync(directoryJava);
   }

   if (!fs.existsSync(directoryFeature)) {
      fs.mkdirSync(directoryFeature);
   }
};

var createJava = function(config) {
   return new Promise((resolve, reject) => {
      let nameFile = `${config.number
         .toUpperCase()
         .replace('-', '_')}_${config.name
         .toUpperCase()
         .replace('-', '')
         .replace(new RegExp(' ', 'g'), '_')}`;

      fs.writeFile(
         path.join(directoryJava, nameFile + 'IT.java'),
         templateJava({
            name: nameFile,
            repository: folderRepository,
            packageId: process.env.PACKAGEID
         }),
         err => {
            if (err) {
               reject(err);
            } else {
               resolve(true);
            }
         }
      );
   });
};

var createFeature = function(config) {
   let nameFile = `${config.number
      .toUpperCase()
      .replace('-', '_')}_${config.name
      .toUpperCase()
      .replace('-', '')
      .replace(new RegExp(' ', 'g'), '_')}`;

   return new Promise((resolve, reject) => {
      fs.writeFile(
         path.join(directoryFeature, nameFile + '.feature'),
         templateFeature(config),
         err => {
            if (err) {
               reject(err);
            } else {
               resolve(true);
            }
         }
      );
   });
};

var selectTests = function() {
   return new Promise((resolve, reject) => {
      let tests = [];

      fs.readdir(directoryJava, (err, files) => {
         if (err) {
            console.log('No tests available. Create one and try again'.red);
            reject(false);
            return;
         }

         if (!files.length) {
            console.log('No tests available. Create one and try again'.red);
            reject(false);
            return;
         }

         files.forEach(file => {
            tests.push(file.replace('IT.java', ''));
         });

         inquirer
            .prompt({
               message: 'Select one test',
               type: 'list',
               choices: tests,
               name: 'test'
            })
            .then(response => {
               resolve(response.test);
            });
      });
   });
};

var removeTest = test => {
   fs.unlinkSync(path.join(directoryJava, test + 'IT.java'));
   fs.unlinkSync(path.join(directoryFeature, test + '.feature'));
};

var self = (module.exports = {
   testAll: () => {
      return new Promise((resolve, reject) => {
         return execute.executeSelenium().then(() => {
            return execute.executeAllTest();
         });
      });
   },

   testRemove: () => {
      return new Promise((resolve, reject) => {
         return selectTests().then(response => {
            inquirer
               .prompt({
                  message: 'Are you sure to delete this test?',
                  name: 'delete',
                  type: 'confirm'
               })
               .then(() => {
                  removeTest(response);
                  resolve(true);
               });
         });
      });
   },

   testOnly: () => {
      let tests = [];

      return new Promise((resolve, reject) => {
         let test;

         return selectTests()
            .then(response => {
               test = response;
               return execute.executeSelenium();
            })
            .then(() => execute.executeTest(test))
            .then(() => resolve(true));
      });
   },
   testCreate: () => {
      return new Promise((resolve, reject) => {
         let questions = [
            { message: 'User history number', name: 'number', type: 'input' },
            { message: 'User History Name', name: 'name', type: 'input' }
         ];

         let prompt = inquirer.createPromptModule();

         prompt(questions).then(response => {
            createFolder();

            return createJava(response)
               .then(() => createFeature(response))
               .then(() => resolve(config));
         });
      });
   }
});
