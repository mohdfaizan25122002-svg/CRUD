
const OBJECTS = ['Contact', 'Account', 'Lead', 'Opportunity', 'Case', 'Task']

export default function ObjectSelector({ value, onChange }) {
  return (
    <div className="form-field" style={{ marginBottom: 0, minWidth: 200 }}>
      <label htmlFor="object-select">Object</label>
      <select id="object-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {OBJECTS.map((obj) => (
          <option key={obj} value={obj}>
            {obj}
          </option>
        ))}
      </select>
    </div>
  )
}
