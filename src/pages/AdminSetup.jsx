import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cmsConfigured, supabase } from '../lib/supabase'

export default function AdminSetup() {
  const [session, setSession] = useState(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('Checking invitation…')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!supabase) return

    let active = true

    const clearAuthParams = () => {
      window.history.replaceState({}, document.title, '/admin/setup')
    }

    const resolve = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
        const searchParams = new URLSearchParams(window.location.search)

        const errorDescription = hashParams.get('error_description') || searchParams.get('error_description')
        if (errorDescription) {
          if (active) setMessage(decodeURIComponent(errorDescription))
          return
        }

        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (error) throw error
          if (active) {
            setSession(data.session)
            setMessage('')
            clearAuthParams()
          }
          return
        }

        const code = searchParams.get('code')
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
          if (active) {
            setSession(data.session)
            setMessage('')
            clearAuthParams()
          }
          return
        }

        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        if (!active) return
        if (data.session) {
          setSession(data.session)
          setMessage('')
        } else {
          setMessage('No active invitation or password-recovery session was found. Request a new email and open its link in this browser.')
        }
      } catch (error) {
        if (active) setMessage(error?.message || 'Could not establish the invitation session.')
      }
    }

    resolve()

    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return
      if (['INITIAL_SESSION', 'SIGNED_IN', 'PASSWORD_RECOVERY', 'TOKEN_REFRESHED'].includes(event) && nextSession) {
        setSession(nextSession)
        setMessage('')
      }
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    if (password.length < 12) return setMessage('Use at least 12 characters. A password-manager generated password is recommended.')
    if (password !== confirm) return setMessage('The two passwords do not match.')

    setMessage('Saving password…')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) return setMessage(error.message)

    setDone(true)
    setMessage('Password set successfully.')
  }

  if (!cmsConfigured) {
    return <section className="page-hero"><p className="kicker">Administrator</p><h1>CMS is not connected yet.</h1></section>
  }

  return (
    <section className="admin-login-shell">
      <div className="admin-login-card admin-setup-card">
        <p className="kicker">Administrator setup</p>
        <h1>{done ? 'Account ready.' : 'Set your password'}</h1>

        {done ? (
          <>
            <p className="admin-message">Your Supabase account now has a password. If this user has also been added to the <code>admins</code> table, you can sign in to the CMS.</p>
            <Link className="button primary" to="/admin">Go to admin login</Link>
          </>
        ) : session ? (
          <form onSubmit={submit}>
            <p className="admin-setup-email">{session.user.email}</p>
            <label>New password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" /></label>
            <label>Confirm password<input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" /></label>
            <button className="button primary" type="submit">Set password</button>
          </form>
        ) : null}

        {message && <p className="admin-message">{message}</p>}
      </div>
    </section>
  )
}
