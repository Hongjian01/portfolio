import usePortfolioData from '../hooks/usePortfolioData'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function About() {
  const { data } = usePortfolioData()
  const paragraphs = data.about
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
  const keywords = [...data.aboutKeywords].sort((a, b) => b.length - a.length)

  const highlightText = (text: string) => {
    if (keywords.length === 0) {
      return [text]
    }

    const pattern = new RegExp(`(${keywords.map(escapeRegExp).join('|')})`, 'gi')
    const parts = text.split(pattern)

    return parts.map((part, index) => {
      const isKeyword = keywords.some((keyword) => keyword.toLowerCase() === part.toLowerCase())
      if (!isKeyword) {
        return part
      }

      return (
        <span key={`keyword-${part}-${index}`} className="font-semibold text-teal-300">
          {part}
        </span>
      )
    })
  }

  return (
    <section id="about" className="mb-16 scroll-mt-24">
      <h2 className="mb-4 text-2xl font-semibold text-slate-100">About</h2>
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={`about-${index}`} className="leading-7 text-slate-300">
            {highlightText(paragraph)}
          </p>
        ))}
      </div>
    </section>
  )
}

export default About
