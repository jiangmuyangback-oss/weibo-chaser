
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip,
  Cell as ReCell
} from 'recharts';
import { SentimentSummary, KeywordData, SentimentType } from '../types';

interface SentimentChartProps {
  summary: SentimentSummary;
}

export const SentimentDonut: React.FC<SentimentChartProps> = ({ summary }) => {
  const data = [
    { name: '正向', value: summary.positive, color: '#4ade80' },
    { name: '负向', value: summary.negative, color: '#f87171' },
    { name: '中性', value: summary.neutral, color: '#007AFF' },
  ];

  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-bold">{summary.total.toLocaleString()}</span>
        <span className="text-[10px] opacity-40 uppercase">微博总数</span>
      </div>
    </div>
  );
};

interface KeywordScatterProps {
  data: KeywordData[];
}

export const KeywordScatter: React.FC<KeywordScatterProps> = ({ data }) => {
  return (
    <div className="w-full h-full min-h-[300px] relative">
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold uppercase tracking-widest opacity-40">出现频率</div>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest opacity-40">时间轴</div>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
          <XAxis type="number" dataKey="time" hide />
          <YAxis type="number" dataKey="importance" hide />
          <ZAxis type="number" dataKey="frequency" range={[400, 3000]} />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            content={({ active, payload }) => {
                if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                        <div className="bg-white dark:bg-zinc-800 p-2 border border-black/5 dark:border-white/10 rounded-lg shadow-xl text-xs">
                            <p className="font-bold">{d.name}</p>
                            <p className="opacity-60">频率: {d.frequency}</p>
                        </div>
                    );
                }
                return null;
            }}
          />
          <Scatter data={data}>
            {data.map((entry, index) => (
              <ReCell 
                key={`cell-${index}`} 
                fill={entry.type === SentimentType.POSITIVE ? '#4ade80' : entry.type === SentimentType.NEGATIVE ? '#f87171' : '#007AFF'}
                fillOpacity={0.2}
                stroke={entry.type === SentimentType.POSITIVE ? '#4ade80' : entry.type === SentimentType.NEGATIVE ? '#f87171' : '#007AFF'}
                strokeWidth={2}
                label={{ position: 'center', fill: 'currentColor', fontSize: 10, fontWeight: 'bold', value: entry.name }}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
