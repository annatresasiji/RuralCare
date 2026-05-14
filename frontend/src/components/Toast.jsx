import { useEffect } from 'react'

export default function Toast({ msg, type = 'ok', onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 3000)
    return () => clearTimeout(t)
  }, [])

  return <div className={`toast ${type}`}>{msg}</div>
}
