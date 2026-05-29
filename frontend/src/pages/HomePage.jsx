import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/api/posts')
      .then(({ data }) => setPosts(data))
      .catch(() => setError('Failed to load posts'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No posts yet.</p>
          <Link to="/create" className="text-indigo-600 hover:underline mt-2 inline-block">
            Create the first one →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
            >
              <Link to={`/posts/${post.id}`}>
                <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 mb-2">
                  {post.title}
                </h2>
              </Link>
              {post.content && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.content}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>By {post.author?.name}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
