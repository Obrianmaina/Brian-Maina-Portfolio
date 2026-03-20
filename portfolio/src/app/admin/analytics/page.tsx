'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { BarChart3, Download, ArrowLeft, FileText } from 'lucide-react';

interface Stat {
  target: string;
  type: 'page_view' | 'download';
  hits: number;
}

interface AccessLog {
  _id: string;
  clientEmail: string;
  accessedAt: string;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stat[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Force browser to fetch fresh data
    fetch('/api/analytics', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStats(data);
        } else {
          setStats(data.stats || []);
          setAccessLogs(data.accessLogs || []);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8 text-gray-500 dark:text-gray-400 transition-colors duration-300">Loading stats...</div>;

  const totalViews = stats.filter(s => s.type === 'page_view').reduce((acc, curr) => acc + curr.hits, 0);
  const totalDownloads = stats.find(s => s.target === 'resume-pdf')?.hits || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => router.push('/admin')} 
          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium mb-6 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded p-1 -ml-1"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Hub
        </button>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-50 transition-colors">Performance Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 flex items-center gap-4 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 transition-colors shadow-sm dark:shadow-none">
            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl transition-colors"><BarChart3 /></div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">Blog Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">{totalViews}</p>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-4 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 transition-colors shadow-sm dark:shadow-none">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl transition-colors"><Download /></div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">CV Downloads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">{totalDownloads}</p>
            </div>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-50 transition-colors">
          <FileText size={24} className="text-teal-600 dark:text-teal-400 transition-colors" /> Recent References Access
        </h2>
        
        <Card className="overflow-hidden bg-white dark:bg-gray-900 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 transition-colors">
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm transition-colors">Email Address</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm transition-colors">Accessed At</th>
                </tr>
              </thead>
              <tbody>
                {accessLogs.length > 0 ? (
                  accessLogs.map((log, i) => (
                    <tr key={log._id || i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-4 text-gray-600 dark:text-gray-300 transition-colors">{log.clientEmail || 'N/A'}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400 text-sm transition-colors">
                        {new Date(log.accessedAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-gray-500 dark:text-gray-400 transition-colors">
                      No references accessed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}