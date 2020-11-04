import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { API } from 'aws-amplify'

const listPosts = `
  query listPosts {
    listPosts {
      id title
    }
  }
`

export default function Home() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetchPosts()
  }, [])
  async function fetchPosts() {
    const postData = await API.graphql({
      query: listPosts
    })
    setPosts(postData.data.listPosts)
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

        <h1>Posts</h1>
      {
        posts.map((post, index) => (<Link key={index} href={`/posts/${post.id}`}><h2>{post.title}</h2></Link>))
      }

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
