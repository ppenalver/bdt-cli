const inquirer = require('inquirer');
const Promise = require('bluebird');
const fs = require('fs');
const template = require('../templates/Jenkinsfile');
const templatePom = require('../templates/pom');
const path = require('path');
const ncp = require('ncp').ncp;

var self = (module.exports = {
   configJenkins: config => {
      let parameters = Object.assign({}, config);

      return new Promise((resolve, reject) => {
         return self
            .confiqQuestions(config)
            .then(response => {
               parameters = Object.assign({}, config, response);
               self.createJenkins(parameters);
            })
            .then(() => self.createPom(parameters))
            .then(() => self.copyFolder(parameters))
            .then(() => {
               resolve(parameters);
            });
      });
   },

   confiqQuestions: config => {
      return new Promise((resolve, reject) => {
         let questions = [
            { message: 'Email Team', name: 'email', type: 'input' },
            { message: 'Slack Team', name: 'slack', type: 'input' },
            { message: 'Timeout', default: 30, name: 'timeout', type: 'input' },
            { message: 'Repository Name', name: 'repository', type: 'input' },
            { message: 'Package ID', name: 'packageId', type: 'input' }
         ];

         let prompt = inquirer.createPromptModule();

         prompt(questions).then(response => {
            config = Object.assign({}, config, response);

            resolve(config);
         });
      });
   },

   createJenkins: config => {
      return new Promise((resolve, reject) => {
         let directory = path.join(
            process.cwd(),
            config.folderName,
            'Jenkinsfile'
         );

         fs.writeFile(directory, template(config), err => {
            if (err) {
               reject(err);
            } else {
               resolve(true);
            }
         });
      });
   },

   createPom: config => {
      return new Promise((resolve, reject) => {
         let directory = path.join(process.cwd(), config.folderName, 'pom.xml');

         fs.writeFile(directory, templatePom(config), err => {
            if (err) {
               reject(err);
            } else {
               resolve(true);
            }
         });
      });
   },

   copyFolder: config => {
      return new Promise((resolve, reject) => {
         let directory = path.join(process.cwd(), config.folderName);

         ncp(path.join(__dirname, '../', './copy/testAT/'), directory, err => {
            if (err) {
               reject(err);
            } else {
               resolve(true);
            }
         });
      });
   }
});
