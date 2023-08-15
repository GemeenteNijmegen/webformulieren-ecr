import { PermissionsBoundaryAspect } from '@gemeentenijmegen/aws-constructs';
import { Aspects, Stage, StageProps, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Configurable } from './Configuration';
import { EcrRepositoriesStack } from './EcrRepositoriesStack';
import { Statics } from './Statics';

export interface EcrRepositoriesStageProps extends StageProps, Configurable {}

export class EcrRepositoriesStage extends Stage {

  constructor(scope: Construct, id: string, props: EcrRepositoriesStageProps) {
    super(scope, id, props);
    Tags.of(this).add('cdkManaged', 'yes');
    Tags.of(this).add('Project', Statics.projectName);
    Aspects.of(this).add(new PermissionsBoundaryAspect());

    new EcrRepositoriesStack(this, 'repositories', {
      env: props.configuration.environment,
      configuration: props.configuration,
    });

  }
}
