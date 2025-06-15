'use client';

import { useEffect } from 'react';

export default function ChunkLoadErrorHandler() {
  useEffect(() => {
    // Обработчик ошибок загрузки чанков
    const handleChunkError = (event: ErrorEvent) => {
      const target = event.target as HTMLScriptElement;
      
      if (target && target.src && target.src.includes('/_next/static/chunks/')) {
        console.warn('Chunk load failed, attempting reload:', target.src);
        
        // Попытка перезагрузки страницы при критических ошибках
        setTimeout(() => {
          if (confirm('Произошла ошибка загрузки. Перезагрузить страницу?')) {
            window.location.reload();
          }
        }, 1000);
      }
    };

    // Обработчик для unhandledrejection (Promise ошибки)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && event.reason.message && 
          event.reason.message.includes('ChunkLoadError')) {
        console.warn('ChunkLoadError detected:', event.reason);
        
        // Предотвращаем показ ошибки в консоли
        event.preventDefault();
        
        // Показываем пользователю уведомление
        setTimeout(() => {
          if (confirm('Ошибка загрузки ресурсов. Попробовать перезагрузить?')) {
            window.location.reload();
          }
        }, 500);
      }
    };

    // Добавляем обработчики
    window.addEventListener('error', handleChunkError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleChunkError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null; // Компонент не рендерит ничего
} 