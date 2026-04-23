import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-200">
      <div className="max-w-xl space-y-5 text-center">
        <h1 className="text-6xl font-bold text-slate-50">404</h1>
        <p className="text-slate-300">页面未找到，占位文本：后续会替换为终端风格交互内容。</p>
        <Link
          to="/"
          className="inline-block rounded-md border border-cyan-400/40 px-4 py-2 text-cyan-300 transition hover:bg-cyan-400/10"
        >
          返回首页
        </Link>
      </div>
    </main>
  )
}

export default NotFound
