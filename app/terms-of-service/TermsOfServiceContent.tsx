"use client"
import { useThemeStore } from '@/app/lib/ThemeStore';
import Header from '../layouts/header';
import Footer from '../layouts/footer';

export default function TermsOfServiceContent() {
    const { theme } = useThemeStore();

    return (
        <>
            <Header />
                <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                    <div className="container mx-auto px-4 py-12 mt-12">
                        <div className="max-w-4xl mx-auto">
                            <header>
                                <h1 className={`text-4xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Условия использования
                                </h1>
                            </header>

                            <main className="prose prose-lg max-w-none">
                                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                                    Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
                                </p>

                                <section>
                                    <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        1. Принятие условий
                                    </h2>
                                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                                        Добро пожаловать на <strong>TechTrends</strong>. Используя наш веб-сайт, вы соглашаетесь соблюдать и
                                        быть связанными настоящими Условиями использования. Если вы не согласны с каким-либо из
                                        этих условий, вам запрещается использовать или получать доступ к этому сайту.
                                    </p>
                                </section>

                                <section>
                                    <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        2. Права интеллектуальной собственности
                                    </h2>
                                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                                        Сайт и его оригинальное содержание, функции и функциональность являются собственностью
                                        <strong> TechTrends</strong> и защищены международными законами об авторском праве, товарных знаках,
                                        патентах, коммерческой тайне и другими законами об интеллектуальной собственности.
                                    </p>
                                </section>

                                <section>
                                    <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        3. Пользовательские аккаунты
                                    </h2>
                                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                                        Когда вы создаете аккаунт на нашем сайте, вы обязаны предоставить точную, полную и
                                        актуальную информацию. Вы несете полную ответственность за поддержание <strong>безопасности
                                            вашей учетной записи</strong> и пароля и за ограничение доступа к вашему компьютеру. Вы
                                        соглашаетесь принять ответственность за все действия, которые происходят под вашей
                                        учетной записью или паролем.
                                    </p>
                                </section>

                                <section>
                                    <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        4. Ограничения
                                    </h2>
                                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                                        Вы соглашаетесь не использовать сайт в следующих целях:
                                    </p>
                                    <ul className={`list-disc pl-8 mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <li>Незаконным образом или для содействия любой незаконной деятельности</li>
                                        <li>Нарушения международных, федеральных, государственных или местных нормативных требований</li>
                                        <li>Нарушения или поощрения нарушения наших или любых третьих сторон прав интеллектуальной собственности</li>
                                        <li>Распространения вредоносного кода или вируса</li>
                                        <li>Сбора или отслеживания личной информации других пользователей</li>
                                        <li>Спама, фишинга, фарминга, обмана, взлома или аналогичных действий</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        5. Пользовательский контент
                                    </h2>
                                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                                        Когда вы создаете или делаете доступным любой контент на сайте, вы тем самым
                                        подтверждаете, что:
                                    </p>
                                    <ul className={`list-disc pl-8 mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <li>Создание, распространение, передача, публичное отображение или исполнение, а также доступ, скачивание или копирование вашего контента не нарушает прав третьих лиц</li>
                                        <li>Ваш контент не содержит вирусов, троянов, червей, вредоносных программ или других вредоносных или деструктивных материалов</li>
                                        <li>Ваш контент не является спамом, не сгенерирован машиной или произведен случайным образом</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        6. Отказ от ответственности
                                    </h2>
                                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                                        Сайт и его содержимое предоставляются <strong>"как есть"</strong> и <strong>"как доступно"</strong> без каких-либо явных
                                        или подразумеваемых гарантий. TechTrends не дает никаких гарантий в отношении точности,
                                        надежности, полноты или своевременности сайта или его содержимого.
                                    </p>
                                </section>

                                <section>
                                    <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        7. Ограничение ответственности
                                    </h2>
                                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                                        В максимальной степени, разрешенной законом, <strong>TechTrends не несет ответственности</strong> за
                                        любые прямые, косвенные, случайные, последующие или штрафные убытки, возникшие в
                                        результате использования вами сайта или любых материалов или услуг, полученных через сайт.
                                    </p>
                                </section>

                                <section>
                                    <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        8. Изменения в условиях
                                    </h2>
                                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                                        Мы оставляем за собой право изменять эти условия в любое время, и вы соглашаетесь
                                        соблюдать эти изменения. Мы рекомендуем вам периодически проверять эту страницу для
                                        ознакомления с последней версией наших условий.
                                    </p>
                                </section>

                                <section>
                                    <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        9. Применимое право
                                    </h2>
                                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                                        Эти условия регулируются и толкуются в соответствии с законами <strong>Российской Федерации</strong>,
                                        без учета ее коллизионных норм.
                                    </p>
                                </section>
                            </main>
                        </div>
                    </div>
                </div>
            <Footer />
        </>
    );
} 