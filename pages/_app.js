import '../styles/globals.css'
import '../configureAmplify'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
  <div>
    <nav style={{ padding: 20 }}>
      <Link href="/"><span style={{marginRight: 20}}>Home</span></Link>
      <Link href="/create-post">Create Post</Link>
    </nav>
    <Component {...pageProps} />
  </div>
  )
}

export default MyApp
