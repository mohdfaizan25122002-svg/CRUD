export default function LoginButton({ loading, children = 'Log in', ...rest }) {
  return (
    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }} {...rest}>
      {loading ? 'Please wait…' : children}
    </button>
  )
}
