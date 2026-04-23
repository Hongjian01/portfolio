import { useEffect, useState } from 'react'
import { getInitialPortfolioData, INITIAL_PORTFOLIO_DATA } from '../data/content'
import type { PortfolioData } from '../types'

const STORAGE_KEY = 'portfolio_data'

function normalizePortfolioData(rawData: Partial<PortfolioData>): PortfolioData {
  return {
    about: rawData.about ?? INITIAL_PORTFOLIO_DATA.about,
    aboutKeywords: rawData.aboutKeywords ?? INITIAL_PORTFOLIO_DATA.aboutKeywords,
    profile: rawData.profile ?? INITIAL_PORTFOLIO_DATA.profile,
    socials: rawData.socials ?? INITIAL_PORTFOLIO_DATA.socials,
    experiences: rawData.experiences ?? INITIAL_PORTFOLIO_DATA.experiences,
    projects: rawData.projects ?? INITIAL_PORTFOLIO_DATA.projects,
  }
}

function readPortfolioData(): PortfolioData {
  const savedData = localStorage.getItem(STORAGE_KEY)
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData) as Partial<PortfolioData>
      const normalizedData = normalizePortfolioData(parsedData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedData))
      return normalizedData
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const initialData = getInitialPortfolioData()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
  return initialData
}

function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(getInitialPortfolioData())

  useEffect(() => {
    setData(readPortfolioData())
  }, [])

  const updateData = (newData: PortfolioData) => {
    setData(newData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
  }

  const resetData = () => {
    const initialData = getInitialPortfolioData()
    setData(initialData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
  }

  return { data, updateData, resetData }
}

export default usePortfolioData
