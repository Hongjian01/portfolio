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

// 提取一个同步读取本地缓存的函数
function getLocalDataOrDefault(): PortfolioData {
  const savedData = localStorage.getItem(STORAGE_KEY)
  if (savedData) {
    try {
      return normalizePortfolioData(JSON.parse(savedData))
    } catch {
      // 解析失败忽略
    }
  }
  return getInitialPortfolioData()
}

function usePortfolioData() {
  // 1. 初始化时，直接同步拿到本地缓存数据，不要等
  const [data, setData] = useState<PortfolioData>(getLocalDataOrDefault)
  
  // 2. 只有在本地完全没有缓存（初次访问）时，才显示加载动画
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY) === null
  })

  useEffect(() => {
    const fetchCloudData = async () => {
      try {
        // 悄悄去云端请求数据
        const { data: cloudResponse, error } = await supabase
          .from('portfolio_data')
          .select('content')
          .eq('id', 1)
          .single()

        if (cloudResponse && cloudResponse.content && !error) {
          const cloudData = cloudResponse.content as PortfolioData
          // 拿到新数据后，无缝替换当前 UI，并更新本地缓存
          setData(cloudData)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData))
        }
      } catch (err) {
        console.error('后台获取数据失败:', err)
      } finally {
        // 无论成功失败，都确保关闭首屏的 loading
        setIsLoading(false)
      }
    }

    fetchCloudData()
  }, [])

  const updateData = async (newData: PortfolioData) => {
    setData(newData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))

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

  return { data, updateData, resetData, isLoading }
}

export default usePortfolioData