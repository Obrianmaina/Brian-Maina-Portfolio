'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Comment {
  _id: string;
  postSlug: string;
  text: string;
  animalIdentity: string;
  animalIcon: string;
  status?: string;
  adminReply?: string | null;
  createdAt: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/admin/comments');
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, status: newStatus }),
      });
      if (res.ok) {
        setComments(comments.map(c => c._id === id ? { ...c, status: newStatus } : c));
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const submitReply = async (id: string) => {
    const text = replyText[id];
    if (!text || text.trim() === '') return;

    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, adminReply: text }),
      });
      if (res.ok) {
        setComments(comments.map(c => c._id === id ? { ...c, adminReply: text } : c));
        setReplyText({ ...replyText, [id]: '' }); // clear input
      }
    } catch (error) {
      console.error("Failed to submit reply", error);
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment forever?")) return;
    
    try {
      const res = await fetch(`/api/admin/comments?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setComments(comments.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading comments...</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Comment Moderation</h1>
      
      {comments.length === 0 ? (
        <p>No comments found.</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Card key={comment._id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{comment.animalIcon}</span>
                    <span className="font-semibold">{comment.animalIdentity}</span>
                    <span className="text-sm text-gray-500">
                      on post: <span className="font-mono bg-gray-100 px-1 rounded">{comment.postSlug}</span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()} 
                    <span className={`ml-3 px-2 py-0.5 rounded text-xs font-bold ${
                      comment.status === 'approved' ? 'bg-green-100 text-green-800' :
                      comment.status === 'spam' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {comment.status || 'legacy'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {comment.status !== 'approved' && (
                    <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50" onClick={() => updateStatus(comment._id, 'approved')}>
                      Approve
                    </Button>
                  )}
                  {comment.status !== 'spam' && (
                    <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" onClick={() => updateStatus(comment._id, 'spam')}>
                      Spam
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="border-red-600 text-red-600 hover:bg-red-50" 
                    onClick={() => deleteComment(comment._id)}
                    >
                    Delete
                    </Button>
                </div>
              </div>

              <p className="text-gray-800 bg-gray-50 p-3 rounded mb-4">
                {comment.text}
              </p>

              <div className="mt-4 border-t pt-4">
                {comment.adminReply ? (
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded">
                    <p className="text-sm font-semibold text-blue-800 mb-1">Your Reply:</p>
                    <p className="text-gray-700">{comment.adminReply}</p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Write a public reply..." 
                      className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={replyText[comment._id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                    />
                    <Button onClick={() => submitReply(comment._id)}>
                      Reply
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}