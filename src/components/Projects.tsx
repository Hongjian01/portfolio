import type { Project } from '../types'
import { TechPill } from './Shared'

interface ProjectsProps {
  projects: Project[]
}

function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="mb-16 scroll-mt-24">
      <h2 className="mb-6 text-2xl font-semibold text-slate-100">Projects</h2>
      <div className="space-y-5">
        {projects.map((item) => (
          <article
            key={item.id}
            className="group rounded-2xl border border-transparent p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900/60"
          >
            <div className="sm:grid sm:grid-cols-8 sm:gap-4">
              <p className="mb-2 text-xs tracking-wide text-slate-400 sm:col-span-2 sm:mt-1 sm:mb-0 sm:text-sm">
                {item.period}
              </p>
              <div className="sm:col-span-6">
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-lg font-semibold text-slate-100 transition-colors duration-300 group-hover:text-teal-300"
                  >
                    {item.title}
                  </a>
                ) : (
                  <h3 className="text-lg font-semibold text-slate-100 transition-colors duration-300 group-hover:text-teal-300">
                    {item.title}
                  </h3>
                )}
                <p className="mt-4 leading-7 text-slate-300">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <TechPill key={tag} label={tag} />
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Projects
