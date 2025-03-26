"use client"
import { posts } from '@/app/lib/posts'; // Импортируем массив постов
import PostCard from '@/app/ui/PostCard'; // Импортируем компонент для поста
import { AccessTime, Favorite, Message } from '@mui/icons-material';

// Получаем текущую дату
const currentDate = new Date().toISOString().split('T')[0]; // Формат YYYY-MM-DD

// Находим самый новый пост
const latestPost = posts.reduce((prev, current) => {
    return new Date(prev.createdAt) > new Date(current.createdAt) ? prev : current;
});

// Фильтруем остальные посты
const otherPosts = posts.filter(post => post.id !== latestPost.id);

const PostsSection = () => {
    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Популярные статьи</h2>
                <div className="space-y-10">
                    {/* Выводим самый новый пост */}
                    <div className="animate-fade-in">
                        <a className="block h-full border border-gray-300 border-opacity-50 shadow-md rounded-xl transition-transform duration-300 hover:translate-y-[-5px]" >
                            <div className="relative group overflow-hidden glass-card rounded-xl card-transition cursor-pointer">
                                <div className="aspect-[16/9] relative overflow-hidden rounded-t-xl">
                                    <img src={latestPost.imageUrl} alt={latestPost.title} className="absolute inset-0 h-full w-full object-cover object-center" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>
                                <div className="p-6 relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize">{latestPost.category}</div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <AccessTime className="h-3.5 w-3.5 mr-1" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold hover:text-primary transition-colors mb-2">{latestPost.title}</h2>
                                    <p className="text-gray-600 line-clamp-3 mb-4">{latestPost.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img src="" alt={latestPost.author} className="w-10 h-10 rounded-full mr-3" />
                                            <span className="font-medium hover:text-primary transition-colors">{latestPost.author}</span>
                                        </div>
                                        <div className="flex space-x-3 text-gray-500">
                                            <span className="flex items-center text-sm">
                                                <Favorite className="h-4 w-4 mr-1 text-red-500" />{latestPost.likes}
                                            </span>
                                            <span className="flex items-center text-sm">
                                                <Message className="h-4 w-4 mr-1" />{latestPost.comments}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* Выводим остальные посты в сетке */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PostsSection;