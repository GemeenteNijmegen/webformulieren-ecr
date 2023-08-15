import * as core from 'aws-cdk-lib';
import { StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Configurable } from './Configuration';
import { EcrRepositoriesStack } from './EcrRepositoriesStack';
import { Statics } from './Statics';

export interface EcrRepositoriesStageProps extends StageProps, Configurable {}

export class EcrRepositoriesStage extends core.Stage {

  constructor(scope: Construct, id: string, props: EcrRepositoriesStageProps) {
    super(scope, id, props);
    core.Tags.of(this).add('cdkManaged', 'yes');
    core.Tags.of(this).add('Project', Statics.projectName);

    new EcrRepositoriesStack(this, 'repositories', {
      env: props.configuration.environment,
      configuration: props.configuration,
    });

  }
}
