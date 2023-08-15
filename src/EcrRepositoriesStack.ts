import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Configurable } from './Configuration';
import { DeploymentUser } from './constructs/DeploymentUser';
import { EcrRepository } from './constructs/EcrRepository';
import { Statics } from './Statics';

export interface EcrRepositoriesStackProps extends StackProps, Configurable { }

export class EcrRepositoriesStack extends Stack {
  constructor(scope: Construct, id: string, props: EcrRepositoriesStackProps) {
    super(scope, id, props);
    Tags.of(this).add('cdkManaged', 'yes');
    Tags.of(this).add('Project', Statics.projectName);

    const proxyContainer = new EcrRepository(this, 'proxy-service', {
      name: 'eform-proxy-service',
      ecrAllowAccessFromAccounts: props.configuration.ecrAllowAccessFromAccounts,
    });

    const authContainer = new EcrRepository(this, 'authentication-service', {
      name: 'eform-authentication-service',
      ecrAllowAccessFromAccounts: props.configuration.ecrAllowAccessFromAccounts,
    });

    const formContainer = new EcrRepository(this, 'form-service', {
      name: 'eform-form-service',
      ecrAllowAccessFromAccounts: props.configuration.ecrAllowAccessFromAccounts,
    });

    new DeploymentUser(this, 'deployment', {
      ecrRepositoryArns: [
        proxyContainer.ecrArn,
        authContainer.ecrArn,
        formContainer.ecrArn,
      ],
    });

  }
}
