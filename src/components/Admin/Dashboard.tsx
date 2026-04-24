import { useEffect, useState } from 'react'
import type { Experience, PortfolioData, Project } from '../../types'

interface DashboardProps {
  data: PortfolioData
  updateData: (newData: PortfolioData) => Promise<void>
  resetData: () => void
}

function Dashboard({ data, updateData, resetData }: DashboardProps) {
  const [formData, setFormData] = useState<PortfolioData>(data)
  const [isSaving, setIsSaving] = useState(false)
  const [saveNotice, setSaveNotice] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)

  useEffect(() => {
    setFormData(data)
  }, [data])

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    setFormData((prev) => {
      const next = prev.experiences.map((item) => ({ ...item }))
      if (field === 'techStack') {
        next[index].techStack = value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      } else {
        ;(next[index][field] as string) = value
      }
      return { ...prev, experiences: next }
    })
  }

  const updateProject = (index: number, field: keyof Project, value: string) => {
    setFormData((prev) => {
      const next = prev.projects.map((item) => ({ ...item }))
      if (field === 'tags') {
        next[index].tags = value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      } else {
        ;(next[index][field] as string) = value
      }
      return { ...prev, projects: next }
    })
  }

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: `exp-${Date.now()}`,
          period: '时间区间',
          role: '岗位名称',
          company: '公司名称',
          description: '职责描述',
          techStack: ['Java'],
        },
      ],
    }))
  }

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: `project-${Date.now()}`,
          period: '时间区间',
          title: '项目标题',
          description: '项目描述',
          tags: ['TypeScript'],
          link: '',
        },
      ],
    }))
  }

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const updateSocial = (index: number, field: 'platform' | 'url' | 'iconName', value: string) => {
    setFormData((prev) => {
      const next = prev.socials.map((item) => ({ ...item }))
      next[index][field] = value
      return { ...prev, socials: next }
    })
  }

  const addSocial = () => {
    setFormData((prev) => ({
      ...prev,
      socials: [
        ...prev.socials,
        {
          id: `social-${Date.now()}`,
          platform: 'New Platform',
          url: 'https://',
          iconName: 'Code2',
        },
      ],
    }))
  }

  const removeSocial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socials: prev.socials.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const handleSave = async () => {
    setSaveNotice({ type: 'info', message: '正在保存到 Supabase...' })
    setIsSaving(true)
    try {
      await updateData(formData)
      setSaveNotice({ type: 'success', message: '保存成功，云端数据已更新。' })
    } catch (error) {
      console.error('保存到 Supabase 失败:', error)
      const message = error instanceof Error ? error.message : '保存失败，请稍后重试。'
      setSaveNotice({ type: 'error', message: `保存失败：${message}` })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    const confirmed = window.confirm('确认重置为初始数据吗？当前未保存修改将丢失。')
    if (!confirmed) {
      return
    }

    resetData()
    setSaveNotice({ type: 'info', message: '已重置为初始数据，请记得点击“保存更改”同步到云端。' })
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Portfolio CMS Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">编辑后点击“保存更改”即可写入 LocalStorage。</p>
        {saveNotice ? (
          <div
            className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
              saveNotice.type === 'success'
                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                : saveNotice.type === 'error'
                  ? 'border-rose-400/30 bg-rose-400/10 text-rose-300'
                  : 'border-sky-400/30 bg-sky-400/10 text-sky-300'
            }`}
          >
            {saveNotice.message}
          </div>
        ) : null}
      </div>

      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5">
        <h2 className="text-lg font-semibold text-slate-100">About / 关于我</h2>
        <label className="block text-sm text-slate-300">
          About 文本
          <textarea
            value={formData.about}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                about: event.target.value,
              }))
            }
            rows={6}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-slate-100 outline-none focus:border-teal-300"
            placeholder="输入 About 内容，支持换行。"
          />
        </label>
        <label className="block text-sm text-slate-300">
          高亮关键词（逗号分隔）
          <input
            value={formData.aboutKeywords.join(', ')}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                aboutKeywords: event.target.value
                  .split(',')
                  .map((item) => item.trim())
                  .filter(Boolean),
              }))
            }
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-slate-100 outline-none focus:border-teal-300"
            placeholder="例如：分布式系统, 并发控制, 性能调优"
          />
        </label>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5">
        <h2 className="text-lg font-semibold text-slate-100">个人基础信息</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            姓名
            <input
              value={formData.profile.name}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  profile: { ...prev.profile, name: event.target.value },
                }))
              }
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-teal-300"
            />
          </label>
          <label className="text-sm text-slate-300">
            头衔
            <input
              value={formData.profile.title}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  profile: { ...prev.profile, title: event.target.value },
                }))
              }
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-teal-300"
            />
          </label>
        </div>
        <label className="block text-sm text-slate-300">
          个人陈述
          <textarea
            value={formData.profile.statement}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                profile: { ...prev.profile, statement: event.target.value },
              }))
            }
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-teal-300"
          />
        </label>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">社交链接管理</h2>
          <button
            type="button"
            onClick={addSocial}
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-700"
          >
            添加新链接
          </button>
        </div>
        <p className="text-xs text-slate-400">
          iconName 需填写 Lucide 图标组件名，例如：Code2、Mail、Linkedin、Twitter。
        </p>
        <div className="space-y-4">
          {formData.socials.map((item, index) => (
            <div key={item.id} className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">社交链接 #{index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeSocial(index)}
                  className="text-sm text-rose-300 transition-colors hover:text-rose-200"
                >
                  删除
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <input
                  value={item.platform}
                  onChange={(event) => updateSocial(index, 'platform', event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-teal-300"
                  placeholder="平台名"
                />
                <input
                  value={item.url}
                  onChange={(event) => updateSocial(index, 'url', event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-teal-300 md:col-span-2"
                  placeholder="链接 URL"
                />
                <input
                  value={item.iconName}
                  onChange={(event) => updateSocial(index, 'iconName', event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-teal-300 md:col-span-3"
                  placeholder="图标组件名（如 Code2）"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Experience 经历</h2>
          <button
            type="button"
            onClick={addExperience}
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-700"
          >
            添加经历
          </button>
        </div>
        <div className="space-y-4">
          {formData.experiences.map((item, index) => (
            <div key={item.id} className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">经历 #{index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-sm text-rose-300 transition-colors hover:text-rose-200"
                >
                  删除
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={item.period}
                  onChange={(event) => updateExperience(index, 'period', event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-teal-300"
                  placeholder="时间区间"
                />
                <input
                  value={item.role}
                  onChange={(event) => updateExperience(index, 'role', event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-teal-300"
                  placeholder="岗位"
                />
                <input
                  value={item.company}
                  onChange={(event) => updateExperience(index, 'company', event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-teal-300 md:col-span-2"
                  placeholder="公司"
                />
                <textarea
                  value={item.description}
                  onChange={(event) => updateExperience(index, 'description', event.target.value)}
                  rows={3}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-teal-300 md:col-span-2"
                  placeholder="经历描述"
                />
                <input
                  value={item.techStack.join(', ')}
                  onChange={(event) => updateExperience(index, 'techStack', event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-teal-300 md:col-span-2"
                  placeholder="技术栈（用逗号分隔）"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Projects 项目</h2>
          <button
            type="button"
            onClick={addProject}
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-700"
          >
            添加项目
          </button>
        </div>
        <div className="space-y-4">
          {formData.projects.map((item, index) => (
            <div key={item.id} className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">项目 #{index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="text-sm text-rose-300 transition-colors hover:text-rose-200"
                >
                  删除
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={item.period}
                  onChange={(event) => updateProject(index, 'period', event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-teal-300"
                  placeholder="时间区间"
                />
                <input
                  value={item.title}
                  onChange={(event) => updateProject(index, 'title', event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-teal-300"
                  placeholder="项目名称"
                />
                <input
                  value={item.link ?? ''}
                  onChange={(event) => updateProject(index, 'link', event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-teal-300 md:col-span-2"
                  placeholder="项目链接"
                />
                <textarea
                  value={item.description}
                  onChange={(event) => updateProject(index, 'description', event.target.value)}
                  rows={3}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-teal-300 md:col-span-2"
                  placeholder="项目描述"
                />
                <input
                  value={item.tags.join(', ')}
                  onChange={(event) => updateProject(index, 'tags', event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-teal-300 md:col-span-2"
                  placeholder="标签（用逗号分隔）"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg bg-teal-400/20 px-5 py-2.5 font-medium text-teal-300 transition-colors hover:bg-teal-400/30"
        >
          {isSaving ? '保存中...' : '保存更改'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-2.5 font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-100"
        >
          重置为初始数据
        </button>
      </div>
    </div>
  )
}

export default Dashboard
