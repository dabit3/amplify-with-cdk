import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { useState } from 'react'
import { API } from 'aws-amplify'
import { v4 as uuid } from 'uuid'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

const initialState = { title: '', content: '' }

const createPost = `
  mutation createPost($post: PostInput!) {
    createPost(post: $post) {
      id
    }
  }
`

function CreatePost() {
  const [post, setPost] = useState(initialState)
  const { title, content } = post
  const router = useRouter()
  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }
  async function createNewPost() {
    if (!title || !content) return
    const id = uuid()
    await API.graphql({
      query: createPost,
      variables: { post: { ...post, id } },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    })
    router.push(`/posts/${id}`)
  }
  return (
    <div className={styles.container}>
      <h2>Create new Post</h2>
      <input onChange={onChange} name="title" placeholder="Title" />
      <textarea onChange={onChange} name="content" placeholder="Content" />
      <button onClick={createNewPost}>Create Post</button>
      <AmplifySignOut />
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
  )
}

export default withAuthenticator(CreatePost)