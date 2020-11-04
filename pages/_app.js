import '../styles/globals.css'
import '../configureAmplify'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

function MyApp({ Component, pageProps }) {
  return (
  <div>
    <nav style={{ padding: 20 }}>
      <Link href="/"><span style={{marginRight: 20}}>Home</span></Link>
      <Link href="/create-post">Create Post</Link>
    </nav>
    <Component {...pageProps} />
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

export default MyApp
