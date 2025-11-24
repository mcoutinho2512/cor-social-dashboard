import api from './api'

const dashboardService = {
  // Dashboard Summary
  getSummary: async (period = 'month') => {
    const response = await api.get(`/api/dashboard/summary/?period=${period}`)
    return response.data
  },

  // Social Metrics
  getSocialMetrics: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const response = await api.get(`/api/social-metrics/?${queryParams}`)
    return response.data
  },

  getLatestSocialMetrics: async () => {
    const response = await api.get('/api/social-metrics/latest/')
    return response.data
  },

  getSocialComparison: async (platform, period = 'week') => {
    const response = await api.get(
      `/api/social-metrics/comparison/?platform=${platform}&period=${period}`
    )
    return response.data
  },

  createSocialMetric: async (data) => {
    const response = await api.post('/api/social-metrics/', data)
    return response.data
  },

  // App Downloads
  getAppDownloads: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const response = await api.get(`/api/app-downloads/?${queryParams}`)
    return response.data
  },

  getTotalDownloads: async () => {
    const response = await api.get('/api/app-downloads/total/')
    return response.data
  },

  createAppDownload: async (data) => {
    const response = await api.post('/api/app-downloads/', data)
    return response.data
  },

  // Website Metrics
  getWebsiteMetrics: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const response = await api.get(`/api/website-metrics/?${queryParams}`)
    return response.data
  },

  getWebsiteSummary: async (period = 'month') => {
    const response = await api.get(`/api/website-metrics/summary/?period=${period}`)
    return response.data
  },

  createWebsiteMetric: async (data) => {
    const response = await api.post('/api/website-metrics/', data)
    return response.data
  },

  // Manual Entries
  getManualEntries: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const response = await api.get(`/api/manual-entries/?${queryParams}`)
    return response.data
  },

  createManualEntry: async (data) => {
    const response = await api.post('/api/manual-entries/', data)
    return response.data
  },

  updateManualEntry: async (id, data) => {
    const response = await api.put(`/api/manual-entries/${id}/`, data)
    return response.data
  },

  deleteManualEntry: async (id) => {
    const response = await api.delete(`/api/manual-entries/${id}/`)
    return response.data
  },
}

export default dashboardService
