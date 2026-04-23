import { useMemo, type MouseEvent } from 'react'
import { Code2, Mail } from 'lucide-react'
import useScrollSpy from '../hooks/useScrollSpy'
import type { Profile, SocialLink } from '../types'

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
]

interface SidebarProps {
  profile: Profile
  socials: SocialLink[]
}

const IconMap = {
  Code2,
  Mail,
}

function Sidebar({ profile, socials }: SidebarProps) {
  const sectionIds = useMemo(() => NAV_ITEMS.map((item) => item.id), [])
  const activeSection = useScrollSpy(sectionIds)

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    event.preventDefault()
    const target = document.getElementById(targetId)

    if (!target) {
      return
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${targetId}`)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Portfolio</p>
          <h1 className="text-4xl font-bold text-slate-50 md:text-5xl">{profile.name}</h1>
          <p className="text-lg text-slate-300">{profile.title}</p>
        </div>

        <p className="max-w-md text-sm leading-7 text-slate-400">{profile.statement}</p>

        <nav aria-label="页面导航" className="pt-4">
          <ul className="space-y-3 text-xs uppercase tracking-[0.16em]">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id

              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => handleNavClick(event, item.id)}
                    className={`group inline-flex items-center gap-4 font-semibold ${
                      isActive ? 'text-slate-50' : 'text-slate-500/65 hover:text-slate-300'
                    }`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span
                      className={`h-px transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive
                          ? 'w-16 bg-teal-300'
                          : 'w-8 bg-slate-600 group-hover:w-12 group-hover:bg-slate-400'
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`transition-all duration-300 ${
                        isActive
                          ? 'text-slate-50 tracking-[0.2em]'
                          : 'text-slate-500/65 tracking-[0.16em] delay-75 group-hover:text-slate-300'
                      }`}
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div className="mt-auto pt-8">
        <ul className="flex items-center gap-4 text-slate-400">
          {socials.map((item) => {
            const IconComponent = IconMap[item.iconName as keyof typeof IconMap] ?? Code2
            const isExternal = item.url.startsWith('http')

            return (
              <li key={item.id}>
                <a
                  href={item.url}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noreferrer' : undefined}
                  aria-label={item.platform}
                  title={item.platform}
                  className="transition-colors hover:text-teal-300"
                >
                  <IconComponent size={20} />
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
