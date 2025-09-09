import { useEffect, useState } from 'react'
import '@aws-amplify/ui-react/styles.css'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { generateClient } from 'aws-amplify/api'
import { listNotes } from './graphql/queries'
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations'

const client = generateClient()

function App({ signOut, user }) {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  async function fetchNotes() {
    const res = await client.graphql({
      query: listNotes,
      authMode: 'userPool'
    })
    setNotes(res.data.listNotes.items)
  }

  useEffect(() => { fetchNotes() }, [])

  async function createNote(e) {
    e.preventDefault()
    if (!title.trim()) return
    await client.graphql({
      query: createNoteMutation,
      variables: { input: { title, content } },
      authMode: 'userPool'
    })
    setTitle(''); setContent('')
    fetchNotes()
  }

  async function removeNote(id) {
    await client.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
      authMode: 'userPool'
    })
    fetchNotes()
  }

  return (
    <div style={{ maxWidth: 720, margin: '32px auto', padding: 16, fontFamily: 'system-ui' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Amplify Notes</h1>
        <div>
          <span style={{ marginRight: 12 }}>Hi, {user?.username}</span>
          <button onClick={signOut}>Sign out</button>
        </div>
      </header>

      <form onSubmit={createNote} style={{ margin: '16px 0' }}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: 8 }}
        />
        <button type="submit" style={{ marginTop: 8 }}>Add Note</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notes.map(n => (
          <li key={n.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <strong>{n.title}</strong>
            {n.content && <p style={{ marginTop: 6 }}>{n.content}</p>}
            <button onClick={() => removeNote(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default withAuthenticator(App)

