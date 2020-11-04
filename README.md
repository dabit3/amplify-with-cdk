# Full stack with Next.js, Amplify, & CDK

This project shows you how to build an app that extends a back end created by the Amplify CLI by using AWS CDK

## Deploying the app

1. Clone the repo & change into the directory

```sh
git clone https://github.com/dabit3/amplify-with-cdk.git

cd amplify-with-cdk
```

2. Install the dependencies in main directory as well as __cdk-backend__ directory:

```sh
npm install

cd cdk-backend 

npm install

cd ..
```

3. Build and deploy Amplify project

```sh
amplify init

amplify push
```

4. Build and deploy the CDK back end

```sh
cd cdk-backend

npm run build && cdk deploy -O ../src/cdk-exports.json

cd ..
```

5. Run the Next app

```sh
npm run dev
```