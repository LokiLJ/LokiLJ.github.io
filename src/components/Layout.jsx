import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="Kevin Zhu home">W.K.Z.</NavLink>
        <nav aria-label="Primary navigation">
          <NavLink to="/work">Work</NavLink>
          <NavLink to="/teaching">Teaching</NavLink>
          <NavLink to="/about">About</NavLink>
          <a href="/resume.pdf">CV</a>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <span>© 2026 Wenchuan (Kevin) Zhu</span>
        <div className="footer-links">
          <a href="mailto:qmcztop@outlook.com">Email</a>
          <a href="https://www.linkedin.com/in/wenchuanzhu" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/LokiLJ" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </footer>
    </>
  )
}
