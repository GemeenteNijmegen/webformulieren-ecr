const { GemeenteNijmegenCdkApp } = require('@gemeentenijmegen/projen-project-type');
const project = new GemeenteNijmegenCdkApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  depsUpgradeOptions: {
    workflowOptions: {
      branches: ['main'], // No acceptance branch
    },
  },
  devDeps: [
    '@gemeentenijmegen/projen-project-type',
  ],
  deps: [
    '@gemeentenijmegen/aws-constructs',
  ],
  name: 'webformulieren-ecr',
});
project.synth();