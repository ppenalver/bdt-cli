module.exports = function(config) {
   return `
      @Library('libpipelines@master') _

      hose {
         EMAIL = '${config.email}'
         SLACKTEAM = '${config.slack}'

         MODULE = '${config.repository}'
         REPOSITORY = '${config.repository}'

         DEVTIMEOUT = '${config.timeout}'
         RELEASETIMEOUT = '${config.timeout}'

         PKGMODULESNAMES = ['${config.repository}']

         ATSERVICES = []

         ATPARAMETERS = """
                    |
                    |"""


         DEV = { config ->
            doCompile(config)
            doUT(config)
            doPackage(config)
            doDocker(config)
            doAT(conf: config, groups: ['basic'])
         }

         AT = { config ->
            doAT(conf: config)
         }

      }
   `;
};
