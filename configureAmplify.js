import Amplify from 'aws-amplify';
import config from './src/aws-exports';
import { CdkBackendStack } from './src/cdk-exports.json';

const CDKConfig = {
  aws_appsync_graphqlEndpoint: CdkBackendStack.awsappsyncgraphqlEndpoint,
  aws_appsync_authenticationType: CdkBackendStack.awsappsyncauthenticationType,
  aws_appsync_apiKey: CdkBackendStack.awsappsyncapiKey
}

Amplify.configure({ ...config, ...CDKConfig });