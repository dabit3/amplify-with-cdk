import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import '../../configureAmplfy'

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
    <div>
      <nav style={{ padding: 20 }}>
        <Link href="/"><span style={{marginRight: 20}}>Home</span></Link>
        <Link href="/create-post">Create Post</Link>
      </nav>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <h1>Post</h1>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
        <p>Created by: {post.username}</p>
        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
          </a>
        </footer>
      </div>
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

