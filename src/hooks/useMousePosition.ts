import { useEffect, useState } from 'react'

interface MousePosition {
  x: number
  y: number
}

function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY })
    }

    // 初始化为视口中心，避免初次渲染光晕固定在左上角
    setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return position
}

export default useMousePosition
