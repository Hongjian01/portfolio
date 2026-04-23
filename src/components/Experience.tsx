import type { Experience as ExperienceItem } from '../types'
import { TechPill } from './Shared'

interface ExperienceProps {
  experiences: ExperienceItem[]
}

function Experience({ experiences }: ExperienceProps) {
  return (
    <section id="experience" className="mb-16 scroll-mt-24">
      <h2 className="mb-6 text-2xl font-semibold text-slate-100">Experience</h2>
      <div className="space-y-5">
        {experiences.map((item) => (
          <article
            key={item.id}
            className="group rounded-2xl border border-transparent p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900/60"
          >
            <div className="sm:grid sm:grid-cols-8 sm:gap-4">
              <p className="mb-2 text-xs tracking-wide text-slate-400 sm:col-span-2 sm:mt-1 sm:mb-0 sm:text-sm">
                {item.period}
              </p>
              <div className="sm:col-span-6">
                <h3 className="text-lg font-semibold text-slate-100 transition-colors duration-300 group-hover:text-teal-300">
                  {item.role}
                </h3>
                <p className="mt-1 text-sm text-slate-300">{item.company}</p>
                <p className="mt-4 leading-7 text-slate-300">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.techStack.map((tech) => (
                    <TechPill key={tech} label={tech} />
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

export default Experience
