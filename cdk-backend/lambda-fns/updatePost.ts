const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

interface Params {
  TableName: string | undefined,
  Key: string | {},
  ExpressionAttributeValues: any,
  ExpressionAttributeNames: any,
  UpdateExpression: string,
  ReturnValues: string,
  ConditionExpression: string
}

async function updatePost(post: any, username: string) {
  let params : Params = {
    TableName: process.env.POST_TABLE,
    Key: {
      id: post.id
    },
    ConditionExpression: '#username = :authenticatedUser',
    ExpressionAttributeNames: { '#username': 'username' },
    ExpressionAttributeValues: { ':authenticatedUser': username },
    UpdateExpression: "",
    ReturnValues: "ALL_NEW"
  };
  let prefix = "set ";
  let attributes = Object.keys(post);
  for (let i=0; i<attributes.length; i++) {
    let attribute = attributes[i];
    if (attribute !== "id") {
      params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
      params["ExpressionAttributeValues"][":" + attribute] = post[attribute];
      params["ExpressionAttributeNames"]["#" + attribute] = attribute;
      prefix = ", ";
    }
 }
  try {
    await docClient.update(params).promise()
    return post
  } catch (err) {
    console.log('DynamoDB error: ', err)
    return null
  }
}

export default updatePost;