import DeleteButton from './DeleteButton'


function getColumns(records) {
  const keys = new Set()
  records.forEach((r) => Object.keys(r).forEach((k) => k !== 'attributes' && keys.add(k)))
  const cols = Array.from(keys)


  cols.sort((a, b) => (a === 'Id' ? -1 : b === 'Id' ? 1 : 0))
  return cols
}

export default function RecordTable({ objectName, records, onView, onEdit, onDeleted }) {
  if (!records.length) {
    return (
      <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-dim)' }}>
        No {objectName} records yet. Create one to get started.
      </div>
    )
  }

  const columns = getColumns(records)

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text-dim)',
                  fontWeight: 600,
                }}
              >
                {col}
              </th>
            ))}
            <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }} />
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.Id}>
              {columns.map((col) => (
                <td key={col} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
                  {String(record[col] ?? '')}
                </td>
              ))}
              <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost" onClick={() => onView(record.Id)}>
                    View
                  </button>
                  <button className="btn btn-ghost" onClick={() => onEdit(record.Id)}>
                    Edit
                  </button>
                  <DeleteButton objectName={objectName} recordId={record.Id} onDeleted={onDeleted} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
