import { useEffect, useState } from 'react'
import { getInitialPortfolioData, INITIAL_PORTFOLIO_DATA } from '../data/content'
import { supabase } from '../lib/supabase'
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

function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(getInitialPortfolioData())

  useEffect(() => {
    // 定义一个异步函数来获取数据
    const fetchCloudData = async () => {
      try {
        // 1. 先尝试从 Supabase 获取
        const { data: cloudResponse, error } = await supabase
          .from('portfolio_data')
          .select('content')
          .eq('id', 1)
          .single()

        if (cloudResponse && cloudResponse.content && !error) {
          const cloudData = cloudResponse.content as PortfolioData
          setData(cloudData)
          // 同步更新本地缓存，保证下次加载速度
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData))
          console.log('✅ 云端数据加载成功')
          return
        }
      } catch (err) {
        console.error('❌ 获取云端数据失败，将回退到本地缓存:', err)
      }

      // 2. 如果云端失败，回退到原来的 localStorage 逻辑
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          setData(normalizePortfolioData(parsed))
        } catch {
          setData(getInitialPortfolioData())
        }
      }
    }

    fetchCloudData()
  }, [])

  const updateData = async (newData: PortfolioData) => {
    // 乐观更新：先改 UI
    setData(newData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))

    // 同步到云端
    const { error } = await supabase
      .from('portfolio_data')
      .update({ content: newData })
      .eq('id', 1)

    if (error) {
      console.error('Supabase 更新失败:', error)
      throw new Error(error.message || 'Supabase update failed')
    }
  }

  const resetData = () => {
    const initialData = getInitialPortfolioData()
    setData(initialData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
  }

  return { data, updateData, resetData }
}

export default usePortfolioData