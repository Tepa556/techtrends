const FirstSection = () => {
    return (
        <section className="pt-24 pb-12 md:pt-32 md:pb-20">
            <div className="container relative mx-auto px-4 text-center">
                <span className="inline-block text-sm font-medium text-blue-500 uppercase tracking-wider mb-3 animate-fade-in">Исследуйте последние новости в технологиях</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mx-auto mb-6 animate-slide-down">Инсайты и тренды из мира технологий</h1>
                <p className="text-lg md:text-xl text-gray-800 max-w-2xl mx-auto mb-8 animate-slide-up">Будьте в курсе с глубокими статьями и аналитикой по программированию, веб-разработке, ИИ и многому другому от экспертов отрасли.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <a className="px-6 py-3 rounded-lg border border-gray-300 hover:border-blue-600 text-gray-900 font-bold transition-colors" href="/about">О TechTrends</a>
                </div>
            </div>
        </section>
    );
};

export default FirstSection;
