'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartContainerProps {
  data: any[]
  dataKey1: string
  dataKey2?: string
  label?: string
  height?: number
}

export function ChartContainer({ data, dataKey1, dataKey2, label, height = 300 }: ChartContainerProps) {
  if (!data || data.length === 0) {
    return (
      <div style={{ width: '100%', height: `${height}px` }} className="flex items-center justify-center bg-cream-50 rounded-lg">
        <p className="text-teal-700 font-medium">No data available</p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: `${height}px` }} className="rounded-lg overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 30, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1B3B3A',
              border: '1px solid #29908A',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 500,
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '13px' }} />
          <Line
            type="monotone"
            dataKey={dataKey1}
            stroke="#5BBAB5"
            strokeWidth={2.5}
            dot={{ fill: '#5BBAB5', r: 4 }}
            activeDot={{ r: 6 }}
            name={label || dataKey1.charAt(0).toUpperCase() + dataKey1.slice(1)}
            isAnimationActive={true}
          />
          {dataKey2 && (
            <Line
              type="monotone"
              dataKey={dataKey2}
              stroke="#29908A"
              strokeWidth={2.5}
              dot={{ fill: '#29908A', r: 4 }}
              activeDot={{ r: 6 }}
              name={dataKey2.charAt(0).toUpperCase() + dataKey2.slice(1)}
              isAnimationActive={true}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
