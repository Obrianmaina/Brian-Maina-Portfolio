import { Metadata } from "next";
import SingleBlogClient from "./SingleBlogClient";
import { BlogPost } from "@/types"; // Import the BlogPost type

// Define your base URL for absolute paths required by Open Graph
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brianmaina.de"; 

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${SITE_URL}/api/blogs?slug=${slug}`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (!res.ok) return null;
    const data = await res.json();
    
    // Use the BlogPost type instead of any
    return Array.isArray(data) ? data.find((b: BlogPost) => b.slug === slug) : data;
  } catch (error) {
    console.error("Error fetching post for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}`;

  return {
    title: `${post.title} | Brian Maina Nyawira`,
    description: post.description,
    openGraph: {
      title: post.title, 
      description: post.description, 
      url: `${SITE_URL}/blog/${resolvedParams.slug}`,
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  return <SingleBlogClient initialSlug={resolvedParams.slug} initialPost={post} />;
}