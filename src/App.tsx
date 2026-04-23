import { useState, type CSSProperties } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './components/Admin/Dashboard'
import Login from './components/Admin/Login'
import About from './components/About'
import Experience from './components/Experience'
import NotFound from './components/NotFound'
import Projects from './components/Projects'
import Sidebar from './components/Sidebar'
import useMousePosition from './hooks/useMousePosition'
import usePortfolioData from './hooks/usePortfolioData'
import type { PortfolioData } from './types'

interface HomePageProps {
  data: PortfolioData
}

function HomePage({ data }: HomePageProps) {
  const { x, y } = useMousePosition()
  const spotlightStyle: CSSProperties = {
    background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(45, 212, 191, 0.15), transparent 80%)`,
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={spotlightStyle}
      />
      <div className="relative z-10 mx-auto min-h-screen max-w-7xl px-6 py-10 md:px-12 md:py-14 lg:px-20 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-12">
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-5/12 lg:flex-col lg:justify-between lg:py-20">
            <Sidebar profile={data.profile} socials={data.socials} />
          </header>
          <main className="pt-12 lg:w-7/12 lg:py-20">
            <About />
            <Experience experiences={data.experiences} />
            <Projects projects={data.projects} />
          </main>
        </div>
      </div>
    </div>
  )
}

interface AdminPageProps {
  data: PortfolioData
  updateData: (newData: PortfolioData) => void
  resetData: () => void
}

const ADMIN_AUTH_KEY = 'portfolio_admin_authenticated'

function AdminPage({ data, updateData, resetData }: AdminPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true',
  )

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true')
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-200 md:px-10">
      {isAuthenticated ? (
        <Dashboard data={data} updateData={updateData} resetData={resetData} />
      ) : (
        <Login onSuccess={handleLoginSuccess} />
      )}
    </div>
  )
}

function App() {
  const { data, updateData, resetData } = usePortfolioData()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage data={data} />} />
        <Route
          path="/admin"
          element={<AdminPage data={data} updateData={updateData} resetData={resetData} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
