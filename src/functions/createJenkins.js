const inquirer = require('inquirer');
const Promise = require('bluebird');
const fs = require('fs');
const template = require('../templates/Jenkinsfile');
const templatePom = require('../templates/pom');
const path = require('path');
const ncp = require('ncp').ncp;

var self = (module.exports = {
   configJenkins: config => {
      return new Promise((resolve, reject) => {
         return self
            .configQuestions(config)
            .createJenkins(config)
            .then(() => self.createPom(config))
            .then(() => self.copyFolder(config))
            .then(() => resolve(config));
      });
   },

   confiqQuestions: config => {
      return new Promise((resolve, reject) => {
         let questions = [
            { message: 'Email Team', name: 'email', type: 'input' },
            { message: 'Slack Team', name: 'slack', type: 'input' },
            { message: 'Timeout', default: 30, name: 'timeout', type: 'input' },
            { message: 'Repository Name', name: 'repository', type: 'input' },
            { message: 'Group ID', name: 'groupId', type: 'input' }
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
         let directory = path.join(__dirname, '../../', config.folderName);

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
