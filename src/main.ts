import { App } from 'aws-cdk-lib';
import { getConfiguration } from './Configuration';
import { PipelineStack } from './PipelineStack';

/**
 * Determine which branch to build (default is main)
 */
const branchToBuild = process.env.BRANCH_NAME ?? 'main';
console.info('Building branch:', branchToBuild);
const configuration = getConfiguration(branchToBuild);

/**
 * Build the app
 */
const app = new App();
new PipelineStack(app, `webformulieren-ecr-pipeline-${configuration.branchName}`, {
  env: configuration.environment,
  configuration: configuration,
});
app.synth();
