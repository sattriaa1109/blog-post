import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import useAuthStore from '../store/authStore';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/posts/${id}`)
      .then(({ data }) => setPost(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/api/posts/${id}`);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!post) return null;

  const isOwner = user?.id === post.authorId;

  return (
    <article className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
          <p className="text-sm text-gray-400">
            By {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded-lg"
          >
            Delete
          </button>
        )}
      </div>

      {post.content && (
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-100">
        <Link to="/" className="text-indigo-600 hover:underline text-sm">
          ← Back to posts
        </Link>
      </div>
    </article>
  );
}
