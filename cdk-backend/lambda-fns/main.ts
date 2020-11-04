import createPost from './createPost';
import deletePost from './deletePost';
import getPostById from './getPostById';
import listPosts from './listPosts';
import updatePost from './updatePost';
import Post from './Post';

type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {
    postId: string,
     post: Post
  },
  identity: {
    sub : string;
    username : string;
  }
}

exports.handler = async (event:AppSyncEvent) => {
    const username = event.identity?.username;
    switch (event.info.fieldName) {
        case "getPostById":
            return await getPostById(event.arguments.postId);
        case "createPost":
            return await createPost({ ...event.arguments.post, username });
        case "listPosts":
            return await listPosts();
        case "deletePost":
            return await deletePost(event.arguments.postId, username);
        case "updatePost":
            return await updatePost(event.arguments.post, username);
        default:
            return null;
    }
}