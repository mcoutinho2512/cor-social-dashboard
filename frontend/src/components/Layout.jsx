import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, BarChart3, Edit } from 'lucide-react'

const Layout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-cor-blue text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BarChart3 size={32} />
              <div>
                <h1 className="text-xl font-bold">COR Social Dashboard</h1>
                <p className="text-xs text-blue-200">Centro de Operações Rio</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm">Olá, {user?.username}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                isActive('/')
                  ? 'border-cor-blue text-cor-blue font-semibold'
                  : 'border-transparent text-gray-600 hover:text-cor-blue'
              }`}
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/manual-entry"
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                isActive('/manual-entry')
                  ? 'border-cor-blue text-cor-blue font-semibold'
                  : 'border-transparent text-gray-600 hover:text-cor-blue'
              }`}
            >
              <Edit size={20} />
              <span>Entrada Manual</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Centro de Operações Rio - COR</p>
          <p className="mt-1">Dashboard de Métricas de Redes Sociais</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
