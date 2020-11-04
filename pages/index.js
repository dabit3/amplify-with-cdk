import { useState, useEffect } from 'react'
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
    <div className={styles.container}>
      <h1>Posts</h1>
      {
        posts.map((post, index) => (<Link key={index} href={`/posts/${post.id}`}><h2>{post.title}</h2></Link>))
      }
    </div>
  )
}
