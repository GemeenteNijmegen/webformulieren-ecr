import { RemovalPolicy, StackProps, aws_ecr as ecr, aws_iam as iam } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface EcrRepositoryProps extends StackProps {
  name: string;
  ecrAllowAccessFromAccounts: string[];
};

/**
 * Creates a ECR repository
 * @param ecrProps: the name of the repository
 * @returns the ARN of the repo in a property
 */
export class EcrRepository extends Construct {
  public readonly ecrArn: string;

  constructor(scope: Construct, id: string, props: EcrRepositoryProps) {
    super(scope, id);

    const ecrInstance = new ecr.Repository(this, props.name, {
      repositoryName: props.name,
      removalPolicy: RemovalPolicy.RETAIN,
      imageScanOnPush: true,
      imageTagMutability: ecr.TagMutability.IMMUTABLE,
    });
    ecrInstance.addLifecycleRule({ description: 'store only last 15 image versions', maxImageCount: 15 });

    // allow auth-accp and auth-prod acces to this repo
    // needed for ecs to download image to start container
    ecrInstance.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: props.ecrAllowAccessFromAccounts.map(account => new iam.AccountPrincipal(account)),
      actions: [
        'ecr:BatchGetImage',
        'ecr:GetDownloadUrlForLayer',
      ],
    }));

    this.ecrArn = ecrInstance.repositoryArn;
  }
}