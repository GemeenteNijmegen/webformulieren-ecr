const { GemeenteNijmegenCdkApp } = require('@gemeentenijmegen/projen-project-type');
const project = new GemeenteNijmegenCdkApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  devDeps: [
    '@gemeentenijmegen/projen-project-type',
  ],
  deps: [
    '@gemeentenijmegen/aws-constructs',
  ],
  name: 'webformulieren-ecr',
});
project.synth();