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

  if (loading) return <div className="p-8">Loading stats...</div>;

  const totalViews = stats.filter(s => s.type === 'page_view').reduce((acc, curr) => acc + curr.hits, 0);
  const totalDownloads = stats.find(s => s.target === 'resume-pdf')?.hits || 0;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <button 
        onClick={() => router.push('/admin')} 
        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium mb-6"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Hub
      </button>

      <h1 className="text-3xl font-bold mb-8">Performance Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText size={24} className="text-teal-600" /> Recent References Access
      </h2>
      
      <Card className="overflow-hidden bg-white shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">Email Address</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Accessed At</th>
              </tr>
            </thead>
            <tbody>
              {accessLogs.length > 0 ? (
                accessLogs.map((log, i) => (
                  <tr key={log._id || i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-gray-600">{log.clientEmail || 'N/A'}</td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(log.accessedAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-gray-500">
                    No references accessed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}