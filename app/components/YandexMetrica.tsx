'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    ym: (...args: any[]) => void;
  }
}

interface YandexMetricaProps {
  ymId: string;
}

export default function YandexMetrica({ ymId }: YandexMetricaProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.ym !== 'undefined') {
      window.ym(parseInt(ymId), 'hit', pathname);
    }
  }, [pathname, ymId]);

  return (
    <>
      {/* Yandex.Metrika counter */}
      <Script
        id="yandex-metrica"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${ymId}, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true
            });
          `,
        }}
      />
      <noscript>
        <div>
          <img 
            src={`https://mc.yandex.ru/watch/${ymId}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}

// Функция для отслеживания целей
export const trackYMGoal = (goalName: string, params?: object) => {
  if (typeof window.ym !== 'undefined') {
    window.ym(102646909, 'reachGoal', goalName, params);
  }
};

// Функция для отслеживания событий
export const trackYMEvent = (action: string, params?: object) => {
  if (typeof window.ym !== 'undefined') {
    window.ym(102646909, 'hit', window.location.href, {
      title: document.title,
      referer: document.referrer,
      params: params
    });
  }
}; 