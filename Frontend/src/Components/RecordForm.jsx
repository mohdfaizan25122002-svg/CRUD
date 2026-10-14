import { useState } from 'react'
const DEFAULT_FIELDS = {
  Contact: ['FirstName', 'LastName', 'Email', 'Phone'],
  Account: ['Name', 'Industry', 'Phone'],
  Lead: ['FirstName', 'LastName', 'Company', 'Email'],
  Opportunity: ['Name', 'StageName', 'Amount', 'CloseDate'],
  Case: ['Subject', 'Status', 'Priority'],
  Task: ['Subject', 'Status', 'ActivityDate'],
}

function toRows(data) {
  const entries = Object.entries(data || {}).filter(([key]) => key !== 'Id' && key !== 'attributes')
  return entries.length ? entries.map(([key, value]) => ({ key, value: value ?? '' })) : [{ key: '', value: '' }]
}

export default function RecordForm({ objectName, initialData, onSubmit, onCancel, submitting }) {
  const isEdit = Boolean(initialData?.Id)
  const [rows, setRows] = useState(() => {
    if (initialData) return toRows(initialData)
    const defaults = DEFAULT_FIELDS[objectName] || ['Name']
    return defaults.map((key) => ({ key, value: '' }))
  })
  const [error, setError] = useState('')

  const updateRow = (index, field, value) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
  }

  const addRow = () => setRows((prev) => [...prev, { key: '', value: '' }])

  const removeRow = (index) => setRows((prev) => prev.filter((_, i) => i !== index))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const cleanRows = rows.filter((r) => r.key.trim() !== '')
    if (cleanRows.length === 0) {
      setError('Add at least one field.')
      return
    }

    const data = {}
    for (const row of cleanRows) {
      data[row.key.trim()] = row.value
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: 20 }}>
      <h3 style={{ marginTop: 0 }}>
        {isEdit ? `Edit ${objectName}` : `New ${objectName}`}
      </h3>

      {rows.map((row, index) => (
        <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-end' }}>
          <div className="form-field" style={{ marginBottom: 0, flex: 1 }}>
            <label>Field</label>
            <input
              type="text"
              placeholder="e.g. LastName"
              value={row.key}
              onChange={(e) => updateRow(index, 'key', e.target.value)}
            />
          </div>
          <div className="form-field" style={{ marginBottom: 0, flex: 2 }}>
            <label>Value</label>
            <input
              type="text"
              value={row.value}
              onChange={(e) => updateRow(index, 'value', e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => removeRow(index)}
            disabled={rows.length === 1}
            aria-label="Remove field"
          >
            ✕
          </button>
        </div>
      ))}

      <button type="button" className="btn btn-ghost" onClick={addRow} style={{ marginBottom: 16 }}>
        + Add field
      </button>

      {error && <div className="error-text">{error}</div>}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create record'}
        </button>
      </div>
    </form>
  )
}
