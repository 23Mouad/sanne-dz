'use client'

import { useEffect, useRef } from 'react'
import Chart, { ChartType, ChartData, ChartOptions } from 'chart.js/auto'

interface ChartProps {
  type: ChartType
  data: ChartData
  options?: ChartOptions
  className?: string
  height?: number | string
}

export default function CustomChart({ type, data, options, className = '', height = 300 }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    chartRef.current = new Chart(canvasRef.current, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options
      }
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [type, data, options])

  return (
    <div className={`relative w-full ${className}`} style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
