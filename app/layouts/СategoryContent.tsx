import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostCard from '@/app/ui/PostCard';
import { categories } from '@/app/lib/nav-categories';
import { useThemeStore } from '@/app/lib/ThemeStore';
interface Post {
  _id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  author: string;
  likeCount: number;
  comments: any[];
  status: string;
  createdAt: string;
}

const CategoryContent = () => {
  const { category } = useParams<{ category: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryTitle, setCategoryTitle] = useState('');
  const { theme } = useThemeStore();
  useEffect(() => {
    const categoryObj = categories.find(cat =>
      cat.link === category || cat.name.toLowerCase() === decodeURIComponent(category as string).toLowerCase()
    );

    setCategoryTitle(categoryObj?.name || decodeURIComponent(category as string));

    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/posts/category/${category}`);

        if (!response.ok) {
          throw new Error('Не удалось загрузить посты');
        }

        const data = await response.json();
        setPosts(data.filter((post: Post) => post.status === 'Опубликован'));
      } catch (error) {
        console.error('Ошибка при загрузке постов категории:', error);
        setError('Не удалось загрузить посты. Попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchPosts();
    }
  }, [category]);

  return (
    <div className="container mx-auto px-4 py-16 min-h-[calc(100vh-200px)]">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-4`}>{categoryTitle}</h1>
        <div className="w-20 h-1 bg-blue-600 mt-2 mb-6"></div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden animate-pulse`}>
              <div className={`h-48 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className="p-4">
                <div className={`w-24 h-5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
                <div className={`h-7 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4`}></div>
                <div className="space-y-2 mb-4">
                  <div className={`h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full`}></div>
                  <div className={`h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-5/6`}></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className={`w-20 h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                  <div className="flex space-x-3">
                    <div className={`w-16 h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                    <div className={`w-16 h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-red-50 rounded-lg">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Попробовать снова
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className={`text-center py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow-sm`}>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-medium text-xl`}>
            В категории «{categoryTitle}» пока нет публикаций
          </p>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            Заходите позже, чтобы увидеть новые публикации в этой категории
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={{
              _id: post._id,
              title: post.title,
              description: post.description,
              category: post.category,
              createdAt: post.createdAt,
              imageUrl: post.imageUrl,
              author: post.author,
              likeCount: post.likeCount,
              comments: post.comments?.length || 0
            }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryContent;