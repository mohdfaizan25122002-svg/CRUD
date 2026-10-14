import { useEffect, useState, useCallback } from 'react'
import Navbar from '../Components/Navbar'
import ObjectSelector from '../Components/ObjectSelector'
import RecordTable from '../Components/RecordTable'
import Pagination from '../Components/Pagination'
import RecordForm from '../Components/RecordForm'
import EditRecord from '../Components/EditRecord'
import ViewRecord from '../Components/ViewRecord'
import Loader from '../Components/Loader'
import { getRecords, createRecord } from '../Services/api'

const PAGE_SIZE = 10

export default function Dashboard() {
  const [objectName, setObjectName] = useState('Contact')
  const [records, setRecords] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [mode, setMode] = useState('list') // 'list' | 'create' | 'view' | 'edit'
  const [editingId, setEditingId] = useState(null)
  const [viewingId, setViewingId] = useState(null)
  const [creating, setCreating] = useState(false)

  const loadRecords = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getRecords(objectName, { page, limit: PAGE_SIZE })
      setRecords(data.records || [])
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load records.')
    } finally {
      setLoading(false)
    }
  }, [objectName, page])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  const handleObjectChange = (next) => {
    setObjectName(next)
    setPage(1)
    setMode('list')
  }

  const handleCreate = async (data) => {
    setCreating(true)
    setError('')
    try {
      await createRecord(objectName, data)
      setMode('list')
      loadRecords()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create record.')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleted = (id) => {
    setRecords((prev) => prev.filter((r) => r.Id !== id))
  }

  return (
    <div>
      <Navbar />
      <div className="page">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
          <ObjectSelector value={objectName} onChange={handleObjectChange} />
          {mode === 'list' && (
            <button className="btn btn-primary" onClick={() => setMode('create')}>
              + New {objectName}
            </button>
          )}
        </div>

        {error && <div className="error-text" style={{ marginBottom: 14 }}>{error}</div>}

        {mode === 'create' && (
          <div style={{ marginBottom: 20 }}>
            <RecordForm
              objectName={objectName}
              onSubmit={handleCreate}
              onCancel={() => setMode('list')}
              submitting={creating}
            />
          </div>
        )}

        {mode === 'edit' && editingId && (
          <div style={{ marginBottom: 20 }}>
            <EditRecord
              objectName={objectName}
              recordId={editingId}
              onClose={() => setMode('list')}
              onSaved={() => {
                setMode('list')
                loadRecords()
              }}
            />
          </div>
        )}

        {mode === 'view' && viewingId && (
          <ViewRecord
            objectName={objectName}
            recordId={viewingId}
            onClose={() => setMode('list')}
          />
        )}

        {mode === 'list' &&
          (loading ? (
            <Loader label={`Loading ${objectName} records…`} />
          ) : (
            <>
              <RecordTable
                objectName={objectName}
                records={records}
                onView={(id) => {
                  setViewingId(id)
                  setMode('view')
                }}
                onEdit={(id) => {
                  setEditingId(id)
                  setMode('edit')
                }}
                onDeleted={handleDeleted}
              />
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          ))}
      </div>
    </div>
  )
}
