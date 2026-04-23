import { useEffect, useState } from 'react'

function useScrollSpy(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const defaultSection = sectionIds.includes('about') ? 'about' : (sectionIds[0] ?? '')
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (sections.length === 0) {
      return
    }

    const observerRoot: Element | null = null

    const setDefaultWhenAtTop = () => {
      if (window.scrollY === 0 && defaultSection) {
        setActiveSection(defaultSection)
      }
    }

    const updateActiveSectionByCenter = () => {
      if (window.scrollY === 0 && defaultSection) {
        setActiveSection(defaultSection)
        return
      }

      const viewportCenter = window.innerHeight / 2
      const closestSection = sections
        .map((section) => {
          const rect = section.getBoundingClientRect()
          const sectionCenter = rect.top + rect.height / 2
          const distance = Math.abs(sectionCenter - viewportCenter)
          const isVisible = rect.bottom > 0 && rect.top < window.innerHeight

          return {
            id: section.id,
            top: rect.top,
            distance,
            isVisible,
          }
        })
        .filter((section) => section.isVisible)
        .sort((a, b) => {
          if (a.distance === b.distance) {
            return a.top - b.top
          }
          return a.distance - b.distance
        })[0]

      if (closestSection) {
        setActiveSection(closestSection.id)
      }
    }

    const observer = new IntersectionObserver(
      () => {
        updateActiveSectionByCenter()
      },
      {
        // 当前页面使用视口滚动，因此 root 设为 null；如改为容器滚动可替换为容器元素
        root: observerRoot,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      },
    )

    sections.forEach((section) => observer.observe(section))

    setDefaultWhenAtTop()
    updateActiveSectionByCenter()
    window.addEventListener('scroll', updateActiveSectionByCenter, { passive: true })
    window.addEventListener('resize', updateActiveSectionByCenter)

    return () => {
      sections.forEach((section) => observer.unobserve(section))
      observer.disconnect()
      window.removeEventListener('scroll', updateActiveSectionByCenter)
      window.removeEventListener('resize', updateActiveSectionByCenter)
    }
  }, [sectionIds])

  return activeSection
}

export default useScrollSpy
