'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, Download } from 'lucide-react';

interface Stat {
  target: string;
  type: 'page_view' | 'download';
  hits: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading stats...</div>;

  const totalViews = stats.filter(s => s.type === 'page_view').reduce((acc, curr) => acc + curr.hits, 0);
  const totalDownloads = stats.find(s => s.target === 'resume-pdf')?.hits || 0;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Performance Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-teal-100 text-teal-600 rounded-xl"><BarChart3 /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Blog Views</p>
            <p className="text-2xl font-bold">{totalViews}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><Download /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">CV Downloads</p>
            <p className="text-2xl font-bold">{totalDownloads}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}