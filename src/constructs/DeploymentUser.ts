import { aws_iam as iam } from 'aws-cdk-lib';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface DeploymentUserProps {
  ecrRepositoryArns: string[];
}

export class DeploymentUser extends Construct {
  constructor(scope: Construct, id: string, props: DeploymentUserProps) {
    super(scope, id);

    // Setup user
    const user = new iam.User(this, 'user');

    // Setup credentials
    const accessKey = new iam.AccessKey(this, 'access-key', {
      user: user,
    });
    new Secret(this, 'password', {
      description: 'The password of the deployment user',
      secretStringValue: accessKey.secretAccessKey,
    });

    // Setup the policy for the deployment user
    new iam.Policy(this, 'policy', {
      statements: [
        this.createAuthTokenStatement(),
        this.allowEcrDeploymentStatement(props.ecrRepositoryArns),
      ],
      users: [
        user,
      ],
    });

  }

  allowEcrDeploymentStatement(arns: string[]) {
    return new iam.PolicyStatement({
      sid: 'allowImagePushing',
      effect: iam.Effect.ALLOW,
      actions: [
        'ecr:DescribeRegistry',
        'ecr:TagResource',
        'ecr:UntagResource',
        'ecr:BatchDeleteImage',
        'ecr:BatchCheckLayerAvailability',
        'ecr:BatchGetImage',
        'ecr:DescribeImages',
        'ecr:DescribeRegistry',
        'ecr:GetAuthorizationToken',
        'ecr:BatchCheckLayerAvailability',
        'ecr:CompleteLayerUpload',
        'ecr:InitiateLayerUpload',
        'ecr:PutImage',
        'ecr:UploadLayerPart',
        'ecr:GetDownloadUrlForLayer',
        'ecr:ListImages',
        'ecr:ListTagsForResource',
      ],
      resources: arns,
    });
  }

  createAuthTokenStatement() {
    //this must be allowed for all repositories, can't be scoped to a specific one
    return new iam.PolicyStatement({
      sid: 'AllowGetAuthorizationToken',
      effect: iam.Effect.ALLOW,
      actions: [
        'ecr:GetAuthorizationToken',
      ],
      resources: ['*'],
    });
  }

}