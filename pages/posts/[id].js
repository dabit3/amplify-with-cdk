import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import '../../configureAmplify'

const getPostById = `
  query getPostById($postId: ID!) {
    getPostById(postId: $postId) {
      id
      title
      content
      username
    }
  }
`

const listPosts = `
  query listPosts {
    listPosts {
      id title
    }
  }
`

export default function Home({ post }) {
  console.log('post: ', post)
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Post</h1>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p>Created by: {post.username}</p>
    </div>
  )
}

export async function getStaticPaths() {
  const postData = await API.graphql({
    query: listPosts
  })

  console.log('postData: ', JSON.stringify(postData))

  const paths = postData.data.listPosts.map(post => ({ params: { id: post.id }}))
  console.log('paths: ', JSON.stringify(paths))
  return {
    paths,
    fallback: true
  };
}

export async function getStaticProps ({ params }) {
  const { id } = params
  const postData = await API.graphql({
    query: getPostById, variables: { postId: id }
  })
  console.log('postData: ', JSON.stringify(postData))

  return {
    props: {
      post: postData.data.getPostById
    }
  }
}

