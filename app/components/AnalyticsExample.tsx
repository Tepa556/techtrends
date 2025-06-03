'use client';

import { trackEvent, trackPageView } from './GoogleAnalytics';
import { trackYMGoal, trackYMEvent } from './YandexMetrica';

// Пример компонента с аналитикой
export default function AnalyticsExample() {
  
  // Отслеживание кликов по кнопкам
  const handleButtonClick = (buttonName: string) => {
    // Google Analytics
    trackEvent('click', 'button', buttonName);
    
    // Yandex Metrica
    trackYMGoal('button_click', { button_name: buttonName });
  };

  // Отслеживание регистрации
  const handleRegistration = () => {
    // Google Analytics
    trackEvent('sign_up', 'user_engagement', 'registration_form');
    
    // Yandex Metrica
    trackYMGoal('registration');
  };

  // Отслеживание создания поста
  const handlePostCreation = (category: string) => {
    // Google Analytics
    trackEvent('create_post', 'content', category);
    
    // Yandex Metrica
    trackYMGoal('post_created', { category });
  };

  // Отслеживание подписки
  const handleSubscription = () => {
    // Google Analytics
    trackEvent('subscribe', 'user_engagement', 'newsletter');
    
    // Yandex Metrica
    trackYMGoal('subscription');
  };

  return (
    <div>
      <button onClick={() => handleButtonClick('hero_cta')}>
        Главная кнопка
      </button>
      
      <button onClick={handleRegistration}>
        Зарегистрироваться
      </button>
      
      <button onClick={() => handlePostCreation('Веб-разработка')}>
        Создать пост
      </button>
      
      <button onClick={handleSubscription}>
        Подписаться
      </button>
    </div>
  );
} 