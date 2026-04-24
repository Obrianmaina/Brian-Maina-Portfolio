import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface BlogContentProps {
  content: string;
  bibliography?: string;
}

// Blocks malicious scripts injected into markdown links
const urlTransform = (url: string) => {
  const lowerUrl = url.toLowerCase().trim();
  if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('vbscript:') || lowerUrl.startsWith('data:')) {
    return '#';
  }
  return url;
};

// Auto-converts raw BibTeX into standard inline citations (Author Year)
const processCitations = (markdown: string, bibtex?: string) => {
  if (!bibtex || !bibtex.trim() || !markdown.includes('[@')) return markdown;

  let parsedMarkdown = markdown;
  const references: string[] = [];
  const entries = bibtex.split('@').slice(1);

  entries.forEach(entry => {
    const firstBrace = entry.indexOf('{');
    const firstComma = entry.indexOf(',');

    if (firstBrace !== -1 && firstComma !== -1) {
      const id = entry.substring(firstBrace + 1, firstComma).trim();
      const citationTag = `[@${id}]`;

      if (parsedMarkdown.includes(citationTag)) {
        const extract = (field: string) => {
          const regex = new RegExp(`${field}\\s*=\\s*([\\s\\S]*?)(?:,|\\n|\\r|$)`, 'i');
          const match = entry.match(regex);
          return match ? match[1].replace(/[{}]/g, '').replace(/"/g, '').trim() : '';
        };

        const author = extract('author') || extract('editor') || 'Unknown Author';
        const title = extract('title') || 'Untitled';
        const year = extract('year') || 'n.d.';
        const publisher = extract('publisher') || extract('journal') || extract('booktitle') || '';
        const url = extract('url') || extract('doi') || '';

        let lastName = "Unknown";
        if (author) {
          const authorsList = author.split(/ and /i);
          const firstAuthor = authorsList[0].trim();
          
          if (firstAuthor.includes(',')) {
            lastName = firstAuthor.split(',')[0].trim();
          } else {
            const parts = firstAuthor.split(' ');
            lastName = parts[parts.length - 1];
          }
          if (authorsList.length > 1) {
            lastName += ' et al.';
          }
        }

        let fullCitation = `${author} (${year}). *${title}*${publisher ? `. ${publisher}` : ''}.`;
        if (url) fullCitation += ` [Source](${url})`;

        const inlineLink = `[(${lastName} ${year})](#references)`;
        parsedMarkdown = parsedMarkdown.split(citationTag).join(inlineLink);
        references.push(`**${lastName} ${year}:** ${fullCitation}`);
      }
    }
  });

  if (references.length > 0) {
    references.sort(); 
    parsedMarkdown += '\n\n---\n\n### References\n\n' + references.map(ref => `- ${ref}`).join('\n');
  }

  return parsedMarkdown;
};

const BlogContent = forwardRef<HTMLDivElement, BlogContentProps>(({ content, bibliography }, ref) => {
  const processedContent = processCitations(content, bibliography);

  return (
    <article className="text-gray-800 dark:text-gray-200 mb-20 leading-relaxed transition-colors duration-300">
      <ReactMarkdown
        urlTransform={urlTransform} // <-- XSS PROTECTION ADDED HERE
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ ...props }) => <h1 className="text-4xl font-extrabold mt-12 mb-6 text-gray-900 dark:text-gray-50 leading-tight transition-colors" {...props} />,
          h2: ({ ...props }) => <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-gray-50 leading-tight transition-colors" {...props} />,
          h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
            const slug = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            return <h3 id={slug || undefined} className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-50 leading-snug transition-colors" {...props}>{children}</h3>;
          },
          p:  ({ ...props }) => <p className="mb-6 text-lg text-gray-700 dark:text-gray-300 transition-colors" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc ml-6 mb-6 space-y-2 text-lg text-gray-700 dark:text-gray-300 marker:text-teal-500 dark:marker:text-teal-400 transition-colors" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal ml-6 mb-6 space-y-2 text-lg text-gray-700 dark:text-gray-300 marker:text-teal-500 dark:marker:text-teal-400 transition-colors" {...props} />,
          li: ({ ...props }) => <li className="pl-2" {...props} />,
          a:  ({ ...props }) => <a className="text-teal-600 dark:text-teal-400 underline decoration-teal-300 dark:decoration-teal-900/50 underline-offset-4 hover:text-teal-700 dark:hover:text-teal-300 hover:decoration-teal-500 dark:hover:decoration-teal-400 transition-colors font-medium" {...props} />,
          strong: ({ ...props }) => <strong className="font-bold text-gray-900 dark:text-gray-100 transition-colors" {...props} />,
          blockquote: ({ ...props }) => <blockquote className="border-l-4 border-teal-500 pl-6 py-2 my-8 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-r-xl transition-colors" {...props} />,
          code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;
            return isInline ? (
              <code className="bg-gray-100 dark:bg-gray-800 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded-md font-mono text-sm border border-gray-200 dark:border-gray-700 transition-colors" {...props}>
                {children}
              </code>
            ) : (
              <div className="bg-gray-900 dark:bg-gray-950 border border-transparent dark:border-gray-800 rounded-xl overflow-hidden mb-6 shadow-md transition-colors">
                <pre className="p-4 overflow-x-auto text-sm text-gray-100 dark:text-gray-300 font-mono leading-relaxed">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          img: ({ ...props }) => <img className="rounded-2xl shadow-md my-10 w-full object-cover border border-gray-100 dark:border-gray-800 transition-colors" {...props} />,
          hr:  ({ ...props }) => <hr className="my-12 border-gray-200 dark:border-gray-800 transition-colors" {...props} />,
        }}
      >
        {processedContent}
      </ReactMarkdown>
      <div ref={ref} className="h-1 w-full mt-10" />
    </article>
  );
});

BlogContent.displayName = "BlogContent";
export default BlogContent;