import { BlogPost } from "@/types";

interface BlogHeroProps {
  blog: BlogPost;
}

export default function BlogHero({ blog }: BlogHeroProps) {
  return (
    <>
      <header className="mb-12">
        
        {/* Author, Date, and Topic Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-gray-500 dark:text-gray-400">
          {blog.topic && (
            <span className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full font-semibold border border-teal-100 dark:border-teal-800/50">
              {blog.topic}
            </span>
          )}
          
          <span className="font-medium text-gray-800 dark:text-gray-200">
            By {blog.author || "Brian Maina"}
          </span>
          
          <span className="hidden sm:inline-block text-gray-300 dark:text-gray-600">•</span>
          
          {blog.createdAt && (
            <span>
              {new Date(blog.createdAt).toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-50 mb-6 leading-tight transition-colors duration-300">
          {blog.title}
        </h1>
        
        <p className="text-lg text-gray-500 dark:text-gray-400 italic border-l-4 border-teal-500 pl-4 py-1 transition-colors duration-300 mb-6">
          {blog.description}
        </p>

        {/* Tags Row */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {blog.tags.map(tag => (
              <span key={tag} className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-800">
                #{tag}
              </span>
            ))}
          </div>
        )}

      </header>

      {blog.featuredImage && (
        <figure className="mb-12">
          <div className="w-full h-64 md:h-[480px] relative rounded-[1rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-300 shadow-sm">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
          {blog.photoCredit && (
            <figcaption className="text-sm text-gray-400 dark:text-gray-500 mt-4 text-center transition-colors duration-300">
              Photo Credit: <span className="italic">{blog.photoCredit}</span>
            </figcaption>
          )}
        </figure>
      )}
    </>
  );
}