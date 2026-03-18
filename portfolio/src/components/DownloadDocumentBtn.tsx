'use client';

import dynamic from 'next/dynamic';
import { Download, Loader2 } from 'lucide-react';
import { DocumentTemplate, DocumentData } from './pdf/DocumentTemplate';
import { useState, useEffect } from 'react';

// Dynamically import PDFDownloadLink to prevent Next.js SSR errors
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false }
);

export default function DownloadDocumentBtn({ 
  data, 
  type,
  iconOnly = false
}: { 
  data: DocumentData; 
  type: 'invoice' | 'receipt';
  iconOnly?: boolean;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fileName = `${type}_${data.clientName.replace(/\s+/g, '_')}_${data._id.substring(0, 6)}.pdf`;
  const tooltipText = `Download ${type === 'receipt' ? 'Receipt' : 'Invoice'}`;

  // Fallback UI to prevent hydration mismatch while respecting the iconOnly prop
  if (!isMounted) {
    return (
      <button disabled className={`flex items-center justify-center text-gray-400 bg-gray-50 cursor-not-allowed shadow-sm ${iconOnly ? 'p-2 rounded-lg' : 'px-4 py-2 rounded-xl text-sm font-medium border border-gray-200'}`}>
        <Loader2 size={16} className={`animate-spin ${!iconOnly ? 'mr-2' : ''} opacity-50`} />
        {!iconOnly && 'Loading PDF...'}
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<DocumentTemplate data={data} type={type} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <button 
          disabled={loading}
          title={tooltipText}
          className={`transition-all flex items-center justify-center shadow-sm
            ${iconOnly 
              ? 'p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 bg-white border border-gray-200' 
              : `px-4 py-2 rounded-xl text-sm font-medium ${
                  loading 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                }`
            }`}
        >
          {loading && iconOnly ? (
            <Loader2 size={16} className="animate-spin text-gray-400" />
          ) : (
            <Download size={16} className={`${!iconOnly ? 'mr-2' : ''} ${loading ? 'opacity-50' : 'text-gray-600'}`} />
          )}
          {!iconOnly && (loading ? 'Preparing...' : tooltipText)}
        </button>
      )}
    </PDFDownloadLink>
  );
}