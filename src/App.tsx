
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import { SentimentDonut, KeywordScatter } from './components/Charts';
import { analyzeWeiboContent } from './services/geminiService';
import { WeiboPost, KeywordData, SentimentSummary, SentimentType } from './types';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<WeiboPost[]>([]);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [summary, setSummary] = useState<SentimentSummary>({
    positive: 0,
    negative: 0,
    neutral: 0,
    total: 0
  });

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const result = await analyzeWeiboContent(searchQuery);
      setPosts(result.posts);
      setKeywords(result.keywords);
      setSummary(result.summary);
    } catch (error: any) {
      console.error("Analysis failed:", error);
      alert(`AI 分析失败: ${error.message || "请稍后重试"}`);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    setSearchQuery('科技发展');
    // Set some mock data or trigger first search
    const init = async () => {
      setIsLoading(true);
      try {
        const result = await analyzeWeiboContent('热门话题');
        setPosts(result.posts);
        setKeywords(result.keywords);
        setSummary(result.summary);
      } finally {
        setIsLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleStar = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isStarred: !p.isStarred } : p));
  };

  const Sidebar = (
    <aside className="w-64 sidebar-blur border-r border-black/5 dark:border-white/10 flex flex-col p-4 gap-6 shrink-0">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold uppercase tracking-wider opacity-40 px-2">微博关键词检索</label>
        <div className="relative px-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-sm opacity-40">search</span>
          <input
            className="w-full bg-black/5 dark:bg-white/5 border-none rounded-lg py-1.5 pl-9 pr-3 text-xs focus:ring-2 focus:ring-primary/40 outline-none transition-all"
            placeholder="输入搜索话题"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            type="text"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="mx-1 bg-primary text-white text-xs font-medium py-2 rounded-lg hover:bg-primary/90 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          {isLoading ? '正在分析...' : '加载数据'}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold uppercase tracking-wider opacity-40 px-2">时间段筛选</label>
        <div className="px-1 space-y-2">
          <select className="w-full bg-black/5 dark:bg-white/5 border-none rounded-lg py-1.5 px-3 text-xs focus:ring-2 focus:ring-primary/40 outline-none appearance-none cursor-pointer">
            <option>近7天</option>
            <option>近30天</option>
            <option>近1年</option>
          </select>
          <div className="flex flex-col gap-1.5 p-2 bg-black/5 dark:bg-white/5 rounded-lg">
            <input className="bg-transparent border-none p-0 text-[11px] focus:ring-0 w-full cursor-pointer dark:invert" type="date" defaultValue="2024-01-01" />
            <div className="h-px bg-black/5 dark:bg-white/5"></div>
            <input className="bg-transparent border-none p-0 text-[11px] focus:ring-0 w-full cursor-pointer dark:invert" type="date" defaultValue="2024-01-31" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-bold uppercase tracking-wider opacity-40 px-2 mb-1">功能导航</label>
        <nav className="flex flex-col gap-0.5">
          {[
            { id: 'scatter', label: '关键词散点图', icon: 'bubble_chart', active: true },
            { id: 'sentiment', label: '情绪分布', icon: 'pie_chart' },
            { id: 'collection', label: '自定义合集', icon: 'bookmarks' },
          ].map(item => (
            <a
              key={item.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${item.active ? 'bg-primary text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
              href="#"
            >
              <span className={`material-symbols-outlined text-lg ${item.active ? 'opacity-100' : 'opacity-60'}`}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 bg-primary/5 rounded-xl border border-primary/10">
        <h4 className="text-[10px] font-bold text-primary uppercase mb-1">高级版分析</h4>
        <p className="text-[11px] opacity-70 leading-relaxed mb-3">解锁深度情绪趋势洞察与实时预警功能。</p>
        <button className="w-full bg-primary/10 text-primary font-semibold text-[11px] py-1.5 rounded-lg hover:bg-primary/20 transition-colors">升级方案</button>
      </div>
    </aside>
  );

  const Footer = (
    <footer className="h-8 sidebar-blur border-t border-black/5 dark:border-white/10 flex items-center justify-between px-4 z-50 shrink-0">
      <div className="flex items-center gap-6 text-[10px] font-medium opacity-50 uppercase tracking-wider">
        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">storage</span> 微博总数: {summary.total.toLocaleString()}</span>
        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">sync</span> 更新时间: 刚刚</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold opacity-40 uppercase">暗黑模式</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              className="sr-only peer"
              type="checkbox"
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
            />
            <div className="w-7 h-4 bg-black/10 dark:bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        <div className="h-3 w-px bg-black/10 dark:bg-white/10"></div>
        <span className="text-[10px] font-bold opacity-30">v3.1.0-sonoma-cn</span>
      </div>
    </footer>
  );

  return (
    <Layout sidebar={Sidebar} footer={Footer} isDarkMode={isDarkMode}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* Upper Dashboard Section */}
        <div className="grid grid-cols-12 gap-6 min-h-[450px]">
          {/* Main Chart Card */}
          <div className="col-span-12 lg:col-span-8 glass-card rounded-xl p-6 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-base font-bold">关键词散点图</h2>
                <p className="text-[11px] opacity-50">话题 "{searchQuery}" 在选定时间段内的关键词热度</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/10 rounded-lg text-xs font-medium hover:bg-black/10 dark:hover:bg-white/20 transition-all active:scale-95">
                <span className="material-symbols-outlined text-sm">ios_share</span>
                导出数据
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4 opacity-30 animate-pulse">
                  <span className="material-symbols-outlined text-6xl">bubble_chart</span>
                  <p className="text-sm font-medium">分析引擎正在渲染...</p>
                </div>
              ) : (
                <KeywordScatter data={keywords} />
              )}
            </div>
          </div>

          {/* Sentiment Summary Card */}
          <div className="col-span-12 lg:col-span-4 glass-card rounded-xl p-6 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider opacity-60">情绪分布</h2>
              <div className="bg-black/5 dark:bg-white/10 p-0.5 rounded-lg flex">
                <button className="px-3 py-1 text-[10px] font-semibold rounded-md bg-white dark:bg-white/20 shadow-sm transition-all">环形图</button>
                <button className="px-3 py-1 text-[10px] font-semibold rounded-md opacity-50 hover:opacity-100 transition-all">趋势图</button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-30 animate-pulse">
                <div className="w-32 h-32 rounded-full border-8 border-primary/20"></div>
              </div>
            ) : (
              <SentimentDonut summary={summary} />
            )}

            <div className="space-y-2 mt-auto">
              {[
                { label: '正向', percent: summary.total ? Math.round((summary.positive / summary.total) * 100) : 0, color: 'bg-green-500', tint: 'bg-green-500/10', border: 'border-green-500/20' },
                { label: '负向', percent: summary.total ? Math.round((summary.negative / summary.total) * 100) : 0, color: 'bg-red-500', tint: 'bg-red-500/10', border: 'border-red-500/20' },
                { label: '中性', percent: summary.total ? Math.round((summary.neutral / summary.total) * 100) : 0, color: 'bg-primary', tint: 'bg-primary/10', border: 'border-primary/20' },
              ].map(item => (
                <div key={item.label} className={`flex items-center justify-between p-2.5 ${item.tint} rounded-lg border ${item.border} transition-all hover:translate-x-1`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                    <span className="text-[11px] font-semibold">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Weibo List Section */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">所有微博 (按时间倒序)</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-40">排序方式：最新发布</span>
              <button className="material-symbols-outlined text-lg opacity-40 hover:opacity-100 transition-opacity">filter_list</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass-card rounded-xl p-4 h-48 animate-pulse opacity-40"></div>
              ))
            ) : (
              posts.map(post => (
                <div key={post.id} className="glass-card rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
                  <button
                    onClick={() => toggleStar(post.id)}
                    className="absolute top-3 right-3 flex items-center justify-center z-10"
                  >
                    <span
                      className={`material-symbols-outlined text-[24px] transition-all duration-300 ${post.isStarred ? 'text-apple-gold scale-110' : 'text-slate-300 dark:text-slate-600 hover:text-apple-gold'}`}
                      style={{ fontVariationSettings: `'FILL' ${post.isStarred ? 1 : 0}` }}
                    >
                      star
                    </span>
                  </button>

                  <div className="flex items-center gap-3 pr-8">
                    <img
                      alt={post.author}
                      className="w-9 h-9 rounded-full border border-black/5 dark:border-white/10"
                      src={post.avatar || `https://picsum.photos/seed/${post.author}/100/100`}
                    />
                    <div>
                      <h4 className="text-xs font-bold truncate max-w-[120px]">{post.author}</h4>
                      <p className="text-[10px] opacity-40">{post.time}</p>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed line-clamp-4 opacity-80 pt-1 flex-1">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${post.sentiment === SentimentType.POSITIVE ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                        post.sentiment === SentimentType.NEGATIVE ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                          'bg-blue-100 dark:bg-blue-900/30 text-primary'
                      }`}>
                      {post.sentiment === SentimentType.POSITIVE ? '正向' : post.sentiment === SentimentType.NEGATIVE ? '负向' : '中性'}
                    </span>
                    <div className="flex items-center gap-3 text-[10px] opacity-40 font-medium">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">favorite</span> {post.likes}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">chat</span> {post.comments}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
