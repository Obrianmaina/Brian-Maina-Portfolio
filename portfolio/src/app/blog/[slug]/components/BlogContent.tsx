import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";

interface BlogContentProps {
  content: string;
}

const BlogContent = forwardRef<HTMLDivElement, BlogContentProps>(({ content }, ref) => {
  return (
    <article className="text-gray-800 mb-20 leading-relaxed">
      <ReactMarkdown
        components={{
          h1: ({ ...props }) => <h1 className="text-4xl font-extrabold mt-12 mb-6 text-gray-900 leading-tight" {...props} />,
          h2: ({ ...props }) => <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900 leading-tight" {...props} />,
          h3: ({ ...props }) => <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900 leading-snug" {...props} />,
          p:  ({ ...props }) => <p className="mb-6 text-lg text-gray-700" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc ml-6 mb-6 space-y-2 text-lg text-gray-700 marker:text-teal-500" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal ml-6 mb-6 space-y-2 text-lg text-gray-700 marker:text-teal-500" {...props} />,
          li: ({ ...props }) => <li className="pl-2" {...props} />,
          a:  ({ ...props }) => <a className="text-teal-600 underline decoration-teal-300 underline-offset-4 hover:text-teal-700 hover:decoration-teal-500 transition-colors font-medium" {...props} />,
          strong: ({ ...props }) => <strong className="font-bold text-gray-900" {...props} />,
          blockquote: ({ ...props }) => <blockquote className="border-l-4 border-teal-500 pl-6 py-2 my-8 italic text-gray-600 bg-gray-50 rounded-r-xl" {...props} />,
          code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;
            return isInline ? (
              <code className="bg-gray-100 text-teal-700 px-1.5 py-0.5 rounded-md font-mono text-sm border border-gray-200" {...props}>
                {children}
              </code>
            ) : (
              <div className="bg-gray-900 rounded-xl overflow-hidden mb-6 shadow-md">
                <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono leading-relaxed">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          img: ({ ...props }) => <img className="rounded-2xl shadow-md my-10 w-full object-cover border border-gray-100" {...props} />,
          hr:  ({ ...props }) => <hr className="my-12 border-gray-200" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>

      <div ref={ref} className="h-1 w-full mt-10" />
    </article>
  );
});

BlogContent.displayName = "BlogContent";
export default BlogContent;
