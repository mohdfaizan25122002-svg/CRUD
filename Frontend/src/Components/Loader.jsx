export default function Loader({ label = 'Loading…', size = 24 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 20, color: 'var(--text-dim)' }}>
      <span
        style={{
          width: size,
          height: size,
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span>{label}</span>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
