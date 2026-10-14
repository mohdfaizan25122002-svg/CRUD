import { useEffect, useState } from 'react'
import { getRecord, updateRecord } from '../Services/api'
import RecordForm from './RecordForm'
import Loader from './Loader'

export default function EditRecord({ objectName, recordId, onClose, onSaved }) {
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    getRecord(objectName, recordId)
      .then(({ data }) => {
        if (!cancelled) setRecord(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load record.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [objectName, recordId])

  const handleSubmit = async (data) => {
    setSubmitting(true)
    setError('')
    try {
      const { data: updated } = await updateRecord(objectName, recordId, data)
      onSaved?.(updated)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader label="Loading record…" />
  if (error && !record) return <div className="error-text">{error}</div>

  return (
    <div>
      <RecordForm
        objectName={objectName}
        initialData={record}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitting={submitting}
      />
      {error && <div className="error-text" style={{ marginTop: 10 }}>{error}</div>}
    </div>
  )
}
