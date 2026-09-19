import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="page-hero">
      <p className="kicker">404</p>
      <h1>That page is not part of the portfolio.</h1>
      <Link className="button primary" to="/">Return home</Link>
    </section>
  )
}
