import { PermissionsBoundaryAspect } from '@gemeentenijmegen/aws-constructs';
import { Aspects, Stack, StackProps, Tags } from 'aws-cdk-lib';
import * as cdkpipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { Configurable } from './Configuration';
import { EcrRepositoriesStage } from './EcrRepositoriesStage';
import { Statics } from './Statics';

export interface PipelineStackProps extends StackProps, Configurable {}

/**
 * Deploy the pipeline that manages the build account which contains the shared ecr
 * repositories for the webforms container images.
 * Each webforms environment (dev, accp, prod) has a dedicated pipeline to manage
 * the resources in that account.
 */
export class PipelineStack extends Stack {

  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);
    Tags.of(this).add('cdkManaged', 'yes');
    Tags.of(this).add('project', Statics.projectName);
    Aspects.of(this).add(new PermissionsBoundaryAspect());

    const pipeline = this.pipeline(props);

    pipeline.addStage(new EcrRepositoriesStage(this, 'webformulieren-ecr', {
      env: props.configuration.environment,
      configuration: props.configuration,
    }));

  }

  pipeline(props: PipelineStackProps) {
    const branchName = props.configuration.branchName;

    const repository = cdkpipelines.CodePipelineSource.connection(Statics.repo, branchName, {
      connectionArn: props.configuration.codeStarConnectionArn,
    });

    const pipeline = new cdkpipelines.CodePipeline(this, 'pipeline', {
      pipelineName: `webformulieren-ecr-pipeline-${branchName}`,
      crossAccountKeys: true,
      synth: new cdkpipelines.ShellStep('Synth', {
        input: repository,
        env: {
          BRANCH_NAME: branchName,
        },
        commands: [
          'yarn install --frozen-lockfile', //nodig om projen geinstalleerd te krijgen
          'yarn build',
        ],
      }),
    });

    return pipeline;
  }
}