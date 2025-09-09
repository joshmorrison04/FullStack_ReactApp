import '@aws-amplify/ui-react/styles.css'
import { withAuthenticator } from '@aws-amplify/ui-react'

function App({ signOut, user }) {
  return (
    <div style={{ maxWidth: 720, margin: '32px auto', fontFamily: 'system-ui' }}>
      <h1>Amplify Auth Check</h1>
      <p>Signed in as <b>{user?.username}</b></p>
      <button onClick={signOut}>Sign out</button>
    </div>
  )
}

export default withAuthenticator(App)

