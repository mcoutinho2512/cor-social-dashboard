import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  Users,
  Download,
  Globe,
  TrendingUp,
  TrendingDown,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  RefreshCw,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import dashboardService from '../services/dashboardService'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')
  const [summaryData, setSummaryData] = useState(null)
  const [socialMetrics, setSocialMetrics] = useState([])

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [summary, social] = await Promise.all([
        dashboardService.getSummary(period),
        dashboardService.getSocialMetrics({ period }),
      ])

      setSummaryData(summary)
      setSocialMetrics(social.results || social)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const getPlatformIcon = (platform) => {
    const icons = {
      twitter: Twitter,
      facebook: Facebook,
      instagram: Instagram,
      youtube: Youtube,
    }
    const Icon = icons[platform] || Users
    return <Icon size={24} />
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num?.toLocaleString('pt-BR') || '0'
  }

  const periodLabels = {
    day: 'Hoje',
    week: 'Última Semana',
    month: 'Último Mês',
    year: 'Último Ano',
  }

  if (loading && !summaryData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cor-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Métricas de Redes Sociais e Aplicativos</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Period Filter */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cor-blue focus:border-transparent outline-none"
          >
            <option value="day">Hoje</option>
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="year">Último Ano</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-cor-blue text-white rounded-lg hover:bg-cor-light-blue transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Followers */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-cor-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de Seguidores</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {formatNumber(summaryData?.total_followers)}
              </p>
              <div className="flex items-center mt-2 text-green-600">
                <TrendingUp size={16} />
                <span className="text-sm ml-1">Todas as redes</span>
              </div>
            </div>
            <div className="bg-cor-blue bg-opacity-10 p-3 rounded-lg">
              <Users size={32} className="text-cor-blue" />
            </div>
          </div>
        </div>

        {/* Total Downloads */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de Downloads</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {formatNumber(summaryData?.total_app_downloads)}
              </p>
              <div className="flex items-center mt-2 text-gray-600">
                <span className="text-sm">Android + iOS</span>
              </div>
            </div>
            <div className="bg-green-500 bg-opacity-10 p-3 rounded-lg">
              <Download size={32} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Page Views */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Visualizações do Site</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {formatNumber(summaryData?.total_page_views)}
              </p>
              <div className="flex items-center mt-2 text-gray-600">
                <span className="text-sm">{periodLabels[period]}</span>
              </div>
            </div>
            <div className="bg-purple-500 bg-opacity-10 p-3 rounded-lg">
              <Globe size={32} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Redes Sociais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryData?.social_metrics?.map((metric) => (
            <div
              key={metric.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    {getPlatformIcon(metric.platform)}
                  </div>
                  <span className="font-semibold text-gray-800 capitalize">
                    {metric.platform_display}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-gray-600 text-sm">Seguidores</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatNumber(metric.followers)}
                  </p>
                </div>

                {metric.engagement_rate && (
                  <div className="flex items-center text-sm">
                    <TrendingUp size={14} className="text-green-500 mr-1" />
                    <span className="text-gray-600">
                      {metric.engagement_rate?.toFixed(2)}% engajamento
                    </span>
                  </div>
                )}

                {metric.posts_count && (
                  <p className="text-sm text-gray-600">{metric.posts_count} publicações</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* App Downloads */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Downloads dos Aplicativos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {summaryData?.app_downloads?.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                  {app.platform_display}
                </h3>
                <Download className="text-gray-400" />
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Total de Downloads</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {formatNumber(app.total_downloads)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {app.rating && (
                    <div>
                      <p className="text-gray-600 text-xs">Avaliação</p>
                      <p className="text-lg font-semibold text-gray-800">
                        ⭐ {app.rating?.toFixed(1)}
                      </p>
                    </div>
                  )}

                  {app.reviews_count && (
                    <div>
                      <p className="text-gray-600 text-xs">Avaliações</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatNumber(app.reviews_count)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      {socialMetrics.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Evolução de Seguidores
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={socialMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="collected_at"
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('pt-BR')
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="followers"
                stroke="#003DA5"
                strokeWidth={2}
                name="Seguidores"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default Dashboard
