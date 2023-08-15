import { Statics } from './Statics';

/**
 * Shortcut for adding configuration obj. property
 */
export interface Configurable {
  configuration: Configuration;
}

/**
 * Create custom Environment without optional fields
 */
export interface Environment {
  account: string;
  region: string;
}

export interface Configuration {

  /**
   * In this case build en deployment environment are on the same
   * We'll be generating ECR repos in the build account.
   */
  environment: Environment;

  /**
   * The name of this branch we are deploying
   */
  branchName: string;

  /**
   * The Github connection to use
   */
  codeStarConnectionArn: string;

  /**
   * We'll allow the following accounts to pull form the ecr repos
   */
  ecrAllowAccessFromAccounts: string[];

}

const configurations: { [key: string]: Configuration } = {
  main: {
    branchName: 'main',
    environment: Statics.gnBuildEnvironment,
    codeStarConnectionArn: 'arn:aws:codestar-connections:eu-central-1:836443378780:connection/9d20671d-91bc-49e2-8680-59ff96e2ab11',
    ecrAllowAccessFromAccounts: [
      Statics.gnWebformsDev,
      Statics.gnWebformsAccp,
      Statics.gnWebformsProd,
    ],
  },
};

/**
 * Get the correct configuration object based on the
 * branch name to build for
 * @param branchName
 * @returns
 */
export function getConfiguration(branchName: string): Configuration {
  const config = configurations[branchName];
  if (!config) {
    throw Error('Branch name not found');
  }
  return config;
}
