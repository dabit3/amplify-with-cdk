import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cognito from '@aws-cdk/aws-cognito';

export class CdkBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  
    const userPool = cognito.UserPool.fromUserPoolId(
      this,
      'amplify-user-pool',
      'us-east-1_RU3fOhMlq'
    )
    
    new cdk.CfnOutput(this, 'aws_user_pools_id', {
      value: userPool.userPoolId
    });

    const client = new cognito.UserPoolClient(this, 'cdkClientId', {
      userPool,
      generateSecret: false
    });
      
    new cdk.CfnOutput(this, 'aws_user_pools_web_client_id', {
      value: client.userPoolClientId
    });

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'cdk-blog-api',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool
            }
          }
        ]
      },
      xrayEnabled: true,
    });

    // Prints out the AppSync GraphQL API URL to the ternminal
    new cdk.CfnOutput(this, "aws_appsync_graphqlEndpoint", {
      value: api.graphqlUrl
     });
 
     // Prints out the AppSync GraphQL API key to the terminal
     new cdk.CfnOutput(this, "aws_appsync_apiKey", {
       value: api.apiKey || ''
     });

     // Prints out the base authentication type for API
     new cdk.CfnOutput(this, "aws_appsync_authenticationType", {
       value: appsync.AuthorizationType.API_KEY
     })

    const blogLambda = new lambda.Function(this, 'AppSyncBlogHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('lambda-fns'),
      memorySize: 1024
    });
    
    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource('lambdaDatasource', blogLambda);

    // lib/appsync-cdk-app-stack.ts
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getPostById"
    });

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listPosts"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createPost"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deletePost"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updatePost"
    });

    const postTable = new dynamodb.Table(this, 'CDKPostTable', {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });

    // enable the Lambda function to access the DynamoDB table (using IAM)
    postTable.grantFullAccess(blogLambda)
    
    // Create an environment variable that we will use in the function code
    blogLambda.addEnvironment('POST_TABLE', postTable.tableName);

  }
}
