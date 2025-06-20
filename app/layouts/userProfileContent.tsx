"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import SubscribeButton from '@/app/ui/SubscribeButton';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import Favorite from '@mui/icons-material/Favorite';
import Message from '@mui/icons-material/Message';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useThemeStore } from '@/app/lib/ThemeStore';
import FilterPanel from '@/app/ui/FilterPanel';

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  subscribers?: string[];
  subscriptions?: string[];
}

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

interface UserProfileContentProps {
  userId: string;
}

export default function UserProfileContent({ userId }: UserProfileContentProps) {
  const { theme } = useThemeStore();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [activePostIndex, setActivePostIndex] = useState(0);

  // Состояния для фильтров
  const [filters, setFilters] = useState({
    timeFilter: 'all',
    sortBy: 'newest',
    minRating: 0
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Функция фильтрации постов
  const filterPosts = (posts: Post[], query: string) => {
    if (!query.trim()) {
      return posts;
    }
    
    const searchTerm = query.toLowerCase().trim();
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.category.toLowerCase().includes(searchTerm)
    );
  };

  // Применение фильтров
  const applyFilters = (posts: Post[]) => {
    let filtered = [...posts];

    // Фильтр по времени
    if (filters.timeFilter !== 'all') {
      const now = new Date();
      const timeThresholds: Record<string, Date> = {
        today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        month: new Date(now.getFullYear(), now.getMonth(), 1),
        year: new Date(now.getFullYear(), 0, 1)
      };
      
      const threshold = timeThresholds[filters.timeFilter];
      filtered = filtered.filter(post => new Date(post.createdAt) >= threshold);
    }

    // Фильтр по минимальному рейтингу
    if (filters.minRating > 0) {
      filtered = filtered.filter(post => (post.likeCount || 0) >= filters.minRating);
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return (b.likeCount || 0) - (a.likeCount || 0);
        case 'rating':
          return (b.likeCount || 0) - (a.likeCount || 0);
        case 'comments':
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Обработчик изменения поискового запроса
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const searchFiltered = filterPosts(posts, query);
    const finalFiltered = applyFilters(searchFiltered);
    setFilteredPosts(finalFiltered);
  };

  // Очистка поиска
  const clearSearch = () => {
    setSearchQuery('');
    const finalFiltered = applyFilters(posts);
    setFilteredPosts(finalFiltered);
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decoded: any = jwt.decode(token);
      setCurrentUserEmail(decoded?.email || null);
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = Cookies.get('token');
        if (!token) {
          setError('Необходима авторизация для просмотра профиля');
          setIsLoading(false);
          return;
        }

        // Получаем информацию о пользователе
        const userResponse = await fetch(`/api/users/${userId}`);
        
        if (!userResponse.ok) {
          throw new Error('Не удалось загрузить данные пользователя');
        }
        
        const userData = await userResponse.json();
        setUser(userData);
        
        // Получаем посты пользователя с передачей JWT токена
        const postsResponse = await fetch(`/api/posts/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!postsResponse.ok) {
          const errorData = await postsResponse.json();
          throw new Error(errorData.error || 'Не удалось загрузить посты пользователя');
        }
        
        const postsData = await postsResponse.json();
        const publishedPosts = postsData.filter((post: Post) => post.status === 'Опубликован');
        setPosts(publishedPosts);
        const searchFiltered = filterPosts(publishedPosts, searchQuery);
        const finalFiltered = applyFilters(searchFiltered);
        setFilteredPosts(finalFiltered);
      } catch (error: any) {
        console.error('Ошибка при загрузке данных:', error);
        setError(error.message || 'Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Применение фильтров при их изменении
  useEffect(() => {
    const searchFiltered = filterPosts(posts, searchQuery);
    const finalFiltered = applyFilters(searchFiltered);
    setFilteredPosts(finalFiltered);
  }, [filters, posts, searchQuery]);

  // Переключение между постами
  const handleTabChange = (index: number) => {
    setActivePostIndex(index);
  };

  // Компонент Skeleton для профиля
  const ProfileSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
        <div className="mb-4 md:mb-0 md:mr-6">
          <div className={`w-24 h-24 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`}></div>
        </div>
        <div className="w-full">
          <div className={`h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-48 mb-2`}></div>
          <div className={`h-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-32 mb-2`}></div>
          <div className={`h-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-32 mb-4`}></div>
          <div className={`h-10 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-40`}></div>
        </div>
      </div>
      <div className={`h-6 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-32 mb-4`}></div>
      <div className="flex overflow-x-auto pb-2 mb-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className={`h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-24 mr-2`}></div>
        ))}
      </div>
      <div className={`h-96 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}></div>
    </div>
  );

  // Компонент Skeleton для постов
  const PostsSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 animate-pulse">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <div className={`h-48 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
        <div className="p-4">
          <div className={`h-6 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded mb-2`}></div>
          <div className={`h-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-3/4 mb-4`}></div>
          <div className="flex justify-between items-center">
            <div className={`h-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-20`}></div>
            <div className={`h-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-20`}></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`w-full max-w-4xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
          <div className={`text-center text-red-500 font-medium py-8 ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'} rounded-lg`}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-4xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
        {isLoading ? (
          <ProfileSkeleton />
        ) : user ? (
          <div>
            <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
              <div className="mb-4 md:mb-0 md:mr-6">
                {user.avatar ? (
                  <Image 
                    src={user.avatar} 
                    alt={`${user.username} аватар`} 
                    width={96} 
                    height={96} 
                    className="rounded-full" 
                  />
                ) : (
                  <div className={`w-24 h-24 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-xl`}>{user.username.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.username}</h1>
                <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  <p>Подписчиков: {user.subscribers?.length || 0}</p>
                  <p>Подписок: {user.subscriptions?.length || 0}</p>
                </div>
                {currentUserEmail && currentUserEmail !== user.email && (
                  <SubscribeButton 
                    userEmail={user.email} 
                    currentUserEmail={currentUserEmail} 
                  />
                )}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-4 text-center border-b pb-3 ${theme === 'dark' ? 'text-white border-gray-600' : 'text-gray-900 border-gray-200'}`}>Публикации пользователя</h2>
              
              {/* Поле поиска */}
              {posts.length > 0 && (
                <div className="mb-6">
                  <div className={`relative max-w-md mx-auto ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <div className="relative">
                      <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} h-5 w-5`} />
                      <input
                        type="text"
                        placeholder="Поиск по статьям..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className={`w-full pl-10 pr-10 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      {searchQuery && (
                        <button
                          onClick={clearSearch}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                        >
                          <ClearIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Результаты поиска */}
                  {searchQuery && (
                    <div className={`text-center mt-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <p className="text-sm">
                        {filteredPosts.length === 0 
                          ? `Не найдено статей по запросу "${searchQuery}"` 
                          : `Найдено ${filteredPosts.length} ${filteredPosts.length === 1 ? 'статья' : filteredPosts.length <= 4 ? 'статьи' : 'статей'} по запросу "${searchQuery}"`
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Фильтры */}
              {posts.length > 0 && (
                <div className="mt-2 mb-4">
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    isOpen={isFilterOpen}
                    onToggle={() => setIsFilterOpen(!isFilterOpen)}
                    showResultCount={true}
                    resultCount={filteredPosts.length}
                  />
                </div>
              )}
              
              {isLoading ? (
                <PostsSkeleton />
              ) : posts.length > 0 ? (
                filteredPosts.length > 0 ? (
                  <div>
                    {/* Упрощенная горизонтальная прокрутка без растягивания */}
                    <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-md p-5 overflow-x-auto`}>
                      <div className="flex gap-6" style={{ width: 'max-content' }}>
                        {filteredPosts.map((post) => (
                          <Link 
                            key={post._id} 
                            href={`/post/${post._id}`} 
                            className={`w-96 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-2`}
                          >
                            <div className="relative w-full h-56">
                              <Image
                                src={post.imageUrl || ''}
                                alt={post.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="transition-transform duration-300 hover:scale-105"
                              />
                              <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                                {post.category}
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'} mb-2 transition-colors`}>
                                {post.title}
                              </h3>
                              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-2`}>{post.description}</p>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className="relative w-8 h-8 mr-2">
                                    <Image
                                      src={user?.avatar || '/user-avatar/default-avatar.jpg'}
                                      alt={post.author}
                                      fill
                                      style={{ objectFit: 'cover' }}
                                      className="rounded-full"
                                    />
                                  </div>
                                  <div>
                                    <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{post.author}</span>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(post.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  <span className="flex items-center ml-3">
                                    <Favorite className="h-4 w-4 mr-1 text-red-500" />{post.likeCount || 0}
                                  </span>
                                  <span className="flex items-center ml-3">
                                    <Message className="h-4 w-4 mr-1" />{post.comments?.length || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`text-center py-12 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg shadow-sm`}>
                    <p className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} font-medium text-xl`}>
                      {searchQuery ? `По запросу "${searchQuery}" ничего не найдено` : 'У пользователя пока нет публикаций'}
                    </p>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                      {searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Заходите позже, чтобы увидеть новые публикации'}
                    </p>
                  </div>
                )
              ) : (
                <div className={`text-center py-12 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg shadow-sm`}>
                  <p className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} font-medium text-xl`}>
                    У пользователя пока нет публикаций
                  </p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                    Заходите позже, чтобы увидеть новые публикации
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Необходимо добавить в глобальные стили для анимации fade-in
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }