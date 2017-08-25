const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const config = require('dotenv').config();
const inquirer = require('inquirer');
const execute = require('./execute');

const templateJava = require('../templates/test.java');
const templateFeature = require('../templates/test.feature');

const appDir = process.cwd();

const directoryJava = path.join(
   appDir,
   process.env.FOLDERNAME,
   'src/test/java/com/stratio/at/',
   process.env.REPOSITORY
);

const directoryFeature = path.join(
   appDir,
   process.env.FOLDERNAME,
   'src/test/resources/features/',
   process.env.REPOSITORY
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
         .replace('-', '_')}_${config.name.toUpperCase().replace('-', '')}`;

      fs.writeFile(
         path.join(directoryJava, nameFile + 'IT.java'),
         templateJava({
            name: nameFile,
            repository: process.env.REPOSITORY
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
   let nameFile = `${config.number.toUpperCase()}_${config.name
      .toUpperCase()
      .replace('-', '')}`;

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

var self = (module.exports = {
   testOnly: () => {
      let tests = [];

      return new Promise((resolve, reject) => {
         console.log(directoryJava);

         fs.readdir(directoryJava, (err, files) => {
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
                  return execute.executeSelenium().then(() => {
                     return execute.executeTest(response.test);
                  });
               })
               .then(response => {
                  resolve(true);
               });
         });
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
