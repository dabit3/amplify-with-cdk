const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deletePost(postId: string, username: string) {
    const params = {
        TableName: process.env.POST_TABLE,
        Key: {
          id: postId
        },
        ConditionExpression: '#username = :authenticatedUser',
        ExpressionAttributeNames: { '#username': 'username' },
        ExpressionAttributeValues: { ':authenticatedUser': username }
    }
    try {
        await docClient.delete(params).promise()
        return postId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default deletePost;