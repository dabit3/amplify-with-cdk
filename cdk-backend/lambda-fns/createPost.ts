const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import Post from './Post';

async function createPost(post: Post) {
    const params = {
        TableName: process.env.POST_TABLE,
        Item: post
    }
    try {
        await docClient.put(params).promise();
        return post;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default createPost;