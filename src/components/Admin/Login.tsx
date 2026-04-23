import { useState, type FormEvent } from 'react'

interface LoginProps {
  onSuccess: () => void
}

const ADMIN_PASSWORD = 'admin123'

function Login({ onSuccess }: LoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password === ADMIN_PASSWORD) {
      setError('')
      onSuccess()
      return
    }

    setError('密码错误，请重试。')
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
      <h1 className="text-2xl font-semibold text-slate-100">Admin Login</h1>
      <p className="mt-2 text-sm text-slate-400">请输入后台密码后继续。</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm text-slate-300" htmlFor="admin-password">
            密码
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition-colors focus:border-teal-300"
            placeholder="请输入密码"
          />
        </div>
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-lg bg-teal-400/20 px-4 py-2 font-medium text-teal-300 transition-colors hover:bg-teal-400/30"
        >
          登录后台
        </button>
      </form>
    </div>
  )
}

export default Login
