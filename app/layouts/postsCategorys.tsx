"use client"
import { useState } from 'react'; 
import { posts } from '@/app/lib/posts'; 
import PostCard from '@/app/ui/PostCard';
import { categories } from '@/app/lib/categories-for-posts-categories'; 

const PostsCategory = () => {
    const [selectedCategory, setSelectedCategory] = useState('Все'); 
    const filteredPosts = selectedCategory === 'Все' ? posts : posts.filter(post => post.category === selectedCategory);

    return (
        <section className="py-16 md:py-24 bg-white transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Исследуйте</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-1 text-gray-800">Категории</h2>
                </div>
                <div dir="ltr" className="w-full">
                    <div className="relative overflow-auto pb-2">
                        <div role="tablist" aria-orientation="horizontal" className="h-15 items-center rounded-md bg-gray-200 p-1 text-gray-700 inline-flex w-auto justify-start pb-5 pt-5" tabIndex={0} style={{ outline: 'none' }}>
                            {categories.map(category => (
                                <button
                                    key={category.name}
                                    type="button"
                                    role="tab"
                                    aria-selected={selectedCategory === category.name}
                                    onClick={() => setSelectedCategory(category.name)}
                                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium ml-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${selectedCategory === category.name ? 'bg-white text-gray-800' : 'hover:bg-white hover:text-gray-800'} mx-1`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div data-state="active" data-orientation="horizontal" role="tabpanel" aria-labelledby="radix-:r6:-trigger-all" id="content-all" tabIndex={0} className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mt-6">
                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPosts.map(post => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 mt-4">Постов в этой категории нет.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PostsCategory;
