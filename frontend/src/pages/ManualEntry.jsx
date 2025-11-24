import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import dashboardService from '../services/dashboardService'

const ManualEntry = () => {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    platform: 'facebook',
    metric_name: '',
    metric_value: '',
    notes: '',
    entered_by: '',
  })

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const data = await dashboardService.getManualEntries()
      setEntries(data.results || data)
    } catch (error) {
      console.error('Erro ao carregar entradas:', error)
      toast.error('Erro ao carregar entradas manuais')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingId) {
        await dashboardService.updateManualEntry(editingId, formData)
        toast.success('Entrada atualizada com sucesso!')
      } else {
        await dashboardService.createManualEntry(formData)
        toast.success('Entrada criada com sucesso!')
      }

      resetForm()
      fetchEntries()
    } catch (error) {
      console.error('Erro ao salvar entrada:', error)
      toast.error('Erro ao salvar entrada')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (entry) => {
    setFormData({
      platform: entry.platform,
      metric_name: entry.metric_name,
      metric_value: entry.metric_value,
      notes: entry.notes || '',
      entered_by: entry.entered_by,
    })
    setEditingId(entry.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta entrada?')) {
      return
    }

    setLoading(true)
    try {
      await dashboardService.deleteManualEntry(id)
      toast.success('Entrada excluída com sucesso!')
      fetchEntries()
    } catch (error) {
      console.error('Erro ao excluir entrada:', error)
      toast.error('Erro ao excluir entrada')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      platform: 'facebook',
      metric_name: '',
      metric_value: '',
      notes: '',
      entered_by: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Entrada Manual de Métricas</h1>
          <p className="text-gray-600 mt-1">
            Adicione métricas manualmente para plataformas sem integração de API
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-cor-blue text-white rounded-lg hover:bg-cor-light-blue transition-colors"
        >
          {showForm ? (
            <>
              <X size={20} />
              <span>Cancelar</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span>Nova Entrada</span>
            </>
          )}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? 'Editar Entrada' : 'Nova Entrada'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plataforma *
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cor-blue focus:border-transparent outline-none"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="threads">Threads</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Métrica *
                </label>
                <input
                  type="text"
                  name="metric_name"
                  value={formData.metric_name}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Seguidores, Curtidas, Visualizações"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cor-blue focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor *
                </label>
                <input
                  type="number"
                  name="metric_value"
                  value={formData.metric_value}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 15000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cor-blue focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registrado por *
                </label>
                <input
                  type="text"
                  name="entered_by"
                  value={formData.entered_by}
                  onChange={handleChange}
                  required
                  placeholder="Seu nome"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cor-blue focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Informações adicionais (opcional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cor-blue focus:border-transparent outline-none resize-none"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-cor-blue text-white rounded-lg hover:bg-cor-light-blue transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                <span>{editingId ? 'Atualizar' : 'Salvar'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-bold text-gray-800">Entradas Registradas</h2>
        </div>

        {loading && entries.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cor-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p>Nenhuma entrada registrada ainda.</p>
            <p className="text-sm mt-2">Clique em "Nova Entrada" para adicionar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plataforma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Métrica
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registrado por
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize font-medium text-gray-800">
                        {entry.platform_display}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {entry.metric_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                      {entry.metric_value.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {entry.entered_by}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(entry.collected_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManualEntry
