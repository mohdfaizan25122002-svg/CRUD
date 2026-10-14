import { useState } from 'react'
import { deleteRecord } from '../Services/api'

export default function DeleteButton({ objectName, recordId, onDeleted }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this record? This cannot be undone.')
    if (!confirmed) return

    setLoading(true)
    try {
      await deleteRecord(objectName, recordId)
      onDeleted?.(recordId)
    } catch (err) {
      window.alert(err.response?.data?.message || 'Failed to delete the record.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
      {loading ? 'Deleting…' : 'Delete'}
    </button>
  )
}
