const inquirer = require('inquirer');
const Promise = require('bluebird');
const fs = require('fs');
const template = require('../templates/Jenkinsfile');
const path = require('path');

var self = (module.exports = {
   configJenkins: config => {
      return new Promise((resolve, reject) => {
         let questions = [
            { message: 'Email Team', name: 'email', type: 'input' },
            { message: 'Slack Team', name: 'slack', type: 'input' },
            { message: 'Timeout', default: 30, name: 'timeout', type: 'input' },
            { message: 'Repository Name', name: 'repository', type: 'input' }
         ];

         let prompt = inquirer.createPromptModule();

         prompt(questions).then(response => {
            config = Object.assign({}, config, response);

            self.createJenkins(config);

            resolve(config);
         });
      });
   },

   createJenkins: config => {
      return new Promise((resolve, reject) => {
         let directory = path.join(
            __dirname,
            '../../',
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
   }
});
