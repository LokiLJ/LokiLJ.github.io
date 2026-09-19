import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Work from './pages/Work'
import Project from './pages/Project'
import About from './pages/About'
import Interests from './pages/Interests'
import InterestPage from './pages/InterestPage'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="work" element={<Work />} />
        <Route path="work/:projectId" element={<Project />} />
        <Route path="about" element={<About />} />
        <Route path="interests" element={<Interests />} />
        <Route path="interests/:slug" element={<InterestPage />} />
        <Route path="teaching" element={<Navigate to="/interests/teaching" replace />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
