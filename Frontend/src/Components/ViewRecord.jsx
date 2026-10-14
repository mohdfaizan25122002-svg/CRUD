import { useEffect, useState } from 'react'
import { getRecord } from '../Services/api'
import Loader from './Loader'

export default function ViewRecord({ objectName, recordId, onClose }) {
  const [record, setRecord] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    getRecord(objectName, recordId)
      .then(({ data }) => {
        if (!cancelled) setRecord(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load record.')
      })

    return () => {
      cancelled = true
    }
  }, [objectName, recordId])

  if (error) return <div className="error-text">{error}</div>
  if (!record) return <Loader label="Loading record…" />

  return (
    <section className="card" style={{ padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>{objectName} details</h3>
        <button className="btn btn-ghost" onClick={onClose}>Close</button>
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: 'minmax(130px, 1fr) minmax(0, 3fr)', gap: '12px 20px', margin: 0 }}>
        {Object.entries(record)
          .filter(([field]) => field !== 'attributes')
          .map(([field, value]) => (
            <div key={field} style={{ display: 'contents' }}>
              <dt style={{ color: 'var(--text-dim)', fontWeight: 600 }}>{field}</dt>
              <dd style={{ margin: 0, overflowWrap: 'anywhere' }}>{String(value ?? '')}</dd>
            </div>
          ))}
      </dl>
    </section>
  )
}
